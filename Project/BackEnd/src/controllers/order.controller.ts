import { AppDataSource } from "../config/data.config";
import { Category, Items, KitchenStatus, Order, OrderItems, OrderStatus, OrderType, Table, User } from "../models";
import {NextFunction, Request, Response} from 'express'
import { isValidOrderStatus, isValidOrderType } from "../utils";
import { ApiError } from "../utils/ApiError";
import chalk from "chalk";
import { io } from "../app";

// import { OrderType } from "../models";




export const makeOrder = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try{

        const orderRepo = queryRunner.manager.getRepository(Order)
        const tableRepo = queryRunner.manager.getRepository(Table)
        const orderItemRepo = queryRunner.manager.getRepository(OrderItems)
        const itemsRepo = queryRunner.manager.getRepository(Items)
        


        const {orderType, tableId,orderItems } = req.body;
        const status =  OrderStatus.PENDING;

        if(!orderType || !isValidOrderType(orderType)){
            res.status(400).json({
                message: "A valid Order-Type required...",
                validTypes : Object.values(OrderType)
            })
            return
        }

        let tableAvail: Table | null = null
        const order = new Order()

        if(orderType == OrderType.DINERIN){
            
            if(!tableId){
                
                throw new ApiError(400,"Table ID Required")
            }
            tableAvail = await  tableRepo.findOne({
                where:{
                    id: tableId
                }
            })

            if(!tableAvail){
                throw new ApiError(404,"Table Not Found ")
            }

            if(!tableAvail.status ){
                throw new ApiError(409, "Table Already Occupied")
            }

            tableAvail!.status = false
            await tableRepo.save(tableAvail)
 

        }

        if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
            throw new ApiError(400, "Order items are required");
        }

            order.orderType = orderType
            order.status = status
            order.table = tableAvail

            const savedOrder = await orderRepo.save(order)
      
           const storeitems : OrderItems[] = []

            for(const item of orderItems){

                const menuItem = await itemsRepo.findOne({
                    where: {
                        id: item.itemId
                    }
                })

                if(!menuItem){
                    throw new ApiError(404,`The Menu Item for id= ${item.itemId} is not found`)
                }

                if(!menuItem.available){
                    throw new ApiError(400, `The Menu Item ${menuItem.name} is not available`);
                }

                const newOrderItem = new OrderItems()
                newOrderItem.kitchenStatus = KitchenStatus.PENDING
                newOrderItem.note = item.note
                newOrderItem.item = menuItem
                newOrderItem.order = savedOrder
                newOrderItem.quantity = item.quantity

                const savedItem = await orderItemRepo.save(newOrderItem)
                storeitems.push(savedItem)
            }

    
            const fullOrder = await orderRepo.findOne({
            where: { id: savedOrder.id },
            relations: ['orderItems', 'orderItems.item', 'table']
            });

            res.status(200).json({
                status: 'success',
                message : 'Order placed Successfully',
                order : fullOrder,


            })
            try{
                io.emit('new-order',fullOrder)
                console.log("io send succefully")
            }catch(err){
                console.log(chalk.red("Error occured while socket transmissin", err))
            }
            
            await queryRunner.commitTransaction()
            return 


            
        
    }catch(err: any){
        console.log("Order Error:", err)
        await queryRunner.rollbackTransaction()

        if(!(err instanceof ApiError)){
            return next(new ApiError(500, "Unexpected error during order creation"));
        }
        
        return next(err);
    }
    finally{
        await queryRunner.release()
    }


}


export const getAllOrder = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{

 try{ 
        const orderRepo = AppDataSource.getRepository(Order)
        const order = await orderRepo.find({
            relations: ["orderItems", "orderItems.item","table"]
        })
        
        res.status(200).json({
            status: "success",
            message: order.length === 0 ? "No orders found" : "Orders fetched successfully",
            data: order
        })

 }catch(err: any){
        console.log("Order Error:", err)

        if(!(err instanceof ApiError)){
            return next(new ApiError(500, "Unexpected error during order creation"));
        }
        return next(err);
    }
   return
}


export const editOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    interface OrderDTO {
        orderType?: OrderType;
        status?: OrderStatus;
        tableId?: null | number;
        orderItems?: {
            id?: number;
            itemId?: number; 
            quantity?: number;
            note?: string;
        }[];
    }

    try {
        const { id } = req.params;
        const resData: OrderDTO = req.body;
        const orderRepo = AppDataSource.getRepository(Order);
        const orderTable = AppDataSource.getRepository(Table);
        const orderItem = AppDataSource.getRepository(OrderItems);

        const order = await orderRepo.findOne({
            where: { id: parseInt(id) },
            relations: ['orderItems', 'table']
        });

        if (!order) {
            throw new ApiError(404, "Order not found"); 
        }

        
        if (resData.orderType) {
            order.orderType = resData.orderType;
        }

        if (resData.status) {
            order.status = resData.status;
        }

        
        if (resData.tableId !== undefined) {
            if (resData.tableId == null) {
                order.table = null;
            } else {
                const table = await orderTable.findOne({
                    where: {
                        id: resData.tableId
                    }
                });

                if (!table) {
                    throw new ApiError(404, 'The table id is not found.');
                }

                order.table = table;
            }
        }

        
        await orderRepo.save(order);

        
        if (resData.orderItems) {
            const existingItemsId = order.orderItems.map(item => item.id);
            const updatedItemsIds = resData.orderItems
                .filter((item: { id?: number }) => item.id)
                .map((item: { id?: number }) => item.id!);
            const itemsToRemove: number[] = existingItemsId.filter(id => !updatedItemsIds.includes(id));

            
            if (itemsToRemove.length > 0) {
                const orderItemsToRemove = order.orderItems.filter(
                    (item) => itemsToRemove.includes(item.id!)
                );

                if (orderItemsToRemove.length > 0) {
                    await orderItem.remove(orderItemsToRemove);
                }
            }

            const itemsRepo = AppDataSource.getRepository(Items);

            
            for (const itemData of resData.orderItems) {
                if (itemData.id) {
                    
                    await orderItem.update(itemData.id, {
                        quantity: itemData.quantity,
                        note: itemData.note,
                    });
                } else {
                    
                    if (!itemData.itemId) {
                        throw new ApiError(400, "Item ID is required for new order items");
                    }

                    const itemEntity = await itemsRepo.findOne({
                        where: { id: itemData.itemId }
                    });

                    if (!itemEntity) {
                        throw new ApiError(404, `Item with ID ${itemData.itemId} not found`);
                    }

                    if(!itemEntity.available){}

                    const newOrderItem = orderItem.create({
                        quantity: itemData.quantity,
                        note: itemData.note,
                        order: order,
                        item: itemEntity
                    });

                    await orderItem.save(newOrderItem);
                }
            }
        }

        
        const updatedOrder = await orderRepo.findOne({
            where: { id: parseInt(id) },
            relations: ['table', 'orderItems', 'orderItems.item'] 
        });

        res.json({
            message: 'Order updated successfully',
            order: updatedOrder
        });

    } catch (err) {
        console.error('Error updating order:', err);
        if (err instanceof ApiError) {
            return next(err); 
        }
        return next(new ApiError(500, "Internal server error"));
    }
};


export const getFilteredOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try{

        const orderRepo = AppDataSource.getRepository(Order);
        const query = orderRepo
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.orderItems','orderItems')
        .leftJoinAndSelect('orderItems.item','item')
        .leftJoinAndSelect('order.table','table')
        .leftJoinAndSelect('order.invoice','invoice');

        const {orderType, status, itemId, category} = req.query;

        if (orderType && Object.values(OrderType).includes(orderType as OrderType)) {
        query.andWhere('order.orderType = :orderType', { orderType });
        }

        if(status && Object.values(OrderStatus).includes(status as OrderStatus)){
            query.andWhere('order.status = :status',{status})
        }

        if(itemId){
            const parsedItemId = parseInt(itemId as string, 10);
            if(!isNaN(parsedItemId)){
                query.andWhere('item.id = :itemId', {itemId: parsedItemId})
            }
        }

        if(category && Object.values(Category).includes(category as Category)){
            query.andWhere("item.category = :category", {category})
        }

        const orders = await query.orderBy('order.id', 'DESC').getMany();

        res.status(200).json({
            status: 'success',
            message: orders.length === 0 ? "No order found": " Orders fetched successfully",
            data : orders
        })

    }catch(err){
        console.log(chalk.red("Error filtering orders: ", err))
        if(!(err instanceof ApiError)){
            return next(new ApiError(500, "Unexpected error during order filtering"));
        }
        return next(err);
    }

}

export const deleteOrder = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try{
    const orderRepo = AppDataSource.getRepository(Order)
    const {reqId} = req.params
    const id = Number(reqId)



    const selectOrder = await  orderRepo.findOne({
        where:{
            id
        }
    })

    if(!selectOrder){
        throw new ApiError(404,"Order Not Found.")
    }
    await orderRepo.delete(id)

    res.status(200).json({
        status : "success",
        message: 'The selected order deleted successfully',
        data:{
            deletedOrde: selectOrder
        }

    })

    }catch(err){
        console.log(chalk.red("Unexpected error occured."))
        if(!(err instanceof ApiError)){
           return next( new ApiError(500,"Unexpected server error occured"))
        }
        return next(err)
    }

}
import { AppDataSource } from "../config/data.config";
import { Invoice, Items, Order, OrderItems, PaymentMode } from "../models";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { createInvoicePDF } from "../services";



export const isValidCategory = (value: any): value is PaymentMode =>{
    return Object.values(PaymentMode).includes(value)
}

export const generateInvoice = async(req: Request, res: Response, next: NextFunction) =>{

    try{
        const orderRepo = AppDataSource.getRepository(Order)
        const invoiceRepo = AppDataSource.getRepository(Invoice)

        const {id} = req.params
        const {reqDiscount,paymentMode, isPaid} = req.body
        const orderId = Number(id)

        if(!isValidCategory(paymentMode)){
            throw new ApiError(404,"Invalid or missing Payment mode")
        }

        const currentOrder = await orderRepo.findOne({
            where:{
                id: orderId
            },
            relations: ['orderItems', 'orderItems.item']
        })  

        
        
        if(!(currentOrder)){
            throw new ApiError(404, "Order not found")
        }

        const currentItems = currentOrder.orderItems;
        

        if(!currentItems || currentItems.length < 1){
            throw new ApiError(404, "No Items found in this Order")
        }

        let totalCost = 0
        for(const orderItem of currentItems){
            if (!orderItem.item || typeof orderItem.item.cost !== "number") {
                    throw new ApiError(400, `Invalid cost for item with id ${orderItem.item?.id}`);
                }
            const itemCost = orderItem.item.cost * orderItem.quantity
            totalCost += itemCost

        }
        const discount =reqDiscount?  Number(reqDiscount): 0
        if (isNaN(discount) || discount < 0 || discount > 100) {
            throw new ApiError(400, "Invalid discount value, must be between 0 and 100");
        }
                const finalCost = (totalCost * (100 - discount))/ 100 ;

        const fileName = `invoice_order_${currentOrder.id}_${Date.now()}.pdf`;
        const filePath = await createInvoicePDF(
            {
                orderId: currentOrder.id,
                totalAmount: totalCost,
                discount,
                paymentMode,
                items: currentItems.map(item => ({
                    name: item.item.name,
                    quantity: item.quantity,
                    cost: item.item.cost,
                })),
            },
            fileName
        );

        // Assuming you serve files via /invoices static route
        const invoiceUrl = `/invoices/${fileName}`;


        const newInvoice = invoiceRepo.create({
            order : currentOrder,
            totalAmount : finalCost,
            discount,
            paymentMode,
            isPaid,
            pdfUrl: invoiceUrl,
            
        })

        await invoiceRepo.save(newInvoice)

        res.status(200).json({
            status: 'success',
            message: "Invoice generated successfully.",
            data: {
                pdfUrl: invoiceUrl
            }

        })
    }catch (err) {
        console.error("Error generating invoice:", err);
        if (!(err instanceof ApiError)) {
            return next(new ApiError(500, "Unexpected error during invoice generation"));
        }
        return next(err);
    }


}

export const toggleInvoicePaid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invoiceRepo = AppDataSource.getRepository(Invoice);
        const { id } = req.params;

        const invoice = await invoiceRepo.findOne({
            where: { id: Number(id) },
            relations: ["order"],
        });

        if (!invoice) {
            throw new ApiError(404, "Invoice not found");
        }

        invoice.isPaid = !invoice.isPaid;
        await invoiceRepo.save(invoice);

        res.status(200).json({
            status: "success",
            message: `Invoice marked as ${invoice.isPaid ? "paid" : "unpaid"}`,
            data: invoice,
        });
    } catch (err) {
        console.error("Error toggling invoice:", err);
        if (!(err instanceof ApiError)) {
            return next(new ApiError(500, "Unexpected error toggling invoice status"));
        }
        return next(err);
    }
};


export const getAllInvoices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invoiceRepo = AppDataSource.getRepository(Invoice);

        const invoices = await invoiceRepo.find({
            relations: ["order", "order.orderItems", "order.orderItems.item"],
            order: { id: "DESC" },
        });

        res.status(200).json({
            status: "success",
            message: invoices.length === 0 ? "No invoices found" : "Invoices fetched successfully",
            data: invoices,
        });
    } catch (err) {
        console.error("Error fetching invoices:", err);
        if (!(err instanceof ApiError)) {
            return next(new ApiError(500, "Unexpected error fetching invoices"));
        }
        return next(err);
    }
};

export const getInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invoiceRepo = AppDataSource.getRepository(Invoice);
        const { id } = req.params;

        const invoice = await invoiceRepo.findOne({
            where: { id: Number(id) },
            relations: ["order", "order.orderItems", "order.orderItems.item"],
        });

        if (!invoice) {
            throw new ApiError(404, "Invoice not found");
        }

        res.status(200).json({
            status: "success",
            message: "Invoice fetched successfully",
            data: invoice,
        });
    } catch (err) {
        console.error("Error fetching invoice:", err);
        if (!(err instanceof ApiError)) {
            return next(new ApiError(500, "Unexpected error fetching invoice"));
        }
        return next(err);
    }
};

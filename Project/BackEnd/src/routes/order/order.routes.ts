import express, {Router} from "express";
import { orderPath } from "../route.dir";
import { editOrder, getAllOrder, getFilteredOrders, makeOrder } from "../../controllers";



export const orderRouter = Router()

orderRouter.post(orderPath.MAKEORDER, makeOrder);
orderRouter.get(orderPath.GETALLORDER, getAllOrder);
orderRouter.post(orderPath.EDITORDER,editOrder);
orderRouter.get(orderPath.GETFILTEREDORDER,getFilteredOrders);
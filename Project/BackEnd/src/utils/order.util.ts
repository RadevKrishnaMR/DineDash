import { OrderStatus, OrderType } from "../models";


export const isValidOrderType = (type: string): type is OrderType => {
    return Object.values(OrderType).includes(type as OrderType);
};

export const isValidOrderStatus = (status: string): status is OrderStatus => {
    return Object.values(OrderStatus).includes(status as OrderStatus);
};
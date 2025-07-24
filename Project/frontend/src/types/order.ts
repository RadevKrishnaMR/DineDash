// src/types/order.ts

export type OrderStatus = 'Pending' | 'InKitchen' | 'Ready' | 'Served' | 'Billed';
export type OrderType = 'DinerIn' | 'TakeAway' | 'Delivery';

export interface Table {
  id: number;
  number: number;
  capacity: number;
}

export interface OrderItem {
  id: number;
  quantity: number;
  item: {
    id: number;
    name: string;
    category: string;
  };
}

export interface Invoice {
  id: number;
  pdfUrl: string;
  totalAmount: number;
  discount: number;
  isPaid: boolean;
  paymentMode: 'UPI' | 'Online' | 'Cash';
}


export interface menuOrderItem {
  id?: number;
  itemId?: number;
  name?: string;
  quantity: number;
  note?: string;
}

export interface Order {
  id: number;
  orderType: OrderType;
  status: OrderStatus;
  table?: Table | null;
  orderItems: OrderItem[];
  invoice?: Invoice | null;

}

export type FilterParams = {
  orderType?: 'DinerIn' | 'TakeAway' | 'Delivery';
  status?: 'Pending' | 'InKitchen' | 'Ready' | 'Served' | 'Billed';
  itemId?: string;
  category?: string;
};

// 👇 Add below existing interfaces in src/types/order.ts

export type KitchenStatus = 'Pending' | 'READY';

export interface EditableOrderItem {
  id: number;
  quantity: number;
  note?: string;
  kitchenStatus: KitchenStatus;
  item: {
    id: number;
    name: string;
    category: string;
  };
}

// Optional: EditableOrder type if the full order is used
export interface EditableOrder {
  id: number;
  orderType: OrderType;
  status: OrderStatus;
  table?: Table | null;
  orderItems: EditableOrderItem[];
}

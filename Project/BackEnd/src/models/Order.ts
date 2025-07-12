import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Table } from "./Table";
import { OrderItems } from "./OrderItem";


export enum OrderType{
    DINERIN = "DinerIn",
    TAKEAWAY = "TakeAway",
    DELIVERY = "Delivery"
}

export enum OrderStatus{
    PENDING = "Pending",
    INKITCHEN = "InKitchen",
    READY = "Ready",
    SERVED = "Served",
    BILLED = "Billed"
}

@Entity("Orders")
export class Order{

    @PrimaryGeneratedColumn()
    id! : number

    @Column({
        type: 'enum',
        enum: OrderType
    })
    orderType!: OrderType

    @Column({
        type: 'enum',
        enum: OrderStatus
    })
    status!: OrderStatus

    @OneToOne(()=> Table,{
        nullable: true
    })
    @JoinColumn()
    table? : Table | null

    @OneToMany(()=> OrderItems, (orderItem)=> orderItem.order )
    orderItems!: OrderItems[]
    
}

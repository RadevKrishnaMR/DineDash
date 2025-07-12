import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Order } from "./Order";
import { CONNREFUSED } from "dns";

export enum PaymentMode{
    UPI = 'UPI',
    ONLINE = 'Online',
    CASH = 'Cash'
}

@Entity("Invoice")
export class Invoice{
    @PrimaryGeneratedColumn()
    id!: number

    @OneToOne(()=>Order,(order)=> order.id)
    @JoinColumn()
    order! : Order

    @Column()
    totalAmount! : number
    
    @Column()
    discount!: number

    @Column({
        type: 'enum',
        enum: PaymentMode,
    })
    paymentMode! : PaymentMode

    @Column()
    isPaid! : boolean

    @Column()
    pdfUrl! : string
    
    
}
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Order } from "./Order";
import { Items } from "./MenuItems";


export enum KitchenStatus{
    PENDING =  "Pending",
    READY = "READY"
}

@Entity("OrderItems")
export class OrderItems{

    @PrimaryGeneratedColumn()
    id! : number

    @ManyToOne(()=>Order, (order)=> order.orderItems)
    order!: Order

    @OneToOne(()=>Items)
    @JoinColumn()
    item! : Items

    @Column()
    quantity!: number

    @Column({
        nullable: true
    })
    note!: string

    @Column({
        type: 'enum',
        enum: KitchenStatus

    })
    kitchenStatus! : KitchenStatus



} 
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { OrderItems } from "./OrderItem";


export enum Category{
    STARTER = 'Starter',
    MAINCOURSE = 'MainCourse',
    BREAD = 'Bread',
    BEVERAGES = 'Beverages',
    BURGER = 'Burgers',
    PASTRIES = 'Pastries'

}

@Entity("ITEMS")
export class Items{

    @PrimaryGeneratedColumn()
    id! : number

    @Column()
    name! : string

    @Column()
    description! : string

    @Column()
    cost! : number

    @Column({
        type: 'enum',
        enum: Category
    })
    category! : Category

    @Column()
    available! : boolean

    @OneToMany(() => OrderItems, (orderItem) => orderItem.item)
    orderItems!: OrderItems[];



}
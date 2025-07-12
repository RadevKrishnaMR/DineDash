import { Entity,Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Table } from "./Table";


export enum UserRoles{
    ADMIN = "Admin",
    WAITER = "Waiter",
    CASHIER = "Cashier",
    KITCHEN = "Kitchen",
}

@Entity('USERS')
export class User{

    @PrimaryGeneratedColumn()
    id! : number;

    @Column()
    name! : string;

    @Column({
        unique: true
    })
    email! : string;

    @Column({
        type: 'enum',
        enum: UserRoles,
        default: UserRoles.WAITER,
    })
    role! : UserRoles;

    @Column()
    password! : string;


    @OneToMany(()=> Table, (table)=> table.assignedWaiter )
    table?: Table[]

} 
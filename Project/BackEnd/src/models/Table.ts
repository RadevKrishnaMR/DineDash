import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { calculateObjectSize } from "typeorm/driver/mongodb/bson.typings";
import { User } from "./User";

@Entity("Table")
export class Table{

    @PrimaryGeneratedColumn()
    id! : number

    @Column()
    name! : string

    @Column()
    status! : boolean

    @ManyToOne(()=> User, {nullable: true})
    assignedWaiter?: User; 

} 
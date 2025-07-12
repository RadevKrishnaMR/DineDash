import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";


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



}
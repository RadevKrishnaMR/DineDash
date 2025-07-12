import 'dotenv/config'
import {DataSource} from "typeorm"
import { Invoice, Items, Order, OrderItems, Table, User } from '../models'



export const TestDataSource = new DataSource({
    type: 'sqlite',
    database: './test.sqlite',
    synchronize: true,
    logging: false,
    entities: [User,Items,OrderItems,Order,Table,Invoice],

})


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port : Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [User,Items,OrderItems,Order,Table,Invoice],

})
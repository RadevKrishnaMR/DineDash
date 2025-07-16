import {Router} from 'express'
import { tablePath } from '../route.dir'
import { addTable, editTable, getAllTables } from '../../controllers/table.controller'



export const tableRouter = Router()

tableRouter.get(tablePath.GETTABLE, getAllTables);
tableRouter.post(tablePath.EDITTABLE,editTable);
tableRouter.post(tablePath.ADDTABLE, addTable);
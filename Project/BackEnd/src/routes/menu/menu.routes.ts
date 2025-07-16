import {Router} from 'express'
import { menuPath } from '../route.dir';
import { addMenu, deleteItem, getMenu } from '../../controllers/menu.controller';


export const menuRouter = Router();

menuRouter.get(menuPath.GETMENU,getMenu);
menuRouter.post(menuPath.ADDMENU,addMenu);
menuRouter.delete(menuPath.DELETEMENU,deleteItem)
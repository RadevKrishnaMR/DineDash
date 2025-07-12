import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data.config";
import { Category, Items } from "../models";
import {ParamsDictionary} from 'express-serve-static-core'
import { ApiError } from "../utils/ApiError";
import chalk from "chalk";
import { isValidCategory } from "../utils/menu.util";



export const getMenu = async(req: Request, res: Response, next: NextFunction): Promise<void>=>{
    try{

        const menuRepo = AppDataSource.getRepository(Items)
        const data = await menuRepo.find()

        if(!(data.length > 0) ){
            throw new ApiError(404, 'Menu not Found')
        }

        res.status(200).json({
            status: 'success',
            message : 'Data from Menu fetched',
            data 
        })

    }catch(err){
        console.log(chalk.red("Fetch from MenuItems Failed"),err)
        if (err instanceof ApiError) {
            return next(err);
        }
        return next(new ApiError(500, "Unexpected server error occurred"));

    }
}


export const addMenu = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try{
        const menuRepo = AppDataSource.getRepository(Items)
        const {name, description, category} = req.body;

        if(!name || !description || !category){
            throw new ApiError(400,"Given data is not sufficient");
        }

        if(!isValidCategory(category)){
            throw new ApiError(400, `Invalid category. Allowed: ${Object.values(Category).join(", ")}`)
        }

        const newItem = new  Items()

        newItem.name = name;
        newItem.description = description;
        newItem.category = category;
        newItem.available = true

        const savedItem = await menuRepo.save(newItem)
        res.status(201).json({
            status: "success",
            message: "Item successfully added to Menu.",
            data: savedItem

        })

    }catch(err){
        console.log(chalk.red("Unexpected server error occured", err))
        if (err instanceof ApiError) {
            return next(err);
        }
        return next(new ApiError(500, "Unexpected server error occurred"));


    }
}


export const deleteItem = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{

    try{
        const menuRepo = AppDataSource.getRepository(Items)
        const {id} = req.params
        const itemId = Number(id)

        if (!itemId || isNaN(itemId)) {
            throw new ApiError(400, "Invalid ID parameter");
        }


        const delItem = await menuRepo.delete(itemId) 

        if(delItem.affected ===0){
            throw new ApiError(404, "Item not found or a already deleted");
        }

        res.status(200).json({
            status: 'success',
            message: 'Item deleted successfully',
            data : delItem,
        })
    }catch(err){
        console.log(chalk.red("Unexpected server error occured", err))
        if (err instanceof ApiError) {
            return next(err);
        }
        return next(new ApiError(500, "Unexpected server error occurred"));

    }
    
}

// function for api , csv bulk upload 


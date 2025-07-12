import { Category } from "../models";

export const isValidCategory = (value: any): value is Category =>{
    return Object.values(Category).includes(value)
}
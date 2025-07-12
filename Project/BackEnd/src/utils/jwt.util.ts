import chalk from 'chalk';
import 'dotenv/config'
import jwt,{SignOptions, JwtPayload} from "jsonwebtoken";

const ACCESS_KEY = process.env.ACCESS_SECRET
const REFRESH_KEY = process.env.REFRESH_SECRET

if(!ACCESS_KEY || !REFRESH_KEY ){
    throw new Error("ACCESS KEY AND REFRESH KEY MUST BE SET IN ENV!!!")
}

export const generateAccessToken = (payload: object, expiresIn: any= "20sec")=>{
    const options: SignOptions = {
        expiresIn,
        algorithm: 'HS512'

    }
    return jwt.sign(payload, ACCESS_KEY, options)
}


export const generateRefreshToken = (payload: object, expiresIn: any = "3min")=>{
    const options: SignOptions = {
        expiresIn,
        algorithm: 'HS512'
    }
    return jwt.sign(payload, REFRESH_KEY, options)
}

export const verifyAccessToken = (token: string): string | JwtPayload | null =>{

    try{
    return jwt.verify(token,ACCESS_KEY)
    }catch(err){
        console.log(chalk.redBright("TOKEN VERIFICATION FAILED"))
        return null
    }

}

export const verifyRefreshToken = (token: string): string | JwtPayload | null =>{
    try{
    return jwt.verify(token, REFRESH_KEY)
    }catch(err){
        console.log(chalk.redBright("TOKEN VERIFICATION FAILED"))
        return null
    }

}
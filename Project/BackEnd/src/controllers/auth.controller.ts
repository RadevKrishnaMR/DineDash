import { Request, Response } from "express";
import { AppDataSource } from "../config/data.config";
import { User } from "../models";
import { createToken, resolveRole, verifyRefreshToken } from "../utils";
import chalk from "chalk";
import bcrypt from 'bcrypt';
import { ApiError } from "../utils/ApiError";



const userRepo = AppDataSource.getRepository(User)

export const login = async (req: Request, res: Response): Promise<void> =>{

    try{

       const {email, password} = req.body
       const userFound = await userRepo.findOne({
        where:{email}
       })

       if(!userFound){

        throw new ApiError(404, "User not found")
       }

       const userMatched = await bcrypt.compare(password, userFound.password)

       if(!userMatched){
        throw new ApiError(401, 'Incorrect Password')
       }

       const userRole = resolveRole(userFound.role)

       const payload = {
        id : userFound.id,
        name: userFound.name,
        email: userFound.email,
        role: userRole,
        

       }

       const tokens = createToken(payload)
        
        res.cookie('refreshToken', tokens.refreshToken ,{
            httpOnly: true,
            maxAge: 1000* 60 * 60 * 24 * 7,
            sameSite: 'lax',        // "lax" for localhost; "none" if you're using HTTPS + cross-origin
            secure: false 
        })
        res.json({
            status: "success",
            data:{
                token: tokens.accessToken,
                user:payload
            }
            
        })
        // console.log("userlogged in", userFound, "cookie created",tokens,refreshToken )
        return

    }catch (err: any) {
    console.log(chalk.red("Login Error", err));
    if (!(err instanceof ApiError)) {
        throw new ApiError(500, "Unexpected error during login");
    }
    throw err;
}

}


export const register = async (req: Request, res: Response): Promise<void> => {

    try{

        const {name,email,role,password} = req.body

        if(!email || !password|| !name || !role){

            throw new ApiError(400, "Name, email, password, and role are required")

        }

        const existing = await userRepo.findOne({
            where:{
                email
            }
        })

        if(existing){
            throw new ApiError(400, "Email Already Registered!!!...")

        }
        const hashPassword = await bcrypt.hash(password,10) 

        
            
        const userRole = resolveRole(role)
            

        const newUser = userRepo.create({
            name, email, role: userRole, password:hashPassword
        })

        await userRepo.save(newUser)

        const userFound = await userRepo.findOne({
        where:{email}
       })
        if(!userFound){

        throw new ApiError(404, "User not found")
       }


         const payload = {
        id : userFound.id,
        name: userFound.name,
        email: userFound.email,
        role: userRole,
         }


        const tokens = createToken(payload)
        
        res.cookie('refreshToken', tokens.refreshToken ,{
            httpOnly: true,
            maxAge: 1000* 60 * 60 * 24 * 7,
            sameSite: 'lax',        // "lax" for localhost; "none" if you're using HTTPS + cross-origin
            secure: false 

        })
        res.json({
            status: "success",
            data:{
                token: tokens.accessToken,
                user:payload
            }
            
        })
        //  console.log("user registered in", userFound, "cookie created",tokens,refreshToken )
        return 

    }catch (err: any) {
    console.log(chalk.red("Registration Error", err));
    if (!(err instanceof ApiError)) {
        throw new ApiError(500, "Unexpected error during registration");
    }
    throw err;
}


}


export const logout = async (req: Request, res: Response): Promise<void> =>{
    try{

    if(!(req.cookies.refreshToken)){
        throw new ApiError(404, "Token not found.")
    }
    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'lax',        // "lax" for localhost; "none" if you're using HTTPS + cross-origin
        secure: false 
    })
    res.json({
        message: "Logged Out successfully...."
    })
    return 
    }catch (err: any) {
    console.log(chalk.red("Refresh Token Error", err));
    if (!(err instanceof ApiError)) {
        throw new ApiError(500, "Unexpected error during token refresh");
    }
    throw err;
}
}


export const refreshToken = async (req: Request, res: Response): Promise<void>=>{
    const token = req.cookies.refreshToken;

    if(!token) {
        throw new ApiError(401,"No refresh token found " )
    }

    try{

        
        const payload: any = verifyRefreshToken(token);
        const {exp, iat, ...safePayload} = payload
        const tokens = createToken(safePayload)
    
        res.cookie("refreshToken",tokens.refreshToken,{
            httpOnly: true,
            maxAge: 1000* 60 * 60 * 24 * 7,
            sameSite: 'lax',        // "lax" for localhost; "none" if you're using HTTPS + cross-origin
            secure: false 
        }).json({
            status: "success",
            data: {
                
                  token: tokens.accessToken,
                  user : safePayload

            }
          

        })

    }catch (err: any) {
    console.log(chalk.red("Refresh Token Error", err));
    if (!(err instanceof ApiError)) {
        throw new ApiError(500, "Unexpected error during token refresh");
    }
    throw err;
}


}
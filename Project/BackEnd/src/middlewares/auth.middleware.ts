import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils'
import chalk from 'chalk';

export interface AUthRequest extends Request{
    user?: any;
}

export const authenticateJWT = (req: AUthRequest, res: Response, next: NextFunction)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({
            message: "No token provided or Invalid token"
        })
    }

    const token = authHeader.split(" ")[1]

    const decoded = verifyAccessToken(token)

     if (!decoded) {
        console.log(chalk.red("ACCESS TOKEN VERIFICATION FAILED"));
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }

    req.user = decoded;
    next();
}
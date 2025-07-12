import express from 'express';
import 'dotenv/config'
import { authRouter } from './routes/auth/auth.routes';
import { Response, Request, NextFunction } from 'express';
import { ApiError } from './utils/ApiError';
import cookieParser from 'cookie-parser'


export const app = express()

app.use(express.json())
app.use(cookieParser())
app.use('/api',authRouter)

app.use((err:any, req: Request, res: Response, next: NextFunction)=>{
    const statusCode = err instanceof ApiError ? err.statusCode: 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        status: "Error",
        message,
    })
})
import express from 'express';
import 'dotenv/config'
import { authRouter } from './routes/auth/auth.routes';
import { Response, Request, NextFunction } from 'express';
import { ApiError } from './utils/ApiError';
import cookieParser from 'cookie-parser'
import { authPath } from './routes/route.dir';
import { invoiceRouter, menuRouter, orderRouter, tableRouter } from './routes';
import { authenticateJWT } from './middlewares/auth.middleware';
import path from 'path';
import cors from 'cors';

export const app = express()
console.log(process.env.FRONT_URL);

const corsOption={
    // origin: 'http://localhost:5173',
    origin: process.env.FRONT_URL,
  credentials: true,
}

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOption))

// Serve invoices folder statically
app.use('/invoices', express.static(path.join(__dirname, '..', 'invoices')));

app.use('/api',authRouter)
app.use('/api',authenticateJWT,orderRouter)
app.use('/api',authenticateJWT,menuRouter)
app.use('/api',authenticateJWT,invoiceRouter)
app.use('/api',authenticateJWT,menuRouter)
app.use('/api',authenticateJWT,tableRouter)

app.use((err:any, req: Request, res: Response, next: NextFunction)=>{
    const statusCode = err instanceof ApiError ? err.statusCode: 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        status: "Error",
        message,
    })
})


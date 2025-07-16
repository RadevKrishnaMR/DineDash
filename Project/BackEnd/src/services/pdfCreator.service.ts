import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { AppDataSource } from "../config/data.config";
import { Invoice, Order, OrderItems, PaymentMode } from "../models";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export async function createInvoicePDF(invoiceData: any, fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const invoicesDir = path.join(__dirname, "..", "..", "invoices");


            // Ensure folder exists
            if (!fs.existsSync(invoicesDir)) {
                fs.mkdirSync(invoicesDir, { recursive: true });
            }

            const filePath = path.join(invoicesDir, fileName);
            const stream = fs.createWriteStream(filePath);
            const tax = process.env.TAX
            doc.pipe(stream);

            doc.fontSize(25).text("Restaurant Invoice", { align: "center" });
            doc.moveDown();

            doc.fontSize(14).text(`Order ID: ${invoiceData.orderId}`);
            doc.text(`Total Amount: INR ${invoiceData.totalAmount}`);
            doc.text(`Tax Percentage: INR ${tax}`);
            doc.text(`Discount: INR ${invoiceData.discount}`);
            doc.text(`Final Payable: INR ${invoiceData.totalAmount - invoiceData.discount}`);
            doc.text(`Payment Mode: ${invoiceData.paymentMode}`);
            doc.moveDown();

            doc.text("Items:");
            invoiceData.items.forEach((item: any) => {
                doc.text(`- ${item.name} x ${item.quantity} = INR ${item.cost * item.quantity}`);
            });

            doc.end();

            stream.on("finish", () => {
                resolve(filePath);
            });
        } catch (error) {
            reject(error);
        }
    });
}
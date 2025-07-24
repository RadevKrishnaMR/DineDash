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

            if (!fs.existsSync(invoicesDir)) {
                fs.mkdirSync(invoicesDir, { recursive: true });
            }

            const filePath = path.join(invoicesDir, fileName);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            const stream = fs.createWriteStream(filePath);

            const currDiscount = invoiceData.discount

            console.log('Discount amount in pdf creation ',invoiceData.discount);

            

            doc.pipe(stream);

            doc.fontSize(25).text("Restaurant Invoice", { align: "center" });
            doc.moveDown();

            doc.fontSize(14).text(`Order ID: ${invoiceData.orderId}`);
            doc.text(`Subtotal: INR ${invoiceData.subtotal.toFixed(2)}`);
            doc.text(`Discount: ${currDiscount}%`);
            doc.text(`Tax: ${invoiceData.tax}%`);
            doc.text(`Final Payable: INR ${invoiceData.finalCost.toFixed(2)}`);
            doc.text(`Payment Mode: ${invoiceData.paymentMode}`);
            doc.moveDown();

            doc.text("Items:");
            invoiceData.items.forEach((item: any) => {
                doc.text(`- ${item.name} x ${item.quantity} = INR ${(item.cost * item.quantity).toFixed(2)}`);
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

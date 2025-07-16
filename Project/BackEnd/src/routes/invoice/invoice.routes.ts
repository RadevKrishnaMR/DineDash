import {Router} from 'express'
import { invoicePath } from '../route.dir'
import { generateInvoice, getAllInvoices, getInvoiceById, toggleInvoicePaid } from '../../controllers/invoice.controller'


export const invoiceRouter = Router()

invoiceRouter.post(invoicePath.GENERATEINVOICE,generateInvoice);
invoiceRouter.post(invoicePath.TOGGLEINVOICE,toggleInvoicePaid);
invoiceRouter.get(invoicePath.GETINVOICE,getAllInvoices);
invoiceRouter.get(invoicePath.GETINVOICEBYID,getInvoiceById);
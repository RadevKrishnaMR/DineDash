import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("dinedash_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

type PaymentMode = 'Cash' | 'Card' | 'UPI' | 'Net Banking';

type Order = {
  id: number;
  orderType: string;
  status: string;
  table?: {
    number: number;
    capacity: number;
  };
  orderItems: {
    id: number;
    quantity: number;
    item: {
      name: string;
      cost: number;
      category: string;
    };
  }[];
};

type InvoiceItem = {
  id: number;
  totalAmount: number | string;
  discount: number;
  isPaid: boolean;
  paymentMode: string;
  pdfUrl: string;
  order: Order;
};

type InvoiceFormData = {
  reqDiscount: number;
  paymentMode: PaymentMode;
  isPaid: boolean;
};

const InvoiceDashboard = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [invoice, setInvoice] = useState<InvoiceItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<InvoiceFormData>({
    reqDiscount: 0,
    paymentMode: 'Cash',
    isPaid: false,
  });

  // If no orderId is provided, show general invoice overview
  const isGeneralView = !orderId;

  const fetchOrder = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/getOrder/${id}`);
      setOrder(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch order details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingInvoice = async (id: string) => {
    try {
      const response = await api.get(`/getInvoiceByOrder/${id}`);
      if (response.data.data) {
        setInvoice(response.data.data);
      }
    } catch (err) {
      // No existing invoice found, which is okay
      console.log('No existing invoice found for this order', err);
    }
  };

  const fetchAllInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/getInvoice/");
      setInvoices(res.data.data);
    } catch (err) {
      console.error("Failed to fetch invoices", err);
    } finally {
      setLoading(false);
    }
  };

  // For general view
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);

  useEffect(() => {
    if (isGeneralView) {
      fetchAllInvoices();
    } else if (orderId) {
      fetchOrder(orderId);
      fetchExistingInvoice(orderId);
    }
  }, [orderId, isGeneralView]);

  const handleGenerateInvoice = async () => {
    if (!order) return;

    setGenerating(true);
    setError(null);

    try {
      const response = await api.post(`/generateInvoice/${order.id}`, {
       
        reqDiscount: formData.reqDiscount,
        paymentMode: formData.paymentMode,
        isPaid: formData.isPaid,
      });
      console.log('response from generate invoice', response);
      

      if (response.data.status === 'success') {
        // Refresh the invoice data
        await fetchExistingInvoice(order.id.toString());
        
        // Open PDF in new tab if URL is provided
        if (response.data.data.pdfUrl) {
          window.open(`${API_BASE_URL}${response.data.data.pdfUrl}`, '_blank');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate invoice');
      console.error('Invoice generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  const togglePaidStatus = async (id: number) => {
    try {
      await api.post(`/toggleInvoice/${id}`);
      if (isGeneralView) {
        fetchAllInvoices();
      } else if (orderId) {
        fetchExistingInvoice(orderId);
      }
    } catch (err) {
      console.error("Failed to toggle paid status", err);
    }
  };

  const handleInputChange = (field: keyof InvoiceFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate totals for invoice generation
  const calculateTotals = () => {
    if (!order) return { subtotal: 0, discountAmount: 0, afterDiscount: 0, taxAmount: 0, total: 0 };

    const subtotal = order.orderItems.reduce((sum, item) => 
      sum + (item.item.cost * item.quantity), 0
    );
    const discountAmount = (subtotal * formData.reqDiscount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const tax = 18; // You can make this configurable
    const taxAmount = (afterDiscount * tax) / 100;
    const total = afterDiscount + taxAmount;

    return { subtotal, discountAmount, afterDiscount, taxAmount, total, tax };
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  // General invoice overview (when no orderId)
  if (isGeneralView) {
    return (
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-3xl font-bold">Invoice Overview</h1>
        </motion.div>

        {invoices.length === 0 ? (
          <p className="text-gray-500">No invoices found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoices.map((invoice) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  title={`Invoice #${invoice.id}`}
                  value={`₹${Number(invoice.totalAmount).toFixed(2)}`}
                  icon={invoice.isPaid ? "✅" : "⌛"}
                  color={invoice.isPaid ? "border-green-500" : "border-yellow-500"}
                />
                <div className="mt-4 flex justify-between gap-2">
                  <Button
                    variant={invoice.isPaid ? "danger" : "primary"}
                    size="sm"
                    onClick={() => togglePaidStatus(invoice.id)}
                  >
                    Mark as {invoice.isPaid ? "Unpaid" : "Paid"}
                  </Button>
                  <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="sm">Download PDF</Button>
                  </a>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Discount: {invoice.discount}%</p>
                  <p>Payment Mode: {invoice.paymentMode}</p>
                  <p>Order ID: #{invoice.order.id}</p>
                  <p>Items: {invoice.order.orderItems.length}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Order-specific invoice view
  if (error) {
    return (
      <div className="p-4">
        <div className="text-center py-8 text-red-500">{error}</div>
        <div className="text-center">
          <Button onClick={() => navigate('/orders')} variant="secondary">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-8">Order not found</div>;
  }

  const { subtotal, discountAmount, afterDiscount, taxAmount, total, tax } = calculateTotals();

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-3xl font-bold">Invoice for Order #{order.id}</h1>
        <Button onClick={() => navigate('/orders')} variant="secondary">
          Back to Orders
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Details */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Type:</span>
                <span className="font-medium">{order.orderType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">{order.status}</span>
              </div>
              {order.table && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Table:</span>
                  <span className="font-medium">{order.table.number} ({order.table.capacity} seats)</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            <div className="space-y-3">
              {order.orderItems.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">{item.item.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ₹{item.item.cost} × {item.quantity}
                    </span>
                    <div className="text-xs text-gray-400">{item.item.category}</div>
                  </div>
                  <span className="font-medium">₹{(item.item.cost * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Invoice Section */}
        <div className="space-y-6">
          {/* Existing Invoice */}
          {invoice && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200"
            >
              <h2 className="text-xl font-semibold mb-4 text-green-800">Existing Invoice</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Invoice ID:</span>
                  <span className="font-medium">#{invoice.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-medium">₹{Number(invoice.totalAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span className={`font-medium ${invoice.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                    {invoice.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Mode:</span>
                  <span className="font-medium">{invoice.paymentMode}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span className="font-medium">{invoice.discount}%</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant={invoice.isPaid ? "danger" : "primary"}
                  size="sm"
                  onClick={() => togglePaidStatus(invoice.id)}
                >
                  Mark as {invoice.isPaid ? "Unpaid" : "Paid"}
                </Button>
                <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="sm">Download PDF</Button>
                </a>
              </div>
            </motion.div>
          )}

          {/* Generate New Invoice */}
          {!invoice && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold mb-4">Generate Invoice</h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.reqDiscount}
                      onChange={(e) => handleInputChange('reqDiscount', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Mode</label>
                    <select
                      value={formData.paymentMode}
                      onChange={(e) => handleInputChange('paymentMode', e.target.value as PaymentMode)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="UPI">UPI</option>
                      <option value="Net Banking">Net Banking</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPaid"
                    checked={formData.isPaid}
                    onChange={(e) => handleInputChange('isPaid', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPaid" className="ml-2 block text-sm font-medium">
                    Mark as Paid
                  </label>
                </div>

                {/* Bill Summary */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Bill Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount ({formData.reqDiscount}%):</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>After Discount:</span>
                      <span>₹{afterDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax ({tax}%):</span>
                      <span>₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateInvoice}
                  disabled={generating}
                  className="w-full"
                  variant="primary"
                >
                  {generating ? 'Generating...' : 'Generate Invoice'}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDashboard;
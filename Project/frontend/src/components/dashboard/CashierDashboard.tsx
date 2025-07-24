import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Card from "../ui/Card";
// import axios from "axios";
import api from "../../api/authAPI";


// const API_BASE_URL = import.meta.env.VITE_API_BASE;

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("dinedash_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

const CashierDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [revenue, setRevenue] = useState(0);
  const [paidCount,setPaidCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0)
  


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/getAllOrder");
        const data = response.data.data;

        const invoiceRes = await api.get("/getInvoice")
        const invoiceData = invoiceRes.data.data

        if (invoiceData) {
          const totalPaidAmount = invoiceData
            .filter((invoice: any) => invoice.isPaid)
            .reduce((sum: number, invoice: any) => sum + Number(invoice.totalAmount), 0);

                  // Count of paid invoices
        const paidCount = invoiceData.filter((inv: any) => inv.isPaid).length;

        // Count of pending invoices
        const pendingCount = invoiceData.filter((inv: any) => !inv.isPaid).length;
          
          setPaidCount(paidCount)
          setPendingCount(pendingCount)
          setRevenue(totalPaidAmount); // we'll create this state
        }
        // Sort by latest order ID (or created date if available)
        const sortedOrders = data.sort((a: any, b: any) => b.id - a.id);
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchOrders();
  }, []);

  
  // Helper to compute total amount for each order
  const calculateAmount = (order: any): number => {
    return order.orderItems?.reduce((sum: number, item: any) => {
      const price = item.item?.price || 0;
      const qty = item.quantity || 1;
      return sum + price * qty;
    }, 0) || 0;
  };


  const getStatusStyles = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-gray-100 text-gray-800";
    case "InKitchen":
      return "bg-yellow-100 text-yellow-800";
    case "Ready":
      return "bg-blue-100 text-blue-800";
    case "Served":
      return "bg-purple-100 text-purple-800";
    case "Billed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};


  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Cashier Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Today's Revenue" value={`₹${revenue.toFixed(2)}`} icon="💰" color="border-green-500" />
        <a href="/order">
          <Card title="Pending Payments" value={`${pendingCount}`} icon="⏳" color="border-yellow-500" />
        </a>
        <a href="/order">
          <Card title="Completed Transactions" value={`${paidCount}`} icon="✅" color="border-blue-500" />
        </a>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg">Recent Orders</h3>
          {/* <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            New Payment
          </button> */}
        </div>

        {loading ? (
          <p className="text-center py-4">Loading recent orders...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.slice(0, 10).map((order) => (
                  <motion.tr
                    key={order.id}
                    whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Table {order.table?.id ?? "N/A"}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      ${calculateAmount(order).toFixed(2)}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusStyles(order.status)}}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                        Process
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Print
                      </button>
                    </td> */}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CashierDashboard;

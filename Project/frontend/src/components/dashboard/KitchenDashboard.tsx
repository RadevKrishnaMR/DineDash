import { useEffect, useState } from "react";
import { motion } from "framer-motion";
// import axios from 'axios';
import { socket } from '../../../src/socket';
import api from "../../api/authAPI";


// const API_BASE_URL = import.meta.env.VITE_API_BASE;

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { 'Content-Type': 'application/json' },
// });

// // Request interceptor for auth
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('dinedash_token');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for 401 handling
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem('dinedash_token');
//       localStorage.removeItem('dinedash_user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(err);
//   }
// );

type StatusType = "pending" | "inProgress" | "completed";

interface Order {
  id: number;
  table: number | null;
  items: string[];
  time: string;
}

interface OrdersByStatus {
  pending: Order[];
  inProgress: Order[];
  completed: Order[];
}

const KitchenDashboard = () => {
  const [orders, setOrders] = useState<OrdersByStatus>({
    pending: [],
    inProgress: [],
    completed: [],
  });

  const [activeTab, setActiveTab] = useState<StatusType>("pending");
  const [loading, setLoading] = useState(false);

  const mapOrder = (order: any): Order => ({
    id: order.id,
    table: order.table?.id ?? null,
    items: order.orderItems.map((oi: any) => oi.item.name),
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });

  const groupOrders = (ordersRaw: any[]): OrdersByStatus => {
    const grouped: OrdersByStatus = { pending: [], inProgress: [], completed: [] };

    ordersRaw.forEach((order: any) => {
      const mapped = mapOrder(order);
      switch (order.status) {
        case "Pending":
          grouped.pending.push(mapped);
          break;
        case "InKitchen":
        case "Ready":
          grouped.inProgress.push(mapped);
          break;
        case "Served":
        case "Billed":
          grouped.completed.push(mapped);
          break;
      }
    });

    return grouped;
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/getAllOrder");
      setOrders(groupOrders(res.data.data));
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: "InKitchen" | "Ready" | "Served" | "Billed") => {
    try {
      await api.put(`/editOrder/${orderId}`, { status });
      fetchOrders(); // Optionally refresh
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  useEffect(() => {
  fetchOrders();

  // ✅ Listen for new orders
  socket.on("new-order", () => {
    console.log("📦 new-order received via socket to", socket.id);
    fetchOrders();
  });

  socket.on("order:updated", () => {
    console.log("🔄 order:updated received");
    fetchOrders();
  });

  socket.onAny((event, ...args) => {
  console.log("🧲 Socket Event:", event, args);
  });


  return () => {
    socket.off("new-order");      // ✅ must match exactly
    socket.off("order:updated");
    // socket.disconnect(); ❌ only disconnect if you're sure socket won't be used after
  };
}, []);

  return (
    <div className="p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Kitchen Dashboard
      </motion.h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Pending Orders", count: orders.pending.length, color: "red", icon: "⏳" },
          { label: "In Progress", count: orders.inProgress.length, color: "yellow", icon: "👨‍🍳" },
          { label: "Completed", count: orders.completed.length, color: "green", icon: "✅" },
        ].map(({ label, count, color, icon }, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className={`bg-white p-6 rounded-xl shadow-md border-l-4 border-${color}-500`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <h3 className="text-2xl font-bold mt-1">{count}</h3>
              </div>
              <div className="text-3xl">{icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {(["pending", "inProgress", "completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab === "pending" && "Pending Orders"}
                {tab === "inProgress" && "In Progress"}
                {tab === "completed" && "Completed"}
              </button>
            ))}
          </nav>
        </div>

        {/* Orders */}
        <div className="p-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : orders[activeTab].length === 0 ? (
            <p className="text-center text-gray-500">No {activeTab} orders</p>
          ) : (
            <div className="space-y-4">
              {orders[activeTab].map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">
                        Order #{order.id} {order.table ? `(Table ${order.table})` : "(No Table)"}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">Placed at {order.time}</p>
                      <ul className="mt-2 list-disc list-inside text-sm">
                        {order.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {activeTab === "pending" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "InKitchen")}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                      >
                        Start Preparing
                      </button>
                    )}

                    {activeTab === "inProgress" && (
                      <button
                        onClick={() => updateOrderStatus(order.id, "Served")}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Mark as Done
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard;

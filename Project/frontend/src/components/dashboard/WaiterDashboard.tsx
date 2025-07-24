import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import axios from 'axios';
import api from "../../api/authAPI";



// const API_BASE_URL = import.meta.env.VITE_API_BASE;

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('dinedash_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('dinedash_token');
//       localStorage.removeItem('dinedash_user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );



// Table interface
interface Table {
  id: number;
  name: string;
  status: boolean;
  assignedWaiter?: {
    id: number;
    name: string;
  };
  customers?: number;
  order?: string;
  time?: string;
}

const WaiterDashboard = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const requests = [
    { id: 1, table: 3, request: 'Extra napkins', status: 'pending' },
    { id: 2, table: 5, request: 'Water refill', status: 'pending' },
    { id: 3, table: 1, request: 'Bill request', status: 'completed' },
  ];

  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    if (path) {
      navigate(path);
    }
  };

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await api.get('/getTable');
        const rawTables: Table[] = response.data.data;

        // Add mock fields for frontend display
        const mappedTables = rawTables.map((table) => ({
          ...table,
          customers: table.status ? Math.floor(Math.random() * 6) + 1 : 0,
          order: table.status ? 'In Progress' : undefined,
          time: table.status ? '12:00 PM' : undefined,
        }));

        setTables(mappedTables);
      } catch (err) {
        console.error("Error fetching tables", err);
        setError("Failed to load tables");
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

const toggleTableStatus = async (tableId: number, currentStatus: boolean) => {
  try {
    // Send the *new* status (toggle current one)
    const newStatus = !currentStatus;

    const response = await api.post(`/editTable/${tableId}`, {
      status: newStatus, // Send actual boolean
    });

    // Optional: Get updated table data from response
    const updatedTable = response.data.data;

    // Safely update UI only after success
    setTables(prev =>
      prev.map(table =>
        table.id === tableId
          ? {
              ...table,
              status: updatedTable.status,
              customers: updatedTable.status ? 0 : Math.floor(Math.random() * 6) + 1,
              order: updatedTable.status ? undefined : 'In Progress',
              time: updatedTable.status ? undefined : '12:00 PM',
            }
          : table
      )
    );
  } catch (err) {
    console.error('Failed to toggle table status:', err);
  }
};


  const statCards = [
    {
      title: "Occupied Tables",
      value: tables.filter(t => t.status !== true).length,
      icon: "🪑",
      borderColor: "border-blue-500",
      path: '',
    },
    {
      title: "Make Orders",
      value: "",
      icon: "📝",
      borderColor: "border-purple-600",
      path: '/makeOrder',
    },
    // {
    //   title: "Ready Orders",
    //   value: tables.filter(t => t.order === 'Ready').length,
    //   icon: "🍽️",
    //   borderColor: "border-green-500",
    //   path: '/order',
    // },
    // {
    //   title: "Pending Requests",
    //   value: requests.filter(r => r.status === 'pending').length,
    //   icon: "🛎️",
    //   borderColor: "border-yellow-500",
    //   path: '/order',
    // },
  ];

  if (loading) return <div className="text-center py-4">Loading tables...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Waiter Dashboard
      </motion.h1>

      <div className="flex flex-wrap gap-6 mb-8 ">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className={`bg-white p-6 flex-grow rounded-xl shadow-md border-l-4 ${card.borderColor} `}
            onClick={() => handleCardClick(card.path)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
              </div>
              <div className="text-3xl">{card.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TABLE STATUS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h3 className="font-semibold text-lg mb-4">Table Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tables.map((table) => (
              <motion.button
                key={table.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleTableStatus(table.id,table.status)}
                className={`p-4 rounded-lg flex flex-col items-center ${
                  table.status
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <span className="text-xl font-bold">{table.name}</span>
                {!table.status && (
                  <>
                    {/* <span className="text-sm">{table.customers} guests</span> */}
                    <span className="text-xs mt-1">{table.order}</span>
                  </>
                )}
                {table.status && (
                  <span className="text-sm">Vacant</span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* REQUESTS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h3 className="font-semibold text-lg mb-4">Customer Requests</h3>
          <div className="space-y-3">
            {requests.map((request) => (
              <motion.div
                key={request.id}
                whileHover={{ x: 5 }}
                className={`p-3 rounded-lg border ${
                  request.status === 'pending'
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-green-200 bg-green-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Table {request.table}</p>
                    <p className="text-gray-700">{request.request}</p>
                  </div>
                  {request.status === 'pending' ? (
                    <button className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700">
                      Complete
                    </button>
                  ) : (
                    <span className="text-green-600 text-sm">Completed</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WaiterDashboard;

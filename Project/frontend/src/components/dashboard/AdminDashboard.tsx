import { motion } from "framer-motion";
import Card from "../ui/Card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import axios from "axios";
import api from "../../api/authAPI";





// const API_BASE_URL = import.meta.env.VITE_API_BASE; 

// const api = axios.create({
//   // baseURL: "http://localhost:6321/api",
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add token to headers
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

// // Response interceptor to handle auth errors
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



type StatCard = {
  title: string;
  value: string;
  icon: string;
  color: string;
  path: string;
};





export const  AdminDashboard = () => {

const [noOrder,setNoOrder] = useState(0);
const [noMenu,setNoMenu] = useState(0);
const [totalrevenue, setotalReveneue] = useState(0)
 useEffect(() => {
  const fetchCounts = async () => {
    try {
      const [orderRes, menuRes, ] = await Promise.all([
        api.get('/getAllOrder'),
        api.get('/getMenu'),
        
      ]);

      setNoOrder(orderRes.data.data.length || 0);
      setNoMenu(menuRes.data.data.length || 0);

      
      const invoiceRes = await api.get("/getInvoice")
        const invoiceData = invoiceRes.data.data

        if (invoiceData) {
          const totalPaidAmount = invoiceData
            .filter((invoice: any) => invoice.isPaid)
            .reduce((sum: number, invoice: any) => sum + Number(invoice.totalAmount), 0);
          setotalReveneue(totalPaidAmount)
         }

      

    } catch (error) {
      console.log('Failed to fetch dashboard data', error);
    }
  };

  fetchCounts();
}, []);

  const stats: StatCard[] = [
    { title: "Total Revenue", value: `₹${Number(totalrevenue || 0).toFixed(2)}`, icon: "💰", color: "border-blue-500", path: ''},
    { title: `Menu Item`, value: `${noMenu}`, icon: "🍽️", color: "border-purple-500", path: '/menu' },
    { title: 'Order', value: `${noOrder}`, icon: "📦", color: "border-yellow-500", path: '/order' },
  ];
  
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(path);
  };


  return (
    <div>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Admin Overview
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center mb-8">

        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card {...stat} 
            onClick={() => handleCardClick(stat.path)}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h3 className="font-semibold text-lg mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {['Menu updated', 'New staff added', 'Discount created', 'System updated'].map((activity, i) => (
              <div key={i} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                <div className="bg-indigo-100 p-2 rounded-full mr-3">
                  <span className="text-indigo-600">🔔</span>
                </div>
                <div>
                  <p className="font-medium">{activity}</p>
                  <p className="text-gray-500 text-sm">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '➕', title: 'Add Menu Item', action: () => {handleCardClick('/menu')} },
              { icon: '👨‍🍳', title: 'Manage Staff', action: () => {} },
              { icon: '📊', title: 'View Reports', action: () => {handleCardClick('/order')} },
              
            ].map((action, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <span className="text-2xl mb-2">{action.icon}</span>
                <span className="text-sm text-center">{action.title}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
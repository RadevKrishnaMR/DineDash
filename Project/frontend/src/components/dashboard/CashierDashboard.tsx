import { motion } from "framer-motion";
import Card from "../ui/Card";

const CashierDashboard = () => {
  const orders = [
    { id: 101, table: 5, amount: 45.50, status: 'Pending' },
    { id: 102, table: 3, amount: 32.75, status: 'Paid' },
    { id: 103, table: 8, amount: 28.90, status: 'Pending' },
    { id: 104, table: 2, amount: 67.20, status: 'Pending' },
  ];

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
        <Card title="Today's Revenue" value="$1,245" icon="💰" color="border-green-500" />
        <Card title="Pending Payments" value="8" icon="⏳" color="border-yellow-500" />
        <Card title="Completed Transactions" value="42" icon="✅" color="border-blue-500" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg">Recent Orders</h3>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            New Payment
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <motion.tr 
                  key={order.id}
                  whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Table {order.table}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${order.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Process
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Print
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default CashierDashboard;
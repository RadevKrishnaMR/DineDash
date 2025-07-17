import { motion } from "framer-motion";
import { useState } from "react";

interface Order {
  id: number;
  table: number;
  items: string[];
  time: string;
}

interface OrdersByStatus {
  pending: Order[];
  inProgress: Order[];
  completed: Order[];
}

const KitchenDashboard = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'inProgress' | 'completed'>('pending');
  
  const orders: OrdersByStatus = {
    pending: [
      { id: 101, table: 5, items: ['Burger', 'Fries', 'Soda'], time: '12:05' },
      { id: 102, table: 3, items: ['Pasta', 'Salad'], time: '12:10' },
      { id: 103, table: 8, items: ['Steak', 'Mashed Potatoes', 'Wine'], time: '12:15' },
    ],
    inProgress: [
      { id: 104, table: 2, items: ['Pizza', 'Garlic Bread'], time: '12:00' },
      { id: 105, table: 7, items: ['Salmon', 'Rice', 'Veggies'], time: '12:08' },
    ],
    completed: [
      { id: 106, table: 1, items: ['Soup', 'Sandwich'], time: '11:45' },
      { id: 107, table: 4, items: ['Chicken Wings', 'Beer'], time: '11:50' },
    ]
  };

  return (
    <div>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Kitchen Dashboard
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Pending Orders</p>
              <h3 className="text-2xl font-bold mt-1">{orders.pending.length}</h3>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">In Progress</p>
              <h3 className="text-2xl font-bold mt-1">{orders.inProgress.length}</h3>
            </div>
            <div className="text-3xl">👨‍🍳</div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Completed Today</p>
              <h3 className="text-2xl font-bold mt-1">{orders.completed.length}</h3>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {(['pending', 'inProgress', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'pending' && 'Pending Orders'}
                {tab === 'inProgress' && 'In Progress'}
                {tab === 'completed' && 'Completed'}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {orders[activeTab].length === 0 ? (
            <p className="text-gray-500 text-center py-8">No {activeTab} orders</p>
          ) : (
            <div className="space-y-4">
              {orders[activeTab].map((order: Order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Order #{order.id} (Table {order.table})</h4>
                      <p className="text-sm text-gray-500 mt-1">Placed at {order.time}</p>
                      <ul className="mt-2 list-disc list-inside text-sm">
                        {order.items.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    {activeTab === 'pending' && (
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                        Start Preparing
                      </button>
                    )}
                    {activeTab === 'inProgress' && (
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
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
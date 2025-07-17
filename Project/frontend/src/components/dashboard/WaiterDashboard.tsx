import { motion } from "framer-motion";
import { useState } from "react";

const WaiterDashboard = () => {
  const [tables, setTables] = useState([
    { id: 1, status: 'occupied', customers: 2, order: 'In Progress', time: '12:15' },
    { id: 2, status: 'vacant', customers: 0, order: null, time: null },
    { id: 3, status: 'occupied', customers: 4, order: 'Ready', time: '12:20' },
    { id: 4, status: 'reserved', customers: 0, order: null, time: '12:30' },
    { id: 5, status: 'occupied', customers: 3, order: 'Waiting', time: '12:05' },
    { id: 6, status: 'vacant', customers: 0, order: null, time: null },
    { id: 7, status: 'occupied', customers: 5, order: 'In Progress', time: '12:10' },
    { id: 8, status: 'vacant', customers: 0, order: null, time: null },
  ]);

  const requests = [
    { id: 1, table: 3, request: 'Extra napkins', status: 'pending' },
    { id: 2, table: 5, request: 'Water refill', status: 'pending' },
    { id: 3, table: 1, request: 'Bill request', status: 'completed' },
  ];

  const toggleTableStatus = (tableId: number) => {
    setTables(tables.map(table => 
      table.id === tableId 
        ? { 
            ...table, 
            status: table.status === 'occupied' ? 'vacant' : 'occupied',
            customers: table.status === 'occupied' ? 0 : Math.floor(Math.random() * 6) + 1
          } 
        : table
    ));
  };

  return (
    <div>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Waiter Dashboard
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Occupied Tables</p>
              <h3 className="text-2xl font-bold mt-1">{tables.filter(t => t.status === 'occupied').length}</h3>
            </div>
            <div className="text-3xl">🪑</div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Ready Orders</p>
              <h3 className="text-2xl font-bold mt-1">{tables.filter(t => t.order === 'Ready').length}</h3>
            </div>
            <div className="text-3xl">🍽️</div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Pending Requests</p>
              <h3 className="text-2xl font-bold mt-1">{requests.filter(r => r.status === 'pending').length}</h3>
            </div>
            <div className="text-3xl">🛎️</div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                onClick={() => toggleTableStatus(table.id)}
                className={`p-4 rounded-lg flex flex-col items-center ${
                  table.status === 'occupied' ? 'bg-red-100 text-red-800' : 
                  table.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'
                }`}
              >
                <span className="text-xl font-bold">Table {table.id}</span>
                {table.status === 'occupied' && (
                  <>
                    <span className="text-sm">{table.customers} guests</span>
                    <span className="text-xs mt-1">{table.order}</span>
                  </>
                )}
                {table.status === 'reserved' && (
                  <span className="text-xs mt-1">Reserved at {table.time}</span>
                )}
                {table.status === 'vacant' && (
                  <span className="text-sm">Vacant</span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

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
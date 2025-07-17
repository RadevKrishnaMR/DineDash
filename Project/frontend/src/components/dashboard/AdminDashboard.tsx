import { motion } from "framer-motion";
import Card from "../ui/Card";

export const  AdminDashboard = () => {
  const stats = [
    { title: "Total Revenue", value: "$12,345", icon: "💰", color: "border-blue-500" },
    { title: "Active Staff", value: "24", icon: "👨‍🍳", color: "border-green-500" },
    { title: "Menu Items", value: "86", icon: "🍽️", color: "border-purple-500" },
    { title: "Today's Orders", value: "142", icon: "📦", color: "border-yellow-500" },
  ];

  return (
    <div>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Admin Overview
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card {...stat} />
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
              { icon: '➕', title: 'Add Menu Item', action: () => {} },
              { icon: '👨‍🍳', title: 'Manage Staff', action: () => {} },
              { icon: '📊', title: 'View Reports', action: () => {} },
              { icon: '⚙️', title: 'Settings', action: () => {} },
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
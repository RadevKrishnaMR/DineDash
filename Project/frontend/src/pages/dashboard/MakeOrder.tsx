import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from 'axios' // assuming your Axios instance
import { Navbar } from "../../components";
import Footer from "../../components/Footer/Footer";
import { Button } from "../../components/ui/Button";





const API_BASE_URL = import.meta.env.VITE_API_BASE; 

const api = axios.create({
  // baseURL: "http://localhost:6321/api",
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dinedash_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dinedash_token');
      localStorage.removeItem('dinedash_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

type OrderItem = {
  itemId: string;
  quantity: number;
  note: string;
};

type Table = {
  id: string;
  status: boolean;
};

type MenuItem = {
  id: string;
  name: string;
  available: boolean;
};


const orderTypes = ["DinerIn", "TakeAway", "Delivery"];



const MakeOrderForm = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [form, setForm] = useState<{
  orderType: string;
  tableId: string;
  orderItems: OrderItem[];
    }>({
    orderType: "",
    tableId: "",
    orderItems: [{ itemId: "", quantity: 1, note: "" }],
    });

    const resetForm = () => {
        if (window.confirm("Are you sure you want to clear the form?")) {
            setForm({
            orderType: "",
            tableId: "",
            orderItems: [{ itemId: "", quantity: 1, note: "" }],
            });
        }
        };


  useEffect(() => {
    const fetchData = async () => {
      const [tablesRes, itemsRes] = await Promise.all([
        api.get("/getTable"),
        api.get("/getMenu")
      ]);
      setTables(tablesRes.data.data || []);
      setMenuItems(itemsRes.data.data || []);
    };

    fetchData();
  }, []);

  const handleItemChange = (
  index: number,
  field: keyof OrderItem,
  value: string | number
) => {
  const updatedItems = [...form.orderItems];
  updatedItems[index] = {
    ...updatedItems[index],
    [field]: value,
  };
  setForm({ ...form, orderItems: updatedItems });
};

  const addItem = () => {
    setForm({ ...form, orderItems: [...form.orderItems, { itemId: "", quantity: 1, note: "" }] });
  };

  const removeItem = (index: number) => {
    const updatedItems = [...form.orderItems];
    updatedItems.splice(index, 1);
    setForm({ ...form, orderItems: updatedItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tableId: form.orderType === "DinerIn" ? form.tableId : undefined
      };
      const res = await api.post("/makeOrder", payload);
      alert("Order Placed Successfully!");
      // optionally reset the form here
    } catch (err) {
      console.error("Order error:", err);
      alert("Failed to place order");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
    <Navbar/>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-6 max-w-5xl mx-auto flex-1 p-6 m-30 mt-50"
    >
      <h2 className="text-2xl font-semibold mb-4">Make New Order</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Order Type</label>
          <select
            value={form.orderType}
            onChange={(e) => setForm({ ...form, orderType: e.target.value })}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Type</option>
            {orderTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Table Selection */}
        {form.orderType === "DinerIn" && (
          <div>
            <label className="block text-sm font-medium mb-1">Table</label>
            <select
              value={form.tableId}
              onChange={(e) => setForm({ ...form, tableId: e.target.value })}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Table</option>
              {tables
                .filter(t => t.status) // only available tables
                .map(table => (
                  <option key={table.id} value={table.id}>
                    Table {table.id}
                  </option>
              ))}
            </select>
          </div>
        )}

        {/* Order Items */}
        <div className="space-y-4">
          <label className="block text-sm font-medium mb-2">Order Items</label>
          {form.orderItems.map((item, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                    value={item.itemId}
                    onChange={(e) => handleItemChange(index, "itemId", e.target.value)}
                    className="border p-2 rounded"
                    required
                    >
                    <option value="">Select Item</option>
                    {menuItems
                        .filter(i => i.available)
                        .map(menu => (
                        <option key={menu.id} value={menu.id}>
                            {menu.name}
                        </option>
                    ))}
                    </select>

                <input
                  type="number"
                  min={1}
                  className="border p-2 rounded"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="border p-2 rounded"
                  placeholder="Note (optional)"
                  value={item.note}
                  onChange={(e) => handleItemChange(index, "note", e.target.value)}
                />
              </div>
              {form.orderItems.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 text-sm"
                  onClick={() => removeItem(index)}
                >
                  Remove Item
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 text-sm"
            onClick={addItem}
          >
            + Add More Item
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 mt-4">
            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
                Submit Order
            </button>

            <Button
                type="button" // Important to prevent submit!
                variant="secondary"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-black"
            >
                Cancel
            </Button>
            </div>

      </form>
    </motion.div>
    <Footer/>
    </div>
  );
};

export default MakeOrderForm;

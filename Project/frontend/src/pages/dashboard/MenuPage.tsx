import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import axios from "axios";
import type { FC } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dinedash_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type MenuItem = {
  id: number;
  name: string;
  description: string;
  category: string;
  cost: number;
  available: boolean;
};

const MenuPage: FC = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    category: "",
    cost: "",
  });

  // Enum options
const categoryOptions = [
  "Starter",
  "MainCourse",
  "Bread",
  "Beverages",
  "Burgers",
  "Pastries",
];

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await api.get("/getMenu");
      setMenu(res.data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch menu");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await api.post("/addMenu", {
        ...newItem,
        cost: Number(newItem.cost),
      });
      setMenu((prev) => [...prev, res.data.data]);
      setNewItem({ name: "", description: "", category: "", cost: "" });
    } catch (err) {
  const error = err as AxiosError<{ message: string }>;
  alert(error?.response?.data?.message || "Add failed");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/deleteMenu/${id}`);
      setMenu((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert(`Delete failed ${err}`);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Menu Management</h1>

     {/* Add Item Form */}
<div className="mb-6 p-4 border rounded-lg bg-white shadow-sm grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Name</label>
    <input
      placeholder="Name"
      className="input border border-gray-300 rounded px-3 py-2"
      value={newItem.name}
      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Description</label>
    <input
      placeholder="Description"
      className="input border border-gray-300 rounded px-3 py-2"
      value={newItem.description}
      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
    />
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Category</label>
    <select
      className="input border border-gray-300 rounded px-3 py-2"
      value={newItem.category}
      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
    >
      <option value="" disabled>Select Category</option>
      {categoryOptions.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  </div>

  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">Cost (₹)</label>
    <input
      placeholder="Cost"
      type="number"
      className="input border border-gray-300 rounded px-3 py-2"
      value={newItem.cost}
      onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
    />
  </div>

  <div className="col-span-full md:col-span-1 flex items-end">
    <button
      className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700"
      onClick={handleAdd}
    >
      Add Item
    </button>
  </div>
</div>


      {loading ? (
        <div className="text-center py-8">Loading menu...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menu.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <button
                  className="text-red-500 hover:text-red-700 text-sm"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-1">{item.description}</p>
              <div className="text-sm flex flex-wrap gap-2">
                <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs">
                  {item.category}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                  ₹{item.cost}
                </span>
                {item.available && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
                    Available
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;

import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Order, OrderStatus, OrderType } from '../../types/order';

// type OrderStatus = 'Pending' | 'InKitchen' | 'Ready' | 'Served' | 'Billed';
// type OrderType = 'DinerIn' | 'TakeAway' | 'Delivery';

// interface Table {
//   id: number;
//   number: number;
//   capacity: number;
// }

// interface OrderItem {
//   id: number;
//   name: string;
//   quantity: number;
//   note?: string;
// }


// interface Order {
//   id: number;
//   orderType: OrderType;
//   status: OrderStatus;
//   table?: Table | null;
//   orderItems: OrderItem[]; // Simplified for edit modal
// }
const orderTypes: OrderType[] = ['DinerIn', 'TakeAway', 'Delivery'];
const orderStatuses: OrderStatus[] = ['Pending', 'InKitchen', 'Ready', 'Served', 'Billed'];



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


const EditOrderModal = ({ 
  order, 
  onClose, 
  onSave 
}: { 
  order: Order; 
  onClose: () => void; 
  onSave: (updatedOrder: Order) => void 
}) => {
  const [editedOrder, setEditedOrder] = useState<Order>({ ...order });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEditedOrder({ ...order });
  }, [order]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleTableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEditedOrder(prev => ({
      ...prev,
      table: value ? { 
        ...prev.table, 
        number: parseInt(value, 10),
        // Default values for other table properties
        id: prev.table?.id || 0,
        capacity: prev.table?.capacity || 4
      } : null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await api.put(`editOrder/${order.id}`, editedOrder);
      onSave(response.data);
      onClose();
    } catch (err) {
      setError('Failed to update order');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Edit Order #{order.id}</h2>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
              <select
                name="orderType"
                value={editedOrder.orderType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                {orderTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={editedOrder.status}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                {orderStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
              <input
                type="number"
                value={editedOrder.table?.number || ''}
                onChange={handleTableChange}
                className="w-full p-2 border rounded"
                placeholder="Leave empty for no table"
                min="1"
              />
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;
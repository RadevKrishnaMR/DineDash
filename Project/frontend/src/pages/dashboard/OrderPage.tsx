import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import EditOrderModal from './EditOrderModal';
import FilterOrders from './FilterOrders';
import type { Order } from '../../types/order'; // ✅ Ensure invoice?: Invoice|null is added here
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components';
import Footer from '../../components/Footer/Footer';
import { toast } from 'react-toastify';


const API_BASE_URL = import.meta.env.VITE_API_BASE;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
const backendBase = import.meta.env.VITE_SOCKET_BASE; // should be http://localhost:6321
type OrderStatus = 'Pending' | 'InKitchen' | 'Ready' | 'Served' | 'Billed';
type OrderType = 'DinerIn' | 'TakeAway' | 'Delivery';
type FilterParams = {
  orderType?: OrderType;
  status?: OrderStatus;
  itemId?: string;
  category?: string;
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [filterParams, setFilterParams] = useState<FilterParams>({});

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/getFilteredOrder', {
        params: filterParams
      });
      setOrders(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleDelete = async (orderId: number) => {
    try {
      await axios.delete(`/orders/${orderId}`);
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleUpdateOrder = async (updatedOrder: Order) => {
    setOrders(orders.map(order =>
      order.id === updatedOrder.id ? updatedOrder : order
    ));
    await fetchOrders();
  };

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilterParams(newFilters);
  };

  if (loading) return <div className="text-center py-8">Loading orders...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    {/* Main content area that grows to fill space */}
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>

      <FilterOrders onFilterChange={handleFilterChange} currentFilters={filterParams} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {orders.length === 0 ? (
          <div className="col-span-full text-center py-8">
            No orders found matching your criteria
          </div>
        ) : (
          orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {isEditModalOpen && selectedOrder && (
        <EditOrderModal
          order={selectedOrder}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateOrder}
        />
      )}
    </main>

    <Footer />
  </div>
);

};

const OrderCard = ({
  order,
  onEdit,
  // onDelete
}: {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (id: number) => void;
}) => {
  const statusColors: Record<OrderStatus, string> = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'InKitchen': 'bg-blue-100 text-blue-800',
    'Ready': 'bg-green-100 text-green-800',
    'Served': 'bg-purple-100 text-purple-800',
    'Billed': 'bg-gray-100 text-gray-800',
  };

  const typeColors: Record<OrderType, string> = {
    'DinerIn': 'bg-indigo-100 text-indigo-800',
    'TakeAway': 'bg-orange-100 text-orange-800',
    'Delivery': 'bg-red-100 text-red-800',
  };

  const navigate = useNavigate();

  const handleGenerateInvoice = async() => {
    if (!order.invoice) {
      navigate(`/generateInvoice/${order.id}`);
    }else{
      console.log("invoice already genereted");
      
    }
    try {
    await api.put(`/editOrder/${order.id}`, {
      status: "Billed"
    });

    toast.success("Order marked as Billed.");
  } catch (err) {
    console.error("Failed to update order status:", err);
    toast.error("Failed to update order status.");
  }
    // navigate("/rollout")
  };

  const handleMarkAsPaid = async (invoiceId: number) => {
  try {
    const res = await api.post(`/toggleInvoice/${invoiceId}`);
    console.log(res.data.message);

    // Optional: refetch updated invoice
    // or optimistically update order invoice in parent state
    window.location.reload(); // simplest way for now
  } catch (err) {
    console.error("Failed to toggle invoice status", err);
    alert("Failed to mark invoice as paid");
  }
};


  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">Order #{order.id}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(order)}
              className="text-blue-500 hover:text-blue-700"
            >
              Edit
            </button>
            {/* <button
              onClick={() => onDelete(order.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button> */}
          </div>
        </div>

        <div className="mb-2">
          <span className={`text-xs px-2 py-1 rounded-full ${typeColors[order.orderType]}`}>
            {order.orderType}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ml-2 ${statusColors[order.status]}`}>
            {order.status}
          </span>
        </div>

        {order.table && (
          <div className="text-sm mb-2">
            Table: {order.table.number} ({order.table.capacity} seats)
          </div>
        )}

        <div className="text-sm">
          <h4 className="font-medium mb-1">Items:</h4>
          <ul className="list-disc list-inside">
            {order.orderItems.map(item => (
              <li key={item.id}>
                {item.item.name} (x{item.quantity}) - {item.item.category}
              </li>
            ))}
          </ul>
        </div>
      </div>

    <div className="mt-4 flex justify-end space-x-2">
  {!order.invoice ? (
    <button
      onClick={handleGenerateInvoice}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
    >
      Generate Invoice
    </button>
  ) : (
    <>
      <a
        href={`${backendBase}${order.invoice.pdfUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        View Invoice
      </a>

      {!order.invoice.isPaid && (
        <button
          onClick={() => handleMarkAsPaid(order.invoice!.id)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Mark as Paid
        </button>
      )}
    </>
  )}
</div>

    </div>
  );
};

export default OrdersPage;

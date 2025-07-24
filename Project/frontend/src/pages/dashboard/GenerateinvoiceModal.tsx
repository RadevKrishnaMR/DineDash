import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


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



const paymentOptions = ["Cash", "Online", "UPI"];


const GenerateInvoiceModal = ({ orderId, onClose, onSuccess }) => {
  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [isPaid, setIsPaid] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/generateInvoice/${orderId}`, {
        reqDiscount: discount,
        paymentMode,
        isPaid,
      });

      alert("invoice generated successfully")

      onSuccess?.(res.data.data.pdfUrl); // return URL to parent
      console.log(res.data.data.pdfUrl)
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4">Generate Invoice</h2>

      <label className="block mb-2 text-sm">Discount (%)</label>
      <input
        type="number"
        min="0"
        max="100"
        value={discount}
        onChange={(e) => setDiscount(Number(e.target.value))}
        className="border p-2 w-full rounded mb-4"
      />

      <label className="block mb-2 text-sm">Payment Mode</label>
      <select
        value={paymentMode}
        onChange={(e) => setPaymentMode(e.target.value)}
        className="border p-2 w-full rounded mb-4"
      >
        {paymentOptions.map((mode) => (
          <option key={mode} value={mode}>
            {mode}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={isPaid}
          onChange={() => setIsPaid(!isPaid)}
        />
        Mark as paid
      </label>

      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 border rounded">
          Cancel
        </button>
        <button
          onClick={handleGenerate}
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
};

export default GenerateInvoiceModal;

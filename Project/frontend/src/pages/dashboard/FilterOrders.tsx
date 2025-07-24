import { useEffect, useState } from 'react';
import type { FilterParams } from '../../types/order';

const orderTypes = ['DinerIn', 'TakeAway', 'Delivery'] as const;
const orderStatuses = ['Pending', 'InKitchen', 'Ready', 'Served', 'Billed'] as const;
const categories = ['Starter', 'MainCourse', 'Bread','Beverages','Burgers','Pastries'];

type Props = {
  onFilterChange: (filters: FilterParams) => void;
  currentFilters: FilterParams;
};

const FilterOrders = ({ onFilterChange, currentFilters }: Props) => {
  const [filters, setFilters] = useState({
    orderType: '',
    status: '',
    itemId: '',
    category: ''
  });

  useEffect(() => {
    setFilters({
      orderType: currentFilters.orderType || '',
      status: currentFilters.status || '',
      itemId: currentFilters.itemId || '',
      category: currentFilters.category || ''
    });
  }, [currentFilters]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const apiFilters = Object.fromEntries(
      Object.entries(filters).map(([key, value]) =>
        [key, value === '' ? undefined : value]
      )
    );
    onFilterChange(apiFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      orderType: '',
      status: '',
      itemId: '',
      category: ''
    };
    setFilters(resetFilters);
    onFilterChange({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Orders</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
          <select
            name="orderType"
            value={filters.orderType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Types</option>
            {orderTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Statuses</option>
            {orderStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item ID</label>
          <input
            type="number"
            name="itemId"
            value={filters.itemId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter item ID"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end space-x-2 md:col-span-2 lg:col-span-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterOrders;

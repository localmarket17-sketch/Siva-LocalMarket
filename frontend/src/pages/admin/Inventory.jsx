import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebarvd';
import './Inventory.css';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newItem, setNewItem] = useState({
    product_id: '',
    quantity: '',
  });

  // Fetch inventory from backend
  const fetchInventory = async () => {
    try {
      const res = await axios.get('/api/admin/inventory');
      setInventory(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
      setError('Failed to load inventory.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Handle new inventory submission
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/inventory', newItem);
      setInventory([...inventory, res.data]);
      setNewItem({ product_id: '', quantity: '' });
    } catch (err) {
      console.error('Add inventory failed:', err);
      setError('Failed to add inventory item.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/inventory/${id}`);
      setInventory(inventory.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete item.');
    }
  };

  return (
    <div className="admin-dashboard-layout">
      <Sidebar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Inventory Table */}
        {loading ? (
          <p>Loading inventory...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Product ID</th>
                  <th className="px-4 py-2 border">Product Name</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 border">{item.id}</td>
                    <td className="px-4 py-2 border">{item.product_id}</td>
                    <td className="px-4 py-2 border">{item.product_name}</td>
                    <td className="px-4 py-2 border">{item.quantity}</td>
                    <td className="px-4 py-2 border">{item.status}</td>
                    <td className="px-4 py-2 border">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Inventory Form */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Add Inventory Item</h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-4 max-w-sm">
            <input
              type="text"
              placeholder="Product ID"
              className="border p-2 rounded"
              value={newItem.product_id}
              onChange={(e) =>
                setNewItem({ ...newItem, product_id: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              className="border p-2 rounded"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inventory;

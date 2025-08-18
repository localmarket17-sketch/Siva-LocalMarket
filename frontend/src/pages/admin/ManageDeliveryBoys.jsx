import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebarvd';
import './ManageDeliveryBoys.css';

const ManageDeliveryBoys = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDeliveryBoys = async () => {
    try {
      const res = await axios.get('/api/admin/delivery-boys');
      setDeliveryBoys(res.data);
    } catch (err) {
      console.error('Error fetching delivery boys:', err);
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this delivery boy?')) return;
    try {
      await axios.delete(`/api/admin/delivery-boys/${id}`);
      fetchDeliveryBoys();
    } catch (err) {
      console.error('Error deleting delivery boy:', err);
    }
  };

  // Filter delivery boys by ID or Email
  const filteredDeliveryBoys = deliveryBoys.filter((boy) =>
    boy.id.toString().includes(searchQuery) || boy.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-dashboard-layout">
      <Sidebar />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Manage Delivery Boys</h2>

        {/* 🔍 Search input */}
        <input
          type="text"
          placeholder="Search by ID or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 mb-4 w-full"
        />

        <h2 className="text-xl font-bold mb-2">Delivery Boys</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveryBoys.map((boy) => (
              <tr key={boy.id}>
                <td className="p-2 border">{boy.id}</td>
                <td className="p-2 border">{boy.name}</td>
                <td className="p-2 border">{boy.email}</td>
                <td className="p-2 border">{boy.phone}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleDelete(boy.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredDeliveryBoys.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No delivery boys found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDeliveryBoys;

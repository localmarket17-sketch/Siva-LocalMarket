import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebarvd';
import './ManageVendors.css';

const ManageVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await axios.get('/api/admin/vendors');
      setVendors(res.data);
    } catch (err) {
      setError('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const deleteVendor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;
    try {
      await axios.delete(`/api/admin/vendors/${id}`);
      setVendors((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert('Failed to delete vendor');
    }
  };

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-dashboard-layout">
      <Sidebar />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Manage Vendors</h2>

        <input
          type="text"
          placeholder="Search by name or email..."
          className="border p-2 rounded mb-4 w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p>Loading vendors...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2">ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Shop Name</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="border-t">
                      <td className="p-2">{vendor.id}</td>
                      <td className="p-2">{vendor.name}</td>
                      <td className="p-2">{vendor.email}</td>
                      <td className="p-2">{vendor.shop_name}</td>
                      <td className="p-2">{vendor.phone}</td>
                      <td className="p-2">
                        <button
                          onClick={() => deleteVendor(vendor.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-2 text-center">
                      No vendors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageVendors;

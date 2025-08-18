import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebarvd';
import './ManageOrders.css';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [statusUpdates, setStatusUpdates] = useState({}); // orderId -> newStatus

  useEffect(() => {
    fetchOrders();
    fetchDeliveryBoys();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/admin/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchDeliveryBoys = async () => {
    try {
      const res = await axios.get('/api/admin/delivery-boys');
      setDeliveryBoys(res.data);
    } catch (err) {
      console.error('Error fetching delivery boys:', err);
    }
  };

  const handleSelect = (orderId, deliveryBoyId) => {
    setAssignments(prev => ({
      ...prev,
      [orderId]: deliveryBoyId
    }));
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates(prev => ({
      ...prev,
      [orderId]: newStatus
    }));
  };

  const handleApply = async () => {
    const assignable = Object.entries(assignments);
    for (const [orderId, deliveryBoyId] of assignable) {
      try {
        await axios.post('/api/admin/orders/assign-delivery', {
          orderId,
          deliveryBoyId
        });
      } catch (err) {
        console.error(`Failed to assign delivery for order ${orderId}`, err);
      }
    }

    setAssignments({});
    fetchOrders();
  };

  const handleStatusUpdate = async (orderId) => {
    const newStatus = statusUpdates[orderId];
    if (!newStatus) return;

    try {
      const res = await axios.put('/api/orders/update-status', {
        order_id: orderId,
        status: newStatus,
      });
      alert(res.data.message);
      fetchOrders(); // Refresh after update
    } catch (err) {
      console.error(`Failed to update status for order ${orderId}`, err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="admin-dashboard-layout">
      <Sidebar />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Manage Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <>
            <table className="w-full table-auto border mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Order ID</th>
                  <th className="border p-2">Customer</th>
                  <th className="border p-2">Address</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Update Status</th>
                  <th className="border p-2">Delivery Boy</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td className="border p-2">{order.id}</td>
                    <td className="border p-2">{order.customer_name || order.user_id}</td>
                    <td className="border p-2">{order.address || 'N/A'}</td>
                    <td className="border p-2">₹{order.total_amount}</td>
                    <td className="border p-2">{order.status}</td>
                    <td className="border p-2">
                      <select
                        value={statusUpdates[order.id] || ''}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className="border p-1 mb-1"
                      >
                        <option value="">-- Change Status --</option>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <br />
                      <button
                        onClick={() => handleStatusUpdate(order.id)}
                        className="bg-green-600 text-white text-sm px-2 py-1 mt-1 rounded"
                      >
                        Save
                      </button>
                    </td>
                    <td className="border p-2">
                      <select
                        value={assignments[order.id] || ''}
                        onChange={e => handleSelect(order.id, e.target.value)}
                        className="border p-1"
                      >
                        <option value="">-- Select Delivery Boy --</option>
                        {deliveryBoys.map(boy => (
                          <option key={boy.id} value={boy.id}>
                            {boy.name} ({boy.phone})
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleApply}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Apply Assignment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;

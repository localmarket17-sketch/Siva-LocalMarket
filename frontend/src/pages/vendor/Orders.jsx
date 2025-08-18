import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebarvd from '../../components/Sidebarvd';
import './Orders.css';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  const fetchVendorOrders = async () => {
    try {
      const response = await axios.get(`/api/vendor/orders`, { withCredentials: true });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const updateOrderStatus = async (orderId) => {
    const status = statusUpdates[orderId];
    if (!status) return;

    try {
      await axios.put(`/api/orders/update-status/${orderId}`, { status }, { withCredentials: true });
      fetchVendorOrders(); // Refresh list
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="vendor-orders-layout">
      <Sidebarvd role="vendor" />
      <div className="vendor-orders-container">
        <h2>📦 Orders</h2>
        {loading ? (
          <div className="text-center">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500">No orders found.</div>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id}>
                    <td>#{order.order_id}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.product_name}</td>
                    <td>{order.quantity}</td>
                    <td>₹{order.total_price}</td>
                    <td>
                      <span className={`status-tag ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select
                        value={statusUpdates[order.order_id] || order.status}
                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                      </select>
                      <button onClick={() => updateOrderStatus(order.order_id)}>Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrders;

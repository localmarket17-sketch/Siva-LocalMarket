// src/pages/delivery/AssignedDeliveries.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Sidebarvd from '../../components/Sidebarvd';
import './AssignedDeliveries.css';

const AssignedDeliveries = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignedOrders = async () => {
    try {
      const res = await axios.get(`/api/delivery/${user.id}/assigned-orders`, {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching assigned deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/delivery/update-status/${orderId}`, { status }, { withCredentials: true });
      fetchAssignedOrders(); // Refresh
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  useEffect(() => {
    if (user?.id) fetchAssignedOrders();
  }, [user]);

  return (
    <div className="assigned-deliveries-layout">
      <Sidebarvd role="delivery" />
      <div className="assigned-deliveries-content">
        <h2 className="page-title">📦 Assigned Deliveries</h2>
        {loading ? (
          <p className="status-message">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="status-message">No assigned deliveries.</p>
        ) : (
          <div className="delivery-cards">
            {orders.map((order) => (
              <div key={order.id} className="delivery-card">
                <h3 className="order-id">Order #{order.id}</h3>
                <p><strong>Customer:</strong> {order.customer_name}</p>
                <p><strong>Address:</strong> {order.customer_address}</p>
                <p><strong>Mobile:</strong> {order.customer_phone}</p>
                <p><strong>Total:</strong> ₹{order.total_amount}</p>
                <p><strong>Status:</strong> <span className={`status-tag ${order.status.toLowerCase().replace(/\s/g, '-')}`}>{order.status}</span></p>

                <div className="actions">
                  {order.status === 'shipped' && (
                    <button className="btn btn-out" onClick={() => updateStatus(order.id, 'Out for Delivery')}>
                      Mark as Out for Delivery
                    </button>
                  )}
                  {order.status === 'Out for Delivery' && (
                    <button className="btn btn-delivered" onClick={() => updateStatus(order.id, 'Delivered')}>
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedDeliveries;

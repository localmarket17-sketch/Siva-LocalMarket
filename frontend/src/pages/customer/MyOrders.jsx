import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './MyOrders.css';

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`/api/orders/user/${user.id}`);
      setOrders(res.data.orders || res.data); // Support both response formats
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  const getStatusClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending':
        return 'status-chip pending';
      case 'shipped':
        return 'status-chip shipped';
      case 'delivered':
        return 'status-chip delivered';
      case 'cancelled':
        return 'status-chip cancelled';
      default:
        return 'status-chip';
    }
  };

  return (
    <div className="my-orders-container">
      <Navbar />

      <div className="my-orders-content">
        <div className="my-orders-header">
          <h2>My Orders</h2>
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Shop
          </button>
        </div>

        {loading ? (
          <p className="loading-text">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-id">Order #{order.id}</span>
                  <span className={getStatusClass(order.status)}>
                    {order.status}
                  </span>
                </div>
                <p className="order-date">
                  Placed on:{' '}
                  {new Date(order.created_at || order.date).toLocaleString()}
                </p>

                <div className="order-items">
                  <strong>Items:</strong>
                  <ul>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <li key={idx} className="order-item">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="order-item-image"
                            onError={(e) =>
                              (e.target.src = '/fallback.png')
                            }
                          />
                          <span className="order-item-title">
                            {item.title}
                          </span>{' '}
                          ×{' '}
                          <span className="order-item-qty">
                            {item.quantity}
                          </span>{' '}
                          – ₹{item.price}
                        </li>
                      ))
                    ) : (
                      <li>No items</li>
                    )}
                  </ul>
                </div>

                <p className="order-total">
                  <strong>Total:</strong> ₹{order.total_amount}
                </p>

                {order.tracking_info && (
                  <p className="tracking-info">
                    <strong>Tracking Info:</strong> {order.tracking_info}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyOrders;

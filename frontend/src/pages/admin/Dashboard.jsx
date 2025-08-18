// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './Dashboard.css';
import Sidebar from '../../components/Sidebarvd';

const Dashboard = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    vendorCount: 0,
    orderCount: 0,
    productCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/admin/dashboard-stats', { withCredentials: true }),
          api.get('/admin/recent-orders', { withCredentials: true }),
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data);
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Users', value: stats.userCount, color: 'bg-blue-100 text-blue-700' },
    { label: 'Vendors', value: stats.vendorCount, color: 'bg-green-100 text-green-700' },
    { label: 'Orders', value: stats.orderCount, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Products', value: stats.productCount, color: 'bg-purple-100 text-purple-700' },
  ];

  if (loading) return <div className="admin-dashboard-loading">Loading dashboard...</div>;
  if (error) return <div className="admin-dashboard-error">{error}</div>;

  return (
    <div className="admin-dashboard-layout">
      <Sidebar />
      <div className="admin-dashboard-content">
        <h1 className="dashboard-title">📊 Admin Dashboard</h1>

        {/* Stats */}
        <div className="stats-grid">
          {statCards.map((card) => (
            <div key={card.label} className={`stat-card ${card.color}`}>
              <h2>{card.label}</h2>
              <p>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="recent-activity">
          <h2>📌 Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <div className="activity-placeholder">No recent orders to display.</div>
          ) : (
            <div className="activity-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total (₹)</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customer_name}</td>
                      <td>₹{order.total_amount}</td>
                      <td>{order.status}</td>
                      <td>{new Date(order.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

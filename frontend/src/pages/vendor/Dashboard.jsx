import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../../components/Sidebarvd'; // Adjust path if needed
import './Dashboard.css';

const VendorDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    sales: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/vendor/dashboard-stats', {
          withCredentials: true,
        });
        setStats(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('You must be logged in as a vendor to view the dashboard.');
        } else {
          setError('Failed to fetch vendor dashboard stats.');
        }
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchStats();
    } else {
      setLoading(false);
      setError('Unauthorized access. Please login as a vendor.');
    }
  }, [isAuthenticated]);

  return (
    <div className="vendor-layout">
      <Sidebar role="vendor" />

      <div className="dashboard-main">
        <h2>Welcome {user?.name || 'Vendor'}</h2>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <div className="dashboard-stats-grid">
            <div className="dashboard-card">
              <h3>{stats.products}</h3>
              <p>Total Products</p>
            </div>
            <div className="dashboard-card">
              <h3>{stats.orders}</h3>
              <p>Total Orders</p>
            </div>
            <div className="dashboard-card">
              <h3>{stats.sales}</h3>
              <p>Total Sales</p>
            </div>
            <div className="dashboard-card">
              <h3>₹{stats.revenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;

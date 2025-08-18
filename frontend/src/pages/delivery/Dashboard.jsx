import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Sidebarvd from '../../components/Sidebarvd'; // Adjust the import if needed
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`/api/delivery/dashboard/${user.id}`, {
          withCredentials: true,
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchStats();
  }, [user]);

  return (
    <div className="flex">
      <Sidebarvd role="delivery" />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold mb-8">📊 Delivery Dashboard</h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading dashboard...</div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Total Assigned" value={stats.totalAssigned} color="blue" />
            <Card title="Out for Delivery" value={stats.outForDelivery} color="yellow" />
            <Card title="Delivered" value={stats.delivered} color="green" />
          </div>
        ) : (
          <div className="text-center text-red-500">Failed to load stats.</div>
        )}
      </div>
    </div>
  );
};

const Card = ({ title, value, color }) => {
  const colorMap = {
    blue: 'text-blue-600',
    yellow: 'text-yellow-500',
    green: 'text-green-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
};

export default Dashboard;

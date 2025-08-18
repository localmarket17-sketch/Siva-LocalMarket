import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebarvd';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/admin/notifications', {
        withCredentials: true,
      });
      setNotifications(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load notifications');
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/admin/notifications/${id}/read`, {}, {
        withCredentials: true,
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
    } catch (err) {
      console.error(err);
      alert('Failed to mark as read');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="admin-dashboard-layout">
      <Sidebar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Notifications</h1>

        {notifications.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((note) => (
              <li
                key={note.id}
                className={`p-4 border rounded-lg ${note.is_read ? 'bg-gray-100' : 'bg-yellow-50'
                  }`}
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm">{note.message}</p>
                  {!note.is_read && (
                    <button
                      onClick={() => markAsRead(note.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(note.created_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;

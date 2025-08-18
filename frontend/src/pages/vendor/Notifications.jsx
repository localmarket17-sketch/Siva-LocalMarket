import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebarvd from '../../components/Sidebarvd';
import './Notifications.css'; // Optional: You can create for styles

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/vendor/notifications', {
        withCredentials: true,
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-notifications-layout">
      <Sidebarvd role="vendor" />
      <div className="vendor-notifications-container">
        <h2 className="page-heading">🔔 Notifications</h2>

        {loading ? (
          <p className="text-gray-500">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500">No notifications found.</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((note) => (
              <li key={note.id} className="notification-item">
                <div className="note-message">{note.message}</div>
                <div className="note-timestamp">{new Date(note.created_at).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;

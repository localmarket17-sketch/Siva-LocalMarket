// src/pages/deliveryboy/Notifications.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebarvd from '../../components/Sidebarvd';
import './Notifications.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/api/delivery/notifications', { withCredentials: true });
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebarvd role="delivery" />
      <div className="deliveryboy-page">
        <h2>Notifications</h2>
        <ul className="notification-list">
          {notifications.map((note, i) => (
            <li key={i} className="notification-item">
              <span>{note.message}</span>
              <small>{new Date(note.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>
      </div>
      );
};

      export default Notification;

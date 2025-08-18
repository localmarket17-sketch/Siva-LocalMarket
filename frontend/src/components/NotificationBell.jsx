// src/components/NotificationBell.jsx
import React from 'react';
import { Bell, X } from 'lucide-react';
import Navbar from './Navbar';
import './NotificationBell.css';

const NotificationBell = () => {
  const notifications = [
    'My Orders',
    'Reminders',
    'Recommendations',
    'New Offers',
    'My Community',
    'Feedback and Review'
  ];

  return (
    <div className="notification-page">
      <Navbar />

      <div className="notification-container">
        <div className="sidebar">
          <h3>🔔 Notification Preferences</h3>
          <p>Desktop Notifications</p>
        </div>

        <div className="notification-content">
          <div>
          <h2>Desktop Notifications</h2>
          <ul className="notification-list">
            {notifications.map((note, index) => (
              <li key={index}>
                <input type="checkbox" defaultChecked />
                <span>{note}</span>
              </li>
            ))}
          </ul>
          </div>

          <div className="notification-blocked">
            <div className="icon-block">
              <X size={32} color="#fff" />
            </div>
            <p className="block-text">
              Oops! You are missing out on a lot of important notifications. Please switch it on from browser settings.
            </p>
            <p className="how-to-unblock">
              <strong>How to Unblock:</strong><br />
              <span>🔒 Notifications &gt; Allow</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;

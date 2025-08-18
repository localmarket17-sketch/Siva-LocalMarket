// src/components/Sidebar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Dashboard</h2>
      <nav className="sidebar-nav">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/manage-items">Manage Items</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/users">Users</Link>
      </nav>
    </aside>

  );
};

export default Sidebar;

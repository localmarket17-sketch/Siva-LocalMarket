// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebarvd.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/manage-users', label: 'Manage Users' },
    { path: '/admin/manage-vendors', label: 'Manage Vendors' },
    { path: '/admin/manage-delivery-boys', label: 'Manage Delivery Boys' },
    { path: '/admin/manage-products', label: 'Manage Products' },
    { path: '/admin/catalog', label: 'Manage Catalog' },
    { path: '/admin/manage-orders', label: 'All Orders' },
    { path: '/admin/inventory', label: 'Inventory' },
    { path: '/admin/sales-report', label: 'Sales Report' },
    { path: '/admin/notifications', label: 'Notifications' },
    { path: '/admin/profile', label: 'Profile' },
  ];

  const vendorLinks = [
    { path: '/vendor/dashboard', label: 'Dashboard' },
    { path: '/vendor/add-product', label: 'Products' },
    { path: '/vendor/orders', label: 'View Orders' },
    { path: '/vendor/sales-report', label: 'Reports' },
    { path: '/vendor/notifications', label: 'Notifications' },
    { path: '/vendor/profile', label: 'Profile' },
  ];

  const deliveryBoyLinks = [
    { path: '/delivery/dashboard', label: 'Dashboard' },
    { path: '/delivery/assigned', label: 'Assigned Deliveries' },
    { path: '/delivery/reports', label: 'Reports' },
    { path: '/delivery/notifications', label: 'Notifications' },
    { path: '/delivery/profile', label: 'Profile' },
  ];

  let roleLabel = 'Panel';
  let roleLinks = [];

  if (user?.role === 'admin') {
    roleLabel = 'Admin Panel';
    roleLinks = adminLinks;
  } else if (user?.role === 'vendor') {
    roleLabel = 'Vendor Panel';
    roleLinks = vendorLinks;
  } else if (user?.role === 'delivery') {
    roleLabel = 'Delivery Panel';
    roleLinks = deliveryBoyLinks;
  }

  return (
    <>
      <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h2 className="sidebar-title">{roleLabel}</h2>
        <ul className="sidebar-links">
          {roleLinks.map((link) => (
            <li key={link.path} className={isActive(link.path) ? 'active' : ''}>
              <Link to={link.path} onClick={() => setIsOpen(false)}>{link.label}</Link>
            </li>
          ))}
          <li>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;

// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar for tablets/desktops */}
      <div className="hidden md:block md:w-1/4 lg:w-1/5 bg-gray-100 shadow">
        <Sidebar />
      </div>

      {/* Sidebar toggle for mobile */}
      <div className="md:hidden">
        {/* Optional: mobile menu button */}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

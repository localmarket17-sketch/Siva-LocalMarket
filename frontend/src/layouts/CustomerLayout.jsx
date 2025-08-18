// src/layouts/CustomerLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import NotificationBell from '../components/NotificationBell';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar with Notification Bell */}
      <header className="relative">
        <Navbar />
        <div className="absolute top-4 right-4 hidden md:block">
          <NotificationBell />
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>

      {/* Bottom Navigation (Visible on Mobile) */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default CustomerLayout;

// src/layouts/VendorLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

const VendorLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation for mobile devices */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default VendorLayout;

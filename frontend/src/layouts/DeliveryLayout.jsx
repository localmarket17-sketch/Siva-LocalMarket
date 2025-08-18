// src/layouts/DeliveryLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

const DeliveryLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation for mobile only */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default DeliveryLayout;

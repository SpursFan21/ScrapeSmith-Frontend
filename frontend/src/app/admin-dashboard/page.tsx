'use client';

import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white">
      <div className="p-10 bg-gray-800 rounded-2xl shadow-2xl ring-1 ring-gray-700">
        <h1 className="text-4xl font-bold mb-4 text-amber-400 text-center">Admin Dashboard</h1>
        <p className="text-gray-300 text-center max-w-md">
          Welcome, admin! This is your control panel for ScrapeSmith. From here you’ll be able to manage users,
          view scrape stats, moderate activity, and more (coming soon).
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;

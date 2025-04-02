//Frontend\frontend\src\app\admin-dashboard\page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import api from '../api/axios';

interface Stats {
  totalUsers: number;
  totalAdmins: number;
  totalOrders: number;
  openTickets: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Users" value={stats?.totalUsers ?? '—'} />
        <StatCard label="Admin Users" value={stats?.totalAdmins ?? '—'} />
        <StatCard label="Open Tickets" value={stats?.openTickets ?? '—'} />
        <StatCard label="Total Orders" value={stats?.totalOrders ?? '—'} />
      </div>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number | string }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-md">
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-2xl font-bold text-amber-400">{value}</p>
  </div>
);

export default AdminDashboard;

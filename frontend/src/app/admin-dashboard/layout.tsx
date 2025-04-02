// src/app/admin-dashboard/layout.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

const navItems = [
  { label: 'Dashboard', href: '/admin-dashboard' },
  { label: 'Users', href: '/admin-dashboard/users' },
  { label: 'Orders', href: '/admin-dashboard/orders' },
  { label: 'Tickets', href: '/admin-dashboard/tickets' },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6">
        <h2 className="text-2xl font-bold text-amber-500 mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={twMerge(
                'block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition',
                pathname === item.href && 'bg-gray-700 text-amber-400'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;

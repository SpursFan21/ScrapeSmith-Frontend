//Frontend\frontend\src\app\admin-dashboard\users\page.tsx
"use client";

import React, { useEffect, useState } from "react";
import api from "@/app/api/axios";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface User {
  id: string;
  email: string;
  username: string;
  is_admin: boolean;
  created_at: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="overflow-auto rounded-lg shadow ring-1 ring-white/10">
        <table className="min-w-full divide-y divide-gray-700 bg-gray-900 text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Admin</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-800 transition">
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.username}</td>
                <td className="px-4 py-3">{user.is_admin ? "✅" : "—"}</td>
                <td className="px-4 py-3">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    className="p-1 rounded hover:bg-amber-600 transition"
                    title="Edit"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-1 rounded hover:bg-red-600 transition"
                    title="Delete"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;

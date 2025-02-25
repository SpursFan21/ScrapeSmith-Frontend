// frontend/src/app/admin/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../_components/NavBar";

type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  image: string;
};

const AdminDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session) {
      // Check admin status using isAdmin flag
      if (!session.user.isAdmin) {
        router.push("/");
      } else {
        fetch("/api/admin/users")
          .then((res) => res.json())
          .then((data) => {
            setUsers(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Failed to fetch users:", error);
            setLoading(false);
          });
      }
    }
  }, [session, router]);

  const handleDelete = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("User deleted successfully!");
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to delete user.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 p-2">ID</th>
              <th className="border border-gray-200 p-2">Username</th>
              <th className="border border-gray-200 p-2">Name</th>
              <th className="border border-gray-200 p-2">Email</th>
              <th className="border border-gray-200 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border border-gray-200 p-2">{user.id}</td>
                <td className="border border-gray-200 p-2">{user.username}</td>
                <td className="border border-gray-200 p-2">{user.name}</td>
                <td className="border border-gray-200 p-2">{user.email}</td>
                <td className="border border-gray-200 p-2">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminDashboard;

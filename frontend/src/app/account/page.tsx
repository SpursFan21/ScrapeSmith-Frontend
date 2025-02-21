// frontend\src\app\account\page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "../_components/NavBar";

const AccountPage: React.FC = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    username: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/user/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          // Convert null fields to empty strings using the null-coalescing operator
          setUserData({
            name: data.name ?? "",
            email: data.email ?? "",
            username: data.username ?? "",
            image: data.image ?? "",
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    }
  }, [session]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) return;

    const res = await fetch(`/api/user/${session.user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    setMessage(
      res.ok ? "Profile updated successfully!" : data.message || "Failed to update profile."
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">My Account</h2>
        {message && <p className="text-red-500">{message}</p>}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label>Name:</label>
            <input
              className="border p-2 w-full"
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              className="border p-2 w-full"
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
          </div>
          <div>
            <label>Username:</label>
            <input
              className="border p-2 w-full"
              type="text"
              value={userData.username}
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            />
          </div>
          <div>
            <label>Profile Image URL:</label>
            <input
              className="border p-2 w-full"
              type="text"
              value={userData.image}
              onChange={(e) => setUserData({ ...userData, image: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded"
          >
            Update Account
          </button>
        </form>
      </div>
    </>
  );
};

export default AccountPage;

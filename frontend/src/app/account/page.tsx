// frontend\src\app\account\page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import jwt_decode from "jwt-decode";
import ProtectedRoute from "../_components/ProtectedRoute";
import api from "../api/axios";

interface UserData {
  name: string;
  email: string;
  username: string;
  image: string;
}

interface DecodedToken {
  sub: string;
}

const AccountPage: React.FC = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    username: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Decode the JWT token to get the user ID
  const decodedToken = accessToken ? jwt_decode<DecodedToken>(accessToken) : null;
  const userId = decodedToken?.sub;

  useEffect(() => {
    if (userId) {
      api
        .get(`/users/${userId}`)
        .then((response) => {
          const data = response.data;
          console.log("Fetched user data:", data);
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
  }, [userId]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;

    try {
      await api.put(`/users/${userId}`, userData);
      setMessage("Profile updated successfully!");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;

    try {
      await api.put(`/users/${userId}/password`, {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPasswordMessage("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (error: any) {
      setPasswordMessage(error.response?.data?.message || "Failed to update password.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto mt-10 bg-gray-50 p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">My Account</h2>
        {message && <p className="text-green-500">{message}</p>}
        {passwordMessage && <p className="text-red-500">{passwordMessage}</p>}

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Welcome, {userData.username}!
          </h3>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500">
              <img
                src={userData.image || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-medium">Name:</span> {userData.name || "Not set"}</p>
              <p><span className="font-medium">Email:</span> {userData.email}</p>
              <p><span className="font-medium">Username:</span> {userData.username}</p>
            </div>
          </div>
        </div>

        {/* Update Profile Form */}
        <form onSubmit={handleUpdate} className="space-y-4 mb-8">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Update Profile</h3>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Name:</label>
            <input
              className="border p-2 w-full rounded bg-white text-gray-700"
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email:</label>
            <input
              className="border p-2 w-full rounded bg-white text-gray-700"
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Username:</label>
            <input
              className="border p-2 w-full rounded bg-white text-gray-700"
              type="text"
              value={userData.username}
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Profile Image URL:</label>
            <input
              className="border p-2 w-full rounded bg-white text-gray-700"
              type="text"
              value={userData.image}
              onChange={(e) => setUserData({ ...userData, image: e.target.value })}
              placeholder="Enter your profile image URL"
            />
          </div>
          <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded">
            Update Account
          </button>
        </form>

        {/* Update Password Form */}
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">Change Password</h3>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Old Password:</label>
            <input
              className="border p-2 w-full rounded bg-white text-gray-700"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter your old password"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">New Password:</label>
            <input
              className="border p-2 w-full rounded bg-white text-gray-700"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
            />
          </div>
          <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded">
            Change Password
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default AccountPage;

// frontend\src\app\account\page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "../_components/ProtectedRoute";
import api from "../api/axios";

interface UserData {
  name: string;
  email: string;
  username: string;
  image: string;
  password?: string; // Add password field (optional)
}

interface DecodedToken {
  sub: string; // User ID
}

const AccountPage: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token); // Get the token from Redux store
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    username: "",
    image: "",
    password: "", // Initialize password field
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Decode the JWT token to get the user ID
  const decodedToken = token ? jwtDecode<DecodedToken>(token) : null; // Use jwtDecode as a function
  const userId = decodedToken?.sub;

  useEffect(() => {
    if (userId) {
      // Fetch user data from your user-service using the api instance
      api
        .get(`/users/users/${userId}`)
        .then((response) => {
          const data = response.data;
          console.log("Fetched user data:", data); // Log the fetched data
          setUserData({
            name: data.name ?? "",
            email: data.email ?? "",
            username: data.username ?? "",
            image: data.image ?? "",
            password: "********", // Simulate a masked password
          });
          console.log("Updated userData state:", { // Log the updated state
            name: data.name ?? "",
            email: data.email ?? "",
            username: data.username ?? "",
            image: data.image ?? "",
            password: "********",
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
      const response = await api.put(`/users/users/${userId}`, userData);
      setMessage("Profile updated successfully!");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to update profile.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto mt-10 bg-gray-50 p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">My Account</h2>
        {message && <p className="text-red-500">{message}</p>}

        {/* Welcome Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Welcome, {userData.username}!</h3>
          <div className="flex items-center space-x-4">
            {/* Profile Image */}
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500">
              <img
                src={userData.image || "https://via.placeholder.com/150"} // Fallback image if no profile image is set
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {/* User Details */}
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Name:</span> {userData.name || "Not set"}
              </p>
              <p>
                <span className="font-medium">Email:</span> {userData.email}
              </p>
              <p>
                <span className="font-medium">Username:</span> {userData.username}
              </p>
              <p>
                <span className="font-medium">Password:</span>{" "}
                {showPassword ? userData.password : "••••••••"}{" "}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-amber-500 hover:text-amber-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Update Account Details Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
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
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded"
          >
            Update Account
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default AccountPage;
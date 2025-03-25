// frontend\src\app\login\page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/authSlice";
import api from "../api/axios";

const Login: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
  
      // Check if the response contains tokens
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
  
      if (!accessToken || !refreshToken) {
        setError("Login failed. Please check your credentials.");
        return;
      }
  
      // Log the response and tokens to make sure they're coming through
      console.log("Login response data:", response.data);
      console.log("Extracted tokens:", accessToken, refreshToken);
  
      // Dispatch the credentials to Redux
      dispatch(setCredentials({ accessToken, refreshToken }));
  
      console.log("Token stored in Redux:", accessToken, refreshToken);
  
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      // Handle login errors correctly
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Login to ScrapeSmith</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-white">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 transition-colors duration-200 rounded-lg font-semibold text-white"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

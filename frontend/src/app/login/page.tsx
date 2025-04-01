// frontend\src\app\login\page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/authSlice";
import api from "../api/axios";
import { Transition } from "@headlessui/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const Login: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
  
      const { access_token, refresh_token, is_admin } = response.data;
  
      if (!access_token || !refresh_token) {
        setError("Login failed. Please check your credentials.");
        return;
      }
  
      const accessToken = access_token;
      const refreshToken = refresh_token;
      const isAdmin = Boolean(is_admin);
  
      dispatch(setCredentials({ accessToken, refreshToken, isAdmin }));
  
      if (isAdmin) {
        router.push("/admin-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
      console.error("Login error:", err);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Glowing Banner Background */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 opacity-20 blur-3xl rounded-full -rotate-12 -z-10" />

      <Transition
        appear
        show
        enter="transition-opacity duration-700 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
      >
        <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md ring-1 ring-gray-700 backdrop-blur-md">
          <h2 className="text-4xl font-extrabold text-center text-white mb-8 tracking-tight">
            Login to ScrapeSmith
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className="mt-1 w-full px-4 py-3 pr-12 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-4 text-gray-400 cursor-pointer"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </div>
            </div>

            <Transition
              show={!!error}
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <p className="text-red-400 text-sm">{error}</p>
            </Transition>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 transition duration-300 rounded-lg font-semibold text-white"
            >
              Login
            </button>
          </form>
        </div>
      </Transition>
    </div>
  );
};

export default Login;

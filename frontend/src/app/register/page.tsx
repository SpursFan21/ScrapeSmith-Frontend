// src/app/register/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../_components/NavBar";

const Register: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      // Redirect to login page after successful registration.
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Create Your ScrapeSmith Account
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-white">Username</label>
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 transition-colors duration-200 rounded-lg font-semibold text-white"
            >
              Register
            </button>
          </form>
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-4 text-gray-400">Or</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
          <button className="w-full py-3 bg-white hover:bg-gray-200 transition-colors duration-200 rounded-lg font-semibold text-gray-900 flex items-center justify-center">
            {/* Placeholder for NextAuth Google Sign In integration */}
            <svg
              className="w-6 h-6 mr-2"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.78 0 6.39 1.62 7.87 2.99l5.74-5.74C32.36 4.62 28.55 3 24 3 14.64 3 6.69 8.94 3.27 17.21l6.63 5.16C11.5 14.22 17.97 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.52 24.49c0-1.63-.15-3.19-.44-4.69H24v8.91h12.57c-.54 2.9-2.17 5.37-4.64 7.01l7.27 5.66C43.15 36.09 46.52 30.77 46.52 24.49z"
              />
              <path
                fill="#FBBC05"
                d="M10.9 28.29c-.58-1.68-.91-3.46-.91-5.29s.33-3.61.91-5.29L4.27 12.55C2.27 16.16 1 20.09 1 24s1.27 7.84 3.27 11.45l6.63-7.16z"
              />
              <path
                fill="#34A853"
                d="M24 47c6.55 0 12.07-2.17 16.09-5.93l-7.27-5.66c-2.02 1.35-4.61 2.15-8.82 2.15-6.03 0-12.5-4.72-14.53-11.11l-6.63 5.16C6.69 39.06 14.64 45 24 45z"
              />
              <path fill="none" d="M1 1h46v46H1z" />
            </svg>
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;

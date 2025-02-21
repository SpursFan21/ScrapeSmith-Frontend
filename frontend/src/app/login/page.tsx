// frontend\src\app\login\page.tsx

"use client";

import React, { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../_components/NavBar";

const Login: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const adminEmail = "admin@scrapesmith.com"; // Set your admin email

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Call NextAuth signIn with credentials provider
    const res = await signIn("credentials", {
      username: formData.username,
      password: formData.password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      // Wait briefly for the session to update
      setTimeout(async () => {
        const session = await getSession();
        if (session?.user?.email === adminEmail) {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Login to ScrapeSmith</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-white">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
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
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

// src/app/register/page.tsx

// src/app/register/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://d17tfod34gawxo.cloudfront.net");

const Register: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.email !== formData.confirmEmail) {
      setError("Email addresses do not match.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError("Network error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Create Your ScrapeSmith Account
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {[
            { label: "Username", name: "username", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Confirm Email", name: "confirmEmail", type: "email" },
            { label: "Password", name: "password", type: "password" },
            { label: "Confirm Password", name: "confirmPassword", type: "password" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block mb-1 text-white">{label}</label>
              <input
                type={type}
                placeholder={label}
                value={(formData as any)[name]}
                onChange={(e) =>
                  setFormData({ ...formData, [name]: e.target.value })
                }
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          ))}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 transition-colors duration-200 rounded-lg font-semibold text-white"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

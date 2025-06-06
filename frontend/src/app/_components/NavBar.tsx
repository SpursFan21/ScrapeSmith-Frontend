// frontend\src\app\_components\NavBar.tsx

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, useAppDispatch } from "../../redux/store";
import { clearCredentials } from "../../redux/authSlice";
import { fetchForgeBalance } from "@/redux/forgeBalanceSlice";
import api from "../api/axios";

const Navbar: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  const balance = useSelector((state: RootState) => state.forgeBalance.balance);

  useEffect(() => {
    if (!accessToken) {
      setIsLoggedIn(false);
      return;
    }

    setIsLoggedIn(true);
    dispatch(fetchForgeBalance());
  }, [accessToken, dispatch]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Error during logout:", err);
    }

    dispatch(clearCredentials());
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center space-x-3 group">
          <Image
            src="/logo.svg"
            alt="ScrapeSmith Logo"
            width={40}
            height={40}
            className="h-10 w-10 transition-transform duration-200 group-hover:scale-105"
            priority
          />
          <span className="text-2xl font-bold text-amber-500 group-hover:text-amber-400">
            ScrapeSmith
          </span>
        </Link>

        <div className="flex space-x-6 items-center">
          <Link href="/" className="text-white hover:text-amber-400">
            Home
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-white hover:text-amber-400">
                Dashboard
              </Link>
              <Link href="/account" className="text-white hover:text-amber-400">
                Account
              </Link>

              {isAdmin && (
                <Link href="/admin-dashboard" className="text-white hover:text-amber-400">
                  Admin Dashboard
                </Link>
              )}

              {balance !== null && (
                <span className="text-amber-400 font-bold text-sm">
                  {balance} Jobs
                </span>
              )}

              <button
                onClick={handleLogout}
                className="text-white hover:text-amber-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-amber-400">
                Login
              </Link>
              <Link href="/register" className="text-white hover:text-amber-400">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

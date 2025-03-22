"use client";
import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { clearCredentials } from "../../redux/authSlice";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  const handleLogout = () => {
    dispatch(clearCredentials());
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold text-amber-500">
          ScrapeSmith
        </Link>
        <div className="flex space-x-8">
          <Link href="/" className="text-white hover:text-amber-400">
            Home
          </Link>
          {token ? (
            <>
              <Link href="/account" className="text-white hover:text-amber-400">
                Account
              </Link>
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

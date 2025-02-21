// src/app/_components/NavBar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Navbar: React.FC = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="w-full bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-2xl font-bold text-amber-500 cursor-pointer"
          >
            ScrapeSmith
          </Link>
          <div className="flex space-x-8">
            <Link
              href="/"
              className="text-white hover:text-amber-400 cursor-pointer"
            >
              Home
            </Link>
            {status === "loading" ? null : session ? (
              <>
                <Link
                  href="/account"
                  className="text-white hover:text-amber-400 cursor-pointer"
                >
                  Account
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-white hover:text-amber-400 cursor-pointer"
                >
                  Logout
                </button>                
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white hover:text-amber-400 cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-white hover:text-amber-400 cursor-pointer"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
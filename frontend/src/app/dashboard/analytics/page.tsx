//frontend\src\app\dashboard\analytics\page.tsx

"use client";

import React from 'react';
import { FiClock } from 'react-icons/fi';
import Link from 'next/link';

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="bg-gray-800 bg-opacity-90 border border-gray-700 rounded-2xl p-12 max-w-md text-center shadow-2xl">
        <FiClock className="text-amber-500 w-16 h-16 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-white mb-4">Coming Soon</h1>
        <p className="text-gray-300 mb-6">
          We're hard at work polishing this feature for you. Stay tuned — it won't be long!
        </p>
        <Link href="/dashboard" className="inline-block bg-amber-600 hover:bg-amber-500 text-black font-semibold px-6 py-3 rounded-lg transition">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}


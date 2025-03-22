// frontend\src\app\page.tsx
import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="flex flex-col items-center justify-center py-20">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to ScrapeSmith</h1>
        <p className="text-xl mb-8">Where data is forged and refined with precision.</p>
        <div className="flex space-x-4">
          <Link
            href="/login"
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 transition-colors duration-200 rounded-full shadow-lg font-semibold"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 transition-colors duration-200 rounded-full shadow-lg font-semibold"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;

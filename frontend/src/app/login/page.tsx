import React from 'react';
import Navbar from '../_components/NavBar';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center">Login to ScrapeSmith</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-1 text-white">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
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

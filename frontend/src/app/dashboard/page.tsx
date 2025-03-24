// frontend/src/app/dashboard/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Transition } from "@headlessui/react";
import { FiZap, FiCalendar, FiCheckCircle, FiClock, FiDatabase, FiBarChart2, FiBell, FiHelpCircle, FiActivity, FiMonitor, FiCreditCard, FiDollarSign } from "react-icons/fi";

interface DashboardOption {
  title: string;
  description: string;
  href: string;
  bgColor: string;
  icon: JSX.Element;
}

const Dashboard: React.FC = () => {
  // Array of dashboard options with icons
  const options: DashboardOption[] = [
    {
      title: "Single Scrape",
      description: "Run a one-off scraping job.",
      href: "/dashboard/single-scrape",
      bgColor: "bg-blue-500",
      icon: <FiZap size={24} />,
    },
    {
      title: "Job Scheduler",
      description: "Schedule single or bulk scraping tasks with the option to set them as recurring.",
      href: "/dashboard/job-scheduler",
      bgColor: "bg-green-500",
      icon: <FiCalendar size={24} />,
    },
    {
      title: "Completed Jobs",
      description: "View finished scraping jobs.",
      href: "/dashboard/completed-jobs",
      bgColor: "bg-purple-500",
      icon: <FiCheckCircle size={24} />,
    },
    {
      title: "Current Scheduled Jobs",
      description: "Manage your upcoming scraping jobs.",
      href: "/dashboard/scheduled-jobs",
      bgColor: "bg-indigo-500",
      icon: <FiClock size={24} />,
    },
    {
      title: "Data Forge",
      description: "Clean and analyze scraped data.",
      href: "/dashboard/data-forge",
      bgColor: "bg-yellow-500",
      icon: <FiDatabase size={24} />,
    },
    {
      title: "Analytics",
      description: "View performance metrics.",
      href: "/dashboard/analytics",
      bgColor: "bg-pink-500",
      icon: <FiBarChart2 size={24} />,
    },
    {
      title: "Notifications & Alerts",
      description: "See real-time updates and alerts.",
      href: "/dashboard/notifications",
      bgColor: "bg-red-500",
      icon: <FiBell size={24} />,
    },
    {
      title: "Help & Documentation",
      description: "Access support and guides.",
      href: "/dashboard/help",
      bgColor: "bg-teal-500",
      icon: <FiHelpCircle size={24} />,
    },
    {
      title: "Recent Activity",
      description: "Review your recent actions.",
      href: "/dashboard/activity",
      bgColor: "bg-orange-500",
      icon: <FiActivity size={24} />,
    },
    {
      title: "Resource Usage & Quota",
      description: "Monitor your current resource usage.",
      href: "/dashboard/quota",
      bgColor: "bg-cyan-500",
      icon: <FiMonitor size={24} />,
    },
    {
      title: "Subscription Manager",
      description: "Manage your subscription details and billing history.",
      href: "/dashboard/subscription",
      bgColor: "bg-lime-500",
      icon: <FiCreditCard size={24} />,
    },
    {
      title: "Forge Balance",
      description: "View your wallet balance and available resources.",
      href: "/dashboard/forge-balance",
      bgColor: "bg-emerald-500",
      icon: <FiDollarSign size={24} />,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      {/* Container with metallic grey background and a border */}
      <div className="w-full max-w-6xl bg-metallic border border-gray-600 p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8">
          Dashboard
        </h1>
        <p className="text-center text-lg text-gray-200 mb-12">
          Select an option below to manage your ScrapeSmith services.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((option) => (
            <Transition
              key={option.title}
              appear={true}
              show={true}
              enter="transition duration-300 transform"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
            >
              <Link
                href={option.href}
                className={`group block p-6 rounded-xl shadow-lg ${option.bgColor} hover:shadow-2xl transition-all duration-300`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  {option.icon}
                  <h2 className="text-2xl font-bold text-white">
                    {option.title}
                  </h2>
                </div>
                <p className="text-white group-hover:opacity-90">
                  {option.description}
                </p>
              </Link>
            </Transition>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

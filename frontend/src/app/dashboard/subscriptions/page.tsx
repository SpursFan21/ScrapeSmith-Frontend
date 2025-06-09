//frontend\src\app\dashboard\subscriptions\page.tsx

'use client';
import React from 'react';
import { Zap } from 'lucide-react';

export default function SubscriptionPage() {
  const plans = [
    { name: 'Bronze', points: 10, discount: '0%', price: '$10/mo', border: 'border-yellow-700', iconColor: 'text-yellow-600' },
    { name: 'Silver', points: 100, discount: '15%', price: '$85/mo', border: 'border-gray-500', iconColor: 'text-gray-400' },
    { name: 'Gold', points: 500, discount: '20%', price: '$400/mo', border: 'border-yellow-500', iconColor: 'text-yellow-400' },
    { name: 'Platinum', points: 1000, discount: '25%', price: '$750/mo', border: 'border-indigo-400', iconColor: 'text-indigo-300' },
    { name: 'Enterprise', points: 5000, discount: '50%', price: '$2500/mo', border: 'border-red-600', iconColor: 'text-red-400' },
  ];

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-7xl bg-gray-900 bg-opacity-90 border border-gray-700 rounded-2xl p-8 space-y-8">
        <h1 className="text-4xl font-extrabold text-amber-500 text-center">
          Forge Your Subscription
        </h1>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-gradient-to-br from-gray-800 to-gray-900 ${plan.border} border rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300 shadow-xl`}
            >
              <div className={`absolute top-4 right-4 ${plan.iconColor}`}>
                <Zap className="w-6 h-6" />
              </div>

              <h2 className="text-2xl font-bold mb-2 text-gray-300">{plan.name}</h2>
              <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">
                {plan.points} Forge Points / month
              </p>
              <p className="text-lg font-semibold text-amber-400 mb-2">
                {plan.discount} off
              </p>
              <p className="text-3xl font-extrabold mb-6 text-white">
                {plan.price}
              </p>

              <button className="w-full bg-amber-600 hover:bg-amber-500 text-black font-semibold py-2 rounded-lg">
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

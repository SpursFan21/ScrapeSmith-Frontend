//Frontend\frontend\src\app\dashboard\forge-balance\page.tsx

'use client';

import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import api from '@/app/api/axios';

const topUpOptions = [
  { amount: 10, price: 10 },
  { amount: 25, price: 24 },
  { amount: 50, price: 45 },
  { amount: 100, price: 85 },
  { amount: 500, price: 400 },
  { amount: 1000, price: 750 },
  { amount: 10000, price: 4000 },
];

export default function ForgeBalancePage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [voucher, setVoucher] = useState('');
  const [loading, setLoading] = useState(false);

  const refetchBalance = async () => {
    try {
      const res = await api.get('/payment/balance');
      setBalance(res.data.balance);
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  };

  useEffect(() => {
    refetchBalance();
  }, []);

  const applyVoucher = async () => {
    try {
      setLoading(true);
      await api.post('/payment/balance/top-up/voucher', { code: voucher });
      await refetchBalance();
      setOpen(false);
      setVoucher('');
      setError(null);
    } catch (err) {
      console.error('Failed to apply voucher:', err);
      setError('Failed to redeem voucher');
    } finally {
      setLoading(false);
    }
  };

  const topUp = async (amount: number) => {
    try {
      setLoading(true);
      await api.post('/payment/balance/top-up/voucher', {
        code: 'yoobee301',
        amount,
      });
      await refetchBalance();
      setError(null);
    } catch (err) {
      console.error(`Failed to top-up ${amount}:`, err);
      setError('Top-up failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-gray-800 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-black text-amber-500 mb-8 drop-shadow-lg tracking-widest uppercase">
          Forge Balance
        </h1>

        <div className="bg-gradient-to-br from-gray-950 to-zinc-800 border border-amber-700 rounded-xl p-6 shadow-2xl mb-10">
          <p className="text-xl text-gray-400 mb-2 tracking-wide">Current Balance</p>
          <div className="text-5xl font-mono font-extrabold text-amber-400">
            {balance !== null ? balance : '...'}
          </div>
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 tracking-wide">
            Top-Up Options
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {topUpOptions.map((option, idx) => (
              <button
                key={option.amount}
                onClick={() => topUp(option.amount)}
                disabled={loading}
                className="bg-gradient-to-br from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-semibold py-4 px-6 rounded-xl border border-amber-900 shadow-lg transition disabled:opacity-50"
              >
                <div className="text-xl font-bold">+{option.amount} Jobs</div>
                <div className="text-sm text-gray-200">${option.price.toFixed(2)} NZD</div>
                {idx > 0 && (
                  <div className="text-xs text-green-300 mt-1">
                    Save {Math.round((1 - option.price / option.amount) * 100)}%
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg border border-gray-600 transition shadow-sm"
        >
          Redeem Voucher Code
        </button>
      </div>

      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-amber-600 p-6 rounded-xl max-w-md w-full shadow-2xl">
              <Dialog.Title className="text-xl text-amber-400 mb-4 font-semibold">
                Enter Voucher Code
              </Dialog.Title>
              <input
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
                placeholder="Enter code"
                className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:ring-amber-500"
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={applyVoucher}
                  disabled={loading}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded text-white font-medium"
                >
                  {loading ? 'Applying...' : 'Apply'}
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

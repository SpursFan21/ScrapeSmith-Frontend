//Frontend\frontend\src\app\dashboard\forge-balance\page.tsx

'use client';

import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import api from '@/app/api/axios';

export default function ForgeBalancePage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [voucher, setVoucher] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get('/payment/balance');
        setBalance(res.data.balance);
      } catch (err) {
        console.error('Failed to fetch balance:', err);
        setError('Failed to fetch balance');
      }
    };

    fetchBalance();
  }, []);

  const applyVoucher = async () => {
    try {
      setLoading(true);
      const res = await api.post('/payment/balance/top-up/voucher', {
        code: voucher,
      });
      setBalance(res.data.balance);
      setOpen(false);
      setVoucher('');
    } catch (err) {
      console.error('Failed to apply voucher:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-amber-500 mb-6">Forge Balance</h1>

        <motion.div
          className="text-6xl font-mono font-bold mb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1.1 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
        >
          {balance !== null ? `${balance} 🔥` : 'Loading...'}
        </motion.div>

        {error && (
          <p className="text-red-400 text-sm mb-4">Error: {error}</p>
        )}

        <button
          onClick={() => setOpen(true)}
          className="mt-4 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow-lg transition"
        >
          Redeem Voucher
        </button>
      </div>

      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-amber-600 p-6 rounded-xl max-w-md w-full shadow-2xl">
              <div className="text-xl text-amber-400 mb-4 font-semibold">
                Enter Voucher Code
              </div>
              <input
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
                placeholder="Enter code"
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white focus:ring-amber-500"
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


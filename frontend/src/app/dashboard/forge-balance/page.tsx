//Frontend\frontend\src\app\dashboard\forge-balance\page.tsx

'use client';

import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchForgeBalance, setBalance } from '@/redux/forgeBalanceSlice';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function ForgeBalancePage() {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const balance = useSelector((state: RootState) => state.forgeBalance.balance);
  const error = useSelector((state: RootState) => state.forgeBalance.error);

  const [open, setOpen] = useState(false);
  const [voucher, setVoucher] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchForgeBalance(accessToken) as any);
    }
  }, [accessToken, dispatch]);

  const applyVoucher = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:8000/payment/balance/top-up/voucher',
        { code: voucher },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      dispatch(setBalance(res.data.balance));
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


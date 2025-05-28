//Frontend\frontend\src\app\dashboard\forge-balance\page.tsx

'use client';

import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import api from '@/app/api/axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
  const [loading, setLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showPaymentChoice, setShowPaymentChoice] = useState(false);
  const [voucherMode, setVoucherMode] = useState(false);
  const [voucher, setVoucher] = useState('');
  const [showStripeForm, setShowStripeForm] = useState(false);

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

  const handleTopUpClick = (amount: number) => {
    setSelectedAmount(amount);
    setShowPaymentChoice(true);
    setVoucherMode(false);
    setShowStripeForm(false);
    setError(null);
  };

  const applyVoucher = async () => {
    if (!selectedAmount || !voucher) return;
    try {
      setLoading(true);
      await api.post('/payment/balance/top-up/voucher', {
        code: voucher,
        amount: selectedAmount,
      });
      await refetchBalance();
      resetDialogs();
    } catch (err) {
      console.error('Failed to redeem voucher:', err);
      setError('Invalid voucher code');
    } finally {
      setLoading(false);
    }
  };

  const resetDialogs = () => {
    setVoucher('');
    setSelectedAmount(null);
    setVoucherMode(false);
    setShowStripeForm(false);
    setShowPaymentChoice(false);
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
                onClick={() => handleTopUpClick(option.amount)}
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
      </div>

      <Transition show={showPaymentChoice} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={resetDialogs}>
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-amber-600 p-6 rounded-xl max-w-md w-full shadow-2xl">
              {!voucherMode && !showStripeForm && (
                <>
                  <Dialog.Title className="text-xl text-amber-400 mb-4 font-semibold">
                    Choose Payment Method
                  </Dialog.Title>
                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => setVoucherMode(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold"
                    >
                      Pay with Voucher
                    </button>
                    <button
                      onClick={() => setShowStripeForm(true)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded font-semibold"
                    >
                      Pay with Stripe
                    </button>
                  </div>
                </>
              )}

              {voucherMode && (
                <>
                  <Dialog.Title className="text-xl text-amber-400 mb-4 font-semibold">
                    Enter Voucher Code
                  </Dialog.Title>
                  <input
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                    placeholder="Enter code"
                    className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:ring-amber-500"
                  />
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={resetDialogs}
                      className="text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={applyVoucher}
                      disabled={loading}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded text-white font-medium"
                    >
                      {loading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                </>
              )}

              {showStripeForm && (
                <Elements stripe={stripePromise}>
                  <div>
                    <Dialog.Title className="text-xl text-amber-400 mb-4 font-semibold">
                      Enter Card Details
                    </Dialog.Title>
                    <div className="bg-gray-800 p-4 rounded mb-4">
                      <CardElement options={{
                        style: {
                          base: {
                            color: '#fff',
                            fontSize: '16px',
                          },
                          invalid: {
                            color: '#f87171',
                          }
                        }
                      }} />
                    </div>
                    <div className="flex justify-between">
                      <button onClick={resetDialogs} className="text-gray-400 hover:text-white">
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          alert('Stripe payment simulation complete.');
                          refetchBalance();
                          resetDialogs();
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                      >
                        Complete Payment
                      </button>
                    </div>
                  </div>
                </Elements>
              )}
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

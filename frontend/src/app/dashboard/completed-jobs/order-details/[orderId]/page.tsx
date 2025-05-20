//Frontend\frontend\src\app\dashboard\completed-jobs\order-details\[orderId]\page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Switch } from '@headlessui/react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface OrderMeta {
  order_id: string;
  created_at: string;
  url: string;
  analysis_type: string;
  custom_script?: string;
}

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState<OrderMeta | null>(null);
  const [rawData, setRawData] = useState<string>('');
  const [cleanData, setCleanData] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [view, setView] = useState<'raw' | 'clean' | 'ai'>('raw');
  const [loading, setLoading] = useState(true);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    const fetchFullOrder = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/users/order-details/${orderId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const { order, raw_data, clean_data, ai_analysis } = res.data;

        setOrderData(order);
        setRawData(raw_data || '');
        setCleanData(clean_data || '');
        setAiAnalysis(ai_analysis || '');
      } catch (err) {
        console.error('Failed to fetch order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFullOrder();
  }, [orderId, accessToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Skeleton or Loaded Order Metadata */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-6 text-center">
          {loading ? (
            <>
              <div className="h-8 w-2/3 mx-auto bg-gray-700 rounded animate-pulse mb-4" />
              <div className="h-4 w-full bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-4 w-5/6 bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-4 w-4/6 bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse" />
            </>
          ) : orderData && (
            <>
              <h1 className="text-3xl font-bold text-amber-500 mb-4">Order Details</h1>
              <p><span className="font-semibold text-gray-400">Order ID:</span> {orderData.order_id}</p>
              <p><span className="font-semibold text-gray-400">Created At:</span> {new Date(orderData.created_at).toLocaleString()}</p>
              <p><span className="font-semibold text-gray-400">URL:</span> <a href={orderData.url} className="text-amber-400 hover:underline">{orderData.url}</a></p>
              <p><span className="font-semibold text-gray-400">Analysis Type:</span> {orderData.analysis_type}</p>
              {orderData.custom_script && (
                <p><span className="font-semibold text-gray-400">Custom Script:</span> {orderData.custom_script}</p>
              )}
            </>
          )}
        </div>

        {/* Toggle Switches */}
        <div className="flex justify-center space-x-4 mb-6">
          {['raw', 'clean', 'ai'].map((type) => (
            <div key={type} className="flex items-center">
              <Switch
                checked={view === type}
                onChange={() => setView(type as 'raw' | 'clean' | 'ai')}
                className={`${
                  view === type ? 'bg-amber-600' : 'bg-gray-700'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
              >
                <span className="sr-only">{type} Data</span>
                <span
                  className={`${
                    view === type ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
              <span className="ml-2 text-gray-300 capitalize">{type} Data</span>
            </div>
          ))}
        </div>

        {/* Data Display Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 min-h-[300px]">
          {loading ? (
            <div className="space-y-4">
              {[...Array(8)].map((_, idx) => (
                <div key={idx} className="h-4 w-full bg-gray-700 animate-pulse rounded" />
              ))}
            </div>
          ) : view === 'raw' ? (
            <pre className="text-gray-300 whitespace-pre-wrap">{rawData}</pre>
          ) : view === 'clean' ? (
            <pre className="text-gray-300 whitespace-pre-wrap">{cleanData}</pre>
          ) : aiAnalysis ? (
            <pre className="text-gray-300 whitespace-pre-wrap">{aiAnalysis}</pre>
          ) : (
            <p className="text-gray-400">No AI Analysis data found for this job.</p>
          )}
        </div>
      </div>
    </div>
  );
}

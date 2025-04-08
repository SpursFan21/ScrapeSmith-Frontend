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

interface RawData {
  data: string;
}

interface CleanData {
  cleanedData: string;
}

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState<OrderMeta | null>(null);
  const [rawData, setRawData] = useState<RawData | null>(null);
  const [cleanData, setCleanData] = useState<CleanData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [view, setView] = useState<'raw' | 'clean' | 'ai'>('raw');
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (!accessToken) return; 


    const fetchOrderData = async () => {
      try {
        const [orderRes, rawRes, cleanRes] = await Promise.all([
          axios.get(`http://localhost:8000/users/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`http://localhost:8000/users/scraped-order/${orderId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get(`http://localhost:8000/users/cleaned-order/${orderId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);
        setOrderData(orderRes.data);
        setRawData(rawRes.data);
        setCleanData(cleanRes.data);
        // AI Analysis data fetching will be implemented later
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderData();
  }, [orderId, accessToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Order Metadata */}
        {orderData && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-6 text-center">
            <h1 className="text-3xl font-bold text-amber-500 mb-4">Order Details</h1>
            <p><span className="font-semibold text-gray-400">Order ID:</span> {orderData.order_id}</p>
            <p><span className="font-semibold text-gray-400">Created At:</span> {new Date(orderData.created_at).toLocaleString()}</p>
            <p><span className="font-semibold text-gray-400">URL:</span> <a href={orderData.url} className="text-amber-400 hover:underline">{orderData.url}</a></p>
            <p><span className="font-semibold text-gray-400">Analysis Type:</span> {orderData.analysis_type}</p>
            {orderData.custom_script && (
              <p><span className="font-semibold text-gray-400">Custom Script:</span> {orderData.custom_script}</p>
            )}
          </div>
        )}

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

        {/* Data Display */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          {view === 'raw' && rawData && (
            <pre className="text-gray-300 whitespace-pre-wrap">{JSON.stringify(rawData.data, null, 2)}</pre>
          )}
          {view === 'clean' && cleanData && (
            <pre className="text-gray-300 whitespace-pre-wrap">{JSON.stringify(cleanData.cleanedData, null, 2)}</pre>
          )}
          {view === 'ai' && (
            <p className="text-gray-400">AI Analysis feature is coming soon.</p>
          )}
        </div>
      </div>
    </div>
  );
}


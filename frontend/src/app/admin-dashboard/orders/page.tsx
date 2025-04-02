//Frontend\frontend\src\app\admin-dashboard\orders\page.tsx
"use client";

import React, { useEffect, useState } from "react";
import api from "@/app/api/axios";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

interface ScrapeData {
  _id: string;
  userId: string;
  url: string;
  data: string;
}

interface CleanedData {
  _id: string;
  userId: string;
  orderId: string;
  cleanedContent: string;
}

const OrdersPage: React.FC = () => {
  const [scrapes, setScrapes] = useState<ScrapeData[]>([]);
  const [cleaned, setCleaned] = useState<CleanedData[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await api.get("/admin/orders");
      setScrapes(response.data.scrapes || []);
      setCleaned(response.data.cleaned || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto rounded shadow ring-1 ring-white/10">
        <table className="min-w-full divide-y divide-gray-700 bg-gray-900 text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left">User ID</th>
              <th className="px-4 py-3 text-left">URL</th>
              <th className="px-4 py-3 text-left">Raw</th>
              <th className="px-4 py-3 text-left">Cleaned</th>
              <th className="px-4 py-3 text-left">Expand</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {scrapes.map((s) => {
              const cleanedMatch = cleaned.find((c) => c.orderId === s._id);
              return (
                <React.Fragment key={s._id}>
                  <tr className="hover:bg-gray-800 transition">
                    <td className="px-4 py-3">{s.userId}</td>
                    <td className="px-4 py-3">{s.url}</td>
                    <td className="px-4 py-3 truncate max-w-[200px]">{s.data.slice(0, 50)}...</td>
                    <td className="px-4 py-3 truncate max-w-[200px]">
                      {cleanedMatch ? cleanedMatch.cleanedContent.slice(0, 50) + "..." : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleExpand(s._id)}>
                        {expandedId === s._id ? (
                          <ChevronUpIcon className="w-5 h-5" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedId === s._id && (
                    <tr>
                      <td colSpan={5} className="bg-gray-800 px-4 py-4">
                        <div className="mb-2">
                          <strong>Raw Data:</strong>
                          <pre className="whitespace-pre-wrap break-words bg-gray-900 p-2 rounded mt-1 text-xs max-h-60 overflow-y-auto">
                            {s.data}
                          </pre>
                        </div>
                        <div>
                          <strong>Cleaned Data:</strong>
                          <pre className="whitespace-pre-wrap break-words bg-gray-900 p-2 rounded mt-1 text-xs max-h-60 overflow-y-auto">
                            {cleanedMatch ? cleanedMatch.cleanedContent : "No cleaned data available."}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;

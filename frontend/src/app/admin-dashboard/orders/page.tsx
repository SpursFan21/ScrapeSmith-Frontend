//Frontend\frontend\src\app\admin-dashboard\orders\page.tsx

"use client";

import React, { useEffect, useState } from "react";
import api from "@/app/api/axios";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

interface ScrapeData {
  _id: string;
  orderId: string;
  userId: string;
  url: string;
  data: string;
}

interface CleanedData {
  _id: string;
  userId: string;
  orderId: string;
  cleanedData: string;
}

interface AIResult {
  _id: string;
  userId: string;
  orderId: string;
  analysisData: string;
}

const OrdersPage: React.FC = () => {
  const [scrapes, setScrapes] = useState<ScrapeData[]>([]);
  const [cleaned, setCleaned] = useState<CleanedData[]>([]);
  const [aiResults, setAIResults] = useState<AIResult[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await api.get("/admin/orders");
      setScrapes(response.data.scrapes || []);
      setCleaned(response.data.cleaned || []);
      setAIResults(response.data.analyzed || []);
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
    <div className="p-6 text-white overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="rounded shadow ring-1 ring-white/10">
        <table className="w-full table-fixed divide-y divide-gray-700 bg-gray-900 text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-2 py-3 text-left w-[15%]">User ID</th>
              <th className="px-2 py-3 text-left w-[25%]">URL</th>
              <th className="px-2 py-3 text-left w-[15%]">Raw</th>
              <th className="px-2 py-3 text-left w-[15%]">Cleaned</th>
              <th className="px-2 py-3 text-left w-[15%]">AI</th>
              <th className="px-2 py-3 text-left w-[5%]">Expand</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {scrapes.map((s) => {
              const cleanedMatch = cleaned.find((c) => c.orderId === s.orderId);
              const aiMatch = aiResults.find((a) => a.orderId === s.orderId);
              const isExpanded = expandedId === s.orderId;

              return (
                <React.Fragment key={s.orderId}>
                  <tr className={`hover:bg-gray-800 transition ${isExpanded ? "bg-gray-800/60" : ""}`}>
                    <td className="px-2 py-3 break-all">{s.userId}</td>
                    <td className="px-2 py-3 break-all">{s.url}</td>
                    <td className="px-2 py-3 truncate">{s.data.slice(0, 50)}...</td>
                    <td className="px-2 py-3 truncate">
                      {cleanedMatch ? cleanedMatch.cleanedData.slice(0, 50) + "..." : "—"}
                    </td>
                    <td className="px-2 py-3 truncate">
                      {aiMatch ? aiMatch.analysisData.slice(0, 50) + "..." : "—"}
                    </td>
                    <td className="px-2 py-3">
                      <button
                        className="text-amber-400 hover:text-amber-300"
                        onClick={() => toggleExpand(s.orderId)}
                      >
                        {isExpanded ? (
                          <ChevronUpIcon className="w-5 h-5" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr>
                      <td colSpan={6} className="bg-gray-950 px-4 py-6">
                        <div className="border border-gray-700 rounded-lg p-4 bg-gray-900 space-y-6">
                          <div>
                            <h2 className="text-lg font-semibold text-amber-400">Order ID: {s.orderId}</h2>
                            <p className="text-sm text-gray-400">User ID: {s.userId}</p>
                            <p className="text-sm text-gray-400 break-all">URL: {s.url}</p>
                          </div>

                          <div>
                            <h3 className="text-md font-bold mb-1">Raw Data</h3>
                            <pre className="bg-black/80 p-3 rounded text-xs whitespace-pre-wrap overflow-y-auto max-h-64 break-words ring-1 ring-gray-800 w-full">
                              {s.data}
                            </pre>
                          </div>

                          <div>
                            <h3 className="text-md font-bold mb-1">Cleaned Data</h3>
                            <pre className="bg-black/80 p-3 rounded text-xs whitespace-pre-wrap overflow-y-auto max-h-64 break-words ring-1 ring-gray-800 w-full">
                              {cleanedMatch ? cleanedMatch.cleanedData : "No cleaned data available."}
                            </pre>
                          </div>

                          <div>
                            <h3 className="text-md font-bold mb-1">AI Analysis</h3>
                            <pre className="bg-black/80 p-3 rounded text-xs whitespace-pre-wrap break-words overflow-y-auto max-h-64 ring-1 ring-gray-800 w-full">
                              {aiMatch ? aiMatch.analysisData : "No AI analysis available."}
                            </pre>
                          </div>


                          <div className="flex justify-end">
                            <button
                              onClick={() => toggleExpand(s.orderId)}
                              className="text-amber-400 hover:text-amber-300 text-sm flex items-center space-x-1"
                            >
                              <ChevronUpIcon className="w-4 h-4" />
                              <span>Collapse</span>
                            </button>
                          </div>
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

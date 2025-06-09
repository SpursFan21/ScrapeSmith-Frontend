//frontend\src\app\dashboard\single-scrape\voucher\page.tsx

"use client";

import React, { useEffect, useState } from "react";
import api from '@/app/api/axios';
import { useRouter } from "next/navigation";

const VoucherPaymentPage: React.FC = () => {
  const router = useRouter();

  const [hasMounted, setHasMounted] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<string | null>(null);
  const [customScript, setCustomScript] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setScrapeUrl(sessionStorage.getItem("scrapeUrl"));
    setAnalysisType(sessionStorage.getItem("analysisType"));
    setCustomScript(sessionStorage.getItem("customScript"));
    setHasMounted(true);
  }, []);

  const handleVoucherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrapeUrl || !analysisType || !voucherCode.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/payment/validate-voucher", { code: voucherCode });

      if (res.data.valid) {
        await api.post("/scrape/single", {
          url: scrapeUrl,
          analysis_type: analysisType,
          custom_script: customScript,
        });

        sessionStorage.removeItem("scrapeUrl");
        sessionStorage.removeItem("analysisType");
        sessionStorage.removeItem("customScript");

        setOrderSuccess(true);
        setMessage(
          "Voucher accepted! Your scrape job has been queued and is being processed."
        );
      } else {
        setMessage("Invalid voucher code.");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-900">
      <div className="w-full max-w-xl p-6 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6">Voucher Payment</h2>

        {hasMounted && (
          <div className="bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="text-lg text-amber-400 font-semibold">Your Scrape Job</h3>
            <p className="text-white mt-2">
              <strong>URL:</strong> {scrapeUrl || "N/A"}
            </p>
            <p className="text-white">
              <strong>Analysis Type:</strong> {analysisType || "N/A"}
            </p>
          </div>
        )}

        <form onSubmit={handleVoucherSubmit}>
          <label className="block mb-2 text-gray-200 font-semibold">
            Enter Voucher Code
          </label>
          <input
            type="text"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="e.g. yoobee301"
            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <button
            type="submit"
            disabled={loading || orderSuccess}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded font-semibold transition"
          >
            {loading ? "Verifying..." : "Submit Voucher"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-400 mb-2">or</p>
          <button
            onClick={() => router.push("/dashboard/single-scrape/payment")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold transition"
          >
            Pay with Stripe
          </button>
        </div>

        {message && (
          <p className="mt-4 text-center font-medium text-white">{message}</p>
        )}

        {orderSuccess && (
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/dashboard/completed-jobs")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
            >
              View Completed Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherPaymentPage;

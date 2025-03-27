// Frontend\frontend\src\app\dashboard\single-scrape\page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ProtectedRoute from "@/app/_components/ProtectedRoute";

const analysisOptions = [
  { name: "Sentiment Analysis", description: "Analyze text sentiment" },
  { name: "Keyword Extraction", description: "Extract key phrases and words" },
  { name: "Entity Recognition", description: "Identify entities in text" },
  { name: "Text Summarization", description: "Summarize text content" },
  { name: "Topic Modeling", description: "Discover topics in text" },
  { name: "Named Entity Linking", description: "Link entities to known databases" },
  { name: "Language Detection", description: "Identify language from text" },
  { name: "Content Classification", description: "Classify text content" },
  { name: "Anomaly Detection", description: "Detect unusual patterns" },
  { name: "Text Clustering", description: "Group similar text documents" },
  { name: "Custom Analysis", description: "Upload or select a custom script" },
];

const SingleScrapePage: React.FC = () => {
  const [url, setUrl] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const router = useRouter();

  // Get tokens from Redux
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);

  const handleProceed = () => {
    if (!url || !selectedAnalysis) {
      alert("Please provide a URL and select an analysis type.");
      return;
    }

    // Save the selected data to sessionStorage for the payment page
    sessionStorage.setItem("scrapeUrl", url);
    sessionStorage.setItem("analysisType", selectedAnalysis);

    // Redirect to the payment page
    router.push("/dashboard/payment");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="w-full max-w-4xl p-10 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-2xl shadow-2xl">
          <div className="relative">
            {/* Banner */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 opacity-50 rounded-2xl -z-10"></div>
            <h1 className="text-4xl font-extrabold text-center text-white mb-8">
              Single Scrape
            </h1>
            <p className="text-center text-lg text-gray-300 mb-6">
              Enter a target URL and select an analysis type.
            </p>

            {/* URL Input */}
            <div className="mb-8">
              <label className="block text-xl font-semibold mb-2 text-gray-200">
                Target URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter the target URL"
                className="border border-gray-500 w-full p-3 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Analysis Selection */}
            <h3 className="text-2xl font-semibold mb-4 text-gray-200">
              Select Analysis Type
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {analysisOptions.map((option) => (
                <Transition
                  key={option.name}
                  appear={true}
                  show={true}
                  enter="transition duration-300 transform"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                >
                  <button
                    onClick={() => setSelectedAnalysis(option.name)}
                    className={`group block p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${
                      selectedAnalysis === option.name
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                        : "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-200"
                    } hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-500`}
                  >
                    <h4 className="text-xl font-medium">{option.name}</h4>
                    <p className="text-sm">{option.description}</p>
                  </button>
                </Transition>
              ))}
            </div>

            {/* Proceed Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleProceed}
                className="bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold transition"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SingleScrapePage;

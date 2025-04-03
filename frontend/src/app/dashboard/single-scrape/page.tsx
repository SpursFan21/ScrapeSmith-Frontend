// Frontend\frontend\src\app\dashboard\single-scrape\page.tsx
"use client";

import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
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
  const [customScript, setCustomScript] = useState("");
  const [customExplanation, setCustomExplanation] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);

  const handleSelect = (analysis: string) => {
    setSelectedAnalysis(analysis);
    if (analysis === "Custom Analysis") {
      setIsModalOpen(true);
    }
  };

  const handleProceed = () => {
    if (!url || !selectedAnalysis) {
      alert("Please provide a URL and select an analysis type.");
      return;
    }

    sessionStorage.setItem("scrapeUrl", url);
    sessionStorage.setItem("analysisType", selectedAnalysis);

    if (selectedAnalysis === "Custom Analysis") {
      sessionStorage.setItem("customScript", customScript);
      sessionStorage.setItem("customExplanation", customExplanation);
    }

    router.push("/dashboard/single-scrape/payment");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="w-full max-w-4xl p-10 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-2xl shadow-2xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 opacity-50 rounded-2xl -z-10"></div>
            <h1 className="text-4xl font-extrabold text-center text-white mb-8">
              Single Scrape
            </h1>
            <p className="text-center text-lg text-gray-300 mb-6">
              Enter a target URL and select an analysis type.
            </p>

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
                    onClick={() => handleSelect(option.name)}
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

      {/* Custom Script Modal */}
      <Transition show={isModalOpen} as={Fragment}>
        <Dialog onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">

            {/* Replace this ↓ */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            {/* Dialog panel content... */}


            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg z-50 border border-gray-700">
                <Dialog.Title className="text-xl font-bold text-white mb-4">
                  Custom Script Input
                </Dialog.Title>
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Script
                </label>
                <textarea
                  rows={5}
                  value={customScript}
                  onChange={(e) => setCustomScript(e.target.value)}
                  placeholder="Paste your custom analysis script here..."
                  className="w-full p-3 rounded bg-gray-900 text-white border border-gray-600 mb-4"
                />
                <label className="block text-sm font-semibold text-gray-300 mb-1">
                  Description / Explanation
                </label>
                <textarea
                  rows={3}
                  value={customExplanation}
                  onChange={(e) => setCustomExplanation(e.target.value)}
                  placeholder="Explain what this script does"
                  className="w-full p-3 rounded bg-gray-900 text-white border border-gray-600"
                />

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </ProtectedRoute>
  );
};

export default SingleScrapePage;

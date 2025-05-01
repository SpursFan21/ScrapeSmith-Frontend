//Frontend\frontend\src\app\dashboard\job-scheduler\page.tsx

"use client";

import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ProtectedRoute from "@/app/_components/ProtectedRoute";

// Analysis Options for the user to choose from
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

const JobSchedulerPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([{ url: "", analysisType: "", customScript: "", runAt: "", customExplanation: "" }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customScript, setCustomScript] = useState("");
  const [customExplanation, setCustomExplanation] = useState("");
  const router = useRouter();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const handleAddJob = () => {
    setJobs([...jobs, { url: "", analysisType: "", customScript: "", runAt: "", customExplanation: "" }]);
  };

  const handleChangeJob = (index: number, key: string, value: any) => {
    const updatedJobs = [...jobs];
    updatedJobs[index][key] = value;
    setJobs(updatedJobs);
  };

  const handleSelectAnalysisType = (index: number, analysis: string) => {
    handleChangeJob(index, "analysisType", analysis);
    if (analysis === "Custom Analysis") {
      setIsModalOpen(true);
    }
  };

  const handleScheduleJobs = async () => {
    if (jobs.some(job => !job.url || !job.analysisType || !job.runAt)) {
      alert("Please fill in all required fields for each job.");
      return;
    }

    // Prepare data to send to the backend
    const jobDataArray = jobs.map(job => ({
      ...job,
      customScript: job.analysisType === "Custom Analysis" ? customScript : undefined,
    }));

    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(jobDataArray),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Jobs scheduled:", data);
        router.push("/dashboard/thank-you");
      } else {
        console.error("Failed to schedule jobs");
      }
    } catch (err) {
      console.error("Error scheduling jobs:", err);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="w-full max-w-4xl p-10 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-2xl shadow-2xl">
          <h1 className="text-4xl font-extrabold text-center text-white mb-8">Job Scheduler</h1>
          <p className="text-center text-lg text-gray-300 mb-6">Schedule multiple scrape jobs with custom analysis types</p>

          {jobs.map((job, index) => (
            <div key={index} className="mb-8">
              <h3 className="text-xl font-semibold text-gray-200 mb-4">Job {index + 1}</h3>

              <div className="mb-4">
                <label className="block text-lg text-gray-200">Target URL</label>
                <input
                  type="text"
                  value={job.url}
                  onChange={(e) => handleChangeJob(index, "url", e.target.value)}
                  placeholder="Enter target URL"
                  className="w-full p-3 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-lg text-gray-200">Select Analysis Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analysisOptions.map((option) => (
                    <button
                      key={option.name}
                      onClick={() => handleSelectAnalysisType(index, option.name)}
                      className={`p-5 rounded-xl shadow-md transition-all duration-300 ${job.analysisType === option.name ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white" : "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-200"}`}
                    >
                      <h4 className="text-xl font-medium">{option.name}</h4>
                      <p className="text-sm">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-lg text-gray-200">Schedule Time</label>
                <input
                  type="datetime-local"
                  value={job.runAt}
                  onChange={(e) => handleChangeJob(index, "runAt", e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {job.analysisType === "Custom Analysis" && (
                <div className="mb-4">
                  <label className="block text-lg text-gray-200">Custom Script</label>
                  <textarea
                    value={job.customScript}
                    onChange={(e) => handleChangeJob(index, "customScript", e.target.value)}
                    placeholder="Paste your custom script here"
                    className="w-full p-3 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>
          ))}

          <div className="mt-6 text-center">
            <button
              onClick={handleAddJob}
              className="bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold transition"
            >
              Add Another Job
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleScheduleJobs}
              className="bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold transition"
            >
              Schedule Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Custom Script Modal */}
      <Transition show={isModalOpen} as={Fragment}>
        <Dialog onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" />
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg z-50 border border-gray-700">
              <Dialog.Title className="text-xl font-bold text-white mb-4">Custom Script Input</Dialog.Title>
              <textarea
                value={customScript}
                onChange={(e) => setCustomScript(e.target.value)}
                placeholder="Paste your custom analysis script here"
                className="w-full p-3 rounded bg-gray-900 text-white border border-gray-600 mb-4"
              />
              <textarea
                value={customExplanation}
                onChange={(e) => setCustomExplanation(e.target.value)}
                placeholder="Explain what this script does"
                className="w-full p-3 rounded bg-gray-900 text-white border border-gray-600"
              />
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
                  Cancel
                </button>
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">
                  Save
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </ProtectedRoute>
  );
};

export default JobSchedulerPage;

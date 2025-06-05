//Frontend\frontend\src\app\dashboard\job-scheduler\page.tsx

"use client";

import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ProtectedRoute from "@/app/_components/ProtectedRoute";
import { fetchForgeBalance } from "@/redux/forgeBalanceSlice";
import { useAppDispatch } from "@/redux/store";
import api from "@/app/api/axios";
import { toast } from "react-hot-toast";


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

const decodeToken = (token?: string): any => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload));
  } catch (err) {
    return null;
  }
};

const JobSchedulerPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([{ url: "", analysisType: "", customScript: "", runAt: "", customExplanation: "" }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customScript, setCustomScript] = useState("");
  const [customExplanation, setCustomExplanation] = useState("");
  const [recentlyScheduled, setRecentlyScheduled] = useState(false);
  const router = useRouter();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const balance = useSelector((state: RootState) => state.forgeBalance.balance);
  const dispatch = useAppDispatch();
  const [showTopUpPrompt, setShowTopUpPrompt] = useState(false);
  const jobCost = 1;
  const totalCost = jobs.length * jobCost;
  const [loading, setLoading] = useState(false);
  const [activeJobIndex, setActiveJobIndex] = useState<number | null>(null);


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
      setActiveJobIndex(index);
      setIsModalOpen(true);
    }
  };


  const handleScheduleJobs = async () => {
    if (loading) return;
    setLoading(true);

    const user = accessToken ? decodeToken(accessToken) : null;
    const jobCount = jobs.length;

    if (!user || !accessToken) {
      alert("You must be logged in.");
      setLoading(false);
      return;
    }

    if (jobs.some(job => !job.url || !job.analysisType || !job.runAt)) {
      alert("Please fill in all required fields for each job.");
      setLoading(false);
      return;
    }

    if (balance !== null && jobCount > balance) {
      setShowTopUpPrompt(true);
      setLoading(false);
      return;
    }

    const jobDataArray = jobs.map(job => ({
      ...job,
      userId: user.sub,
      runAt: new Date(job.runAt).toISOString(),
      customScript: job.analysisType === "Custom Analysis" ? customScript : undefined,
    }));


    try {
      const paymentResponse = await api.post("/payment/schedule", { amount: jobCount });
      if (paymentResponse.status < 200 || paymentResponse.status >= 300) {
        toast.error("Payment processing failed.");
        setLoading(false); // This is important to avoid freezing the UIi
        return;
      }


      const jobResponse = await api.post("/job/api/schedule", jobDataArray);
      console.log("Job scheduling response:", jobResponse.status, jobResponse.data);

      // Accept any 2xx status as success
      if (jobResponse.status >= 200 && jobResponse.status < 300) {
        toast.success("Jobs scheduled successfully!");
        dispatch(fetchForgeBalance());

        // Reset form
        setJobs([{ url: "", analysisType: "", customScript: "", runAt: "", customExplanation: "" }]);
        setCustomScript("");
        setCustomExplanation("");
        setActiveJobIndex(null);
        setRecentlyScheduled(true);
        setLoading(false);
      } else {
        toast.error(`Job scheduling failed (status ${jobResponse.status}).`);
      }
    } catch (err: any) {
      console.error("Error in scheduling process:", err.response?.data || err.message);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  }


  useEffect(() => {
    if (accessToken) {
      dispatch(fetchForgeBalance());
    }
  }, [accessToken, dispatch]);

  return (
    <ProtectedRoute>
      <Transition show={showTopUpPrompt} as={Fragment}>
        <Dialog onClose={() => setShowTopUpPrompt(false)} className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-60" />
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md z-50 border border-gray-600 text-white">
              <Dialog.Title className="text-lg font-bold mb-4">Insufficient Forge Balance</Dialog.Title>
              <p className="mb-4">
                You need <strong>{totalCost}</strong> Forge Balance to schedule {jobs.length} job(s), but you only have <strong>{balance}</strong>.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowTopUpPrompt(false)} className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
                <button onClick={() => router.push("/dashboard/forge-balance")} className="bg-amber-600 px-4 py-2 rounded hover:bg-amber-700">Top Up Now</button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="w-full max-w-4xl p-10 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-2xl shadow-2xl">
          <h1 className="text-4xl font-extrabold text-center text-white mb-8">Job Scheduler</h1>
          <p className="text-center text-lg text-gray-300 mb-6">Schedule multiple scrape jobs with custom analysis types</p>

          {recentlyScheduled && (
            <div className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center flex justify-between items-center">
              <span>Jobs scheduled successfully!</span>
              <button onClick={() => setRecentlyScheduled(false)} className="bg-white text-green-700 font-semibold px-4 py-1 rounded hover:bg-gray-100 ml-4">Schedule More</button>
            </div>
          )}

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
                      className={`p-5 rounded-xl shadow-md transition-all duration-300 ${
                        job.analysisType === option.name
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                          : "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-200"
                      }`}
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

            </div>
          ))}

          <div className="text-center text-gray-300 font-medium mb-4">
            Jobs Scheduled: {jobs.length} × {jobCost} = <span className="text-white font-bold">{totalCost}</span>
          </div>

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
              disabled={loading}
              onClick={handleScheduleJobs}
              className={`bg-amber-500 hover:bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Schedule Jobs"}
            </button>
          </div>
        </div>
      </div>

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
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (activeJobIndex !== null) {
                    handleChangeJob(activeJobIndex, "customScript", customScript);
                    handleChangeJob(activeJobIndex, "customExplanation", customExplanation);
                  }
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
              >
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


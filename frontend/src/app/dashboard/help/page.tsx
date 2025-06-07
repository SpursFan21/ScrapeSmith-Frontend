//frontend\src\app\dashboard\help\page.tsx

"use client";

import React, { useEffect, useState } from "react";
import api from "@/app/api/axios";
import Toast from "@/app/_components/Toast";


interface Ticket {
  _id: string;
  subject: string;
  message: string;
  status: string;
  responses: { fromAdmin: boolean; message: string; timestamp: string }[];
  createdAt: string;
}

const HelpPage: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDocs, setOpenDocs] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);


  const fetchTickets = async () => {
  try {
    const res = await api.get("/users/tickets");
    setTickets(res.data);
  } catch (err) {
    console.error("Failed to fetch tickets:", err);
    setTickets([]);
  }
};


useEffect(() => {
  fetchTickets();
}, []);

const handleSubmit = async () => {
  if (!subject || !message) return;
  setLoading(true);
  try {
    await api.post("/users/tickets", { subject, message });
    setSubject("");
    setMessage("");
    setToastVisible(true);
    await fetchTickets();
  } catch (err) {
    console.error("Failed to submit ticket:", err);
    alert("Failed to submit ticket. Try again.");
  } finally {
    setLoading(false);
  }
};


  const toggleDoc = (id: string) => {
    setOpenDocs(openDocs === id ? null : id);
  };

  return (
    <div className="w-full flex justify-center px-4 bg-gradient-to-br from-gray-900 via-gray-950 to-black py-10 min-h-screen">
      <div className="w-full max-w-3xl bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] border border-gray-700 rounded-lg p-6 shadow-md shadow-black">
        <h1 className="text-3xl font-bold text-center text-amber-500 mb-6 tracking-wide">
          Help & Documentation
        </h1>

        {/* Documentation Section */}
        <div className="mb-10 space-y-4">
          {[
            {
              id: "overview",
              title: "📌 What is ScrapeSmith?",
              content: (
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Submit URLs to be scraped via a single scrape or job scheduler.</li>
                  <li>Automatically clean messy HTML using AI-powered logic.</li>
                  <li>Run text analysis like sentiment, keyword extraction, summarization, etc.</li>
                  <li>Pay using Stripe or vouchers, and manage your Forge Balance.</li>
                </ul>
              ),
            },
            {
              id: "jobs",
              title: "⚙️ How do jobs work?",
              content: (
                <ol className="list-decimal ml-6 mt-2 space-y-1">
                  <li><strong>Scrape:</strong> Fetch content via ScrapeNinja API.</li>
                  <li><strong>Clean:</strong> Use Cheerio to sanitize and extract useful data.</li>
                  <li><strong>Analyze:</strong> Analyze cleaned text with OpenAI.</li>
                </ol>
              ),
            },
            {
              id: "payments",
              title: "💳 Payment & Forge Balance",
              content: (
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>Stripe</strong> for one-time payments.</li>
                  <li><strong>Voucher codes</strong> (e.g. <code>yoobee301</code>).</li>
                  <li><strong>Forge Balance</strong> = prepaid credits to run jobs.</li>
                </ul>
              ),
            },
            {
              id: "ai",
              title: "🧠 AI Analysis Types",
              content: (
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Sentiment Analysis</li>
                  <li>Keyword Extraction</li>
                  <li>Text Summarization</li>
                  <li>Entity Recognition & Linking</li>
                  <li>Topic Modeling</li>
                  <li>Content Classification</li>
                  <li>Custom Script Execution</li>
                </ul>
              ),
            },
          ].map((section) => (
            <div key={section.id}>
              <button
                onClick={() => toggleDoc(section.id)}
                className="w-full text-left bg-gray-800 p-3 rounded hover:bg-gray-700 font-semibold text-amber-400"
              >
                {section.title}
              </button>
              {openDocs === section.id && (
                <div className="bg-gray-900 p-4 text-sm rounded-b border border-t-0 border-gray-700">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ticket Submission */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-amber-400 mb-2">
            Submit a Support Ticket
          </h2>
          <input
            className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <textarea
            className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded"
            placeholder="Describe your issue..."
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded text-white font-semibold"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </div>

        {/* Existing Tickets */}
        <div>
          <h2 className="text-xl font-semibold text-amber-400 mb-4">
            Your Tickets
          </h2>
          {tickets.length === 0 ? (
            <p className="text-gray-400 text-sm">No tickets submitted yet.</p>
          ) : (
            tickets.map((t) => (
              <div
                key={t._id}
                className="mb-6 p-4 bg-gray-800 rounded border border-gray-700 hover:border-teal-500 transition"
              >
                <p className="font-bold text-teal-300 mb-1">{t.subject}</p>
                <p className="text-sm text-gray-300 mb-1">{t.message}</p>
                <p className="text-xs text-gray-500">Status: {t.status}</p>

                {t.responses.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {t.responses.map((r, idx) => (
                      <div key={idx} className="text-sm">
                        <span className={r.fromAdmin ? "text-amber-400" : "text-gray-300"}>
                          {r.fromAdmin ? "Admin:" : "You:"}
                        </span>{" "}
                        {r.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <Toast
        show={toastVisible}
        message="Ticket submitted successfully!"
        onClose={() => setToastVisible(false)}
      />

    </div>
    
  );
  
};

export default HelpPage;

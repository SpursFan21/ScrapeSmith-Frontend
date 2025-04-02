//Frontend\frontend\src\app\admin-dashboard\tickets\page.tsx
"use client";

import React, { useEffect, useState } from "react";
import api from "@/app/api/axios";
import toast, { Toaster } from "react-hot-toast";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Response {
  adminId: string;
  message: string;
  timestamp: string;
}

interface Ticket {
  _id: string;
  userId: string;
  subject: string;
  message: string;
  status: "open" | "closed";
  responses: Response[];
  createdAt: string;
}

const TicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<"all" | "open">("all");
  const [search, setSearch] = useState("");
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    try {
      const res = await api.get("/admin/tickets");
      setTickets(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to fetch tickets");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((t) => {
    if (filter === "open" && t.status !== "open") return false;
    return (
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.userId.toLowerCase().includes(search.toLowerCase())
    );
  });

  const toggleExpand = (id: string) => {
    setExpandedTicketId(expandedTicketId === id ? null : id);
    setResponseText("");
  };

  const handleRespond = async (id: string) => {
    if (!responseText.trim()) return;

    try {
      await api.post(`/admin/tickets/${id}/respond`, { message: responseText });
      toast.success("Response sent!");
      await fetchTickets();
      setResponseText("");
    } catch (err) {
      toast.error("Failed to send response.");
    }
  };

  const handleClose = async (id: string) => {
    try {
      await api.post(`/admin/tickets/${id}/close`);
      toast.success("Ticket closed.");
      await fetchTickets();
    } catch (err) {
      toast.error("Failed to close ticket.");
    }
  };

  return (
    <div className="p-6 text-white">
      <Toaster />
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by subject or user ID..."
            className="px-2 py-1 rounded bg-gray-800 text-sm text-white border border-gray-700"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "open")}
            className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="open">Open Only</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {filteredTickets.length === 0 && (
        <p className="text-gray-400">No tickets found.</p>
      )}

      {filteredTickets.map((ticket) => (
        <div
          key={ticket._id}
          className="mb-6 border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-md"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-amber-400">
                {ticket.subject}
              </h2>
              <p className="text-sm text-gray-300 font-mono">
                From: {ticket.userId}
              </p>
              <p className="text-xs text-gray-400">
                Created: {new Date(ticket.createdAt).toLocaleString()}
              </p>
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded-full font-semibold ${
                  ticket.status === "open"
                    ? "bg-green-900 text-green-400"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {ticket.status.toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => toggleExpand(ticket._id)}
              className="text-sm text-amber-500 hover:underline"
            >
              {expandedTicketId === ticket._id ? "Collapse" : "View"}
            </button>
          </div>

          {expandedTicketId === ticket._id && (
            <div className="mt-4">
              <div className="bg-gray-900 rounded p-3 text-sm">
                <p className="font-bold text-white mb-1">User Message:</p>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {ticket.message}
                </p>
              </div>

              {ticket.responses.length > 0 && (
                <div className="mt-3">
                  <p className="text-white font-bold">Admin Responses:</p>
                  {ticket.responses.map((res, i) => (
                    <div key={i} className="mt-1 px-3 py-2 bg-gray-900 rounded">
                      <p className="text-gray-300">{res.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        — {res.adminId} •{" "}
                        {new Date(res.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {ticket.status === "open" && (
                <>
                  <div className="mt-4 flex items-center space-x-2">
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Write a response..."
                      className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                      rows={2}
                    />
                    <button
                      onClick={() => handleRespond(ticket._id)}
                      className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded"
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleClose(ticket._id)}
                    className="mt-2 text-sm text-red-400 hover:underline flex items-center"
                  >
                    <XMarkIcon className="w-4 h-4 mr-1" />
                    Close Ticket
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TicketsPage;

//frontend\src\app\dashboard\help\tickets\[ticketId]\page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/app/api/axios';
import Toast from '@/app/_components/Toast';
import ReactMarkdown from 'react-markdown';

interface TicketResponse {
  fromAdmin: boolean;
  message: string;
  timestamp: string;
}

interface Ticket {
  _id: string;
  subject: string;
  message: string;
  status: 'open' | 'closed';
  responses: TicketResponse[];
  createdAt: string;
}

export default function TicketThreadPage() {
  const params = useParams();
  const ticketId = Array.isArray(params?.ticketId)
    ? params.ticketId[0]
    : params?.ticketId;
  console.log("Ticket ID from URL:", ticketId);


  const router = useRouter();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const fetchTicket = async () => {
    try {
      const res = await api.get(`/users/tickets/${ticketId}`);
      setTicket(res.data);
    } catch (err) {
      console.error('Failed to fetch ticket:', err);
      router.push('/dashboard/help');
    }
  };

  useEffect(() => {
    if (ticketId) fetchTicket();
  }, [ticketId]);

  const handleReply = async () => {
    if (!reply.trim()) return;
    setLoading(true);
    try {
      await api.post(`/users/tickets/${ticketId}/reply`, { message: reply });
      setReply('');
      setToastVisible(true);
      await fetchTicket(); // Refresh thread
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) {
    return <div className="p-10 text-white">Loading ticket...</div>;
  }

  const isClosed = ticket.status === 'closed';

  return (
    <div className="min-h-screen bg-black text-white py-10 px-6">
      <div className="max-w-2xl mx-auto bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-md">
        <button
          onClick={() => router.back()}
          className="text-amber-500 hover:underline text-sm mb-4"
        >
          ← Back to Help
        </button>

        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-amber-400">
            {ticket.subject}
          </h1>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              isClosed
                ? 'bg-red-800 text-red-300'
                : 'bg-green-800 text-green-300'
            }`}
          >
            {ticket.status.toUpperCase()}
          </span>
        </div>

        <p className="mb-6 text-gray-300">{ticket.message}</p>

        <div className="space-y-4 mb-6">
          {ticket.responses.map((r, idx) => (
            <div key={idx} className="bg-gray-800 p-3 rounded text-sm">
              <p className="font-semibold text-amber-300">
                {r.fromAdmin ? 'Admin' : 'You'}
              </p>
              <div className="prose prose-invert text-sm max-w-none">
                <ReactMarkdown>{r.message}</ReactMarkdown>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(r.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {!isClosed ? (
          <div>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply... (supports **Markdown**)"
              rows={4}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-sm mb-2"
            />
            <button
              onClick={handleReply}
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded font-semibold"
            >
              {loading ? 'Sending...' : 'Send Reply'}
            </button>
          </div>
        ) : (
          <p className="text-gray-400 italic text-sm">
            This ticket is closed. Replies are disabled.
          </p>
        )}
      </div>

      <Toast
        show={toastVisible}
        message="Reply sent!"
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}

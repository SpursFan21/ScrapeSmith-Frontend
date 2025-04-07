//Frontend\frontend\src\app\dashboard\completed-jobs\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ArrowTopRightOnSquareIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import axios from 'axios';
import clsx from 'clsx';
import { RootState } from '@/redux/store';

interface Job {
  order_id: string;
  url: string;
  created_at: string;
  analysis_type: string;
}

export default function CompletedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!accessToken || accessToken.split('.').length !== 3) {
        console.warn('❌ No valid access token in Redux. Skipping API request.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:8000/users/me/completed-jobs', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setJobs(res.data);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [accessToken]);

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🧾 Completed Jobs</h1>

        {loading ? (
          <div className="text-gray-600 text-center mt-10 animate-pulse">Loading completed jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p>No jobs found yet. Start scraping to see results here!</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <Transition
                key={job.order_id}
                show={true}
                appear={true}
                enter="transition duration-300 ease-out"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
              >
                <li
                  className={clsx(
                    'bg-white p-5 shadow rounded-lg border border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center transition hover:shadow-md'
                  )}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-500">Order ID</p>
                    <p className="text-sm text-gray-800 break-all">{job.order_id}</p>
                    <p className="text-sm mt-2">
                      <span className="font-medium text-gray-500">Analysis Type:</span>{' '}
                      <span className="text-blue-600">{job.analysis_type}</span>
                    </p>
                  </div>

                  <div className="mt-4 md:mt-0 md:text-right">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-indigo-600 hover:underline"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-1" />
                      View Source
                    </a>
                    <div className="flex items-center justify-end mt-2 text-gray-500 text-sm">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {new Date(job.created_at).toLocaleString()}
                    </div>
                  </div>
                </li>
              </Transition>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


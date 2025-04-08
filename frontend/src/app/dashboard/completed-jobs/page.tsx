// Frontend\frontend\src\app\dashboard\completed-jobs\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ArrowTopRightOnSquareIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';
import axios from 'axios';
import clsx from 'clsx';
import { RootState } from '@/redux/store';

interface Job {
  order_id: string;
  user_id: string;
  created_at: string | Date;
  url: string;
  analysis_type: string;
  custom_script?: string;
}

export default function CompletedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const fetchJobs = async () => {
      if (!accessToken || accessToken.split('.').length !== 3) {
        console.warn('No valid access token in Redux. Skipping API request.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:8000/users/me/completed-jobs', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (Array.isArray(res.data)) {
          setJobs(res.data);
        } else {
          console.error('Unexpected API response format:', res.data);
          setJobs([]);
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [accessToken]);

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-xl border-2 border-amber-600 bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg p-8 mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-amber-500 tracking-tight mb-2">
            Completed Jobs
          </h1>
          <p className="text-sm text-gray-400">
            All the jobs you’ve forged in the data furnace.
          </p>
        </div>

        {loading ? (
          <div className="text-amber-400 text-center mt-10 animate-pulse">
            Loading completed jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-400 mt-16">
            <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-600 mb-2" />
            <p>No jobs found yet. Start scraping to forge some results.</p>
          </div>
        ) : (
          <ul className="space-y-5 bg-gray-900 p-6 rounded-lg border border-gray-700 shadow-inner">
            {jobs.map((job, index) => {
              const key = job.order_id || `job-${index}`;
              const displayURL = job.url
                ? job.url.length > 80
                  ? `${job.url.slice(0, 80)}...`
                  : job.url
                : 'No URL provided';

              return (
                <Transition
                  key={key}
                  show={true}
                  appear={true}
                  enter="transition duration-300 ease-out"
                  enterFrom="opacity-0 translate-y-2"
                  enterTo="opacity-100 translate-y-0"
                >
                  <li>
                    <div
                      onClick={() => job.order_id && router.push(`/dashboard/completed-jobs/order-details/${job.order_id}`)}
                      className={clsx(
                        'cursor-pointer bg-gradient-to-tr from-gray-800 to-gray-700 border border-gray-600 text-gray-200 p-5 shadow-lg rounded-lg flex flex-col md:flex-row md:justify-between md:items-center hover:border-amber-500 hover:shadow-amber-600/40 transition-all duration-300'
                      )}
                    >
                      <div className="w-full md:w-2/3">
                        <p className="text-sm font-semibold text-amber-400">Order ID</p>
                        <p className="text-sm text-gray-100 break-all">
                          {job.order_id || 'N/A'}
                        </p>

                        <p className="text-sm font-medium text-gray-400 mt-3">URL</p>
                        <p className="text-sm text-blue-300 break-words underline underline-offset-2 decoration-dotted">
                          {displayURL}
                        </p>

                        <p className="text-sm mt-3">
                          <span className="font-medium text-gray-400">Analysis Type:</span>{' '}
                          <span className="text-amber-500">{job.analysis_type || 'N/A'}</span>
                        </p>
                      </div>

                      <div className="mt-4 md:mt-0 md:text-right">
                        <a
                          href={job.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            if (!job.url) e.preventDefault();
                            e.stopPropagation();
                          }}
                          className={clsx(
                            'inline-flex items-center text-sm hover:underline',
                            job.url ? 'text-amber-400 hover:text-amber-500' : 'text-gray-500 cursor-not-allowed'
                          )}
                        >
                          <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-1" />
                          View Source
                        </a>
                        {isClient && (
                          <div className="flex items-center justify-end mt-2 text-gray-400 text-sm">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {job.created_at
                              ? new Date(job.created_at).toLocaleString()
                              : 'Unknown Date'}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                </Transition>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}






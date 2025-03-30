// frontend\src\app\page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Transition } from '@headlessui/react';
import Lottie from 'lottie-react';
import animationData from '../../public/lottie-ai-animation.json';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const taglines = [
  'Automated Web Scraping',
  'Data Cleaning with Precision',
  'AI-Powered Analysis',
  'Insightful Reports in Seconds',
  'Microservice Architecture at Scale',
];

const Home: React.FC = () => {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Trigger client-only rendering for Lottie & Particles
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* 🌌 Particles (client only) */}
      {mounted && (
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: { enable: false },
            background: { color: { value: 'transparent' } },
            particles: {
              number: { value: 60, density: { enable: true, area: 800 } },
              color: { value: '#fbbf24' },
              shape: { type: 'circle' },
              opacity: { value: 0.2 },
              size: { value: 4, random: true },
              move: {
                enable: true,
                speed: 1,
                direction: 'none',
                outModes: { default: 'bounce' },
              },
            },
            interactivity: {
              events: {
                onHover: { enable: true, mode: 'repulse' },
                resize: true,
              },
              modes: { repulse: { distance: 100, duration: 0.4 } },
            },
            detectRetina: true,
          }}
          className="absolute inset-0 z-0"
        />
      )}

      <main className="relative z-10 flex flex-col items-center justify-center text-center py-20 px-6">

        {/* 🤖 Lottie Animation */}
        {mounted && (
          <div className="mb-10">
            <Lottie animationData={animationData} loop className="w-56 h-56 mx-auto" />
          </div>
        )}

        {/* 🧊 Glassy Banner */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-10 rounded-3xl shadow-2xl max-w-2xl w-full border border-gray-600">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
            Welcome to ScrapeSmith
          </h1>

          <div className="relative w-full h-10 mb-6">
            {taglines.map((tagline, index) => (
              <Transition
                key={index}
                show={currentTagline === index}
                enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <p className="absolute inset-0 text-xl text-amber-400 font-mono tracking-wide">
                  {tagline}
                </p>
              </Transition>
            ))}
          </div>

          <p className="text-lg text-gray-300 mb-8">
            Forge raw web data into clean, structured, and insightful intelligence.
          </p>

          <div className="flex justify-center space-x-4">
            <Link href="/login">
              <button
                className="relative px-6 py-3 bg-amber-600 text-white font-semibold rounded-full shadow-lg overflow-hidden group transition duration-300 ease-in-out hover:scale-105"
                data-twe-ripple-init
              >
                Login
              </button>
            </Link>
            <Link href="/register">
              <button
                className="relative px-6 py-3 bg-gray-700 text-white font-semibold rounded-full shadow-lg overflow-hidden group transition duration-300 ease-in-out hover:scale-105"
                data-twe-ripple-init
              >
                Register
              </button>
            </Link>
          </div>
        </div>

        {/* 📚 Description */}
        <div className="mt-12 max-w-3xl text-gray-400 text-sm sm:text-base leading-relaxed">
          <p className="mb-3">
            ScrapeSmith is your one-stop platform for automated data extraction, intelligent cleaning, and AI-powered analysis.
            Built on a scalable microservice architecture, it's designed for developers, researchers, and data-driven businesses.
          </p>
          <p>
            Whether you're monitoring competitors, gathering market trends, or building custom datasets — ScrapeSmith helps you
            turn the messy web into structured, actionable data.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;

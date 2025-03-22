// src/app/_components/Footer.tsx
"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto text-center">
        © {new Date().getFullYear()} ScrapeSmith. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

"use client";

import React from 'react';

// The main page component for the "Coming Soon" page.
// This component will be rendered by Next.js as the default home page.
export default function App() {
  return (
    // The main container for the page.
    // It uses Tailwind CSS to set a dark background, ensure the content fills the viewport,
    // and center the text both horizontally and vertically.
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      
      {/* The content container with a centered text alignment. */}
      <div className="text-center">
        
        {/* The main heading with a large, bold font for emphasis. */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Coming Soon
        </h1>
        
        {/* A simple subtitle to add a little more context. */}
        <p className="mt-4 text-lg sm:text-xl md:text-2xl font-light text-gray-400">
          Our website is currently under development
        </p>
      </div>
      
    </div>
  );
}

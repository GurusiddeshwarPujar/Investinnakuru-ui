// src/app/(admin-auth)/layout.tsx
// This layout is specifically for admin authentication pages like login and signup.
// It will NOT include the main admin dashboard header/sidebar components.

import '../../globals.css'; // Import global styles if needed for these pages
// import { Inter } from 'next/font/google'; // Example font import if you use it

import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext"; // Assuming this is your context provider
import Image from "next/image";
import Link from "next/link";
import React from "react";

// const inter = Inter({ subsets: ['latin'] }); // Example font usage

export const metadata = {
  title: 'Admin Login', // Specific title for admin auth pages
  description: 'Admin authentication pages for your application.',
};

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
          {children} {/* This is where your login/signup form will be rendered */}
          <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center flex z-1">
              {/* */}
              <GridShape />
              <div className="flex flex-col items-center max-w-xs">
                <Link href="/" className="block mb-4">
                  <Image
                    width={231}
                    height={32}
                    src="/images/logo/auth-logo.svg"
                    alt="Logo"
                  />
                </Link>
                <p className="text-center text-gray-400 dark:text-white/60">
             
                </p>
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-t from-[#1488CC]/40 to-white p-6">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 p-8 items-center">
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#1488CC] to-[#2B32B2] bg-clip-text text-transparent leading-tight"
            >
              Oops — Page not found
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.4 }}
              className="text-sm sm:text-base text-gray-700"
            >
              The page you’re looking for doesn’t exist or has moved.
            </motion.p>

            <div className="flex gap-4">
              <button
                onClick={handleGoBack}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1488CC] to-[#2B32B2] text-white hover:opacity-90 transition"
              >
                Go Back
              </button>
              <Link
                href="/"
                className="px-5 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
              >
                Home
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <motion.img
              src="https://cdn.dribbble.com/userupload/21373125/file/original-f5e997f969963006e96ff5a9e7f7dbe9.gif"
              alt="Not found"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-h-64 object-contain"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
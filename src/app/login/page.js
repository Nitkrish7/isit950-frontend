"use client"; // Required for client-side interactivity

import { Suspense } from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Staytion
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md">
          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>
          <div className="mt-6 text-center">
            <Link href="/" className="text-indigo-600 hover:underline">
              Back to Landing Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

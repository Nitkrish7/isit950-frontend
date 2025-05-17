"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">
                  Staytion
                </span>
              </div>
            </div>
            <div className="flex items-center">
              {user ? (
                <Link
                  href="/profile"
                  className="flex items-center text-gray-700 hover:text-indigo-600"
                >
                  <span className="mr-2">{user.name}</span>
                  <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center text-gray-700 hover:text-indigo-600"
                >
                  <span className="mr-2">Sign In</span>
                  <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">?</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to Staytion
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Manage your hotels and bookings with ease.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href={user ? "/home" : "/login"}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Features
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">
                Easy Booking
              </h3>
              <p className="mt-2 text-gray-500">
                Book your stay with just a few clicks.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">
                Manage Hotels
              </h3>
              <p className="mt-2 text-gray-500">
                Easily manage your hotel listings and availability.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">
                User Profiles
              </h3>
              <p className="mt-2 text-gray-500">
                Keep track of your bookings and preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Testimonials
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">
                "This platform made managing my hotel bookings so much easier!"
              </p>
              <p className="mt-2 font-medium text-gray-900">- John Doe</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">
                "I love how user-friendly the interface is. Highly recommend!"
              </p>
              <p className="mt-2 font-medium text-gray-900">- Jane Smith</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">
                "The best hotel management system I've ever used."
              </p>
              <p className="mt-2 font-medium text-gray-900">- Alice Johnson</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

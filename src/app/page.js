"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { FaHotel, FaUserCircle, FaArrowRight } from "react-icons/fa";

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
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Find Your Perfect Stay
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Discover amazing hotels or list your property with our platform
          </p>

          {/* Dual CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={user ? "/home" : "/login"}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
            >
              <FaUserCircle className="mr-2" />
              Traveler? Get Started Here
              <FaArrowRight className="ml-2" />
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 shadow-sm transition-all"
            >
              <FaHotel className="mr-2" />
              Hotel Owner? List Your Property
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Why Choose Staytion?
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">
                <FaUserCircle className="inline mr-2 text-indigo-600" />
                Easy Booking
              </h3>
              <p className="mt-2 text-gray-500">
                Book your stay with just a few clicks. Our intuitive interface
                makes finding the perfect hotel effortless.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">
                <FaHotel className="inline mr-2 text-indigo-600" />
                Hotel Management
              </h3>
              <p className="mt-2 text-gray-500">
                Powerful tools to manage your property, bookings, and
                availability all in one place.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">
                <FaUserCircle className="inline mr-2 text-indigo-600" />
                Personalized Experience
              </h3>
              <p className="mt-2 text-gray-500">
                Tailored recommendations and preferences for every traveler.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-indigo-600 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to get started?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-indigo-100">
            Join thousands of travelers and hotel owners who trust Staytion for
            their accommodation needs.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={user ? "/home" : "/login"}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 shadow-sm transition-all"
            >
              <FaUserCircle className="mr-2" />
              Find Hotels
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-700 shadow-sm transition-all"
            >
              <FaHotel className="mr-2" />
              List Your Property
            </Link>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            What Our Users Say
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <p className="text-gray-500 italic">
                "This platform made managing my hotel bookings so much easier!
                The interface is intuitive and the support team is fantastic."
              </p>
              <p className="mt-4 font-medium text-gray-900">
                - John Doe, Traveler
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <p className="text-gray-500 italic">
                "As a hotel owner, Staytion has simplified my operations and
                increased my bookings significantly."
              </p>
              <p className="mt-4 font-medium text-gray-900">
                - Jane Smith, Hotel Owner
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <p className="text-gray-500 italic">
                "The best hotel management system I've ever used. Both as a
                guest and property manager."
              </p>
              <p className="mt-4 font-medium text-gray-900">- Alice Johnson</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">
              © {new Date().getFullYear()} Staytion. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

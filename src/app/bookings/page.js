"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { userAPI } from "@/lib/api";
import UserNavbar from "@/components/UserNavbar";
import {
  FaHotel,
  FaBed,
  FaCalendarAlt,
  FaUserFriends,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import { format } from "date-fns";
import Link from "next/link";

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError("");
      try {
        if (user?.id) {
          const data = await userAPI.listBookings(user.id);
          setBookings(data);
        }
      } catch (err) {
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString.slice(0, 10);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaRegCalendarCheck className="text-indigo-600" />
            My Bookings
            {bookings.length > 0 && (
              <span className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full ml-auto">
                {bookings.length}{" "}
                {bookings.length === 1 ? "booking" : "bookings"}
              </span>
            )}
          </h1>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center p-6">
              <FiAlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {error}
              </h3>
              <p className="text-gray-500">
                Please try refreshing the page or contact support
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center p-6">
              <FaRegCalendarCheck className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-500 mb-4">
                Your upcoming stays will appear here
              </p>
              <Link
                href="/home"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse Hotels
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/hotel/${booking.hotel?.id || booking.hotelid}`}
                  className="block hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <div className="p-6 flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-lg">
                      <FaHotel className="text-indigo-600 text-2xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-2">
                        <h3 className="text-lg font-bold text-indigo-700 truncate">
                          {booking.hotel?.name || "Hotel"}
                        </h3>
                        <span className="text-sm text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {booking.status || "Confirmed"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <FaBed className="text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Room Type</p>
                            <p className="font-medium">
                              {booking.room?.name || "-"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <FaCalendarAlt className="text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Dates</p>
                            <p className="font-medium">
                              {formatDate(booking.startdate)} →{" "}
                              {formatDate(booking.enddate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <FaUserFriends className="text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Guests</p>
                            <p className="font-medium">
                              {booking.no_of_guests || "-"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <svg
                              className="w-4 h-4 text-indigo-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="font-medium">
                              ${booking.total_price?.toLocaleString() || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { userAPI } from "@/lib/api";
import UserNavbar from "@/components/UserNavbar";
import { FaHotel, FaBed, FaCalendarAlt, FaUserFriends } from "react-icons/fa";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="text-gray-500">You have no bookings.</div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6 border border-indigo-100 hover:shadow-xl transition"
              >
                <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-full">
                  <FaHotel className="text-indigo-600 text-3xl" />
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold text-indigo-700">
                      {booking.hotel?.name || "Hotel"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FaBed className="text-indigo-400 mr-1" />
                    <span className="font-medium">Room:</span>
                    <span>{booking.room?.name || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FaCalendarAlt className="text-indigo-400 mr-1" />
                    <span className="font-medium">Dates:</span>
                    <span>{booking.startdate?.slice(0, 10)}</span>
                    <span className="mx-1">→</span>
                    <span>{booking.enddate?.slice(0, 10)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUserFriends className="text-indigo-400 mr-1" />
                    <span className="font-medium">Guests:</span>
                    <span>{booking.no_of_guests}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

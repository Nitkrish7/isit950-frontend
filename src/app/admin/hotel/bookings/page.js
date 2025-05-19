"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { useHotelAdmin } from "@/context/HotelAdminContext";

export default function HotelBookingsPage() {
  const { adminId, hotelId, loading: contextLoading } = useHotelAdmin();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hotelId) return;
    const fetchBookings = async () => {
      try {
        const bookingsRes = await adminAPI.listBookingsByHotel(hotelId);
        setBookings(bookingsRes);
      } catch (err) {
        setError("Failed to load bookings");
      }
    };
    fetchBookings();
  }, [hotelId]);

  if (contextLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-6 sm:mb-8">
        Bookings
      </h1>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded max-w-xl w-full">
          {error}
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden w-full mx-auto">
        <table className="w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Booking Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Room Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Room Count
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Guests
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 sm:px-6 py-4 text-center text-gray-500"
                >
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 sm:px-6 py-4">
                    {booking.user?.name || "-"}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    {booking.room?.name || "-"}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    {new Date(booking.startdate).toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    {new Date(booking.enddate).toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4">{booking.booking_count}</td>
                  <td className="px-4 sm:px-6 py-4">{booking.no_of_guests}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { useHotelAdmin } from "@/context/HotelAdminContext";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

export default function HotelBookingsPage() {
  const { adminId, hotelId, loading: contextLoading } = useHotelAdmin();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState("");
  const [ratingError, setRatingError] = useState("");

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

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setRating(booking.user?.rating || 0);
    setModalOpen(true);
    setRatingSuccess("");
    setRatingError("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
    setRating(0);
    setRatingSuccess("");
    setRatingError("");
  };

  const handleRateCustomer = async () => {
    const customerId =
      selectedBooking?.bookinguserid || selectedBooking?.user?.id;
    if (!customerId || !rating) return;
    setRatingLoading(true);
    setRatingError("");
    setRatingSuccess("");
    try {
      await adminAPI.rateCustomer(customerId, rating);
      setRatingSuccess("Customer rated successfully!");
    } catch (err) {
      setRatingError("Failed to rate customer");
    } finally {
      setRatingLoading(false);
    }
  };

  const handleDeclineBooking = async () => {
    if (!selectedBooking) return;
    if (!window.confirm("Are you sure you want to decline this booking?"))
      return;
    try {
      await adminAPI.declineBooking(selectedBooking.id);
      // Send decline email
      await emailjs.send(
        "service_e1ehk0o",
        "template_g6u3jjh",
        {
          name: selectedBooking.user?.name || "Guest",
          hotelName: selectedBooking.room?.hotel?.name || "Hotel",
          startDate: new Date(selectedBooking.startdate).toLocaleDateString(),
          endDate: new Date(selectedBooking.enddate).toLocaleDateString(),
          email: selectedBooking.user?.email || "",
        },
        { publicKey: "ks7n0G36jNygKn6ny" }
      );
      toast.success("Booking declined successfully!");
      // Refresh bookings
      if (hotelId) {
        const bookingsRes = await adminAPI.listBookingsByHotel(hotelId);
        setBookings(bookingsRes);
      }
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to decline booking");
    }
  };

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
                <tr
                  key={booking.id}
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => openModal(booking)}
                >
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

      {/* Booking Details & Rate Modal */}
      {modalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl rounded-full p-2"
              onClick={closeModal}
            >
              &times;
            </button>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Booking Details
              </h3>
              <div className="mb-4 space-y-1 text-gray-700">
                <div>
                  <span className="font-semibold">Room:</span>{" "}
                  {selectedBooking.room?.name || "-"}
                </div>
                <div>
                  <span className="font-semibold">Start Date:</span>{" "}
                  {new Date(selectedBooking.startdate).toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold">End Date:</span>{" "}
                  {new Date(selectedBooking.enddate).toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold">Guests:</span>{" "}
                  {selectedBooking.no_of_guests}
                </div>
                <div>
                  <span className="font-semibold">Customer:</span>{" "}
                  {selectedBooking.user?.name || "-"} (
                  {selectedBooking.user?.email || "-"})
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Rate Customer</h4>
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`text-2xl ${
                        rating >= star ? "text-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => setRating(star)}
                      disabled={ratingLoading}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleRateCustomer}
                  disabled={ratingLoading || !rating}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  {ratingLoading ? (
                    <span className="inline-flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Rating"
                  )}
                </button>
                <button
                  onClick={handleDeclineBooking}
                  className="mt-4 w-full px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Decline Booking
                </button>
                {ratingSuccess && (
                  <div className="text-green-600 mt-2">{ratingSuccess}</div>
                )}
                {ratingError && (
                  <div className="text-red-600 mt-2">{ratingError}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

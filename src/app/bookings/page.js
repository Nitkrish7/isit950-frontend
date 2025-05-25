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
import { FiAlertCircle, FiMoreVertical } from "react-icons/fi";
import { format } from "date-fns";
import Link from "next/link";
import toast from "react-hot-toast";

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // For modify modal
  const [showDropdown, setShowDropdown] = useState(null); // booking id
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newCheckin, setNewCheckin] = useState("");
  const [newCheckout, setNewCheckout] = useState("");
  const [modifying, setModifying] = useState(false);

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

  const handleModifyClick = (booking) => {
    setSelectedBooking(booking);
    setNewCheckin(booking.startdate?.slice(0, 10) || "");
    setNewCheckout(booking.enddate?.slice(0, 10) || "");
    setShowModal(true);
    setShowDropdown(null);
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    setModifying(true);
    try {
      await userAPI.updateBooking({
        id: selectedBooking.id,
        startdate: newCheckin + " 00:03:44",
        enddate: newCheckout + " 00:03:44",
      });
      toast.success("Booking updated successfully!");
      // Refresh bookings
      if (user?.id) {
        const data = await userAPI.listBookings(user.id);
        setBookings(data);
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to update booking");
    } finally {
      setModifying(false);
    }
  };

  const handleCancelBooking = async (booking) => {
    setShowDropdown(null);
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    try {
      await userAPI.cancelBooking(booking.id);
      toast.success("Booking cancelled successfully!");
      // Refresh bookings
      if (user?.id) {
        const data = await userAPI.listBookings(user.id);
        setBookings(data);
      }
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  // Helper to calculate nights between two dates
  const getNights = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    // Calculate difference in milliseconds, then convert to days
    const diffTime = endDate - startDate;
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
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
                <div key={booking.id} className="relative group">
                  {/* Three dots menu */}
                  <button
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowDropdown(
                        showDropdown === booking.id ? null : booking.id
                      );
                    }}
                  >
                    <FiMoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                  {/* Dropdown */}
                  {showDropdown === booking.id && (
                    <div className="absolute top-12 right-4 z-10 bg-white border border-gray-200 rounded-lg shadow-lg w-40">
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50"
                        onClick={() => handleModifyClick(booking)}
                      >
                        Modify Booking
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        onClick={() => handleCancelBooking(booking)}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                  <Link
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
                                {(() => {
                                  const nights = getNights(
                                    booking.startdate,
                                    booking.enddate
                                  );
                                  const price =
                                    (booking.room?.price || 0) *
                                    (booking.booking_count || 1) *
                                    nights;
                                  return price
                                    ? `$${price.toLocaleString()}`
                                    : "-";
                                })()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Modify Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl rounded-full p-2"
              onClick={() => setShowModal(false)}
              disabled={modifying}
            >
              &times;
            </button>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Modify Booking
              </h3>
              <form onSubmit={handleUpdateBooking} className="space-y-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={newCheckin}
                    onChange={(e) => setNewCheckin(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={modifying}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={newCheckout}
                    onChange={(e) => setNewCheckout(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={modifying}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                  disabled={modifying}
                >
                  {modifying ? (
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
                      Updating...
                    </span>
                  ) : (
                    "Update Booking"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { useHotelAdmin } from "@/context/HotelAdminContext";

const TIMEFRAMES = [
  { label: "1 Week", days: 7 },
  { label: "1 Month", days: 30 },
  { label: "6 Months", days: 182 },
  { label: "1 Year", days: 365 },
  { label: "Custom", days: null },
];

export default function HotelRoomsPage() {
  const { adminId, hotelId, loading: contextLoading } = useHotelAdmin();
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    count: "",
    no_of_guests: "",
    price: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockError, setBlockError] = useState("");
  const [blockSuccess, setBlockSuccess] = useState("");
  const [blockedDates, setBlockedDates] = useState([]);
  const [blockedLoading, setBlockedLoading] = useState(false);
  const [blockedError, setBlockedError] = useState("");
  const [blockedTimeframe, setBlockedTimeframe] = useState(TIMEFRAMES[1]);
  const [blockedCustomStart, setBlockedCustomStart] = useState("");
  const [blockedCustomEnd, setBlockedCustomEnd] = useState("");
  const [showBlocked, setShowBlocked] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [bookedLoading, setBookedLoading] = useState(false);
  const [bookedError, setBookedError] = useState("");
  const [bookedTimeframe, setBookedTimeframe] = useState(TIMEFRAMES[1]);
  const [bookedCustomStart, setBookedCustomStart] = useState("");
  const [bookedCustomEnd, setBookedCustomEnd] = useState("");
  const [showBooked, setShowBooked] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewRoom, setViewRoom] = useState(null);

  useEffect(() => {
    if (!hotelId) return;
    const fetchRooms = async () => {
      try {
        const roomsRes = await adminAPI.listRooms(hotelId);
        setRooms(roomsRes);
      } catch (err) {
        setError("Failed to load rooms");
      }
    };
    fetchRooms();
  }, [hotelId]);

  const refreshRooms = async () => {
    try {
      const roomsRes = await adminAPI.listRooms(hotelId);
      setRooms(roomsRes);
    } catch (err) {
      setError("Failed to refresh rooms");
    }
  };

  const handleOpenModal = (room = null) => {
    if (room) {
      setForm({
        id: room.id,
        name: room.name,
        count: room.count,
        no_of_guests: room.no_of_guests,
        price: room.price,
      });
      setEditMode(true);
      setActiveRoomId(room.id);
    } else {
      setForm({ id: "", name: "", count: "", no_of_guests: "", price: "" });
      setEditMode(false);
      setActiveRoomId(null);
    }
    setShowModal(true);
    setError("");
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      if (editMode) {
        const payload = {
          id: form.id,
          name: form.name,
          hotelid: hotelId,
          count: Number(form.count),
          no_of_guests: Number(form.no_of_guests),
          price: Number(form.price),
        };
        await adminAPI.updateRoom(payload);
      } else {
        const payload = {
          name: form.name,
          hotelid: hotelId,
          count: Number(form.count),
          no_of_guests: Number(form.no_of_guests),
          price: Number(form.price),
        };
        await adminAPI.createRoom(payload);
      }
      setShowModal(false);
      await refreshRooms();
    } catch (err) {
      setError(err.message || "Failed to save room");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (roomId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this room? This action cannot be undone."
      )
    )
      return;
    setIsDeleting(true);
    setError("");
    try {
      await adminAPI.deleteRoom(roomId);
      await refreshRooms();
    } catch (err) {
      setError("Failed to delete room");
    } finally {
      setIsDeleting(false);
    }
  };

  const openBlockModal = () => {
    setBlockModalOpen(true);
    setBlockStart("");
    setBlockEnd("");
    setBlockError("");
    setBlockSuccess("");
  };

  const closeBlockModal = () => setBlockModalOpen(false);

  const handleBlockSubmit = async (e) => {
    e.preventDefault();
    setBlockLoading(true);
    setBlockError("");
    setBlockSuccess("");
    try {
      await adminAPI.blockRoomDates(activeRoomId, blockStart, blockEnd);
      setBlockSuccess("Dates blocked successfully!");
      setBlockModalOpen(false);
    } catch (err) {
      setBlockError("Failed to block dates");
    } finally {
      setBlockLoading(false);
    }
  };

  const fetchBlockedDates = async () => {
    setBlockedLoading(true);
    setBlockedError("");
    setBlockedDates([]);
    let start, end;
    if (blockedTimeframe.days) {
      start = new Date();
      end = new Date(Date.now() + blockedTimeframe.days * 24 * 60 * 60 * 1000);
    } else {
      start = new Date(blockedCustomStart);
      end = new Date(blockedCustomEnd);
    }
    try {
      const res = await adminAPI.getBlockedDates(
        activeRoomId,
        start.toISOString(),
        end.toISOString()
      );
      setBlockedDates(res);
      setShowBlocked(true);
    } catch (err) {
      setBlockedError("Failed to fetch blocked dates");
    } finally {
      setBlockedLoading(false);
    }
  };

  const fetchBookedDates = async () => {
    setBookedLoading(true);
    setBookedError("");
    setBookedDates([]);
    let start, end;
    if (bookedTimeframe.days) {
      start = new Date();
      end = new Date(Date.now() + bookedTimeframe.days * 24 * 60 * 60 * 1000);
    } else {
      start = new Date(bookedCustomStart);
      end = new Date(bookedCustomEnd);
    }
    try {
      const res = await adminAPI.getBookedDates(
        activeRoomId,
        start.toISOString(),
        end.toISOString()
      );
      setBookedDates(res);
      setShowBooked(true);
    } catch (err) {
      setBookedError("Failed to fetch booked dates");
    } finally {
      setBookedLoading(false);
    }
  };

  const handleViewRoom = (room) => {
    setViewRoom(room);
    setActiveRoomId(room.id);
    setShowViewModal(true);
    setBlockedTimeframe(TIMEFRAMES[1]);
    setBookedTimeframe(TIMEFRAMES[1]);
    setShowBlocked(false);
    setShowBooked(false);
  };

  if (contextLoading)
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Room Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all rooms for your hotel
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
            onClick={() => handleOpenModal()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Room
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Guests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rooms.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No rooms found. Add your first room to get started.
                    </td>
                  </tr>
                ) : (
                  rooms.map((room) => (
                    <tr
                      key={room.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {room.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{room.count}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{room.no_of_guests}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900 font-medium">
                          ${room.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewRoom(room)}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View
                          </button>
                          <button
                            onClick={() => handleOpenModal(room)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(room.id)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editMode ? "Edit Room" : "Add New Room"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Deluxe Suite"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="count"
                      value={form.count}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Guests
                    </label>
                    <input
                      type="number"
                      name="no_of_guests"
                      value={form.no_of_guests}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Night
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="199.99"
                    />
                  </div>
                </div>

                {editMode && (
                  <>
                    <div className="mt-6">
                      <button
                        type="button"
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600"
                        onClick={openBlockModal}
                      >
                        Block Dates
                      </button>
                    </div>
                  </>
                )}

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mt-0.5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <svg
                        className="animate-spin -ml-1 mr-1 h-4 w-4 text-white"
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
                    )}
                    {isSubmitting
                      ? editMode
                        ? "Saving..."
                        : "Adding..."
                      : editMode
                      ? "Save Changes"
                      : "Add Room"}
                  </button>
                </div>
              </form>
            </div>
            {/* Block Dates Modal (move outside the form) */}
            {blockModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl rounded-full p-2"
                    onClick={closeBlockModal}
                    disabled={blockLoading}
                  >
                    &times;
                  </button>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Block Dates for Room
                    </h3>
                    <form onSubmit={handleBlockSubmit} className="space-y-5">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={blockStart}
                          onChange={(e) => setBlockStart(e.target.value)}
                          required
                          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={blockLoading}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={blockEnd}
                          onChange={(e) => setBlockEnd(e.target.value)}
                          required
                          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={blockLoading}
                        />
                      </div>
                      {blockError && (
                        <div className="text-red-600 text-sm">{blockError}</div>
                      )}
                      {blockSuccess && (
                        <div className="text-green-600 text-sm">
                          {blockSuccess}
                        </div>
                      )}
                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                        disabled={blockLoading}
                      >
                        {blockLoading ? (
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
                            Blocking...
                          </span>
                        ) : (
                          "Block Dates"
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewRoom && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Room Details
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Room Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">
                    Room Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Room Name</p>
                      <p className="font-medium">{viewRoom.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-medium">{viewRoom.count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Max Guests</p>
                      <p className="font-medium">{viewRoom.no_of_guests}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price per Night</p>
                      <p className="font-medium">
                        ${viewRoom.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Blocked Dates Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Blocked Dates</h3>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {TIMEFRAMES.map((tf) => (
                      <button
                        key={tf.label}
                        type="button"
                        className={`px-3 py-1 rounded-lg border ${
                          blockedTimeframe.label === tf.label
                            ? "bg-yellow-100 border-yellow-400"
                            : "bg-white border-gray-300"
                        }`}
                        onClick={() => setBlockedTimeframe(tf)}
                      >
                        {tf.label}
                      </button>
                    ))}
                  </div>
                  {blockedTimeframe.label === "Custom" && (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="date"
                        value={blockedCustomStart}
                        onChange={(e) => setBlockedCustomStart(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                      <input
                        type="date"
                        value={blockedCustomEnd}
                        onChange={(e) => setBlockedCustomEnd(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600"
                    onClick={fetchBlockedDates}
                  >
                    Show Blocked Dates
                  </button>
                  {blockedLoading && (
                    <div className="mt-2 text-sm">Loading...</div>
                  )}
                  {blockedError && (
                    <div className="mt-2 text-red-600 text-sm">
                      {blockedError}
                    </div>
                  )}
                  {showBlocked && (
                    <div className="mt-2">
                      {blockedDates.length === 0 ? (
                        <div className="text-gray-500 text-sm">
                          No dates are blocked in the selected timeframe.
                        </div>
                      ) : (
                        <ul className="text-sm text-gray-800 list-disc ml-5">
                          {blockedDates.map((date) => (
                            <li key={date}>{date}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {/* Booked Dates Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Booked Dates</h3>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {TIMEFRAMES.map((tf) => (
                      <button
                        key={tf.label}
                        type="button"
                        className={`px-3 py-1 rounded-lg border ${
                          bookedTimeframe.label === tf.label
                            ? "bg-green-100 border-green-400"
                            : "bg-white border-gray-300"
                        }`}
                        onClick={() => setBookedTimeframe(tf)}
                      >
                        {tf.label}
                      </button>
                    ))}
                  </div>
                  {bookedTimeframe.label === "Custom" && (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="date"
                        value={bookedCustomStart}
                        onChange={(e) => setBookedCustomStart(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                      <input
                        type="date"
                        value={bookedCustomEnd}
                        onChange={(e) => setBookedCustomEnd(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
                    onClick={fetchBookedDates}
                  >
                    Show Booked Dates
                  </button>
                  {bookedLoading && (
                    <div className="mt-2 text-sm">Loading...</div>
                  )}
                  {bookedError && (
                    <div className="mt-2 text-red-600 text-sm">
                      {bookedError}
                    </div>
                  )}
                  {showBooked && (
                    <div className="mt-2">
                      {bookedDates.length === 0 ? (
                        <div className="text-gray-500 text-sm">
                          No dates are booked in the selected timeframe.
                        </div>
                      ) : (
                        <ul className="text-sm text-gray-800 list-disc ml-5">
                          {bookedDates.map((date) => (
                            <li key={date}>{date}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

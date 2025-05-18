"use client";
import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { useHotelAdmin } from "@/context/HotelAdminContext";

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
    } else {
      setForm({ id: "", name: "", count: "", no_of_guests: "", price: "" });
      setEditMode(false);
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

  if (contextLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-6 sm:mb-8">
        Room Management
      </h1>
      <button
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 w-full sm:w-auto"
        onClick={() => handleOpenModal()}
      >
        + Add Room
      </button>
      <div className="bg-white rounded-lg shadow overflow-x-auto w-full max-w-4xl mx-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Number of Rooms
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Max Guests
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Price
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  {room.name}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  {room.count}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  {room.no_of_guests}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  ${room.price}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap flex flex-col sm:flex-row gap-2">
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    onClick={() => handleOpenModal(room)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleDelete(room.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-md mx-2">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              {editMode ? "Edit Room" : "Add New Room"}
            </h2>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Rooms
                </label>
                <input
                  type="number"
                  name="count"
                  value={form.count}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Guests per Room
                </label>
                <input
                  type="number"
                  name="no_of_guests"
                  value={form.no_of_guests}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Night
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {error && (
                <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
                  disabled={isSubmitting}
                >
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
        </div>
      )}
    </div>
  );
}

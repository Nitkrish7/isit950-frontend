"use client";
import { useState } from "react";

const dummyRooms = [
  { id: 1, type: "Deluxe Room", price: 120, status: "Available" },
  { id: 2, type: "Suite", price: 200, status: "Occupied" },
  { id: 3, type: "Standard Room", price: 90, status: "Available" },
];

export default function HotelRoomsPage() {
  const [rooms, setRooms] = useState(dummyRooms);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    type: "",
    price: "",
    status: "Available",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = () => {
    setForm({ type: "", price: "", status: "Available" });
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setRooms((prev) => [
        ...prev,
        { id: prev.length + 1, ...form, price: Number(form.price) },
      ]);
      setShowModal(false);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Room Management</h1>
      <button
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
        onClick={handleOpenModal}
      >
        + Add Room
      </button>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="px-6 py-4 whitespace-nowrap">{room.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">${room.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{room.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Room</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

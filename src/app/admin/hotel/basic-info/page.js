"use client";
import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { useHotelAdmin } from "@/context/HotelAdminContext";

export default function HotelAdminBasicInfoPage() {
  const { adminId, hotelId, loading: contextLoading } = useHotelAdmin();
  const [form, setForm] = useState({
    id: "",
    name: "",
    place: "",
    description: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hotelId) return;
    const fetchHotel = async () => {
      setLoading(true);
      try {
        const hotel = await adminAPI.getHotelDetails(hotelId);
        setForm({
          id: hotel.id,
          name: hotel.name || "",
          place: hotel.place || "",
          description: hotel.description || "",
          tags: hotel.tags || [],
        });
      } catch (err) {
        setError("Failed to load hotel details");
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [hotelId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const handleTagRemove = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");
    try {
      const payload = {
        id: form.id,
        name: form.name,
        place: form.place,
        description: form.description,
        tags: form.tags,
      };
      await adminAPI.updateHotel(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError("Failed to update hotel info");
    }
  };

  if (contextLoading || loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">
          Hotel Basic Info
        </h1>
        {success && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            Hotel info updated successfully!
          </div>
        )}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hotel Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Place
            </label>
            <input
              type="text"
              name="place"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.place}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add a tag"
              />
              <button
                onClick={handleTagAdd}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                type="button"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-2 text-indigo-500 hover:text-red-500"
                    onClick={() => handleTagRemove(tag)}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

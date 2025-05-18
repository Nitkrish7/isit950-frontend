"use client";
import { useState } from "react";
import { adminAPI } from "@/lib/api";

export default function HotelAdminOnboardingPage() {
  const [form, setForm] = useState({
    name: "",
    place: "",
    adminemail: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.place || !form.adminemail) {
      setError("Please fill in all required fields.");
      return;
    }
    try {
      const res = await adminAPI.requestOnboard({
        hotelname: form.name,
        location: form.place,
        hoteladminemail: form.adminemail,
        hoteldescription: form.message || null,
      });
      if (res && (res.id || res.hotelname)) {
        setSubmitted(true);
      } else {
        setError("Failed to submit onboarding request. Please try again.");
      }
    } catch (err) {
      setError("Failed to submit onboarding request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">
          Hotel Admin Onboarding
        </h1>
        {submitted ? (
          <div className="text-green-600 font-medium mb-4">
            Your onboarding request has been submitted! We will contact you
            soon.
          </div>
        ) : (
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
                Location
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
                Admin Email
              </label>
              <input
                type="email"
                name="adminemail"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.adminemail}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (optional)
              </label>
              <textarea
                name="message"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us about your hotel or any special requirements..."
              />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Request Onboarding
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

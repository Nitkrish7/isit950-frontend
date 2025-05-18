"use client";
import { useEffect, useState } from "react";
import { userAPI, adminAPI } from "@/lib/api";
import emailjs from "@emailjs/browser";

const TABS = { ACTIVE: "Active", PENDING: "Pending" };

const initialForm = {
  adminemail: "",
  name: "",
  place: "",
};

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState(TABS.ACTIVE);
  const [pending, setPending] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState("");
  const [viewRequest, setViewRequest] = useState(null);

  const fetchHotels = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await userAPI.listHotels();
      setHotels(data);
    } catch (err) {
      setError("Failed to load hotels list");
    } finally {
      setLoading(false);
    }
  };

  const fetchPending = async () => {
    setPendingLoading(true);
    setPendingError("");
    try {
      const data = await adminAPI.listOnboardRequests();
      setPending(data);
    } catch (err) {
      setPendingError("Failed to load pending requests");
    } finally {
      setPendingLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
    if (tab === TABS.PENDING) fetchPending();
    // eslint-disable-next-line
  }, [tab]);

  const handleOpenModal = () => {
    setForm(initialForm);
    setShowModal(true);
    setMessage("");
    setError("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");
    try {
      await adminAPI.createHotel(form);
      setMessage("Hotel created successfully!");
      setShowModal(false);
      await fetchHotels();
    } catch (err) {
      setError(err.message || "Failed to create hotel");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!viewRequest) return;
    setIsSubmitting(true);
    setMessage("");
    setError("");
    try {
      const payload = {
        adminemail: viewRequest.hoteladminemail,
        name: viewRequest.hotelname,
        place: viewRequest.location,
        description: viewRequest.hoteldescription,
        requestId: viewRequest.id,
      };
      const res = await adminAPI.createHotel(payload);

      // Check for required fields in response
      if (!res.email || !res.password) {
        setError("API did not return credentials. Please check backend.");
        setIsSubmitting(false);
        return;
      }

      await emailjs.send("service_3bufmww", "template_hcc1cyl", {
        email: res.email,
        password: res.password,
      }, {  publicKey: "D7yqutHMazalcl_0z" });
      setMessage("Hotel approved and email sent!");
      setViewRequest(null);
      fetchPending();
      fetchHotels();
    } catch (err) {
      setError(
        err?.message || JSON.stringify(err) || "Failed to approve hotel"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Hotels Management</h1>
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-t font-medium border-b-2 ${
            tab === TABS.ACTIVE
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setTab(TABS.ACTIVE)}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 rounded-t font-medium border-b-2 ${
            tab === TABS.PENDING
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setTab(TABS.PENDING)}
        >
          Pending
        </button>
      </div>
      {tab === TABS.ACTIVE && (
        <>
          <button
            className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700"
            onClick={handleOpenModal}
          >
            + Add Hotel
          </button>
          {message && (
            <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center text-gray-500">Loading hotels...</div>
          ) : hotels.length === 0 ? (
            <div className="text-center text-gray-500">No hotels found.</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Place
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hotels.map((hotel) => (
                    <tr key={hotel.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hotel.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hotel.place}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hotel.adminemail}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      {tab === TABS.PENDING && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {pendingLoading ? (
            <div className="text-center text-gray-500 p-8">
              Loading pending requests...
            </div>
          ) : pendingError ? (
            <div className="text-center text-red-600 p-8">{pendingError}</div>
          ) : pending.length === 0 ? (
            <div className="text-center text-gray-500 p-8">
              No pending requests.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hotel Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pending.map((req) => (
                  <tr key={req.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {req.hotelname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {req.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {req.hoteladminemail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        onClick={() => setViewRequest(req)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Hotel</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hotel Admin Email
                </label>
                <input
                  type="email"
                  name="adminemail"
                  value={form.adminemail}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hotel Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Place
                </label>
                <input
                  type="text"
                  name="place"
                  value={form.place}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {viewRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Pending Onboarding Request
            </h2>
            <div className="mb-2">
              <span className="font-medium">Hotel Name:</span>{" "}
              {viewRequest.hotelname}
            </div>
            <div className="mb-2">
              <span className="font-medium">Location:</span>{" "}
              {viewRequest.location}
            </div>
            <div className="mb-2">
              <span className="font-medium">Admin Email:</span>{" "}
              {viewRequest.hoteladminemail}
            </div>
            <div className="mb-4">
              <span className="font-medium">Description:</span>{" "}
              {viewRequest.hoteldescription || (
                <span className="italic text-gray-400">No description</span>
              )}
            </div>
            {error && (
              <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-2 p-2 bg-green-100 text-green-700 rounded">
                {message}
              </div>
            )}
            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleApprove}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Approving..." : "Approve"}
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setViewRequest(null)}
                disabled={isSubmitting}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

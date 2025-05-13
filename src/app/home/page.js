"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { userAPI } from "@/lib/api";

export default function UserHomePage() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
    fetchHotels();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">
            Welcome{user && user.name ? `, ${user.name}` : "!"}
          </h1>
          <p className="text-gray-600 text-lg">
            Explore our top hotels and book your next stay with ease.
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Featured Hotels
          </h2>
          {loading ? (
            <div className="text-center text-gray-500">Loading hotels...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : hotels.length === 0 ? (
            <div className="text-center text-gray-500">No hotels found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="border rounded-lg p-6 flex flex-col justify-between hover:shadow-lg transition-shadow bg-gray-50"
                >
                  <div>
                    <h3 className="text-xl font-bold text-indigo-700 mb-1">
                      {hotel.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{hotel.place}</p>
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium text-gray-700">4.5</span>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Admin: {hotel.adminemail}
                    </span>
                  </div>
                  <button className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

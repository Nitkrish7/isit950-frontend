"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { userAPI } from "@/lib/api";
import Link from "next/link";
import UserNavbar from "@/components/UserNavbar";

const mainImages = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  // Add more if you have more images
];

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
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
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
              {hotels.map((hotel, idx) => (
                <Link
                  href={`/hotel/${hotel.id}`}
                  key={hotel.id}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <img
                      src={`/images/hotels/main/${
                        mainImages[idx % mainImages.length]
                      }`}
                      alt={hotel.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = "/images/hotels/main/1.jpg";
                      }}
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        {/* Dummy rating: 4 out of 5 stars */}
                        {[...Array(4)].map((_, i) => (
                          <span key={i} className="text-yellow-400">
                            ★
                          </span>
                        ))}
                        <span className="text-gray-300">★</span>
                        <span className="ml-2 text-sm text-gray-600">4.0</span>
                      </div>
                      <p className="text-gray-600">{hotel.place}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

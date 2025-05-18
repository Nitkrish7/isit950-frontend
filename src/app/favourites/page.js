"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { userAPI } from "@/lib/api";
import UserNavbar from "@/components/UserNavbar";
import Link from "next/link";

export default function FavouritesPage() {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mainImages = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"];

  useEffect(() => {
    const fetchFavourites = async () => {
      setLoading(true);
      setError("");
      try {
        if (user?.id) {
          const data = await userAPI.listFavourites(user.id);
          setFavourites(data);
        }
      } catch (err) {
        setError("Failed to load favourites");
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8 mb-8">
          <h1 className="text-2xl font-bold mb-6">My Favourites</h1>
        </div>
        <div className="bg-white shadow rounded-lg p-8">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : favourites.length === 0 ? (
            <div className="text-gray-500">You have no favourite hotels.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favourites.map((hotel, idx) => (
                <Link
                  key={hotel.id}
                  href={`/hotel/${hotel.id}`}
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

"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { userAPI } from "@/lib/api";
import UserNavbar from "@/components/UserNavbar";
import Link from "next/link";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaRegStar,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";

export default function FavouritesPage() {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredHotel, setHoveredHotel] = useState(null);

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

  const handleRemoveFavourite = async (hotelId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await userAPI.removeFavourite(user.id, hotelId);
      setFavourites(favourites.filter((hotel) => hotel.id !== hotelId));
    } catch (err) {
      setError("Failed to remove favourite");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaHeart className="text-red-500" />
              My Favourites
            </h1>
            <span className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
              {favourites.length} {favourites.length === 1 ? "hotel" : "hotels"}
            </span>
          </div>
        </div>

        {/* Favourites List */}
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
          ) : favourites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center p-6">
              <FaRegHeart className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No favourites yet
              </h3>
              <p className="text-gray-500 mb-4">
                Save your favorite hotels by clicking the heart icon
              </p>
              <Link
                href="/home"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse Hotels
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {favourites.map((hotel, idx) => (
                <Link
                  key={hotel.id}
                  href={`/hotel/${hotel.id}`}
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-xl"
                  onMouseEnter={() => setHoveredHotel(hotel.id)}
                  onMouseLeave={() => setHoveredHotel(null)}
                >
                  <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group-hover:border-indigo-300">
                    {/* Remove Favourite Button */}
                    <button
                      onClick={(e) => handleRemoveFavourite(hotel.id, e)}
                      className={`absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md transition-opacity duration-200 ${
                        hoveredHotel === hotel.id ? "opacity-100" : "opacity-0"
                      } hover:bg-red-50 hover:text-red-600`}
                      aria-label="Remove from favourites"
                    >
                      <FaHeart className="w-5 h-5 text-red-500" />
                    </button>

                    {/* Hotel Image */}
                    <div className="relative h-48">
                      <img
                        src={`/images/hotels/main/${
                          mainImages[idx % mainImages.length]
                        }`}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/images/hotels/main/1.jpg";
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-lg font-semibold text-white">
                          {hotel.name}
                        </h3>
                      </div>
                    </div>

                    {/* Hotel Details */}
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) =>
                            i < 4 ? (
                              <FaStar
                                key={i}
                                className="w-5 h-5 text-yellow-400"
                              />
                            ) : (
                              <FaRegStar
                                key={i}
                                className="w-5 h-5 text-gray-300"
                              />
                            )
                          )}
                          <span className="ml-2 text-sm font-medium text-gray-600">
                            4.0
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaMapMarkerAlt className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="text-sm">{hotel.place}</span>
                      </div>
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

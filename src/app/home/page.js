"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { userAPI } from "@/lib/api";
import Link from "next/link";
import UserNavbar from "@/components/UserNavbar";
import {
  FaSearch,
  FaStar,
  FaRegStar,
  FaMapMarkerAlt,
  FaRegHeart,
  FaHeart,
} from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import { useMembership } from "@/context/MembershipContext";

const mainImages = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"];
const GOLD_COLOR_CLASS = "text-yellow-400";

export default function UserHomePage() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [favourites, setFavourites] = useState([]);
  const { membership } = useMembership();

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

  const fetchFavourites = async () => {
    if (user?.id) {
      try {
        const data = await userAPI.listFavourites(user.id);
        setFavourites(data.map((fav) => fav.hotelid || fav.hotelId));
      } catch (err) {
        console.error("Failed to fetch favourites:", err);
      }
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setSearchResults(null);
      setSearchError("");
      return;
    }
    setSearchLoading(true);
    setSearchError("");
    try {
      const keywords = search.trim().split(/\s+/);
      const data = await userAPI.searchHotels(keywords);
      setSearchResults(data);
    } catch (err) {
      setSearchError("Failed to search hotels");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddToFavourites = async (hotelId) => {
    if (!user?.id) {
      setToast({ message: "Please log in to add favourites.", type: "error" });
      setTimeout(() => setToast({ message: "", type: "" }), 2500);
      return;
    }
    try {
      if (favourites.includes(hotelId)) {
        await userAPI.removeFromFavourites(user.id, hotelId);
        setToast({ message: "Removed from favourites!", type: "success" });
        setFavourites((prev) => prev.filter((id) => id !== hotelId));
      } else {
        await userAPI.addToFavourites(user.id, hotelId);
        setToast({ message: "Added to favourites!", type: "success" });
        setFavourites((prev) => [...prev, hotelId]);
      }
    } catch (err) {
      setToast({
        message: err.message || "Failed to update favourites.",
        type: "error",
      });
    } finally {
      setTimeout(() => setToast({ message: "", type: "" }), 2500);
    }
  };

  const displayHotels = searchResults || hotels;
  const isEmpty = displayHotels.length === 0;
  const isError = error || searchError;
  const isLoading = loading || searchLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome,
            {user && user.name ? (
              <span
                className={
                  membership.tier === "gold"
                    ? `ml-1 ${GOLD_COLOR_CLASS}`
                    : "ml-1"
                }
              >
                {` ${user.name}`}
              </span>
            ) : (
              "!"
            )}
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Discover your perfect stay at the best hotels around the world
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search by hotel name, location, or amenities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <FaSearch />
              Search Hotels
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              {searchResults ? "Search Results" : "Featured Hotels"}
            </h2>
          </div>

          <div className="p-6">
            {isError ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FiAlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {error || searchError}
                </h3>
                <p className="text-gray-500">
                  Please try again later or contact support
                </p>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : isEmpty ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg
                  className="h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No hotels found
                </h3>
                <p className="text-gray-500">
                  {searchResults
                    ? "Try a different search term"
                    : "We'll have more options soon"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayHotels.map((hotel, idx) => (
                  <Link
                    href={`/hotel/${hotel.id}`}
                    key={hotel.id}
                    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-xl"
                  >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group-hover:border-indigo-300">
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
                        <button
                          type="button"
                          className="absolute top-3 right-3 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-red-100 transition-colors z-10"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToFavourites(hotel.id);
                          }}
                          aria-label={
                            favourites.includes(hotel.id)
                              ? "Remove from favourites"
                              : "Add to favourites"
                          }
                        >
                          {favourites.includes(hotel.id) ? (
                            <FaHeart className="text-2xl text-red-500" />
                          ) : (
                            <FaRegHeart className="text-2xl text-red-500" />
                          )}
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <h3 className="text-lg font-semibold text-white">
                            {hotel.name}
                          </h3>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {hotel.rating && hotel.rating > 0 ? (
                              <>
                                {[...Array(5)].map((_, i) =>
                                  i < Math.floor(hotel.rating) ? (
                                    <FaStar
                                      key={i}
                                      className="h-5 w-5 text-yellow-400"
                                    />
                                  ) : (
                                    <FaRegStar
                                      key={i}
                                      className="h-5 w-5 text-gray-300"
                                    />
                                  )
                                )}
                                <span className="ml-2 text-sm font-medium text-gray-600">
                                  {hotel.rating.toFixed(1)}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm text-gray-400 italic">
                                No ratings yet
                              </span>
                            )}
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

      {/* Membership Benefits Section - Only show for free users */}
      {membership.tier === "free" && (
        <div className="bg-yellow-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Upgrade to Gold Membership
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Get exclusive benefits and save on every booking
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-8">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-6 text-xl font-medium text-gray-900">
                      10% Discount
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Save 10% on all your bookings with our Gold membership
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-8">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-6 text-xl font-medium text-gray-900">
                      Priority Support
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Get priority access to our customer support team
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-8">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="mt-6 text-xl font-medium text-gray-900">
                      Early Access
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      Be the first to know about deals and promotions
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-center">
                <Link
                  href="/subscription"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast.message && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all animate-fade-in ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
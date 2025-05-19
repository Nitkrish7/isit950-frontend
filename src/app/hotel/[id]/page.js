"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { userAPI } from "@/lib/api";
import UserNavbar from "@/components/UserNavbar";
import HotelTag from "@/components/HotelTag";
import {
  FaSwimmingPool,
  FaWifi,
  FaCoffee,
  FaParking,
  FaUtensils,
  FaBath,
  FaSpa,
  FaShuttleVan,
  FaSnowflake,
  FaWheelchair,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaPlus,
  FaUserFriends,
  FaArrowLeft,
  FaStar,
  FaRegStar,
  FaMapMarkerAlt,
  FaBed,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

// Tag to icon mapping
const tagIcons = {
  "Outdoor swimming pool": <FaSwimmingPool className="text-indigo-600" />,
  "Free WiFi": <FaWifi className="text-indigo-600" />,
  "Good Breakfast": <FaCoffee className="text-indigo-600" />,
  "Free on-site parking": <FaParking className="text-indigo-600" />,
  "2 restaurants": <FaUtensils className="text-indigo-600" />,
  "Private bathroom": <FaBath className="text-indigo-600" />,
  "Spa and wellness centre": <FaSpa className="text-indigo-600" />,
  "Airport shuttle": <FaShuttleVan className="text-indigo-600" />,
  "Air conditioning": <FaSnowflake className="text-indigo-600" />,
  "Facilities for disabled guests": (
    <FaWheelchair className="text-indigo-600" />
  ),
};

export default function HotelDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const images = Array.from(
    { length: 8 },
    (_, i) => `/images/hotels/details/${i + 1}.jpg`
  );

  // Modal/slider state
  const [sliderOpen, setSliderOpen] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  // Open slider at index
  const openSlider = (idx) => {
    setSliderIndex(idx);
    setSliderOpen(true);
  };
  const closeSlider = () => setSliderOpen(false);
  const prevImage = (e) => {
    e?.stopPropagation();
    setSliderIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const nextImage = (e) => {
    e?.stopPropagation();
    setSliderIndex((prev) => (prev + 1) % images.length);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!sliderOpen) return;
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "Escape") closeSlider();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sliderOpen, images.length]);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await userAPI.getHotelDetails(id);
        setHotel(data);
      } catch (err) {
        setError("Failed to load hotel details");
      } finally {
        setLoading(false);
      }
    };
    fetchHotelDetails();
  }, [id]);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // Add review handler
  const handlePostReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError("");
    try {
      await userAPI.createReview({
        hotelid: id,
        description: reviewText,
        rating: reviewRating,
        userid: user?.id,
      });
      setReviewModalOpen(false);
      setReviewText("");
      setReviewRating(0);
      const data = await userAPI.getHotelDetails(id);
      setHotel(data);
    } catch (err) {
      setReviewError("Failed to post review");
    } finally {
      setReviewLoading(false);
    }
  };

  // Availability modal state
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomCount, setRoomCount] = useState(1);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState(null);
  const [availabilityError, setAvailabilityError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  // Calculate room count based on guests and room capacity
  const guestsPerRoom = selectedRoom?.no_of_guests || 1;
  const calculatedRoomCount = Math.ceil(numberOfGuests / guestsPerRoom);

  // Open modal for a room
  const openAvailabilityModal = (room) => {
    setSelectedRoom(room);
    setAvailabilityModalOpen(true);
    setCheckIn("");
    setCheckOut("");
    setNumberOfGuests(1);
    setAvailabilityResult(null);
    setAvailabilityError("");
  };

  // Check availability handler
  const handleCheckAvailability = async (e) => {
    e.preventDefault();
    setAvailabilityLoading(true);
    setAvailabilityResult(null);
    setAvailabilityError("");
    try {
      const res = await userAPI.checkRoomAvailability({
        roomId: selectedRoom.id || selectedRoom._id,
        roomCount: calculatedRoomCount,
        startDate: checkIn,
        endDate: checkOut,
      });
      setAvailabilityResult(res.availability);
    } catch (err) {
      setAvailabilityError("Failed to check availability");
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // Book room handler
  const handleBookRoom = async () => {
    setBookingLoading(true);
    setToast({ message: "", type: "" });
    try {
      const res = await userAPI.createBooking({
        roomid: selectedRoom.id || selectedRoom._id,
        startdate: checkIn,
        enddate: checkOut,
        bookinguserid: user?.id,
        hotelid: id,
        booking_count: calculatedRoomCount,
        no_of_guests: numberOfGuests,
      });
      setToast({ message: "Booking successful!", type: "success" });
      setAvailabilityModalOpen(false);
      setTimeout(() => setToast({ message: "", type: "" }), 3000);
    } catch (err) {
      setToast({
        message: err.message || "Failed to book room",
        type: "error",
      });
      setTimeout(() => setToast({ message: "", type: "" }), 3000);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  if (!hotel)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Hotel not found
      </div>
    );

  // Collage: 1 large + 4 small (show overlay if more images)
  const mainImage = images[0];
  const collageImages = images.slice(1, 5);
  const extraCount = images.length - 5;

  // Room images
  const roomImages = [
    "/images/rooms/1.jpg",
    "/images/rooms/2.jpg",
    "/images/rooms/3.jpg",
  ];

  // Dummy reviews data
  const dummyReviews = [
    {
      id: 1,
      name: "Alice Smith",
      rating: 5,
      comment:
        "Amazing stay! The staff was super friendly and the rooms were spotless.",
      date: "2024-06-01",
    },
    {
      id: 2,
      name: "Bob Johnson",
      rating: 4,
      comment:
        "Great location and comfortable beds. Breakfast could be better.",
      date: "2024-05-28",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/home"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>

        {/* Toast Notification */}
        {toast.message && (
          <div
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all animate-fade-in
              ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            {toast.message}
          </div>
        )}

        {/* Hotel Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                {hotel.name}
              </h1>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2 text-indigo-500" />
                <span>{hotel.place}</span>
              </div>
            </div>
            {hotel.rating && (
              <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mr-2">
                  {Array.from({ length: 5 }).map((_, i) =>
                    i < hotel.rating ? (
                      <FaStar key={i} className="text-yellow-400" />
                    ) : (
                      <FaRegStar key={i} className="text-yellow-400" />
                    )
                  )}
                </div>
                <span className="text-gray-700 font-medium">
                  {hotel.rating.toFixed(1)} / 5
                </span>
              </div>
            )}
          </div>

          {/* Image Gallery */}
          <div className="relative group mb-8 rounded-xl overflow-hidden shadow-lg">
            <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-96">
              {/* Main image */}
              <div
                className="col-span-2 row-span-2 relative cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openSlider(0)}
              >
                <Image
                  src={mainImage}
                  alt={`Main view of ${hotel.name}`}
                  fill
                  className="object-cover"
                  quality={80}
                />
              </div>

              {/* Thumbnail images */}
              {collageImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative cursor-pointer hover:opacity-90 transition-opacity ${
                    idx === 0 ? "col-span-2" : ""
                  }`}
                  onClick={() => openSlider(idx + 1)}
                >
                  <Image
                    src={img}
                    alt={`Hotel view ${idx + 2}`}
                    fill
                    className="object-cover"
                    quality={80}
                  />
                  {idx === collageImages.length - 1 && extraCount > 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white font-medium">
                      +{extraCount} more
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile image gallery */}
            <div className="md:hidden h-64 relative">
              <Image
                src={mainImage}
                alt={`Main view of ${hotel.name}`}
                fill
                className="object-cover"
                quality={80}
              />
              <div
                className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm"
                onClick={() => openSlider(0)}
              >
                View all photos
              </div>
            </div>

            {/* Hover overlay */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30 cursor-pointer">
              <div className="bg-white bg-opacity-90 px-6 py-3 rounded-full text-indigo-700 font-medium flex items-center">
                <FaPlus className="mr-2" />
                View all photos
              </div>
            </div>
          </div>

          {/* Hotel Features */}
          {hotel.tags && hotel.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Facilities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {hotel.tags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100"
                  >
                    {tagIcons[tag] || <FaPlus className="text-indigo-500" />}
                    <span className="ml-2 text-gray-700 text-sm">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {hotel.description && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                About this property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {hotel.description}
              </p>
            </div>
          )}

          {/* Rooms Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Available Rooms
              </h2>
            </div>

            {hotel.room && hotel.room.length > 0 ? (
              <div className="space-y-6">
                {hotel.room.map((room, idx) => {
                  const img =
                    roomImages[Math.floor(Math.random() * roomImages.length)];
                  const roomName = room.name || room.type;
                  const guests = room.no_of_guests || 2;
                  const price = room.price || 120;
                  const status = room.status || "Available";

                  return (
                    <div
                      key={room.id || idx}
                      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3 h-48 md:h-auto relative">
                          <Image
                            src={img}
                            alt={roomName}
                            fill
                            className="object-cover"
                            quality={80}
                          />
                        </div>
                        <div className="p-6 md:w-2/3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {roomName}
                              </h3>
                              <div className="flex items-center text-gray-600 mb-2">
                                <FaUserFriends className="mr-2 text-indigo-500" />
                                <span className="text-sm">
                                  Sleeps {guests} guest{guests > 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-indigo-600">
                                ${price}
                              </div>
                              <div className="text-gray-500 text-sm">
                                per night
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                              <FaBed className="mr-1 text-indigo-500" />
                              King bed
                            </div>
                            <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                              <FaWifi className="mr-1 text-indigo-500" />
                              Free WiFi
                            </div>
                            <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                              <FaSnowflake className="mr-1 text-indigo-500" />
                              Air conditioning
                            </div>
                          </div>

                          <div className="mt-6 flex justify-end">
                            <button
                              onClick={() => openAvailabilityModal(room)}
                              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                status === "Available"
                                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
                              }`}
                            >
                              Check Availability
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="text-gray-400 mb-4">
                  <FaBed className="inline-block text-4xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No rooms available in this hotel
                </h3>
                <p className="text-gray-500 mb-4">
                  Please check back later or browse other hotels.
                </p>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Guest Reviews
              </h2>
              <button
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center"
                onClick={() => setReviewModalOpen(true)}
              >
                <FaPlus className="mr-2" />
                Add Review
              </button>
            </div>

            {hotel.reviews && hotel.reviews.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {hotel.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-4">
                        {review.user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">
                          {review.user.name}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500">
                          {new Date(
                            review.createdAt || review.date
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {Array.from({ length: 5 }).map((_, i) =>
                        i < review.rating ? (
                          <FaStar key={i} className="text-yellow-400" />
                        ) : (
                          <FaRegStar key={i} className="text-yellow-400" />
                        )
                      )}
                    </div>
                    <p className="text-gray-700">
                      {review.description || review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <div className="text-gray-400 mb-4">
                  <FaStar className="inline-block text-4xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Be the first to share your experience!
                </p>
                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 inline-flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Review Modal */}
        {reviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl rounded-full p-2"
                onClick={() => setReviewModalOpen(false)}
              >
                <FaTimes />
              </button>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Write a Review
                </h3>

                <form onSubmit={handlePostReview}>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-3">
                      Your Rating
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          className={`text-3xl ${
                            reviewRating >= star
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          onClick={() => setReviewRating(star)}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-3">
                      Your Review
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={5}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                      placeholder="Share your experience with this hotel..."
                    />
                  </div>

                  {reviewError && (
                    <div className="mb-4 text-red-600 text-sm">
                      {reviewError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                    disabled={reviewLoading || !reviewText || !reviewRating}
                  >
                    {reviewLoading ? (
                      <span className="inline-flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Availability Modal */}
        {availabilityModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl rounded-full p-2"
                onClick={() => setAvailabilityModalOpen(false)}
              >
                <FaTimes />
              </button>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Check Availability
                </h3>
                <p className="text-gray-600 mb-6">
                  for {selectedRoom?.name || selectedRoom?.type}
                </p>

                <form onSubmit={handleCheckAvailability}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Check-in
                      </label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="date"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          required
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Check-out
                      </label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="date"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          required
                          min={
                            checkIn || new Date().toISOString().split("T")[0]
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Guests
                    </label>
                    <div className="relative">
                      <FaUsers className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="number"
                        min={1}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={numberOfGuests}
                        onChange={(e) =>
                          setNumberOfGuests(Number(e.target.value))
                        }
                        required
                      />
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {`${calculatedRoomCount} room${
                        calculatedRoomCount > 1 ? "s" : ""
                      } needed (max ${guestsPerRoom} per room)`}
                    </div>
                  </div>

                  {availabilityError && (
                    <div className="mb-4 text-red-600 text-sm">
                      {availabilityError}
                    </div>
                  )}

                  {availabilityResult !== null && (
                    <div
                      className={`mb-6 p-4 rounded-lg ${
                        availabilityResult
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {availabilityResult ? (
                        <div>
                          <div className="font-bold mb-2">Room available!</div>
                          <div>
                            Total for {calculatedRoomCount} room
                            {calculatedRoomCount > 1 ? "s" : ""}:{" "}
                            <span className="font-bold">
                              $
                              {(selectedRoom?.price || 0) *
                                calculatedRoomCount *
                                Math.ceil(
                                  (new Date(checkOut) - new Date(checkIn)) /
                                    (1000 * 60 * 60 * 24)
                                )}
                            </span>
                          </div>
                        </div>
                      ) : (
                        "Room not available for the selected dates."
                      )}
                    </div>
                  )}

                  <div className="space-y-3">
                    {availabilityResult && (
                      <button
                        type="button"
                        onClick={handleBookRoom}
                        disabled={bookingLoading}
                        className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                      >
                        {bookingLoading ? (
                          <span className="inline-flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Booking...
                          </span>
                        ) : (
                          "Book Now"
                        )}
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={
                        availabilityLoading ||
                        !checkIn ||
                        !checkOut ||
                        !numberOfGuests
                      }
                      className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                      {availabilityLoading ? (
                        <span className="inline-flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Checking...
                        </span>
                      ) : (
                        "Check Availability"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Image Slider Modal */}
        {sliderOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
            onClick={closeSlider}
          >
            <button
              className="absolute top-8 right-8 text-white text-3xl p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                closeSlider();
              }}
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <button
              className="absolute left-8 top-1/2 -translate-y-1/2 text-white text-4xl p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>

            <div className="relative max-h-[90vh] max-w-[90vw]">
              <Image
                src={images[sliderIndex]}
                alt={`Hotel image ${sliderIndex + 1}`}
                width={1200}
                height={800}
                className="rounded-lg object-contain max-h-[90vh] max-w-[90vw]"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
                {sliderIndex + 1} / {images.length}
              </div>
            </div>

            <button
              className="absolute right-8 top-1/2 -translate-y-1/2 text-white text-4xl p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

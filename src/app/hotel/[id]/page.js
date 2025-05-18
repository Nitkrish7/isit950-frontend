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
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

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
  // For now, use static images, but structure for future dynamic support
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
    // eslint-disable-next-line
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
      // Refresh hotel details to show new review
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!hotel) return <div>Hotel not found</div>;

  // Collage: 1 large + 4 small (show overlay if more images)
  const mainImage = images[0];
  const collageImages = images.slice(1, 5);
  const extraCount = images.length - 5;

  // Dummy room data
  const dummyRooms = [
    { id: 1, type: "Deluxe Room", price: 120, status: "Available" },
    { id: 2, type: "Suite", price: 200, status: "Available" },
    { id: 3, type: "Standard Room", price: 90, status: "Occupied" },
  ];

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
      <div className="max-w-5xl mx-auto p-4">
        <Link
          href="/home"
          className="inline-flex items-center text-indigo-700 hover:text-indigo-900 mb-4 font-medium"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
        {/* Toast Notification */}
        {toast.message && (
          <div
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all
              ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            {toast.message}
          </div>
        )}
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">
          {hotel.name}
        </h1>
        <p className="text-gray-600 mb-4">{hotel.place}</p>
        {hotel.rating && (
          <div className="flex items-center mb-4">
            <span className="text-yellow-400 mr-2">
              {Array.from({ length: hotel.rating }).map((_, i) => (
                <span key={i}>★</span>
              ))}
              {Array.from({ length: 5 - hotel.rating }).map((_, i) => (
                <span key={i} className="text-gray-300">
                  ★
                </span>
              ))}
            </span>
            <span className="text-gray-600">{hotel.rating} / 5</span>
          </div>
        )}
        {/* Collage */}
        <div
          className="w-full max-w-full overflow-hidden mb-8 relative group cursor-pointer"
          onClick={() => openSlider(0)}
        >
          {/* Desktop: grid, Mobile: flex-col */}
          <div
            className="hidden md:grid grid-cols-3 gap-2 aspect-[16/7] w-full overflow-hidden"
            style={{ maxWidth: "100%" }}
          >
            {/* Main image left */}
            <div className="col-span-2 row-span-2 relative h-full w-full">
              <div className="w-full h-full overflow-hidden rounded-l-lg rounded-tr-lg md:rounded-tr-none md:rounded-bl-lg shadow">
                <img
                  src={mainImage}
                  alt={`Main view of ${hotel.name}`}
                  className="w-full h-full object-cover cursor-pointer"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  onClick={() => openSlider(0)}
                />
              </div>
            </div>
            {/* Up to 4 images on the right, fill full height */}
            <div className="grid grid-rows-2 gap-2 col-span-1 h-full w-full">
              {collageImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative h-full w-full overflow-hidden rounded${
                    idx === 1 ? " rounded-tr-lg" : ""
                  }${idx === 3 ? " rounded-br-lg" : ""}`}
                  style={{ minHeight: 0 }}
                >
                  <img
                    src={img}
                    alt={`Hotel view ${idx + 2}`}
                    className="w-full h-full object-cover cursor-pointer shadow"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    onClick={() => openSlider(idx + 1)}
                  />
                  {/* Overlay for extra images or always on last image */}
                  {idx === 3 && (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 rounded-br-lg cursor-pointer hover:bg-opacity-60 transition"
                      onClick={() => openSlider(0)}
                    >
                      <FaPlus className="text-white text-2xl mb-1" />
                      <span className="text-white font-medium text-base">
                        View More Photos
                      </span>
                      {extraCount > 0 && (
                        <span className="text-white text-xs mt-1">
                          +{extraCount} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Mobile: stack all images in a column, main image first, then rest */}
          <div className="flex flex-col gap-2 md:hidden">
            <div className="w-full aspect-[4/3] overflow-hidden rounded-lg shadow">
              <img
                src={mainImage}
                alt={`Main view of ${hotel.name}`}
                className="w-full h-full object-cover cursor-pointer"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                onClick={() => openSlider(0)}
              />
            </div>
            {collageImages.map((img, idx) => (
              <div
                key={idx}
                className={`w-full aspect-[4/3] overflow-hidden rounded-lg shadow relative`}
              >
                <img
                  src={img}
                  alt={`Hotel view ${idx + 2}`}
                  className="w-full h-full object-cover cursor-pointer"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  onClick={() => openSlider(idx + 1)}
                />
                {/* Overlay only on last image in mobile view */}
                {idx === collageImages.length - 1 && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 rounded-lg cursor-pointer hover:bg-opacity-60 transition"
                    onClick={() => openSlider(0)}
                  >
                    <FaPlus className="text-white text-2xl mb-1" />
                    <span className="text-white font-medium text-base">
                      View More Photos
                    </span>
                    {extraCount > 0 && (
                      <span className="text-white text-xs mt-1">
                        +{extraCount} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Overlay on hover */}
          <div
            className="hidden md:flex absolute inset-0 z-10 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
            style={{ background: "rgba(0,0,0,0.4)" }}
          >
            <span className="text-white text-2xl font-semibold flex items-center gap-2">
              <FaPlus className="inline-block mb-1" /> Click to view images
            </span>
          </div>
        </div>
        {/* Features/Tags */}
        {hotel.tags && hotel.tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {hotel.tags.map((tag, idx) => (
              <HotelTag tag={tag} key={idx} />
            ))}
          </div>
        )}
        {/* Description */}
        {hotel.description && (
          <p className="text-gray-700 text-lg mb-8 mt-4">{hotel.description}</p>
        )}
        {/* Room Cards Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(hotel.room && hotel.room.length > 0
              ? hotel.room
              : dummyRooms
            ).map((room, idx) => {
              // Pick a random image for each room
              const img =
                roomImages[Math.floor(Math.random() * roomImages.length)];
              // Use API data if available, else fallback to dummy
              const roomName = room.name || room.type;
              const guests = room.no_of_guests || 2; // fallback to 2 if not present
              const price = room.price || 120; // fallback to dummy price
              const status = room.status || "Available";
              return (
                <div
                  key={room.id || idx}
                  className="bg-white rounded-lg shadow p-6 flex flex-col justify-between"
                >
                  <img
                    src={img}
                    alt={roomName}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {roomName}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <FaUserFriends className="text-indigo-600 text-lg" />
                      <span className="text-gray-600">
                        {guests} guest{guests > 1 ? "s" : ""}
                      </span>
                    </div>
                    {/* <p className="text-gray-600 mb-2">
                      {status === "Available" ? "Available" : "Occupied"}
                    </p> */}
                    <p className="text-indigo-700 font-semibold text-xl mb-4">
                      ${price} / night
                    </p>
                  </div>
                  <button
                    className={`mt-auto px-4 py-2 rounded font-medium text-white transition-colors ${
                      status === "Available"
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    // disabled={status !== "Available"}
                    onClick={() => openAvailabilityModal(room)}
                  >
                    Check Availability
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        {/* Reviews Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-indigo-700">Reviews</h2>
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              onClick={() => setReviewModalOpen(true)}
            >
              Add Review
            </button>
          </div>
          {hotel.reviews && hotel.reviews.length > 0 ? (
            <div className="space-y-6">
              {hotel.reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-2">
                    <span className="font-bold text-gray-800 mr-2">
                      {review.user.name}
                    </span>
                    <span className="text-yellow-400 mr-2">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                      {Array.from({ length: 5 - review.rating }).map((_, i) => (
                        <span key={i} className="text-gray-300">
                          ★
                        </span>
                      ))}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No reviews yet.</p>
          )}
          {/* Review Modal */}
          {reviewModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <form
                className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative"
                onSubmit={handlePostReview}
              >
                <button
                  type="button"
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
                  onClick={() => setReviewModalOpen(false)}
                >
                  &times;
                </button>
                <h3 className="text-xl font-bold mb-4">Add Your Review</h3>
                <label className="block mb-2 font-medium">Your Rating</label>
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-2xl cursor-pointer ${
                        reviewRating >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => setReviewRating(star)}
                      data-testid={`star-${star}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <label className="block mb-2 font-medium">Your Review</label>
                <textarea
                  className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                  placeholder="Share your experience..."
                />
                {reviewError && (
                  <div className="mb-2 text-red-600">{reviewError}</div>
                )}
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  disabled={reviewLoading || !reviewText || !reviewRating}
                >
                  {reviewLoading ? "Posting..." : "Post Review"}
                </button>
              </form>
            </div>
          )}
        </div>
        {/* Availability Modal */}
        {availabilityModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <form
              className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative"
              onSubmit={handleCheckAvailability}
            >
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
                onClick={() => setAvailabilityModalOpen(false)}
              >
                &times;
              </button>
              <h3 className="text-xl font-bold mb-4">
                Check Room Availability
              </h3>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Check-in Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded p-2"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Check-out Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded p-2"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">
                  Number of Guests
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full border border-gray-300 rounded p-2"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(Number(e.target.value))}
                  required
                />
                <div className="text-sm text-gray-500 mt-1">
                  {`This will book ${calculatedRoomCount} room${
                    calculatedRoomCount > 1 ? "s" : ""
                  } (max ${guestsPerRoom} guest${
                    guestsPerRoom > 1 ? "s" : ""
                  } per room)`}
                </div>
              </div>
              {availabilityError && (
                <div className="mb-2 text-red-600">{availabilityError}</div>
              )}
              {availabilityResult !== null && (
                <div
                  className={`mb-4 text-lg font-semibold ${
                    availabilityResult ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {availabilityResult
                    ? "Room is available!"
                    : "Room is not available for the selected dates."}
                </div>
              )}
              {availabilityResult && (
                <button
                  type="button"
                  className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition mb-2"
                  onClick={handleBookRoom}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? "Booking..." : "Book Now"}
                </button>
              )}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                disabled={
                  availabilityLoading ||
                  !checkIn ||
                  !checkOut ||
                  !numberOfGuests
                }
              >
                {availabilityLoading ? "Checking..." : "Check Availability"}
              </button>
            </form>
          </div>
        )}
        {/* Image Slider Modal */}

        {sliderOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
            onClick={closeSlider}
          >
            <button
              className="absolute top-6 right-8 text-white text-3xl p-2 bg-black bg-opacity-40 rounded-full hover:bg-opacity-70 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                closeSlider();
              }}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <button
              className="absolute left-8 top-1/2 -translate-y-1/2 text-white text-4xl p-2 bg-black bg-opacity-40 rounded-full hover:bg-opacity-70 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>
            <img
              src={images[sliderIndex]}
              alt={`Hotel image ${sliderIndex + 1}`}
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg border-4 border-white object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-8 top-1/2 -translate-y-1/2 text-white text-4xl p-2 bg-black bg-opacity-40 rounded-full hover:bg-opacity-70 focus:outline-none"
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

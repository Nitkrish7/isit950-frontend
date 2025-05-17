import React from "react";
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
  FaDumbbell,
  FaGlassCheers,
  FaConciergeBell,
  FaDog,
  FaMugHot,
  FaUmbrellaBeach,
  FaTshirt,
  FaLock,
  FaBed,
  FaSmokingBan,
  FaUserFriends,
  FaRegBuilding,
} from "react-icons/fa";

// Helper to convert any string to Title Case (e.g., 'family rooms' => 'Family Rooms')
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const tagIcons = {
  "Air Conditioning": <FaSnowflake className="text-indigo-600" />,
  "Air Conditioner": <FaSnowflake className="text-indigo-600" />,
  "Free Wifi": <FaWifi className="text-indigo-600" />,
  "Outdoor Swimming Pool": <FaSwimmingPool className="text-indigo-600" />,
  "Swimming Pool": <FaSwimmingPool className="text-indigo-600" />,
  "Good Breakfast": <FaCoffee className="text-indigo-600" />,
  "Free On-Site Parking": <FaParking className="text-indigo-600" />,
  "Free Parking": <FaParking className="text-indigo-600" />,
  Restaurant: <FaUtensils className="text-indigo-600" />,
  "2 Restaurants": <FaUtensils className="text-indigo-600" />,
  "Private Bathroom": <FaBath className="text-indigo-600" />,
  "Spa And Wellness Centre": <FaSpa className="text-indigo-600" />,
  "Spa/Wellness": <FaSpa className="text-indigo-600" />,
  "Airport Shuttle": <FaShuttleVan className="text-indigo-600" />,
  "Family Rooms": <FaUserFriends className="text-indigo-600" />,
  "Non-Smoking Rooms": <FaSmokingBan className="text-indigo-600" />,
  "Fitness Centre": <FaDumbbell className="text-indigo-600" />,
  "Fitness Center": <FaDumbbell className="text-indigo-600" />,
  Bar: <FaGlassCheers className="text-indigo-600" />,
  "Room Service": <FaConciergeBell className="text-indigo-600" />,
  "24-Hour Front Desk": <FaConciergeBell className="text-indigo-600" />,
  "Facilities For Disabled Guests": (
    <FaWheelchair className="text-indigo-600" />
  ),
  "Pet Friendly": <FaDog className="text-indigo-600" />,
  "Tea/Coffee Maker": <FaMugHot className="text-indigo-600" />,
  Beachfront: <FaUmbrellaBeach className="text-indigo-600" />,
  Laundry: <FaTshirt className="text-indigo-600" />,
  Elevator: <FaRegBuilding className="text-indigo-600" />,
  Safe: <FaLock className="text-indigo-600" />,
  Bed: <FaBed className="text-indigo-600" />,
};

export default function HotelTag({ tag, className = "" }) {
  // Normalize tag to Title Case for lookup
  const normalizedTag = toTitleCase(tag);
  const icon = tagIcons[normalizedTag] || (
    <FaRegBuilding className="text-indigo-600" />
  );
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 bg-white border border-indigo-100 rounded-full shadow-sm text-indigo-700 text-sm font-medium hover:bg-indigo-50 transition ${className}`}
    >
      {icon}
      <span>{tag}</span>
    </div>
  );
}

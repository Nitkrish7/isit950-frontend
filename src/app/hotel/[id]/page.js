"use client";
import Link from "next/link";
import UserNavbar from "@/components/UserNavbar";

const dummyHotel = {
  id: "1",
  name: "Grand Palace Hotel",
  description:
    "Experience luxury and comfort at the Grand Palace Hotel, located in the heart of the city. Enjoy world-class amenities, fine dining, and exceptional service.",
  images: [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
  ],
  place: "New York, USA",
  rooms: [
    {
      id: "101",
      type: "Deluxe Room",
      price: 120,
      description:
        "A spacious room with a king-size bed, city view, and modern amenities.",
      available: true,
    },
    {
      id: "102",
      type: "Suite",
      price: 200,
      description:
        "A luxurious suite with a separate living area and premium facilities.",
      available: false,
    },
    {
      id: "103",
      type: "Standard Room",
      price: 90,
      description:
        "A comfortable room with all basic amenities for a pleasant stay.",
      available: true,
    },
  ],
};

export default function HotelDetailsPage() {
  const hotel = dummyHotel;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <UserNavbar back />
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-8">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Hotel Images */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <img
                src={hotel.images[0]}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {hotel.images.slice(1).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={hotel.name + " image " + (idx + 2)}
                  className="w-24 h-16 object-cover rounded"
                />
              ))}
            </div>
          </div>
          {/* Hotel Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-indigo-700 mb-2">
                {hotel.name}
              </h1>
              <p className="text-gray-600 mb-2">{hotel.place}</p>
              <p className="text-gray-700 mb-4">{hotel.description}</p>
            </div>
          </div>
        </div>
        {/* Rooms List */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Available Rooms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hotel.rooms.map((room) => (
              <div
                key={room.id}
                className="border rounded-lg p-6 flex flex-col justify-between bg-gray-50"
              >
                <div>
                  <h3 className="text-xl font-bold text-indigo-700 mb-1">
                    {room.type}
                  </h3>
                  <p className="text-gray-600 mb-2">{room.description}</p>
                  <p className="text-gray-800 font-semibold mb-2">
                    ${room.price} / night
                  </p>
                </div>
                <Link href={`/hotel/${hotel.id}/book?room=${room.id}`}>
                  <button
                    className={`mt-4 w-full py-2 px-4 rounded-md font-medium transition-colors text-white ${
                      room.available
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!room.available}
                  >
                    {room.available ? "Book Now" : "Not Available"}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

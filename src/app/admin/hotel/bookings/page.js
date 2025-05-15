"use client";

const dummyBookings = [
  {
    id: 1,
    guest: "Alice Smith",
    room: "Deluxe Room",
    checkin: "2024-07-01",
    checkout: "2024-07-03",
    status: "Confirmed",
  },
  {
    id: 2,
    guest: "Bob Johnson",
    room: "Suite",
    checkin: "2024-07-05",
    checkout: "2024-07-08",
    status: "Pending",
  },
  {
    id: 3,
    guest: "Charlie Brown",
    room: "Standard Room",
    checkin: "2024-07-10",
    checkout: "2024-07-12",
    status: "Cancelled",
  },
];

export default function HotelBookingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Bookings</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-in
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dummyBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap">{booking.guest}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.room}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.checkin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.checkout}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

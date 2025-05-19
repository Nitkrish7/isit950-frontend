// app/admin/hotel/dashboard/page.js
"use client";
import { useState, useEffect } from "react";
import { useHotelAdmin } from "@/context/HotelAdminContext";
import { adminAPI } from "@/lib/api";
import HotelAdminNavbar from "@/components/HotelAdminNavbar";

export default function HotelAdminDashboard() {
  const { hotelId, loading: contextLoading } = useHotelAdmin();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upcoming, setUpcoming] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [upcomingError, setUpcomingError] = useState("");

  useEffect(() => {
    if (!hotelId) return;
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await adminAPI.getHotelAdminStats(hotelId);
        setStats(res);
      } catch (err) {
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    const fetchUpcoming = async () => {
      setUpcomingLoading(true);
      setUpcomingError("");
      try {
        const res = await adminAPI.getUpcomingBookings(hotelId);
        setUpcoming(res);
      } catch (err) {
        setUpcomingError("Failed to load upcoming bookings");
      } finally {
        setUpcomingLoading(false);
      }
    };
    fetchStats();
    fetchUpcoming();
  }, [hotelId]);

  if (contextLoading || loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-6 sm:mb-8">
        Hotel Dashboard
      </h1>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded max-w-xl w-full">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <p className="text-sm font-medium text-gray-500">Total Rooms</p>
          <p className="text-2xl font-semibold text-gray-900">
            {stats?.totalRooms ?? "-"}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <p className="text-sm font-medium text-gray-500">Occupied Rooms</p>
          <p className="text-2xl font-semibold text-gray-900">
            {stats?.occupiedRooms ?? "-"}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <p className="text-sm font-medium text-gray-500">Total Bookings</p>
          <p className="text-2xl font-semibold text-gray-900">
            {stats?.totalBookings ?? "-"}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto mb-8">
        <h2 className="text-xl font-semibold mb-4">Welcome, Hotel Admin!</h2>
        <p className="text-gray-600">
          Here you can manage your rooms, view bookings, and monitor your
          hotel's performance.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Upcoming Bookings</h2>
        {upcomingLoading ? (
          <div className="text-gray-500">Loading upcoming bookings...</div>
        ) : upcomingError ? (
          <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">
            {upcomingError}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="text-gray-500">No upcoming bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Booking Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Room Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Start Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    End Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Room Count
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Guests
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcoming.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {booking.user?.name || "-"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {booking.room?.name || "-"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {new Date(booking.startdate).toLocaleString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {new Date(booking.enddate).toLocaleString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {booking.booking_count}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {booking.no_of_guests}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// function StatCard({ title, value, icon, trend, percentage }) {
//   const iconClasses = {
//     users:
//       "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
//     activeUsers:
//       "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
//     hotel: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",
//     bed: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
//     dollar:
//       "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
//   };

//   const trendColors = {
//     up: "text-green-500",
//     down: "text-red-500",
//     steady: "text-yellow-500",
//   };

//   const trendIcons = {
//     up: "M5 10l7-7m0 0l7 7m-7-7v18",
//     down: "M19 14l-7 7m0 0l-7-7m7 7V3",
//     steady: "M5 12h14",
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-500">{title}</p>
//           <p className="text-2xl font-semibold text-gray-900">{value}</p>
//         </div>
//         <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d={iconClasses[icon]}
//             />
//           </svg>
//         </div>
//       </div>
//       {trend && (
//         <div className="mt-4 flex items-center">
//           <svg
//             className={`w-4 h-4 ${trendColors[trend]}`}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d={trendIcons[trend]}
//             />
//           </svg>
//           <span className={`ml-1 text-sm ${trendColors[trend]}`}>
//             {percentage ||
//               (trend === "up"
//                 ? "Increased"
//                 : trend === "down"
//                 ? "Decreased"
//                 : "No change")}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }
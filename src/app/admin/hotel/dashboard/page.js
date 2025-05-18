// app/admin/hotel/dashboard/page.js
"use client";
import { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";
import HotelAdminNavbar from "@/components/HotelAdminNavbar";

export default function HotelAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data fetch for hotel-specific stats
  useEffect(() => {
    const fetchStats = async () => {
      setTimeout(() => {
        setStats({
          totalRooms: 42,
          occupied: 28,
          revenue: 12500,
          bookingsToday: 5,
          averageRating: 4.2,
        });
        setLoading(false);
      }, 800);
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Hotel Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Total Rooms</p>
          <p className="text-2xl font-semibold text-gray-900">42</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Occupied Rooms</p>
          <p className="text-2xl font-semibold text-gray-900">28</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Total Bookings</p>
          <p className="text-2xl font-semibold text-gray-900">5</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, Hotel Admin!</h2>
        <p className="text-gray-600">
          Here you can manage your rooms, view bookings, and monitor your
          hotel's performance.
        </p>
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
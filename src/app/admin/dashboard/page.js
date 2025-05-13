"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { adminAPI } from "@/lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Check authentication
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/login");
          return;
        }

        // Fetch real user and hotel counts from backend
        const [userCountData, hotelCountData] = await Promise.all([
          adminAPI.getUsersCount(),
          adminAPI.getHotelsCount(),
        ]);
        // Simulate API call for other stats (replace with real API as needed)
        await new Promise((resolve) => setTimeout(resolve, 800));

        setStats({
          totalUsers: userCountData.totalCount,
          activeUsers: 892, // keep mock for now
          totalHotels: hotelCountData.totalCount,
          occupiedRooms: 342,
          availableRooms: 128,
          revenue: 125640,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!stats) {
    return <div className="text-red-500">Failed to load dashboard data</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="users"
          trend="up"
          percentage="12%"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon="activeUsers"
          trend="up"
          percentage="5%"
        />
        <StatCard
          title="Total Hotels"
          value={stats.totalHotels}
          icon="hotel"
          trend="steady"
        />
        <StatCard
          title="Occupied Rooms"
          value={stats.occupiedRooms}
          icon="bed"
          trend="up"
          percentage="8%"
        />
        <StatCard
          title="Available Rooms"
          value={stats.availableRooms}
          icon="bed"
          trend="down"
          percentage="3%"
        />
        <StatCard
          title="Revenue (USD)"
          value={`$${stats.revenue.toLocaleString()}`}
          icon="dollar"
          trend="up"
          percentage="15%"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="text-gray-500">
          <p>Coming soon...</p>
        </div>
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ title, value, icon, trend, percentage }) {
  const iconClasses = {
    users:
      "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    activeUsers:
      "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    hotel: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",
    bed: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
    dollar:
      "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  };

  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    steady: "text-yellow-500",
  };

  const trendIcons = {
    up: "M5 10l7-7m0 0l7 7m-7-7v18",
    down: "M19 14l-7 7m0 0l-7-7m7 7V3",
    steady: "M5 12h14",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={iconClasses[icon]}
            />
          </svg>
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <svg
            className={`w-4 h-4 ${trendColors[trend]}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={trendIcons[trend]}
            />
          </svg>
          <span className={`ml-1 text-sm ${trendColors[trend]}`}>
            {percentage ||
              (trend === "up"
                ? "Increased"
                : trend === "down"
                ? "Decreased"
                : "No change")}
          </span>
        </div>
      )}
    </div>
  );
}

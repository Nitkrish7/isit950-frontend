// app/admin/hotel/dashboard/page.js
"use client";
import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { useHotelAdmin } from "@/context/HotelAdminContext";
import HotelAdminNavbar from "@/components/HotelAdminNavbar";
import ReportGenerator from "@/components/ReportGenerator";
import withRole from "@/components/withRole";
import { FiCalendar, FiHome, FiBookmark, FiTrendingUp } from "react-icons/fi";

export default withRole(HotelAdminDashboard, ["admin"]);

function HotelAdminDashboard() {
  const { adminId, hotelId, loading: contextLoading } = useHotelAdmin();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [calendarData, setCalendarData] = useState({});
  const [hotelName, setHotelName] = useState("");
  const [stats, setStats] = useState(null);
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  useEffect(() => {
    if (!hotelId) return;
    if (!now) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get all rooms
        const roomsRes = await adminAPI.listRooms(hotelId);
        setRooms(roomsRes);

        // Get current month's start and end dates
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Fetch blocked and booked dates for each room
        const roomData = {};
        for (const room of roomsRes) {
          const [blockedDates, bookedDates] = await Promise.all([
            adminAPI.getBlockedDates(
              room.id,
              startDate.toISOString(),
              endDate.toISOString()
            ),
            adminAPI.getBookedDates(
              room.id,
              startDate.toISOString(),
              endDate.toISOString()
            ),
          ]);

          roomData[room.id] = {
            name: room.name,
            blockedDates: blockedDates,
            bookedDates: bookedDates,
          };
        }

        setCalendarData(roomData);
        // Fetch hotel name
        const hotelDetails = await adminAPI.getHotelDetails(hotelId);
        setHotelName(hotelDetails.name);
        // Fetch stats
        const statsRes = await adminAPI.getHotelAdminStats(hotelId);
        setStats(statsRes);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId, now]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const isDateBlocked = (day, roomId) => {
    if (!day || !calendarData[roomId] || !now) return false;
    const date = new Date(now.getFullYear(), now.getMonth(), day);
    const dateStr = date.toISOString().split("T")[0];
    return calendarData[roomId].blockedDates.includes(dateStr);
  };

  const isDateBooked = (day, roomId) => {
    if (!day || !calendarData[roomId] || !now) return false;
    const date = new Date(now.getFullYear(), now.getMonth(), day);
    const dateStr = date.toISOString().split("T")[0];
    return calendarData[roomId].bookedDates.includes(dateStr);
  };

  // Only show rooms with at least one blocked or booked date in the month
  const filteredRooms = rooms.filter((room) => {
    const data = calendarData[room.id];
    return (
      data &&
      ((data.blockedDates && data.blockedDates.length > 0) ||
        (data.bookedDates && data.bookedDates.length > 0))
    );
  });

  if (contextLoading || loading || !now) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const days = getDaysInMonth(now);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonth = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {hotelName} • {currentMonth} {currentYear}
            </p>
          </div>
          <ReportGenerator
            type="hotel"
            hotelId={hotelId}
            hotelName={hotelName}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg max-w-xl">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                  <FiHome size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Rooms
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalRooms ?? "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-green-50 text-green-600">
                  <FiBookmark size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Occupied Rooms
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.occupiedRooms ?? "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                  <FiTrendingUp size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalBookings ?? "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-amber-50 text-amber-600">
                  <FiCalendar size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Current Month
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {currentMonth}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">
              Room Availability
            </h2>
            <p className="text-gray-600 mt-1">
              Overview of room status for {currentMonth}
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-7 gap-1 mb-3">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center font-medium text-gray-500 py-2 text-sm"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square p-1 rounded-lg transition-all ${
                    day
                      ? "hover:bg-gray-50 border border-gray-100"
                      : "bg-gray-50"
                  } ${
                    day === now.getDate() &&
                    "ring-2 ring-blue-500 ring-offset-1"
                  }`}
                >
                  {day && (
                    <>
                      <div
                        className={`text-sm font-medium mb-1 text-right px-1 ${
                          day === now.getDate()
                            ? "text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        {day}
                      </div>
                      <div className="space-y-1 max-h-[calc(100%-24px)] overflow-y-auto">
                        {filteredRooms.map((room) => (
                          <div
                            key={room.id}
                            className={`text-xs p-1 rounded truncate ${
                              isDateBlocked(day, room.id)
                                ? "bg-amber-50 text-amber-800 border border-amber-100"
                                : isDateBooked(day, room.id)
                                ? "bg-green-50 text-green-800 border border-green-100"
                                : "bg-gray-50 text-gray-500 border border-gray-100"
                            }`}
                            title={room.name}
                          >
                            {room.name}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-50 border border-green-100 rounded-sm"></div>
            <span className="text-sm text-gray-600">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-50 border border-amber-100 rounded-sm"></div>
            <span className="text-sm text-gray-600">Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-50 border border-gray-100 rounded-sm"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-50 border border-blue-100 rounded-sm"></div>
            <span className="text-sm text-gray-600">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useRouter, usePathname } from "next/navigation";
import HotelAdminNavbar from "@/components/HotelAdminNavbar";
import { HotelAdminProvider, useHotelAdmin } from "@/context/HotelAdminContext";
import { useState, useRef, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { userAPI } from "@/lib/api";

export default function HotelAdminLayout({ children }) {
  const router = useRouter();
  const { adminId } = useHotelAdmin() || {};
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const notificationsRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  // Fetch notifications when bell is clicked
  const fetchNotifications = async () => {
    if (!adminId) return;
    setNotificationsLoading(true);
    try {
      const data = await userAPI.getNotifications(adminId);
      setNotifications(data);
    } catch {
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBellClick = async () => {
    if (!notificationsOpen) {
      await fetchNotifications();
    }
    setNotificationsOpen((open) => !open);
  };

  return (
    <HotelAdminProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <HotelAdminNavbar />
        <div className="">
          {/* Top Bar */}
          {/* <header className="bg-white shadow">
            <div className="flex justify-between items-center px-6 py-4">
              <h2 className="text-lg font-semibold">Dashboard Overview</h2>
              <div className="flex items-center gap-6">
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={handleBellClick}
                    className="p-2 rounded-full hover:bg-indigo-50 transition-colors focus:outline-none relative"
                    aria-label="Notifications"
                  >
                    <FiBell className="w-6 h-6 text-gray-500" />
                    {notifications.length > 0 && !notificationsOpen && (
                      <span className="absolute top-1 right-1 block w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
                    )}
                  </button>
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 max-w-xs bg-white rounded-md shadow-lg py-2 z-50 ring-1 ring-black ring-opacity-5">
                      <div className="px-4 py-2 border-b text-gray-700 font-semibold text-base">
                        Notifications
                      </div>
                      {notificationsLoading ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          Loading...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-400 text-sm">
                          No notifications
                        </div>
                      ) : (
                        <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                          {notifications.map((notif) => (
                            <li
                              key={notif.id}
                              className="px-4 py-3 hover:bg-indigo-50 transition-colors"
                            >
                              <div className="text-sm text-gray-800">
                                {notif.description}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {new Date(notif.timestamp).toLocaleString()}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </header> */}

          {/* Page Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </HotelAdminProvider>
  );
}

function NavItem({ href, icon, children }) {
  return (
    <Link href={href} className="flex items-center px-6 py-3 hover:bg-blue-700">
      <span className="material-icons mr-3">{icon}</span>
      {children}
    </Link>
  );
}

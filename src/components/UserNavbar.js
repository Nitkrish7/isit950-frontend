"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useMembership } from "@/context/MembershipContext";
import { useState, useRef, useEffect } from "react";
import {
  FiUser,
  FiLogOut,
  FiHome,
  FiHeart,
  FiCalendar,
  FiChevronDown,
  FiArrowLeft,
  FiBell,
} from "react-icons/fi";
import { userAPI } from "@/lib/api";

export default function UserNavbar({ back = false }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { resetMembership } = useMembership();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutId = useRef();
  const dropdownRef = useRef(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const notificationsRef = useRef(null);

  // Fetch notifications when bell is clicked
  const fetchNotifications = async () => {
    if (!user?.id) return;
    setNotificationsLoading(true);
    try {
      const data = await userAPI.getNotifications(user.id);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(timeoutId.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId.current = setTimeout(() => setDropdownOpen(false), 200);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center">
            {back && (
              <button
                onClick={() => router.back()}
                className="mr-2 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                aria-label="Go back"
              >
                <FiArrowLeft className="w-5 h-5 text-indigo-600" />
              </button>
            )}

            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600">
                Staytion
              </span>
            </Link>

            <div className="hidden md:block ml-10">
              <div className="flex space-x-8">
                <Link
                  href="/home"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <FiHome className="w-4 h-4" />
                  Home
                </Link>
                <Link
                  href="/favourites"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <FiHeart className="w-4 h-4" />
                  Favourites
                </Link>
                <Link
                  href="/bookings"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                  <FiCalendar className="w-4 h-4" />
                  Bookings
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Notification bell and User dropdown */}
          <div className="hidden md:flex items-center gap-4">
            {/* Notification Bell */}
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
            {/* User dropdown */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full"
              >
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  {user?.name?.charAt(0)?.toUpperCase() || (
                    <FiUser className="w-4 h-4" />
                  )}
                </div>
                <span className="text-gray-700 font-medium text-sm">
                  {user?.name || "User"}
                </span>
                <FiChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    dropdownOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                  >
                    <FiUser className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      resetMembership();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleDropdown}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`h-6 w-6 ${dropdownOpen ? "hidden" : "block"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`h-6 w-6 ${dropdownOpen ? "block" : "hidden"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${dropdownOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          <Link
            href="/home"
            className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3"
          >
            <FiHome className="w-5 h-5" />
            Home
          </Link>
          <Link
            href="/favourites"
            className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3"
          >
            <FiHeart className="w-5 h-5" />
            Favourites
          </Link>
          <Link
            href="/bookings"
            className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3"
          >
            <FiCalendar className="w-5 h-5" />
            Bookings
          </Link>
          <div className="border-t border-gray-200 mt-2 pt-2">
            <Link
              href="/profile"
              className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3"
            >
              <FiUser className="w-5 h-5" />
              Profile
            </Link>
            <button
              onClick={() => {
                logout();
                resetMembership();
              }}
              className="w-full text-left text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-3"
            >
              <FiLogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

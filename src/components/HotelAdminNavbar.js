"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useHotelAdmin } from "@/context/HotelAdminContext";
import { useState, useRef, useEffect } from "react";
import { FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";

const navItems = [
  { label: "Dashboard", href: "/admin/hotel/dashboard", icon: "dashboard" },
  { label: "Basic Info", href: "/admin/hotel/basic-info", icon: "info" },
  {
    label: "Room Management",
    href: "/admin/hotel/rooms",
    icon: "meeting_room",
  },
  { label: "Bookings", href: "/admin/hotel/bookings", icon: "calendar_today" },
];

export default function HotelAdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { adminId, hotelId, loading: contextLoading } = useHotelAdmin();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutId = useRef();
  const dropdownRef = useRef(null);

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

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case "dashboard":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        );
      case "info":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "meeting_room":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M7 4a1 1 0 011-1h4a1 1 0 011 1v1h1.5a1.5 1.5 0 011.5 1.5v11a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 014 17.5v-11A1.5 1.5 0 015.5 5H7V4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "calendar_today":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white flex flex-col shadow-xl">
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-2xl font-bold text-white">Staytion</h1>
        <p className="text-blue-200 text-sm mt-1">Hotel Admin Panel</p>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
              pathname === item.href
                ? "bg-blue-600 shadow-md"
                : "hover:bg-blue-700 hover:bg-opacity-50"
            }`}
          >
            <span className="mr-3 opacity-80">{getIcon(item.icon)}</span>
            <span className="font-medium">{item.label}</span>
            {pathname === item.href && (
              <span className="ml-auto w-1.5 h-1.5 bg-blue-200 rounded-full"></span>
            )}
          </Link>
        ))}
      </nav>

      {/* Profile Section */}
      <div className="p-4 border-t border-blue-700">
        <div
          className="relative"
          ref={dropdownRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={toggleDropdown}
            className="w-full flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg p-2 hover:bg-blue-700 hover:bg-opacity-50"
          >
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FiUser className="w-4 h-4" />
            </div>
            <span className="text-white font-medium text-sm flex-1 text-left">
              Hotel Admin
            </span>
            <FiChevronDown
              className={`w-4 h-4 text-blue-200 transition-transform ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
              <Link
                href="/admin/hotel/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
              >
                <FiUser className="w-4 h-4" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
        <p className="text-blue-200 text-sm mt-4">
          © {new Date().getFullYear()} Staytion
        </p>
      </div>
    </div>
  );
}

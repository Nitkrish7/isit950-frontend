"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef } from "react";

export default function UserNavbar({ back = false }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutId = useRef();

  const handleMouseEnter = () => {
    clearTimeout(timeoutId.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId.current = setTimeout(() => setDropdownOpen(false), 100);
  };

  return (
    <nav className="bg-white shadow flex items-center justify-between px-8 py-4 mb-8">
      <div className="flex items-center gap-4">
        {back && (
          <button
            onClick={() => router.back()}
            className="mr-2 p-2 rounded-full hover:bg-indigo-100 transition"
            aria-label="Go back"
          >
            <svg
              className="w-6 h-6 text-indigo-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <div className="text-2xl font-bold text-indigo-700">Staytion</div>
      </div>
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center space-x-2 cursor-pointer select-none">
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            {user?.name?.charAt(0) || "U"}
          </div>
          <span className="text-gray-700 font-medium">
            {user?.name || "User"}
          </span>
        </div>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
            <Link
              href="/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

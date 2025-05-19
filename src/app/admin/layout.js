"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-indigo-800 to-indigo-900 text-white shadow-xl">
        <div className="p-6 border-b border-indigo-700">
          <h1 className="text-2xl font-bold text-white">Staytion</h1>
          <p className="text-indigo-200 text-sm mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link
            href="/admin/dashboard"
            className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-indigo-700 hover:bg-opacity-50"
          >
            <svg
              className="w-5 h-5 mr-3 opacity-80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-indigo-700 hover:bg-opacity-50"
          >
            <svg
              className="w-5 h-5 mr-3 opacity-80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="font-medium">Users</span>
          </Link>

          <Link
            href="/admin/hotels"
            className="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-indigo-700 hover:bg-opacity-50"
          >
            <svg
              className="w-5 h-5 mr-3 opacity-80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>
            <span className="font-medium">Hotels</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-indigo-700 text-sm text-indigo-200">
          <p>© {new Date().getFullYear()} Staytion</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Dashboard Overview
            </h2>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
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
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 lg:p-10 bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}

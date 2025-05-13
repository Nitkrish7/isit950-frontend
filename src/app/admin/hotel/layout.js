"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HotelAdminLayout({ children }) {
  const router = useRouter();
  const hotelId = 1; // Would come from auth context

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-blue-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Hotel Admin Panel</h1>
          <p className="text-xs text-blue-200">Hotel ID: {hotelId}</p>
        </div>
        <nav className="mt-6">
          <NavItem href="/admin/hotel/dashboard">
            Dashboard
          </NavItem>
          <NavItem href="/admin/hotel/rooms">
            Room Management
          </NavItem>
          <NavItem href="/admin/hotel/bookings">
            Bookings
          </NavItem>
          <NavItem href="/admin/hotel/analytics">
            Analytics
          </NavItem>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow">
          {/* <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-lg font-semibold">Hotel Administration</h2>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div> */}
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
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

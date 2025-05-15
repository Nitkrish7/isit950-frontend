"use client";
import { useRouter } from "next/navigation";
import HotelAdminNavbar from "@/components/HotelAdminNavbar";

export default function HotelAdminLayout({ children }) {
  const router = useRouter();
  const hotelId = 1; // Would come from auth context

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HotelAdminNavbar />
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

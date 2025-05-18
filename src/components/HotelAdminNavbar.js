"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin/hotel/dashboard" },
  { label: "Basic Info", href: "/admin/hotel/basic-info" },
  { label: "Room Management", href: "/admin/hotel/rooms" },
  { label: "Bookings", href: "/admin/hotel/bookings" },
];

export default function HotelAdminNavbar() {
  const pathname = usePathname();
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-blue-800 text-white flex flex-col">
      <div className="p-4 border-b border-blue-700">
        <h1 className="text-2xl font-bold">Hotel Admin Panel</h1>
      </div>
      <nav className="flex-1 mt-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-6 py-3 hover:bg-blue-700 transition font-medium ${
              pathname === item.href ? "bg-blue-900" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

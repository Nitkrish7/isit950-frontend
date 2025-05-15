"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserNavbar({ back = false }) {
  const router = useRouter();
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
      <div>
        <Link href="/profile">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center cursor-pointer hover:bg-indigo-200 transition">
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
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </Link>
      </div>
    </nav>
  );
}

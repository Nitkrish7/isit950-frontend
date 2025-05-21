"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { userAPI } from "@/lib/api";
import UserNavbar from "@/components/UserNavbar";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiEdit2,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { FaUserShield } from "react-icons/fa";
import { format } from "date-fns";
import Link from "next/link";
import { useMembership } from "@/context/MembershipContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, fetchUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { membership } = useMembership();

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const email = localStorage.getItem("userEmail");
        if (!token || !email) {
          router.push("/login");
          return;
        }
        await fetchUser(email);
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    setEditData(user || {});
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setSuccess("");
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        email: editData.email,
        name: editData.name,
        phonenumber: editData.phonenumber,
        dateofbirth: editData.dateofbirth,
      };
      await userAPI.updateProfile(payload);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      await fetchUser(editData.email);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/home"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Home
        </Link>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Profile Information
              </h3>
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <FiUser className="text-gray-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={editData.name || ""}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <FiMail className="text-gray-400" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={editData.email || ""}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
                      disabled
                      required
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="phonenumber"
                      className="block text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <FiPhone className="text-gray-400" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phonenumber"
                      id="phonenumber"
                      value={editData.phonenumber || ""}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Date of Birth Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="dateofbirth"
                      className="block text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <FiCalendar className="text-gray-400" />
                      Date of Birth
                    </label>
                    <input
                      type="text"
                      name="dateofbirth"
                      id="dateofbirth"
                      value={editData.dateofbirth || ""}
                      onChange={handleInputChange}
                      placeholder="DD/MM/YYYY"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Membership Field */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Membership Tier
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${
                          membership.tier === "gold"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {membership.tier === "gold" ? "Gold" : "Free"}
                      </span>
                      {membership.tier === "gold" && membership.expiryDate && (
                        <span className="text-sm text-gray-500">
                          Expires:{" "}
                          {new Date(membership.expiryDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Membership Upgrade Button */}
                {membership.tier === "free" && (
                  <div className="mt-6">
                    <Link
                      href="/subscription"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Upgrade to Gold Membership
                    </Link>
                  </div>
                )}

                {/* Reset Password Link */}
                <div className="mt-6">
                  <Link
                    href="/reset-password"
                    className="inline-block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                  >
                    Reset Password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

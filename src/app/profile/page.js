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

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, fetchUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/home"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Home
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">My Profile</h1>
                <p className="mt-1 text-blue-100">
                  Manage your personal information and settings
                </p>
              </div>
              <button
                onClick={handleEditToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditing
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-white text-indigo-700 hover:bg-indigo-50"
                }`}
                disabled={!user}
              >
                {isEditing ? (
                  <>
                    <FiX className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <FiEdit2 className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-8">
            {/* Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <div className="flex items-center">
                  <FiAlertCircle className="h-5 w-5 text-red-500 mr-3" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <div className="flex items-center">
                  <FiCheck className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-green-700">{success}</span>
                </div>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-6 py-2 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <FiUser className="text-gray-400" />
                      Full Name
                    </div>
                    <div className="text-gray-900 font-medium">
                      {user?.name || "N/A"}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <FiMail className="text-gray-400" />
                      Email
                    </div>
                    <div className="text-gray-900 font-medium">
                      {user?.email || "N/A"}
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <FiPhone className="text-gray-400" />
                      Phone Number
                    </div>
                    <div className="text-gray-900 font-medium">
                      {user?.phonenumber || "N/A"}
                    </div>
                  </div>

                  {/* Date of Birth Field */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <FiCalendar className="text-gray-400" />
                      Date of Birth
                    </div>
                    <div className="text-gray-900 font-medium">
                      {formatDate(user?.dateofbirth)}
                    </div>
                  </div>

                  {/* Role Field */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <FaUserShield className="text-gray-400" />
                      Role
                    </div>
                    <div className="text-gray-900 font-medium capitalize">
                      {user?.role || "N/A"}
                    </div>
                  </div>
                </div>

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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

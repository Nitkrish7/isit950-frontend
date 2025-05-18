"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";
import { userAPI } from "@/lib/api";
import UserNavbar from "@/components/UserNavbar";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, fetchUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showError, setShowError] = useState(true);

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

  if (isLoading || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="max-w-3xl mx-auto py-4 px-4">
        <Link
          href="/home"
          className="inline-flex items-center text-indigo-700 hover:text-indigo-900 mb-4 font-medium"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Error Toast */}
          {error && showError && (
            <div className="mb-4 flex items-center justify-between p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              <span>{error}</span>
              <button
                onClick={() => setShowError(false)}
                className="ml-4 px-2 py-1 text-xs bg-red-200 text-red-800 rounded hover:bg-red-300"
              >
                Dismiss
              </button>
            </div>
          )}
          {/* Profile Header */}
          <div className="bg-indigo-700 px-6 py-8 sm:px-10 sm:py-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">User Profile</h1>
                <p className="mt-1 text-indigo-200">
                  Manage your account information
                </p>
              </div>
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-white text-indigo-700 rounded-md font-medium hover:bg-indigo-50 transition-colors"
                disabled={!user}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-8 sm:px-10 sm:py-12">
            {success && (
              <div className="mb-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg">
                {success}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={editData.name || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={editData.email || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      disabled
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phonenumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phonenumber"
                      id="phonenumber"
                      value={editData.phonenumber || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="dateofbirth"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="text"
                      name="dateofbirth"
                      id="dateofbirth"
                      value={editData.dateofbirth || ""}
                      onChange={handleInputChange}
                      placeholder="DD/MM/YYYY"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">
                      Full Name
                    </h2>
                    <p className="mt-1 text-sm text-gray-900">
                      {user?.name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Email</h2>
                    <p className="mt-1 text-sm text-gray-900">
                      {user?.email || "N/A"}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm font-medium text-gray-500">
                      Phone Number
                    </h2>
                    <p className="mt-1 text-sm text-gray-900">
                      {user?.phonenumber || "N/A"}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm font-medium text-gray-500">
                      Date of Birth
                    </h2>
                    <p className="mt-1 text-sm text-gray-900">
                      {user?.dateofbirth || "N/A"}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Role</h2>
                    <p className="mt-1 text-sm text-gray-900 capitalize">
                      {user?.role || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

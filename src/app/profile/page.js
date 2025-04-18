"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mock user data - replace with real API call later
  const mockUserData = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Hotel St, Suite 456",
    membershipLevel: "Gold",
    lastLogin: "2023-06-15T10:30:00Z",
  };

  // Mock API to fetch user data
  const fetchUserData = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUserData);
      }, 800);
    });
  };

  // Mock API to update user data
  const updateUserData = async (updatedData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (updatedData.name && updatedData.email) {
          resolve({ ...mockUserData, ...updatedData });
        } else {
          reject(new Error("Validation failed"));
        }
      }, 1000);
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const data = await fetchUserData();
        setUserData(data);
        setEditData(data);
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

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
      const updatedData = await updateUserData(editData);
      setUserData(updatedData);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !userData) {
    return <LoadingSpinner />;
  }

  if (!userData) {
    return <div className="p-4 text-red-500">No user data available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
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
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-8 sm:px-10 sm:py-12">
            {error && (
              <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg">
                {success}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit}>
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
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={editData.phone || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={editData.address || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
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
                      {userData.name}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Email</h2>
                    <p className="mt-1 text-sm text-gray-900">
                      {userData.email}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm font-medium text-gray-500">Phone</h2>
                    <p className="mt-1 text-sm text-gray-900">
                      {userData.phone}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm font-medium text-gray-500">
                      Membership Level
                    </h2>
                    <p className="mt-1 text-sm text-gray-900">
                      {userData.membershipLevel}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <h2 className="text-sm font-medium text-gray-500">
                      Address
                    </h2>
                    <p className="mt-1 text-sm text-gray-900">
                      {userData.address}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-sm font-medium text-gray-500">
                      Last Login
                    </h2>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(userData.lastLogin).toLocaleString()}
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

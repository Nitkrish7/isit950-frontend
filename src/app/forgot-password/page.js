"use client";
import { useState } from "react";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import { userAPI } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    try {
      // Call backend API to get temporary password
      const res = await userAPI.forgotPassword(email);
      const tempPassword = res.temporaryPassword;
      // Send email with emailjs
      await emailjs.send(
        "service_3bufmww",
        "template_rir83dh",
        {
          email: email,
          temporaryPassword: tempPassword,
        },
        { publicKey: "D7yqutHMazalcl_0z" }
      );
      setSubmitted(true);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Staytion
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-white shadow rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-indigo-700 mb-4">
            Forgot Password
          </h1>
          {submitted ? (
            <div className="text-green-600 font-medium mb-4">
              If an account with that email exists, a password reset link has
              been sent.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Send Reset Link
              </button>
            </form>
          )}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-indigo-600 hover:underline">
              Back to Login
            </Link>
            <span className="mx-2 text-gray-400">|</span>
            <Link href="/" className="text-indigo-600 hover:underline">
              Back to Landing Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

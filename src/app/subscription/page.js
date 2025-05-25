"use client";
import { useState } from "react";
import { useMembership } from "@/context/MembershipContext";
import { useRouter } from "next/navigation";
import UserNavbar from "@/components/UserNavbar";
import { FiArrowLeft } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { userAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import emailjs from "@emailjs/browser";

export default function SubscriptionPage() {
  const { membership, updateMembership, renewMembership } = useMembership();
  const { user, fetchUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [renewLoading, setRenewLoading] = useState(false);
  const [renewError, setRenewError] = useState("");
  const [renewSuccess, setRenewSuccess] = useState(false);

  const plans = [
    {
      id: "monthly",
      label: "Monthly",
      price: 19.99,
      priceText: "$19.99",
      duration: 30, // days
      description: "Billed monthly, cancel anytime",
      highlight: false,
      badge: "Most Popular",
    },
    {
      id: "yearly",
      label: "Yearly",
      price: 199,
      priceText: "$199",
      duration: 365, // days
      description: "Billed yearly, save 17% vs monthly",
      highlight: true,
      badge: "Best Value",
    },
  ];

  const handlePurchase = () => {
    setPaymentModalOpen(true);
    setPaymentSuccess(false);
    setPaymentError("");
    setCardNumber("");
    setCardName("");
    setCardExpiry("");
    setCardCVV("");
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentLoading(true);
    setPaymentError("");
    setPaymentSuccess(false);
    // Simulate payment processing delay
    setTimeout(async () => {
      // Simple dummy validation
      if (
        cardNumber.length !== 16 ||
        !/^[0-9]{16}$/.test(cardNumber) ||
        cardName.trim() === "" ||
        !/^\d{2}\/\d{2}$/.test(cardExpiry) ||
        cardCVV.length !== 3 ||
        !/^[0-9]{3}$/.test(cardCVV)
      ) {
        setPaymentError("Please enter valid card details.");
        setPaymentLoading(false);
        return;
      }
      setPaymentSuccess(true);
      setPaymentLoading(false);
      // Wait a moment, then proceed to upgrade membership
      setTimeout(async () => {
        const plan = plans.find((p) => p.id === selectedPlan);
        try {
          const expiresOn = new Date(
            Date.now() + plan.duration * 24 * 60 * 60 * 1000
          );
          await userAPI.createSubscription({
            userid: user.id,
            expireson: expiresOn.toISOString(),
            amountpaid: plan.price,
          });
          await fetchUser(user.email);
          // Send gold membership confirmation email
          await emailjs.send(
            "service_oqimzhm",
            "template_4rypdbf",
            {
              name: user?.name || "",
              amountPaid: plan.price,
              expiresOn: `${expiresOn.getDate().toString().padStart(2, "0")}-${(
                expiresOn.getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}-${expiresOn.getFullYear()}`,
              email: user?.email || "",
            },
            { publicKey: "SyPA3PMWcj17sU8BK" }
          );
        } catch (err) {
          setPaymentError("Failed to create subscription. Please try again.");
          return;
        }
        setPaymentModalOpen(false);
        router.push("/profile");
      }, 1200);
    }, 1200);
  };

  const handleRenew = () => {
    setRenewModalOpen(true);
    setRenewError("");
    setRenewSuccess(false);
    setCardNumber("");
    setCardName("");
    setCardExpiry("");
    setCardCVV("");
  };

  const handleRenewSubmit = async (e) => {
    e.preventDefault();
    setRenewLoading(true);
    setRenewError("");
    setRenewSuccess(false);
    // Simple validation
    if (
      cardNumber.length !== 16 ||
      !/^[0-9]{16}$/.test(cardNumber) ||
      cardName.trim() === "" ||
      !/^\d{2}\/\d{2}$/.test(cardExpiry) ||
      cardCVV.length !== 3 ||
      !/^[0-9]{3}$/.test(cardCVV)
    ) {
      setRenewError("Please enter valid card details.");
      setRenewLoading(false);
      return;
    }
    // Calculate new expiry: extend from current expiry or today, whichever is later
    const renewalAmount = 199;
    const renewalDurationDays = 365;
    const newExpiry = new Date(
      Math.max(new Date(membership.expiryDate).getTime(), Date.now()) +
        renewalDurationDays * 24 * 60 * 60 * 1000
    ).toISOString();
    try {
      await renewMembership(newExpiry, renewalAmount);
      setRenewSuccess(true);
      setTimeout(() => {
        setRenewModalOpen(false);
        router.push("/profile");
      }, 1200);
    } catch (err) {
      setRenewError("Failed to renew membership. Please try again.");
    } finally {
      setRenewLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Link
          href="/home"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Upgrade to Gold Membership
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Get exclusive benefits and save on every booking
          </p>
        </div>

        {/* Show renew button for gold members */}
        {membership.tier === "gold" && (
          <div className="flex flex-col items-center mt-8">
            <div className="mb-2 text-yellow-700 font-semibold">
              Your Gold Membership will expire on{" "}
              {membership.expiryDate
                ? new Date(membership.expiryDate).toLocaleDateString()
                : "-"}
            </div>
            <button
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors mb-4"
              onClick={handleRenew}
            >
              Renew Membership
            </button>
          </div>
        )}

        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedPlan === plan.id
                    ? "border-yellow-500 ring-2 ring-yellow-200"
                    : "border-gray-100"
                } ${plan.highlight ? "scale-105" : ""}`}
                onClick={() => setSelectedPlan(plan.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="px-6 py-8 sm:p-10 sm:pb-6">
                  <div className="flex justify-center">
                    <span
                      className={`inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase ${
                        plan.highlight
                          ? "bg-yellow-500 text-white"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-center text-5xl font-extrabold text-gray-900">
                    <span className="ml-1 mr-3 text-xl font-medium text-gray-500">
                      $
                    </span>
                    {plan.price}
                    <span className="ml-3 text-xl font-medium text-gray-500">
                      {plan.id === "monthly" ? "/month" : "/year"}
                    </span>
                  </div>
                  <div className="mt-2 text-center text-gray-500 text-base">
                    {plan.description}
                  </div>
                </div>
                <div className="px-6 pt-6 pb-8 sm:px-10 sm:pb-10">
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        10% discount on all bookings
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Priority customer support
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        Early access to deals and promotions
                      </p>
                    </li>
                  </ul>
                  <div className="mt-10">
                    <button
                      onClick={handlePurchase}
                      disabled={loading || membership.tier === "gold"}
                      className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                        membership.tier === "gold"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-yellow-600 hover:bg-yellow-700"
                      } md:py-4 md:text-lg md:px-10`}
                    >
                      {loading
                        ? "Processing..."
                        : membership.tier === "gold"
                        ? "Already a Gold Member"
                        : `Choose ${plan.label}`}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl rounded-full p-2"
              onClick={() => setPaymentModalOpen(false)}
              disabled={paymentLoading}
            >
              &times;
            </button>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Payment Details
              </h3>
              <div className="mb-4 text-lg font-semibold text-gray-700">
                {plans.find((p) => p.id === selectedPlan).label} Plan:{" "}
                {plans.find((p) => p.id === selectedPlan).priceText}
              </div>
              {paymentSuccess ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <svg
                    className="w-16 h-16 text-green-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <h4 className="text-xl font-semibold text-green-700 mb-2">
                    Payment Successful!
                  </h4>
                  <p className="text-gray-600">Upgrading your membership...</p>
                </div>
              ) : (
                <form onSubmit={handlePaymentSubmit} className="space-y-5">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      inputMode="numeric"
                      pattern="[0-9]{16}"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(e.target.value.replace(/\D/g, ""))
                      }
                      required
                      disabled={paymentLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                      disabled={paymentLoading}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        pattern="\d{2}/\d{2}"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="08/27"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                        disabled={paymentLoading}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={3}
                        pattern="[0-9]{3}"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="123"
                        value={cardCVV}
                        onChange={(e) =>
                          setCardCVV(e.target.value.replace(/\D/g, ""))
                        }
                        required
                        disabled={paymentLoading}
                      />
                    </div>
                  </div>
                  {paymentError && (
                    <div className="text-red-600 text-sm">{paymentError}</div>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? (
                      <span className="inline-flex items-center">
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
                        Processing Payment...
                      </span>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Renew Modal for gold members */}
      {renewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl rounded-full p-2"
              onClick={() => setRenewModalOpen(false)}
              disabled={renewLoading}
            >
              &times;
            </button>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Renew Gold Membership
              </h3>
              <div className="mb-4 text-lg font-semibold text-gray-700">
                1 Year: $199
              </div>
              {renewSuccess ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <svg
                    className="w-16 h-16 text-green-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <h4 className="text-xl font-semibold text-green-700 mb-2">
                    Renewal Successful!
                  </h4>
                  <p className="text-gray-600">Updating your membership...</p>
                </div>
              ) : (
                <form onSubmit={handleRenewSubmit} className="space-y-5">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      inputMode="numeric"
                      pattern="[0-9]{16}"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(e.target.value.replace(/\D/g, ""))
                      }
                      required
                      disabled={renewLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                      disabled={renewLoading}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        pattern="\d{2}/\d{2}"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="08/27"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                        disabled={renewLoading}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={3}
                        pattern="[0-9]{3}"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="123"
                        value={cardCVV}
                        onChange={(e) =>
                          setCardCVV(e.target.value.replace(/\D/g, ""))
                        }
                        required
                        disabled={renewLoading}
                      />
                    </div>
                  </div>
                  {renewError && (
                    <div className="text-red-600 text-sm">{renewError}</div>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                    disabled={renewLoading}
                  >
                    {renewLoading ? (
                      <span className="inline-flex items-center">
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
                        Processing Renewal...
                      </span>
                    ) : (
                      "Pay & Renew"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

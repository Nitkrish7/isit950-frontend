"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { userAPI } from "@/lib/api";
import toast from "react-hot-toast";

const MembershipContext = createContext();

export function MembershipProvider({ children }) {
  const { user, fetchUser } = useAuth();
  const [membership, setMembership] = useState({
    tier: "free", // or "gold"
    expiryDate: null,
    subscriptionId: null,
  });

  useEffect(() => {
    if (user && user.Subscriptions && user.Subscriptions.length > 0) {
      // Find the latest valid subscription
      const validSub = user.Subscriptions.find(
        (sub) => new Date(sub.expireson) > new Date()
      );
      if (validSub) {
        setMembership({
          tier: "gold",
          expiryDate: validSub.expireson,
          subscriptionId: validSub.id || validSub._id || null,
        });
        return;
      }
    }
    setMembership({ tier: "free", expiryDate: null, subscriptionId: null });
  }, [user]);

  // Only for internal context updates, not for subscription
  const updateMembership = (newMembership) => {
    setMembership(newMembership);
  };

  const resetMembership = () => {
    setMembership({ tier: "free", expiryDate: null, subscriptionId: null });
  };

  const calculateDiscountedPrice = (originalPrice) => {
    if (membership.tier === "gold") {
      return originalPrice * 0.9; // 10% discount
    }
    return originalPrice;
  };

  // Helper to format date as 'DD-MM-YYYY HH:mm:ss'
  function formatDateTime(dateString) {
    const date = new Date(dateString);
    const pad = (n) => n.toString().padStart(2, "0");
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  // For renewals, call the update API
  const renewMembership = async (expireson, amountpaid) => {
    // Get the latest subscription ID from user's Subscriptions array
    const latestSubscription = user?.Subscriptions?.[0];
    const subscriptionId = latestSubscription?.id;

    console.log("renewMembership called with:", {
      subscriptionId,
      expireson,
      amountpaid,
    });

    if (!subscriptionId) {
      console.warn("No subscription id found for renewal!");
      return;
    }

    const formattedExpireson = expireson;
    console.log("Calling userAPI.updateSubscription with:", {
      id: subscriptionId,
      expireson: formattedExpireson,
      amountpaid,
    });

    try {
      await userAPI.updateSubscription({
        id: subscriptionId,
        expireson: formattedExpireson,
        amountpaid,
      });
      await fetchUser(user.email); // Refresh user data
      toast.success("Membership renewed successfully!");
    } catch (error) {
      console.error("Error renewing membership:", error);
      toast.error("Failed to renew membership. Please try again.");
    }
  };

  return (
    <MembershipContext.Provider
      value={{
        membership,
        updateMembership, // keep for profile editing, not for subscription
        calculateDiscountedPrice,
        renewMembership,
        resetMembership,
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership() {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error("useMembership must be used within a MembershipProvider");
  }
  return context;
}

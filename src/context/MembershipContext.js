"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { userAPI } from "@/lib/api";

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
    console.log("renewMembership called with:", {
      userId: user.id,
      expireson,
      amountpaid,
    });
    if (!user?.id) {
      console.warn("No user id found for renewal!");
      return;
    }
    const formattedExpireson = formatDateTime(expireson);
    console.log("Calling userAPI.updateSubscription with:", {
      id: user.id,
      expireson: formattedExpireson,
      amountpaid,
    });
    await userAPI.updateSubscription({
      id: user.id,
      expireson: formattedExpireson,
      amountpaid,
    });
    await fetchUser(user.email); // Refresh user data
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

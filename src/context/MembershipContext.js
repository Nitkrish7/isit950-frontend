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
        (sub) => new Date(sub.expirson) > new Date()
      );
      if (validSub) {
        setMembership({
          tier: "gold",
          expiryDate: validSub.expirson,
          subscriptionId: validSub.id || null,
        });
        return;
      }
    }
    setMembership({ tier: "free", expiryDate: null, subscriptionId: null });
  }, [user]);

  const updateMembership = (newMembership) => {
    setMembership(newMembership);
  };

  const calculateDiscountedPrice = (originalPrice) => {
    if (membership.tier === "gold") {
      return originalPrice * 0.9; // 10% discount
    }
    return originalPrice;
  };

  // For renewals, call the update API
  const renewMembership = async (expirson, amountpaid) => {
    if (!membership.subscriptionId) return;
    await userAPI.updateSubscription({
      id: membership.subscriptionId,
      expirson,
      amountpaid,
    });
    await fetchUser(user.email); // Refresh user data
  };

  return (
    <MembershipContext.Provider
      value={{
        membership,
        updateMembership,
        calculateDiscountedPrice,
        renewMembership,
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

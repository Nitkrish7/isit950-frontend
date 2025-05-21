"use client";

import { createContext, useContext, useState, useEffect } from "react";

const MembershipContext = createContext();

export function MembershipProvider({ children }) {
  const [membership, setMembership] = useState({
    tier: "free", // or "gold"
    expiryDate: null,
  });

  useEffect(() => {
    // TODO: Replace with actual API call when backend is ready
    const storedMembership = localStorage.getItem("membership");
    if (storedMembership) {
      setMembership(JSON.parse(storedMembership));
    }
  }, []);

  const updateMembership = (newMembership) => {
    setMembership(newMembership);
    localStorage.setItem("membership", JSON.stringify(newMembership));
  };

  const calculateDiscountedPrice = (originalPrice) => {
    if (membership.tier === "gold") {
      return originalPrice * 0.9; // 10% discount
    }
    return originalPrice;
  };

  return (
    <MembershipContext.Provider
      value={{
        membership,
        updateMembership,
        calculateDiscountedPrice,
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

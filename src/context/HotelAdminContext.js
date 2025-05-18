import React, { createContext, useContext, useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";

const HotelAdminContext = createContext();

export function HotelAdminProvider({ children }) {
  const [adminId, setAdminId] = useState("");
  const [hotelId, setHotelId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdminId = localStorage.getItem("userEmail");
    if (storedAdminId) setAdminId(storedAdminId);

    async function fetchHotelId() {
      if (storedAdminId) {
        try {
          const res = await adminAPI.getHotelIdByAdmin(storedAdminId);
          setHotelId(res.id);
        } catch {
          setHotelId("");
        }
      }
      setLoading(false);
    }
    fetchHotelId();
  }, []);

  return (
    <HotelAdminContext.Provider value={{ adminId, hotelId, loading }}>
      {children}
    </HotelAdminContext.Provider>
  );
}

export function useHotelAdmin() {
  return useContext(HotelAdminContext);
}

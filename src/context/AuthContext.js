"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          // You might want to fetch user data here if needed
          // const userData = await userAPI.getProfile();
          // setUser(userData);
        } catch (err) {
          console.error("Failed to load user", err);
          logout();
        }
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { access_token } = await authAPI.login(email, password);
      localStorage.setItem("authToken", access_token);
      // Fetch user data if needed
      // const userData = await userAPI.getProfile(email);
      // setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message || "Signup failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

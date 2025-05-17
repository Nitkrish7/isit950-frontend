"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI, userAPI } from "@/lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user profile from backend
  const fetchUser = async (email) => {
    try {
      const userData = await userAPI.getProfile(email);
      setUser(userData);
      return userData;
    } catch (err) {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("authToken");
      const email = localStorage.getItem("userEmail");
      if (token && email) {
        await fetchUser(email);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      // Accept both token and access_token for compatibility
      const token = response.token || response.access_token;
      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userEmail", email);
        await fetchUser(email);
        return { success: true, role: response.role };
      } else {
        return { success: false, error: response.message || "Login failed" };
      }
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
    localStorage.removeItem("userEmail");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withRole(Component, allowedRoles = []) {
  return function RoleProtected(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.replace("/login");
        } else if (!allowedRoles.includes(user.role)) {
          // Redirect based on role
          if (user.role === "user") router.replace("/home");
          else if (user.role === "admin")
            router.replace("/admin/hotel/dashboard");
          else if (user.role === "superuser")
            router.replace("/admin/dashboard");
          else router.replace("/login");
        }
      }
    }, [user, loading, router]);

    if (loading || !user || !allowedRoles.includes(user.role)) {
      return null; // or a spinner
    }

    return <Component {...props} />;
  };
}

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "admin";
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { isLoggedIn, user } = useAuth();

  // Chua dang nhap -> redirect login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Yeu cau role admin nhung user khong phai admin
  if (requiredRole === "admin" && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { status } = useAuth();

  if (status === "loading") return null;

  return status === "authenticated" ? <Outlet /> : <Navigate to="/login" replace />;
}
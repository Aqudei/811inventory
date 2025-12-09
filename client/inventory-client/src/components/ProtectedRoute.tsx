import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute isAuthenticated");
  console.log(isAuthenticated);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;

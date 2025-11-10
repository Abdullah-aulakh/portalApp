import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const role = user?.role?.toLowerCase?.();

  if (role === "admin" && location.pathname === "/") {
    return <Navigate to="/admin" replace />;
  }

  if (role === "teacher" && location.pathname === "/") {
    return <Navigate to="/teacher" replace />;
  }

  if (role === "student" && location.pathname === "/") {
    return <Navigate to="/student" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

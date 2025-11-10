import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext";

const StudentOnly = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (user?.role?.toLowerCase() !== "student") return <Navigate to="/" replace />;

  return <Outlet />;
};

export default StudentOnly;

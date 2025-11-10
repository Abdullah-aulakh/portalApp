import { useAuth } from "@/context/AuthContext";

import { Navigate, Outlet, useLocation } from "react-router";
import EaseInOut from "../components/Animations/EaseInOut";
import { AnimatePresence } from "framer-motion";


const AuthPage = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? (
    <Navigate to="/" replace />
  ) : (

    <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-gradient-to-r from-blue-800 to-indigo-900">
      <AnimatePresence mode="wait">
        <EaseInOut key={location.pathname}>
          <Outlet />
        </EaseInOut>
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;

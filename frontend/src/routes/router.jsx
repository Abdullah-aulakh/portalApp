import { createBrowserRouter, Navigate } from "react-router";
import { AuthPage, App } from "@pages/index";
import LoginForm from "@features/auth/LoginForm";
import OtpVerify from "@/features/auth/OtpVerify";
import ForgotPassword from "@/features/auth/ForgotPassword";
import ResetPassword from "@/features/auth/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";
import AdminOnly from "./AdminOnly";
import TeacherOnly from "./TeacherOnly";
import StudentOnly from "./StudentOnly";

import AdminPanel from "@/pages/AdminPanel";
import CreateUserPage from "@/pages/CreateUserPage";
import TeacherPanel from "@/pages/TeacherPanel";
import StudentPanel from "@/pages/StudentPanel";
import CreateDepartmentPage from "@/pages/CreateDepartmentPage";
import Dashboard from "@/features/admin/Dashboard";
import { RoutePath } from "./routes";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/", element: <App /> },


      {
        element: <TeacherOnly />,
        children: [
          { path: "/teacher", element: <TeacherPanel /> },
        ],
      },

      {
        element: <StudentOnly />,
        children: [
          { path: "/student", element: <StudentPanel /> },
        ],
      },

      {
        element: <AdminOnly />,
        children: [
          { path: "/admin",
            element: <AdminPanel />,
            children: [
              {index:true, element:<Navigate to="dashboard" replace />},
              {path:"dashboard", element:<Dashboard />},
              { path: "users/create-user", element: <CreateUserPage /> },
              { path: "departments/create-department", element: <CreateDepartmentPage /> },
            ]
          },
          
        ],
      },
    ],
  },


  {
    path: RoutePath.AUTH,
    element: <AuthPage />,
    children: [
      { index: true, element: <LoginForm /> },
      { path: RoutePath.LOGIN, element: <LoginForm /> },
      { path: RoutePath.OTP, element: <OtpVerify /> },
      { path: RoutePath.FORGOT_PASSWORD, element: <ForgotPassword /> },
      { path: RoutePath.RESET_PASSWORD, element: <ResetPassword /> },
    ],
  },
]);

export default router;

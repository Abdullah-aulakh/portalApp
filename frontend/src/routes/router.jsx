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
import ManageUsersPage from "@/pages/ManageUsersPage";
import TeacherPanel from "@/pages/TeacherPanel";
import StudentPanel from "@/pages/StudentPanel";
import CreateDepartmentPage from "@/pages/CreateDepartmentPage";
import ManageDepartmentsPage from "@/pages/ManageDepartmentsPage"; 
import AdminDashboard from "@/features/admin/Dashboard";
import StudentDetailsPage from "../pages/StudentDetailsPage";
import { RoutePath } from "./routes";
import CreateCoursePage from "@/pages/CreateCoursePage";
import ManageCoursesPage from "@/pages/ManageCoursesPage";
import CreateEnrollmentPage from "@/pages/CreateEnrollmentPage";
import ManageEnrollmentsPage from "@/pages/ManageEnrollmentsPage";
import CreateTimetablePage from "@/pages/CreateTimetablePage";
import ManageTimetablesPage from "@/pages/ManageTimetablesPage";

import StudentDashboard from "@/features/student/Dashboard";
import TimetablePage from "@/features/student/TimeTablePage";
import AttendancePage from "../features/student/AttendancePage";
import ManageAttendancePage from "@/pages/ManageAttendancePage";
import ManageGradesPage from "@/pages/ManageGradesPage"; 
import GradePage from "@/features/student/GradePage";

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
          { path: "/student", element: <StudentPanel />,
            children: [
              {index:true, element:<Navigate to="dashboard" replace />},
              {path:"dashboard", element:<StudentDashboard />},
              {path:"timetable", element:<TimetablePage />},
              {path:"attendance", element:<AttendancePage />},
              {path:"academics/grades",element:<GradePage/>}
            ]
           },

        ],
      },

      {
        element: <AdminOnly />,
        children: [
          { 
            path: "/admin",
            element: <AdminPanel />,
            children: [
              {index:true, element:<Navigate to="dashboard" replace />},
              {path:"dashboard", element:<AdminDashboard />},
              { path: "users/create-user", element: <CreateUserPage /> },
              { path: "users/manage-users", element: <ManageUsersPage /> },
              { path: "users/student/details", element: <StudentDetailsPage /> },
              { path: "departments/create-department", element: <CreateDepartmentPage /> },
              { path: "departments/manage-departments", element: <ManageDepartmentsPage /> }, 
              { path: "courses/create-course", element: <CreateCoursePage /> },
              { path: "courses/manage-courses", element: <ManageCoursesPage /> },
              { path: "enrollments/create-enrollment", element: <CreateEnrollmentPage /> },
              { path: "enrollments/manage-enrollments", element: <ManageEnrollmentsPage /> },
              { path: "timetable/create-timetable", element: <CreateTimetablePage /> },
              { path: "timetable/manage-timetable", element: <ManageTimetablesPage /> },
              { path: "attendance/manage-attendance", element: <ManageAttendancePage /> },
              { path: "grades/manage-grades", element: <ManageGradesPage /> },
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
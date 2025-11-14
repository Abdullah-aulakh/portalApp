import CustomSidebar from "../components/CustomSideBar";
import { FaHome, FaUser, FaCog, FaBuilding } from "react-icons/fa";
import { Outlet } from "react-router";
import TopNavbar from "@/components/TopNavBar";
import { FaBook } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa";


const AdminPanel = () => {
  const menuData = [
      { title: "Dashboard", icon: FaHome, path: "dashboard" },
  {
    title: "Users",
    icon: FaUser,
    path: "users",
    subMenu: [
      { title: "Create User", path: "users/create-user" },
      { title: "Manage Users", path: "users/manage-users" }
    ],
  },
  {
    title: "Departments",
    icon: FaBuilding,
    path: "departments",
    subMenu: [
      { title: "Create Department", path: "departments/create-department" },
      { title: "Manage Departments", path: "departments/manage-departments" }
    ],
  },
  {
    title: "Courses",
    icon: FaBook,
    path: "courses",
    subMenu: [
      { title: "Create Course", path: "courses/create-course" },
      { title: "Manage Courses", path: "courses/manage-courses" }
    ],
  },
    {
    title: "Enrollments",
    icon: FaUserGraduate,
    path: "enrollments",
    subMenu: [
      { title: "Create Enrollment", path: "enrollments/create-enrollment" },
      { title: "Manage Enrollments", path: "enrollments/manage-enrollments" }
    ],
  },  
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <div className="flex-shrink-0">
        <TopNavbar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden ml-[-2px]">
        <div
          className="flex-shrink-0 transition-all duration-300 bg-gray-100
        mt-3
        "
        >
          <CustomSidebar menuData={menuData} basePath="/admin" />
        </div>

        <div className="flex-1 p-6 overflow-auto bg-gray-100">
          <Outlet />
        </div>

        {/* Right Sidebar */}
      </div>
    </div>
  );
};

export default AdminPanel;

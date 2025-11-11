import CustomSidebar from "../components/CustomSideBar";
import { FaHome, FaUser, FaCog, FaBuilding } from "react-icons/fa";
import { Outlet } from "react-router";
import TopNavbar from "@/components/TopNavBar";

const AdminPanel = () => {
  const menuData = [
    { title: "Dashboard", icon: FaHome, path: "dashboard" },
    {
      title: "Users",
      icon: FaUser,
      path: "users",
      subMenu: [{ title: "Create User", path: "users/create-user" },
        { title: "Manage Users", path: "users/manage-users" }
      ],
    },
    {
      title: "Departments",
      icon: FaBuilding,
      path: "departments",
      subMenu: [
        { title: "Create Department", path: "departments/create-department" },
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
        <div className="flex-shrink-0 transition-all duration-300 bg-gray-100
        mt-3
        ">
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

import CustomSidebar from "@/components/CustomSideBar";
import { FaHome, FaBook, FaChartBar, FaCalendarAlt, FaUser, FaGraduationCap } from "react-icons/fa";
import { Outlet } from "react-router";
import TopNavbar from "@/components/TopNavBar";
import { title } from "framer-motion/client";
import { MdEventAvailable } from "react-icons/md";

const StudentPanel = () => {
  const menuData = [
    { title: "Dashboard", icon: FaHome, path: "dashboard" },
    {
      title: "Profile",
      icon: FaUser,
      path: "profile",
    },
    {
      title: "Academics",
      icon: FaBook,
      path: "academics",
      subMenu: [
        { title: "My Courses", path: "academics/courses" },
        { title: "My Grades", path: "academics/grades" },
        { title: "Enrollments", path: "academics/enrollments" },
      ],
    },
    {
      title: "Timetable",
      icon: FaCalendarAlt,
      path: "timetable",
     
    },
    {
      title: "Attendance",
      icon: MdEventAvailable,
      path: "attendance",
    }
    
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <div className="shrink-0">
        <TopNavbar />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden -ml-0.5">
        <div className="shrink-0 transition-all duration-300 bg-gray-100 mt-3">
          <CustomSidebar menuData={menuData} basePath="/student" />
        </div>

        <div className="flex-1 p-6 overflow-auto bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentPanel;
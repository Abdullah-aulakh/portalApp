import CustomSidebar from "@/components/CustomSideBar";
import { FaHome, FaBook, FaChartBar, FaCalendarAlt, FaUser, FaGraduationCap } from "react-icons/fa";
import { Outlet } from "react-router";
import TopNavbar from "@/components/TopNavBar";

const StudentPanel = () => {
  const menuData = [
    { title: "Dashboard", icon: FaHome, path: "dashboard" },
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
      title: "Schedule",
      icon: FaCalendarAlt,
      path: "schedule",
      subMenu: [
        { title: "Timetable", path: "schedule/timetable" },
        { title: "Attendance", path: "schedule/attendance" },
      ],
    },
    {
      title: "Profile",
      icon: FaUser,
      path: "profile",
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
        <div className="flex-shrink-0 transition-all duration-300 bg-gray-100 mt-3">
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
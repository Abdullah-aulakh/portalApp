import CustomSidebar from "@/components/CustomSideBar";
import { FaHome, FaChalkboardTeacher,FaChartBar, FaUsers, FaCalendarAlt } from "react-icons/fa";
import { Outlet } from "react-router";
import TopNavbar from "@/components/TopNavBar";

const TeacherPanel = () => {
  const menuData = [
    { title: "Dashboard", icon: FaHome, path: "dashboard" },
    {
      title: "Teaching",
      icon: FaChalkboardTeacher,
      path: "teaching",
      subMenu: [
        { title: "My Courses", path: "teaching/courses" },
        { title: "Manage Grades", path: "teaching/grades" },
        { title: "Attendance", path: "teaching/attendance" },
      ],
    },
    {
      title: "Students",
      icon: FaUsers,
      path: "students",
      subMenu: [
        { title: "Class Students", path: "students/class" },
        { title: "Student Performance", path: "students/performance" },
      ],
    },
    {
      title: "Schedule",
      icon: FaCalendarAlt,
      path: "schedule",
    },
    {
      title: "Analytics",
      icon: FaChartBar,
      path: "analytics",
    },
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
          <CustomSidebar menuData={menuData} basePath="/teacher" />
        </div>

        <div className="flex-1 p-6 overflow-auto bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TeacherPanel;
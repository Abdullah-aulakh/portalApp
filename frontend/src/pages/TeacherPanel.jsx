import CustomSidebar from "@/components/CustomSideBar";
import { FaHome, FaChalkboardTeacher,FaChartBar, FaUsers, FaCalendarAlt } from "react-icons/fa";
import { Outlet } from "react-router";
import { MdEventAvailable } from "react-icons/md";
import TopNavbar from "@/components/TopNavBar";

const TeacherPanel = () => {
  const menuData = [
    { title: "Dashboard", icon: FaHome, path: "dashboard" },
    {
     title:"Grades",
     icon:FaChartBar,
     path:"grades",
    }

    ,{
      title:"Attendance",
      icon:MdEventAvailable,
      path:"attendance",
    },
    {
      title: "Schedule",
      icon: FaCalendarAlt,
      path: "schedule",
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
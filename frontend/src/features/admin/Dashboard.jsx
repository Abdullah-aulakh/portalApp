import React, { use } from "react";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import DashboardCards from "@components/DashboardCards";
import { FaBuilding } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";
import useAxios from "@/hooks/useAxios";
import FullPageLoader from "@/components/FullPageLoader";

const Dashboard = () => {
  const { response, error, loading, fetchData } = useAxios();
  const [stats, setStats] = useState([
    {
      title: "Total Students",
      id: "totalStudents",

      icon: <PiStudentBold className="text-blue-500 w-6 h-6" />,
      bg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total Teachers",
      id: "totalTeachers",

      icon: <FaChalkboardTeacher className="text-green-500 w-6 h-6" />,
      bg: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Departments",
      id: "totalDepartments",

      icon: <FaBuilding className="text-purple-500 w-6 h-6" />,
      bg: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ]);
  useEffect(() => {
    fetchData({ url: "admin/dashboard", method: "get" });
  }, []);
  useEffect(() => {
    if (response) {
      console.log(response);

      setStats((prevState) =>
        prevState.map((stat) => ({
          ...stat,
          value: response[stat.id] ?? stat.value,
        }))
      );
    }
    console.log(stats);
  }, [response]);

  return (
    <>
    {loading && <FullPageLoader />}
    <div className="p-8 bg-white/90 min-h rounded-3xl shadow-xl border-2 border-[var(--primary-color)]">
      <DashboardCards stats={stats} />
    </div>
    </>
  );
};

export default Dashboard;

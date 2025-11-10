import React, { use } from "react";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
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
    <div className="p-8 bg-white/90 min-h rounded-3xl shadow-xl border-2 border-[var(--primary-color)]">
      <Tabs>
        {/* Tab headers */}
        <TabList className="flex mb-6 justify-around space-x-4">
          <Tab
            className="px-4 py-2 font-medium cursor-pointer border-b-0 transition-all"
            selectedClassName="border-b-3 border-[var(--color-primary)] text-[var(--color-primary)]"
          >
            Overview
          </Tab>
          <Tab
            className="px-4 py-2 font-medium cursor-pointer border-b-0 transition-all"
            selectedClassName="border-b-3 border-[var(--color-primary)] text-[var(--color-primary)]"
          >
            Users
          </Tab>
        </TabList>

        {/* Tab content */}
        <TabPanel>
          <h2 className="text-xl font-bold mb-4">Overview</h2>
          <DashboardCards stats={stats} />
        </TabPanel>

        <TabPanel>
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <p>Here you can manage users.</p>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Dashboard;

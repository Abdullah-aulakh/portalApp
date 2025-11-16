import React, { useEffect, useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import useAxios from "@/hooks/useAxios";
import FullpageLoader from "@/components/FullPageLoader";
import GradeTile from "@/components/GradeTile";
import { useAuth } from "@/context/AuthContext";

const GradesPage = () => {
  const { user } = useAuth();

  // API instances
  const activeCourseApi = useAxios();
  const previousCourseApi = useAxios();

  const [activeGrades, setActiveGrades] = useState([]);
  const [previousGrades, setPreviousGrades] = useState([]);

  const [selectedTab, setSelectedTab] = useState(0); // 0 = active courses, 1 = previous courses

  // Load active courses when the page first loads OR when user opens that tab
  useEffect(() => {
    if (user && selectedTab === 0) {
      activeCourseApi.fetchData({
        url: `students/grade/${user.id}`,
        method: "get",
        data:{
            enrolled: true
        }
      });
    }
  }, [user, selectedTab]);

  // Load previous courses only when that tab opens
  useEffect(() => {
    if (user && selectedTab === 1) {
      previousCourseApi.fetchData({
        url: `students/grade/${user.id}`,
        method: "get"
      });
    }
  }, [user, selectedTab]);

  // Update responses
  useEffect(() => {
    if (activeCourseApi.response) setActiveGrades(activeCourseApi.response);
    console.log(activeCourseApi.response);
  }, [activeCourseApi.response]);

  useEffect(() => {
    if (previousCourseApi.response) setPreviousGrades(previousCourseApi.response);
    console.log(previousCourseApi.response);
  }, [previousCourseApi.response]);

  const loading = activeCourseApi.loading || previousCourseApi.loading;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {loading && <FullpageLoader />}

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Grades</h1>

      <Tabs selectedIndex={selectedTab} onSelect={(index) => setSelectedTab(index)}>
        <TabList className="flex mb-6 justify-around space-x-4">
          <Tab
            className="px-4 py-2 font-medium cursor-pointer border-b-0 transition-all"
            selectedClassName="border-b-3 border-[var(--color-primary)] text-[var(--color-primary)]"
          >
            Active Courses
          </Tab>

          <Tab
            className="px-4 py-2 font-medium cursor-pointer border-b-0 transition-all"
            selectedClassName="border-b-3 border-[var(--color-primary)] text-[var(--color-primary)]"
          >
            Previous Courses
          </Tab>
        </TabList>

        {/* ACTIVE COURSES */}
        <TabPanel>
          <h2 className="text-xl font-bold mb-4">Active Course Grades</h2>

          {activeGrades.length === 0 ? (
            <p className="text-gray-400 italic">No active course grades found</p>
          ) : (
          activeGrades.map((g) => <GradeTile key={g.id} gradeData={g} />)
          )}
        </TabPanel>

        {/* PREVIOUS COURSES */}
        <TabPanel>
          <h2 className="text-xl font-bold mb-4">Previous Course Grades</h2>

          {previousGrades?.length === 0 ? (
            <p className="text-gray-400 italic">No previous course grades found</p>
          ) : (
            previousGrades?.map((g) => <GradeTile key={g.id} gradeData={g} />)
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default GradesPage;

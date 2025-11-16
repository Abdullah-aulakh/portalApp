import React, { useState, useEffect } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import SearchBar from "@/components/SearchBar";
import UserTile from "@/components/UserTile";
import CustomDropDown from "@/components/CustomDropDown";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";

const ManageUsersPage = () => {
  const [selectedTab, setSelectedTab] = useState(0); // 0 = Students, 1 = Teachers, 2 = Admins
  const [student, setStudent] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [admins, setAdmins] = useState([]);

  // ----- Separate API instances -----
  const studentApi = useAxios();
  const departmentApi = useAxios();
  const teacherApi = useAxios();
  const adminApi = useAxios();

  // ----- Fetch data when tab is selected -----
  useEffect(() => {
    if (selectedTab === 0) {
      // Students tab doesn't need auto fetch, search will call studentApi
    } else if (selectedTab === 1) {
      // Teachers tab: fetch departments
      departmentApi.fetchData({ url: "/departments", method: "get" });
    } else if (selectedTab === 2) {
      // Admins tab
      adminApi.fetchData({ url: "/admin", method: "get" });
    }
  }, [selectedTab]);

  // ----- Update states from API responses -----
  useEffect(() => {
    if (studentApi.response) setStudent(studentApi.response);
  }, [studentApi.response]);

  useEffect(() => {
    if (departmentApi.response) setDepartments(departmentApi.response);
  }, [departmentApi.response]);

  useEffect(() => {
    if (teacherApi.response) setTeachers(teacherApi.response);
  }, [teacherApi.response]);

  useEffect(() => {
    if (adminApi.response) setAdmins(adminApi.response);
  }, [adminApi.response]);

  // ----- Handle errors -----
  useEffect(() => {
    [studentApi, departmentApi, teacherApi, adminApi].forEach((api) => {
      if (api.error) {
        Swal.fire({
          title: "Error!",
          text: api.error?.message || "Failed to load data",
          icon: "error",
          confirmButtonColor: "var(--color-primary)",
        });
      }
    });
  }, [studentApi.error, departmentApi.error, teacherApi.error, adminApi.error]);

  // ----- Fetch teachers for selected department -----
  const handleDeptChange = (deptId) => {
    setSelectedDept(deptId);
    if (deptId) teacherApi.fetchData({ url: `/departments/teachers/${deptId}`, method: "get" });
    else setTeachers([]);
  };

  const loading =
    studentApi.loading || departmentApi.loading || teacherApi.loading || adminApi.loading;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      {loading && <p className="text-center text-gray-500">Loading...</p>}

      <h2 className="text-3xl font-bold text-center mb-6">Manage Users</h2>

      <Tabs selectedIndex={selectedTab} onSelect={(index) => setSelectedTab(index)}>
        <TabList className="flex mb-6 justify-around space-x-4">
          <Tab
            className="px-4 py-2 font-medium cursor-pointer border-b-0 transition-all"
            selectedClassName="border-b-3 border-[var(--color-primary)] text-[var(--color-primary)]"
          >
            Students
          </Tab>
          <Tab
            className="px-4 py-2 font-medium cursor-pointer border-b-0 transition-all"
            selectedClassName="border-b-3 border-[var(--color-primary)] text-[var(--color-primary)]"
          >
            Teachers
          </Tab>
          <Tab
            className="px-4 py-2 font-medium cursor-pointer border-b-0 transition-all"
            selectedClassName="border-b-3 border-[var(--color-primary)] text-[var(--color-primary)]"
          >
            Admin
          </Tab>
        </TabList>

        {/* Students Tab */}
        <TabPanel>
          <SearchBar
            placeholder="Search by Registration Number"
            endpoint="students/reg"
            setResults={(res) => setStudent(res)}
          />
          {student && (
            <div className="mt-4">
              <div className="mb-2 font-bold text-xl">Results</div>
              <UserTile data={student} />
            </div>
          )}
        </TabPanel>

        {/* Teachers Tab */}
        <TabPanel>
          <div className="mb-4">
            <CustomDropDown
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
              selectedOption={selectedDept}
              onChange={handleDeptChange}
              label="Department"
            />
          </div>

          {teachers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map((teacher) => (
                <UserTile key={teacher.id} data={teacher} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No teachers found for selected department.</p>
          )}
        </TabPanel>

        {/* Admin Tab */}
        <TabPanel>
          {admins.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {admins.map((admin) => (
                <UserTile key={admin.id} data={admin} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No admin users found.</p>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ManageUsersPage;

// StudentDetailsPage.jsx
import React, { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useLocation } from "react-router";
import EditUserInfoTab from "@/features/admin/EditUserInfoTab";

const StudentDetailsPage = () => {
const location = useLocation();
  const { student } = location.state;
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...student });
  

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Call API to save formData
    console.log("Saving data", formData);
    setEditMode(false);
  };

  const handleDelete = () => {
    // Call API to delete user
    console.log("Deleting student", student?.id);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Student Details
      </h1>

      <Tabs>
        {/* Tab headers */}
        <TabList className="flex mb-6 justify-around space-x-4">
          <Tab
            className="px-4 py-2 font-medium cursor-pointer border-b-0 transition-all"
            selectedClassName="border-b-3 border-[var(--color-primary)] text-[var(--color-primary)]"
          >
            User Info
          </Tab>
          <Tab
            className="px-4 py-2 font-medium cursor-pointer border-b-0 transition-all"
            selectedClassName="border-b-3 border-[var(--color-primary)] text-[var(--color-primary)]"
          >
            Enrollment
          </Tab>
          <Tab
            className="px-4 py-2 font-medium cursor-pointer border-b-0 transition-all"
            selectedClassName="border-b-3 border-[var(--color-primary)] text-[var(--color-primary)]"
          >
            Attendance
          </Tab>
          <Tab
            className="px-4 py-2 font-medium cursor-pointer border-b-0 transition-all"
            selectedClassName="border-b-3 border-[var(--color-primary)] text-[var(--color-primary)]"
          >
            Grades
          </Tab>
        </TabList>

        {/* User Info Tab */}
        <TabPanel>
          <EditUserInfoTab user={student?.user} />
        </TabPanel>

        {/* Enrollment Tab */}
        <TabPanel>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Enrollments</h2>
            <button className="px-3 py-1 bg-green-500 text-white rounded flex items-center mb-4">
              <FaPlus className="mr-2" />
              Add Enrollment
            </button>

            <div className="space-y-2">
              {student?.enrollments?.map((enrollment, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border rounded p-2"
                >
                  <p>{enrollment.courseName}</p>
                  <div className="flex gap-2">
                    <button className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      <FaEdit />
                    </button>
                    <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabPanel>

        {/* Attendance Tab */}
        <TabPanel>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>
            {student?.attendanceRecords?.map((att, idx) => (
              <div key={idx} className="flex justify-between p-2 border rounded mb-2">
                <p>{att.date}</p>
                <p>{att.status}</p>
              </div>
            ))}
          </div>
        </TabPanel>

        {/* Grades Tab */}
        <TabPanel>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Grades</h2>
            {student?.grades?.map((grade, idx) => (
              <div key={idx} className="flex justify-between p-2 border rounded mb-2">
                <p>{grade.courseName}</p>
                <p>{grade.grade}</p>
              </div>
            ))}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default StudentDetailsPage;

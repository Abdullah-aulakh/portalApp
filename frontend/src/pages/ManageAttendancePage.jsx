import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import useAxios from "@/hooks/useAxios";
import AttendanceTile from "@/components/AttendanceTile";

const ManageAttendancePage = () => {
  const [student, setStudent] = useState(null);

  const handleSearch = (result) => {
    setStudent(result); // result should contain student + courses
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Manage Attendance
      </h1>

      <SearchBar
        placeholder="Search by student registration number..."
        endpoint="attendance/student/reg"
        setResults={handleSearch}
      />

      {!student && (
        <p className="text-gray-500 mt-8 italic">Search a student to continue…</p>
      )}

      {student && (
        <div className="mt-8">
          <h2 className="font-bold text-xl mb-4">
            {student?.user?.firstName} {student?.user?.lastName} — Enrolled Courses
          </h2>

          {student?.courses?.length === 0 ? (
            <p className="text-gray-400 italic">No active enrollments</p>
          ) : (
            student?.courses?.map((c) => (
              <AttendanceTile key={c.id} attendanceData={c} editable />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ManageAttendancePage;

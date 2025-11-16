import React, { use, useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import useAxios from "@/hooks/useAxios";
import AttendanceTile from "@/components/AttendanceTile";
import Swal from "sweetalert2";
import FullPageLoader from "@/components/FullPageLoader";

const ManageAttendancePage = () => {
  const [result, setResults] = useState(null);
  const [state, setState] = useState(0);

  const editAttendanceApi = useAxios();

  const handleSearch = (result) => {
    setResults(result); 
  };
 const updateCourseAttendance = (courseId, updatedCourseData) => {
  setResults((prev) => {
    if (!prev) return prev;

    // create a new copy of attendanceData array
    const newAttendanceData = prev.attendanceData.map((course) =>
      course.id === courseId
        ? { ...course, ...updatedCourseData, records: [...updatedCourseData.records] }
        : course
    );

    // create a new state object with a new reference
    const newState = { ...prev, attendanceData: newAttendanceData };
    return newState;
  });


};



useEffect(()=>{
  console.log("Result after update:",result);
},[result]);

  const handleSave = (records,courseId) => {
    const payload = records.map((r) => ({
      ...r,
      courseId,
      studentId: result?.student?.id,
    }));
    if(payload.length>0){
    editAttendanceApi.fetchData({
      url: `attendance/`,
      method: "put",
      data: payload,
    });
  }
  };
  useEffect(()=>{
    if(editAttendanceApi.response){
      Swal.fire({
        title: "Attendance Updated",
        text: "Your attendance has been updated successfully.",
        icon: "success",
        confirmButtonText: "Ok",
        customClass: {
          popup: 'text-sm sm:text-base'
        }
      });
      console.log(editAttendanceApi.response);
      updateCourseAttendance(editAttendanceApi.response.id,editAttendanceApi.response);
    }
  },[editAttendanceApi.response])

  useEffect(()=>{
    if(editAttendanceApi.error){
      Swal.fire({
        title: "Attendance Update Failed",
        text: "An error occurred while updating your attendance.",
        icon: "error",
        confirmButtonText: "Ok",
        customClass: {
          popup: 'text-sm sm:text-base'
        }
      });
    }
  },  [editAttendanceApi.error])
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Manage Attendance
      </h1>
    {editAttendanceApi.loading && <FullPageLoader />}
      <SearchBar
        placeholder="Search by student registration number..."
        endpoint="attendance/student/reg"
        setResults={handleSearch}
      />

      {!result?.student && (
        <p className="text-gray-500 mt-8 italic">Search a student to continue…</p>
      )}

      {result?.student&& (
        <div className="mt-8">
          <h2 className="font-bold text-xl mb-4">
            {result?.student?.user?.firstName} {result?.student?.user?.lastName} — Enrolled Courses
          </h2>

          {result?.attendanceData?.length === 0 ? (
            <p className="text-gray-400 italic">No active enrollments</p>
          ) : (
            result?.attendanceData?.map((c) => (
              <AttendanceTile key={c.id + c.attendancePercentage}  attendanceData={c} editable onSave={(records)=>handleSave(records,c.id)} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ManageAttendancePage;

import React, { useEffect, useState } from "react";
import useAxios from "@/hooks/useAxios";
import CustomButton from "@/components/CustomButton";
import { useFetcher, useLocation } from "react-router";
import Swal from "sweetalert2";

const RegisterAttendancePage = () => {
  const studentsApi = useAxios();
  const attendanceApi = useAxios();
  const saveApi = useAxios();
  const location = useLocation();
  const { courseId } = location.state;

  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({}); // { studentId: { isPresent: boolean, id?: string } }

  // Fetch all students for the course
  useEffect(() => {
    if (!courseId) return;
    studentsApi.fetchData({ url: `enrollments/studentsOfCourse/${courseId}`, method: "get" });
  }, [courseId]);

  useEffect(() => {
    if (studentsApi.response) setStudents(studentsApi.response);
  }, [studentsApi.response]);

  // Fetch today's attendance
  useEffect(() => {
    if (!courseId) return;
    attendanceApi.fetchData({ url: `attendance/today/${courseId}`, method: "get" });
  }, [courseId,saveApi.response]);

  useEffect(()=>{
    if(saveApi.response){
        Swal.fire({
          title: "Success!",
          text: "Attendance updated successfully.",
          icon: "success",
          confirmButtonColor: "var(--color-primary)",
        });
    }
  },[saveApi.response])
  // Map attendance data
  useEffect(() => {
    if (!students || students.length === 0) return;
    const attendanceData = attendanceApi.response || [];

    const map = {};
    students.forEach((s) => {
      const record = attendanceData.find((a) => a.student.id === s.id);
      map[s.id] = {
        isPresent: record ? record.isPresent : true, // default true
        id: record ? record.id : undefined,
      };
    });

    setAttendanceMap(map);
  }, [attendanceApi.response, students]);

  // Toggle attendance
  const toggleAttendance = (id) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [id]: { ...prev[id], isPresent: !prev[id].isPresent },
    }));
  };

  // Submit attendance
  const handleSubmit = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedToday = `${yyyy}-${mm}-${dd}`;

    const payload = students.map((st) => ({
      studentId: st.id,
      courseId,
      isPresent: attendanceMap[st.id].isPresent,
      date: formattedToday,
      ...(attendanceMap[st.id].id && { id: attendanceMap[st.id].id }), // send id if exists
    }));

    console.log("Submitting:", payload);

    saveApi.fetchData({
      url: "attendance/createOrUpdate",
      method: "post",
      data: payload,
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Register Attendance</h1>

      {students.length === 0 ? (
        <p>Loading students...</p>
      ) : (
        <div className="space-y-3">
          {students.map((st, idx) => (
            <div
              key={st.id}
              className="p-4 bg-white rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-500">#{idx + 1}</p>
                <p className="text-lg font-medium">
                  {st.user.firstName} {st.user.lastName}
                </p>
                <p className="text-xs text-gray-400">{st.registrationNumber}</p>
                <p className="text-xs text-gray-400">
                  {st.program} - Semester {st.currentSemester}
                </p>
              </div>

              <button
                onClick={() => toggleAttendance(st.id)}
                className={`px-4 py-2 rounded-lg text-white font-medium ${
                  attendanceMap[st.id]?.isPresent
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {attendanceMap[st.id]?.isPresent ? "Present" : "Absent"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <CustomButton
          onClick={handleSubmit}
          disabled={saveApi.loading}
          className="w-full"
        >
          {"Submit Attendance"}
        </CustomButton>
      </div>
    </div>
  );
};

export default RegisterAttendancePage;

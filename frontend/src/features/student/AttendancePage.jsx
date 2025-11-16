import React, { useEffect, useState } from "react";
import AttendanceTile from "@/components/AttendanceTile";
import useAxios from "@/hooks/useAxios";
import FullpageLoader from "@/components/FullPageLoader";
import { useAuth } from "@/context/AuthContext";

const AttendancePage = () => {
  const { user } = useAuth();
  const { response, loading, fetchData } = useAxios();
  const [attendanceList, setAttendanceList] = useState([]);

  useEffect(() => {
    if (user?.id) fetchData({ url: `students/attendance/${user.id}`, method: "get" });
  }, [user?.id]);

  useEffect(() => {
    if (response) setAttendanceList(response);
    console.log(response);
  }, [response]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {loading && <FullpageLoader />}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Attendance</h1>

      {attendanceList?.length > 0 ? (
        attendanceList?.map((attendance) => (
          <AttendanceTile key={attendance?.courseId} attendanceData={attendance} />
        ))
      ) : (
        <p className="text-gray-500">No attendance data available.</p>
      )}
    </div>
  );
};

export default AttendancePage;

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import useAxios from "@/hooks/useAxios";
import FullPageLoader from "@/components/FullPageLoader";
// Custom Tailwind Components
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border-2 rounded-2xl shadow-sm border-(--color-primary) ${className}`}
  >
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

const Avatar = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="w-20 h-20 rounded-full object-cover border"
  />
);

export default function Dashboard() {
  const [student, setStudent] = useState({});
  const { user } = useAuth();
  const { response, error, loading, fetchData } = useAxios();

  useEffect(() => {
    fetchData({ url: `students/getProfile/${user?.id}`, method: "get" });
  }, []);

  useEffect(() => {
    if (response) {
      console.log(response);
      setStudent(response);
    }
  }, [response]);

  return (
    <div className="w-full p-6 flex flex-col gap-6">
        {loading && <FullPageLoader />}
      {/* Top Section */}
      <Card className="p-6 flex items-center gap-6 shadow-md rounded-2xl">
        <Avatar
          src={
            user?.profilePicture
              ? user?.profilePicture
              : `https://ui-avatars.com/api/?name=${
                  user?.firstName + " " + user?.lastName
                }`
          }
          alt="Av"
        />

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-600 text-sm">
            Registration: {student?.registrationNumber}
          </p>
          <p className="text-gray-600 text-sm">Program: {student.program}</p>
          <p className="text-lg font-semibold mt-1">CGPA: {student.cgpa}</p>
        </div>
      </Card>

      {/* Today Classes */}
      <h2 className="text-xl font-semibold mb-0">Today's Classes</h2>

      {
        <ul className="space-y-2">
          {student?.activeEnrollments?.map((enrollment, idx) => (
            <React.Fragment key={idx}>
              {enrollment?.todaysClasses?.map((cls) => (
                <li
                  key={cls.id}
                  className="flex justify-between p-3 bg-white border-2 rounded-2xl shadow-sm border-(--color-primary) items-center"
                >
                  <span className="font-medium text-gray-800">
                    {enrollment.course?.title+" ("+cls.room+") "}
                  </span>
                  <div className="flex flex-col gap-2">
                    <span className="font-medium text-gray-700">
                    {cls.startTime} - {cls.endTime}
                  </span>
                  </div>
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      }

      {/* Courses Enrolled */}
      <h1 className="text-xl font-semibold mb-0">Courses Enrolled</h1>
      <div className="flex items-center justify-between gap-4">
        {student?.activeEnrollments?.map((e, idx) => (
          <Card key={idx} className="shadow-md rounded-2xl flex-2">
            <CardContent className="p-5 flex flex-col gap-2">
              <h3 className="text-lg font-semibold">{e?.course.title}</h3>
              <p className="text-sm text-gray-600">{e?.course?.code}</p>
              <p className="text-sm text-gray-600">
                {e?.course?.teacher
                  ? "Teacher: " +
                    e?.course?.teacher?.user?.firstName +
                    " " +
                    e?.course?.teacher?.user?.lastName
                  : "No Teacher Assigned Yet"}
              </p>
              <p className="text-sm text-gray-600">
                Credit Hours: {e?.course?.creditHours}
              </p>
              <p className="text-sm font-semibold mt-1">
                Attendance: {e?.attendancePercentage + "%"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import useAxios from "@/hooks/useAxios";
import FullPageLoader from "@/components/FullPageLoader";

// Reusable Tailwind UI components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white border-2 rounded-2xl shadow-sm border-(--color-primary) ${className}`}>
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

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState({});
  const { user } = useAuth();
  const { response, loading, fetchData } = useAxios();

  useEffect(() => {
    if (!user?.id) return;
    fetchData({ url: `teachers/getProfile/${user.id}`, method: "get" });
  }, [user]);

  useEffect(() => {
    if (response) setTeacher(response);
  }, [response]);

  return (
    <div className="w-full p-6 flex flex-col gap-6">
      {loading && <FullPageLoader />}

      <Card className="p-6 flex items-center gap-6 shadow-md rounded-2xl">
        <Avatar
          src={
            user?.profilePicture
              ? user.profilePicture
              : `https://ui-avatars.com/api/?name=${user?.firstName + " " + user?.lastName}`
          }
          alt="Avatar"
        />

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-600 text-sm">Teacher ID: {teacher?.teacherId}</p>
          <p className="text-gray-600 text-sm">Department: {teacher?.department}</p>
        </div>
      </Card>

      {/* Today's Classes */}
      <h2 className="text-xl font-semibold">Today's Classes</h2>

      <ul className="space-y-2">
        {teacher?.todaysClasses?.map((cls) => (
          <li
            key={cls.id}
            className="flex justify-between p-3 bg-white border-2 rounded-2xl shadow-sm border-(--color-primary) items-center"
          >
            <span className="font-medium text-gray-800">
              {cls.course?.title} — {cls.room}
            </span>

            <span className="font-medium text-gray-700">
              {cls.startTime} - {cls.endTime}
            </span>
          </li>
        ))}
      </ul>

      {/* Courses Taught */}
      <h2 className="text-xl font-semibold">Courses Taught</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {teacher?.courses?.map((c) => (
          <Card key={c.id} className="shadow-md rounded-2xl">
            <CardContent className="p-5 flex flex-col gap-2">
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-600">{c.code}</p>
              <p className="text-sm text-gray-600">Credit Hours: {c.creditHours}</p>

              <p className="text-sm font-semibold mt-1">
                Enrolled Students: {c.totalStudents}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

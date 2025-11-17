import React, { useState, useEffect } from "react";
import useAxios from "@/hooks/useAxios";
import FullpageLoader from "@/components/FullPageLoader";
import { useAuth } from "@/context/AuthContext";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TeacherSchedulePage = () => {
  const [classes, setClasses] = useState([]);
  const { user } = useAuth();
  const { response, loading, fetchData } = useAxios();

  useEffect(() => {
    if (user?.id) {
      fetchData({ url: `teachers/getSchedule/${user.id}`, method: "get" });
    }
  }, [user?.id]);

  useEffect(() => {
    if (response && Array.isArray(response)) {
      // Flatten all courses' timetables and attach course title
      const flat = response.flatMap(course =>
        course.timetables.map(tt => ({
          ...tt,
          courseTitle: course.title
        }))
      );

      setClasses(flat);
    }
  }, [response]);

  // Group by day
  const classesByDay = daysOfWeek.reduce((acc, day) => {
    acc[day] = classes.filter(cls => cls.dayOfWeek === day);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {loading && <FullpageLoader />}

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Weekly Teaching Schedule
      </h1>

      <div className="flex flex-col space-y-4 md:space-y-0 gap-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="flex-1 bg-white rounded-2xl shadow-lg p-4 flex flex-col border-2 border-(--color-primary) gap-2"
          >
            <h2 className="text-lg font-semibold mb-3 text-gray-700">{day}</h2>

            {classesByDay[day] && classesByDay[day].length > 0 ? (
              classesByDay[day].map((cls) => (
                <div
                  key={cls.id}
                  className="flex justify-between items-center p-3 mb-2 bg-blue-50 rounded-xl border-l-4 border-(--color-primary) shadow-sm"
                >
                  <span className="font-medium text-gray-800">
                    {cls.courseTitle} — Room: {cls.room || "Not Assigned"}
                  </span>

                  <span className="text-gray-600">
                    {cls.startTime} - {cls.endTime}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic mt-2">No classes</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherSchedulePage;

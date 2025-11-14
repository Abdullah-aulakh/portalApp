import React from "react";
import useAxios from "@/hooks/useAxios";
import { useState, useEffect } from "react";
import FullpageLoader from "@/components/FullPageLoader";
import { useAuth } from "@/context/AuthContext";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TimetablePage = () => {
  const [allClasses, setAllClasses] = useState([]);
  const { user } = useAuth();
  const { response, error, loading, fetchData } = useAxios();

  useEffect(() => {
    if (user?.id) fetchData({ url: `students/timetable/${user.id}`, method: "get" });
  }, [user?.id]);

  useEffect(() => {
    if (response) {
      // Flatten all courses' todaysClasses into one array with courseTitle
      const classes = response.flatMap((course) =>
        course.todaysClasses.map((cls) => ({
          ...cls,
          courseTitle: course.title,
        }))
      );
      setAllClasses(classes);
    }
  }, [response]);

  // Group classes by day
  const classesByDay = daysOfWeek.reduce((acc, day) => {
    acc[day] = allClasses.filter((cls) => cls.dayOfWeek === day);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {loading && <FullpageLoader />}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Weekly Timetable</h1>

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
                    {cls.courseTitle} ({cls.room})
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

export default TimetablePage;

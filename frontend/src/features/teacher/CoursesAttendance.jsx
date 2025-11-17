import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import useAxios from "@/hooks/useAxios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";

const TeachersCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const coursesApi = useAxios();
  const { user } = useAuth();


  useEffect(() => {
    coursesApi.fetchData({
      url: `teachers/getCourses/${user.id}`,
      method: "get",
    });
  }, []);

  useEffect(() => {
    if (coursesApi.response) {
      setCourses(coursesApi.response);
    }
  }, [coursesApi.response]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-4">My Courses</h1>

      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        courses.map((course) => <CourseTile key={course.id} course={course} />)
      )}
    </div>
  );
};

export default TeachersCoursesPage;

/* -------------------------------------------------- */
/* Course Tile                                         */
/* -------------------------------------------------- */
const CourseTile = ({ course }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-lg font-medium">{course.title}</h2>
        {open ? <FaChevronDown /> : <FaChevronUp />}
      </div>

      {open && (
        <div className="mt-4 space-y-3">
          {course.timetable?.length > 0 ? (
            course.timetable.map((slot) => (
              <TimeSlotTile key={slot.id} slot={slot} courseId={course.id} />
            ))
          ) : (
            <p className="text-sm text-gray-500">No timetables assigned.</p>
          )}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------- */
/* Slot Tile                                           */
/* -------------------------------------------------- */
const TimeSlotTile = ({ slot, courseId }) => {
  const canRegister = isTimeNowWithinSlot(slot);
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-3 bg-gray-50">
      <div className="flex flex-col gap-1">
        <p className="font-medium">{slot.dayOfWeek}</p>
        <p className="text-sm">
          {slot.startTime} — {slot.endTime}
        </p>

        {canRegister ? (
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => {
              navigate(`/teacher/register/attendance`,{state:{courseId}})

            }}
          >
            Register Attendance
          </button>
        ) : (
          <p className="text-xs text-red-500 mt-2">
            You can only register attendance during the scheduled time.
          </p>
        )}
      </div>
    </div>
  );
};


function isTimeNowWithinSlot(slot) {
  const today = new Date()
    .toLocaleString("en-US", { weekday: "long" })
    .toLowerCase();

  if (slot.dayOfWeek.toLowerCase() !== today) return false;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const parseTime = (t) => {
    // supports "6:30" → 06:30
    let [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const start = parseTime(slot.startTime);
  const end = parseTime(slot.endTime);

  return nowMinutes >= start && nowMinutes <= end;
}

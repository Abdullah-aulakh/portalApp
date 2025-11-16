import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import useAxios from "@/hooks/useAxios";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import CustomDropDown from "@/components/CustomDropDown";
import FullPageLoader from "@/components/FullPageLoader";

const EditTimetableForm = ({ timetable, onSave, onCancel }) => {
  const [courses, setCourses] = useState([]);

  const { response: coursesResponse, fetchData: fetchCourses } = useAxios();
  const { response, error, loading, fetchData: updateTimetable } = useAxios();

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses({ url: "/courses", method: "get" });
  }, []);

  useEffect(() => {
    if (coursesResponse) {
      setCourses(Array.isArray(coursesResponse) ? coursesResponse : []);
    }
  }, [coursesResponse]);

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Success!",
        text: "Timetable entry updated successfully!",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
      
      const updatedTimetable = {
        ...timetable,
        ...response,
        course: response.course || timetable.course
      };
      
      onSave(updatedTimetable);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to update timetable entry",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  }, [error]);

  const validationSchema = Yup.object({
    courseId: Yup.string().required("Course is required"),
    dayOfWeek: Yup.string().required("Day of week is required"),
    startTime: Yup.string()
      .required("Start time is required")
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
    endTime: Yup.string()
      .required("End time is required")
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format"),
    room: Yup.string().optional(),
  });

  const formik = useFormik({
    initialValues: {
      courseId: timetable?.course?.id || "",
      dayOfWeek: timetable?.dayOfWeek || "",
      startTime: timetable?.startTime || "",
      endTime: timetable?.endTime || "",
      room: timetable?.room || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        courseId: values.courseId,
        dayOfWeek: values.dayOfWeek,
        startTime: values.startTime,
        endTime: values.endTime,
        room: values.room || undefined,
      };

      await updateTimetable({
        url: `/timetables/${timetable.id}`,
        method: "put",
        data: payload,
      });
    },
  });

  const daysOfWeek = [
    "Monday",
    "Tuesday", 
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
  ];

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[var(--color-primary)] text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            Edit Timetable Entry
          </h2>
          <p className="text-white/80 text-center text-sm sm:text-base mt-1">
            Update timetable schedule
          </p>
        </div>

        {loading && <FullPageLoader />}

        <form onSubmit={formik.handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Current Course Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
              Current Course
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                📚
              </div>
              <div>
                <p className="text-gray-800 font-medium text-sm sm:text-base">
                  {timetable.course?.code} - {timetable.course?.title}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {timetable.course?.creditHours} credit hours
                </p>
              </div>
            </div>
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Change Course
            </label>
            <CustomDropDown
              label="Select Course"
              options={[
                { value: "", label: "Select a course" },
                ...courses.map(course => ({
                  value: course.id,
                  label: `${course.code} - ${course.title} (${course.creditHours} credits)`
                }))
              ]}
              selectedOption={formik.values.courseId}
              onChange={(value) => formik.setFieldValue("courseId", value)}
              isInvalid={!!formik.errors.courseId && formik.touched.courseId}
              validationMsg={formik.errors.courseId}
            />
          </div>

          {/* Day of Week */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Day of Week
            </label>
            <CustomDropDown
              label="Select Day"
              options={[
                { value: "", label: "Select day" },
                ...daysOfWeek.map(day => ({
                  value: day,
                  label: day
                }))
              ]}
              selectedOption={formik.values.dayOfWeek}
              onChange={(value) => formik.setFieldValue("dayOfWeek", value)}
              isInvalid={!!formik.errors.dayOfWeek && formik.touched.dayOfWeek}
              validationMsg={formik.errors.dayOfWeek}
            />
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <CustomDropDown
                label="Start Time"
                options={[
                  { value: "", label: "Select start time" },
                  ...timeSlots.map(time => ({
                    value: time,
                    label: time
                  }))
                ]}
                selectedOption={formik.values.startTime}
                onChange={(value) => formik.setFieldValue("startTime", value)}
                isInvalid={!!formik.errors.startTime && formik.touched.startTime}
                validationMsg={formik.errors.startTime}
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <CustomDropDown
                label="End Time"
                options={[
                  { value: "", label: "Select end time" },
                  ...timeSlots.map(time => ({
                    value: time,
                    label: time
                  }))
                ]}
                selectedOption={formik.values.endTime}
                onChange={(value) => formik.setFieldValue("endTime", value)}
                isInvalid={!!formik.errors.endTime && formik.touched.endTime}
                validationMsg={formik.errors.endTime}
              />
            </div>
          </div>

          {/* Room */}
          <CustomInput
            label="Room (Optional)"
            name="room"
            value={formik.values.room}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.room && formik.touched.room}
            validationMsg={formik.errors.room}
            placeholder="e.g., Room 101, Lab A"
          />

          {/* Time Display Preview */}
          {(formik.values.startTime || formik.values.endTime) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm font-medium text-green-800 text-center">
                {formik.values.startTime && formik.values.endTime 
                  ? `Time Slot: ${formatTime(formik.values.startTime)} - ${formatTime(formik.values.endTime)}`
                  : 'Please select both start and end times'
                }
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <CustomButton
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="flex-1 order-2 sm:order-1"
              disabled={loading}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              variant="primary"
              className="flex-1 order-1 sm:order-2"
              disabled={loading || !formik.isValid}
            >
              {loading ? "Updating..." : "Update Timetable"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTimetableForm;
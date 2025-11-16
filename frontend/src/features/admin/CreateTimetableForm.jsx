import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import useAxios from "@/hooks/useAxios";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import CustomDropDown from "@/components/CustomDropDown";
import FullPageLoader from "@/components/FullPageLoader";

const CreateTimetableForm = () => {
  const [courses, setCourses] = useState([]);

  const { response: coursesResponse, fetchData: fetchCourses } = useAxios();
  const { response, error, loading, fetchData: createTimetable } = useAxios();

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
        text: "Timetable entry created successfully!",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
      formik.resetForm();
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to create timetable entry",
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
      courseId: "",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      room: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        courseId: values.courseId,
        dayOfWeek: values.dayOfWeek,
        startTime: values.startTime,
        endTime: values.endTime,
        room: values.room || undefined,
      };

      await createTimetable({
        url: "/timetables",
        method: "post",
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

  const renderError = (field) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : "";

  return (
    <div className="max-w-xl mx-auto p-5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-[var(--primary-color)]">
     

      {loading && <FullPageLoader />}

      <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Course Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course
          </label>
          <CustomDropDown
            label="Course"
            options={[
              ...courses.map(course => ({
                value: course.id,
                label: `${course.code} - ${course.title} (${course.creditHours} credits)`
              }))
            ]}
            selectedOption={formik.values.courseId}
            onChange={(value) => formik.setFieldValue("courseId", value)}
            isInvalid={!!renderError("courseId")}
            validationMsg={renderError("courseId")}
          />
        </div>

        {/* Day of Week */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Day of Week
          </label>
          <CustomDropDown
            label="Day"
            options={[

              ...daysOfWeek.map(day => ({
                value: day,
                label: day
              }))
            ]}
            selectedOption={formik.values.dayOfWeek}
            onChange={(value) => formik.setFieldValue("dayOfWeek", value)}
            isInvalid={!!renderError("dayOfWeek")}
            validationMsg={renderError("dayOfWeek")}
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

                ...timeSlots.map(time => ({
                  value: time,
                  label: time
                }))
              ]}
              selectedOption={formik.values.startTime}
              onChange={(value) => formik.setFieldValue("startTime", value)}
              isInvalid={!!renderError("startTime")}
              validationMsg={renderError("startTime")}
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

                ...timeSlots.map(time => ({
                  value: time,
                  label: time
                }))
              ]}
              selectedOption={formik.values.endTime}
              onChange={(value) => formik.setFieldValue("endTime", value)}
              isInvalid={!!renderError("endTime")}
              validationMsg={renderError("endTime")}
            />
          </div>
        </div>

        {/* Room */}
        <CustomInput
          label="Room (Optional)"
          name="room"
          value={formik.values.room}
          onChange={formik.handleChange}
          isInvalid={!!renderError("room")}
          validationMsg={renderError("room")}
          placeholder="e.g., Room 101, Lab A"
        />

        {/* Time Display Preview */}
        {(formik.values.startTime || formik.values.endTime) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-800 text-center">
              {formik.values.startTime && formik.values.endTime 
                ? `Time Slot: ${formik.values.startTime} - ${formik.values.endTime}`
                : 'Please select both start and end times'
              }
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <CustomButton
            type="submit"
            variant="primary"
            disabled={loading || !formik.isValid}
            className="w-full sm:w-auto"
          >
            {loading ? "Creating..." : "Create Timetable Entry"}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default CreateTimetableForm;
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import useAxios from "@/hooks/useAxios";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import CustomDropDown from "@/components/CustomDropDown";
import FullPageLoader from "@/components/FullPageLoader";

const EditCourseForm = ({ course, onSave, onCancel }) => {
  const [teachers, setTeachers] = useState([]);

  const { response: teachersResponse, fetchData: fetchTeachers } = useAxios();
  const { response, error, loading, fetchData: updateCourse } = useAxios();

  // Fetch teachers for dropdown
  useEffect(() => {
    fetchTeachers({ url: "/teachers", method: "get" });
  }, []);

  useEffect(() => {
    if (teachersResponse) {
      setTeachers(Array.isArray(teachersResponse) ? teachersResponse : []);
    }
  }, [teachersResponse]);

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Success!",
        text: "Course updated successfully!",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
      
      const updatedCourse = {
        ...course,
        ...response,
        teacher: response.teacher || course.teacher
      };
      
      onSave(updatedCourse);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to update course",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  }, [error]);

  const validationSchema = Yup.object({
    code: Yup.string()
      .required("Course code is required")
      .min(2, "Course code must be at least 2 characters")
      .max(10, "Course code must be at most 10 characters"),
    title: Yup.string()
      .required("Course title is required")
      .min(3, "Course title must be at least 3 characters")
      .max(100, "Course title must be at most 100 characters"),
    creditHours: Yup.number()
      .required("Credit hours are required")
      .min(1, "Minimum 1 credit hour")
      .max(6, "Maximum 6 credit hours"),
    teacherId: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      code: course?.code || "",
      title: course?.title || "",
      creditHours: course?.creditHours || 3,
      teacherId: course?.teacher?.id || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        code: values.code,
        title: values.title,
        creditHours: values.creditHours,
        ...(values.teacherId && { teacherId: values.teacherId }),
      };

      await updateCourse({
        url: `/courses/${course.id}`,
        method: "put",
        data: payload,
      });
    },
  });

  const handleRemoveTeacher = () => {
    formik.setFieldValue("teacherId", "");
  };

  const currentTeacher = course?.teacher;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[var(--color-primary)] text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            Edit Course
          </h2>
          <p className="text-white/80 text-center text-sm sm:text-base mt-1">
            Update course information
          </p>
        </div>

        {loading && <FullPageLoader />}

        <form onSubmit={formik.handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Course Code */}
          <CustomInput
            label="Course Code"
            name="code"
            value={formik.values.code}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.code && formik.touched.code}
            validationMsg={formik.errors.code}
            placeholder="e.g., CS101"
          />

          {/* Course Title */}
          <CustomInput
            label="Course Title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.title && formik.touched.title}
            validationMsg={formik.errors.title}
            placeholder="Enter course title"
          />

          {/* Credit Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credit Hours
            </label>
            <select
              name="creditHours"
              value={formik.values.creditHours}
              onChange={formik.handleChange}
              className={`w-full border-2 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                formik.errors.creditHours && formik.touched.creditHours
                  ? "border-red-400 bg-red-50 focus:ring-red-300"
                  : "border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              }`}
            >
              {[1, 2, 3, 4, 5, 6].map(hours => (
                <option key={hours} value={hours}>
                  {hours} Credit Hour{hours > 1 ? 's' : ''}
                </option>
              ))}
            </select>
            {formik.errors.creditHours && formik.touched.creditHours && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.creditHours}</p>
            )}
          </div>

          {/* Teacher Assignment */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Assigned Teacher
            </label>

            {currentTeacher && !formik.values.teacherId ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {currentTeacher.user?.firstName?.charAt(0)}
                      {currentTeacher.user?.lastName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium text-sm sm:text-base">
                        {currentTeacher.user?.firstName} {currentTeacher.user?.lastName}
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {currentTeacher.designation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <CustomDropDown
                  label="Select Teacher"
                  options={[
                    { value: "", label: "No teacher assigned" },
                    ...teachers.map(teacher => ({
                      value: teacher.id,
                      label: `${teacher.user?.firstName} ${teacher.user?.lastName} - ${teacher.designation}`
                    }))
                  ]}
                  selectedOption={formik.values.teacherId}
                  onChange={(value) => formik.setFieldValue("teacherId", value)}
                  isInvalid={!!formik.errors.teacherId && formik.touched.teacherId}
                  validationMsg={formik.errors.teacherId}
                />
                
                {formik.values.teacherId && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleRemoveTeacher}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove Teacher
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

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
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Course"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseForm;
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import useAxios from "@/hooks/useAxios";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import CustomDropDown from "@/components/CustomDropDown";

const CreateCourseForm = () => {
  const [teachers, setTeachers] = useState([]);

  const { response: teachersResponse, fetchData: fetchTeachers } = useAxios();
  const { response, error, loading, fetchData: createCourse } = useAxios();

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
        text: "Course created successfully!",
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
        text: error?.message || "Failed to create course",
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
      code: "",
      title: "",
      creditHours: 3,
      teacherId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        code: values.code,
        title: values.title,
        creditHours: values.creditHours,
        ...(values.teacherId && { teacherId: values.teacherId }),
      };

      await createCourse({
        url: "/courses",
        method: "post",
        data: payload,
      });
    },
  });

  const renderError = (field) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : "";

  return (
    <div className="max-w-xl mx-auto p-5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-[var(--primary-color)]">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Create New Course
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Add a new course to the system
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Course Code */}
        <CustomInput
          label="Course Code"
          name="code"
          value={formik.values.code}
          onChange={formik.handleChange}
          isInvalid={!!renderError("code")}
          validationMsg={renderError("code")}
          placeholder="e.g., CS101, MATH201"
        />

        {/* Course Title */}
        <CustomInput
          label="Course Title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          isInvalid={!!renderError("title")}
          validationMsg={renderError("title")}
          placeholder="e.g., Introduction to Computer Science"
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign Teacher (Optional)
          </label>
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
            isInvalid={!!renderError("teacherId")}
            validationMsg={renderError("teacherId")}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <CustomButton
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Creating..." : "Create Course"}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default CreateCourseForm;
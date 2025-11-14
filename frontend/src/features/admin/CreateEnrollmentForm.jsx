import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import useAxios from "@/hooks/useAxios";
import CustomButton from "@/components/CustomButton";
import CustomDropDown from "@/components/CustomDropDown";

const CreateEnrollmentForm = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const { response: studentsResponse, fetchData: fetchStudents } = useAxios();
  const { response: coursesResponse, fetchData: fetchCourses } = useAxios();
  const { response, error, loading, fetchData: createEnrollment } = useAxios();

  // Fetch students and courses for dropdowns
  useEffect(() => {
    fetchStudents({ url: "/students", method: "get" });
    fetchCourses({ url: "/courses", method: "get" });
  }, []);

  useEffect(() => {
    if (studentsResponse) {
      const studentsData = Array.isArray(studentsResponse) ? studentsResponse : [];
      setStudents(studentsData);
      setFilteredStudents(studentsData);
    }
  }, [studentsResponse]);

  useEffect(() => {
    if (coursesResponse) {
      setCourses(Array.isArray(coursesResponse) ? coursesResponse : []);
    }
  }, [coursesResponse]);

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Success!",
        text: "Enrollment created successfully!",
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
        text: error?.message || "Failed to create enrollment",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  }, [error]);

  const validationSchema = Yup.object({
    studentId: Yup.string().required("Student is required"),
    courseId: Yup.string().required("Course is required"),
  });

  const formik = useFormik({
    initialValues: {
      studentId: "",
      courseId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        studentId: values.studentId,
        courseId: values.courseId,
      };

      await createEnrollment({
        url: "/enrollments",
        method: "post",
        data: payload,
      });
    },
  });

  const handleStudentSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(student =>
      student.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.program?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const renderError = (field) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : "";

  return (
    <div className="max-w-xl mx-auto p-5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-[var(--primary-color)]">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Create New Enrollment
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Enroll a student in a course
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Student Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Select Student
          </label>
          
          {/* Student Search */}
          <input
            type="text"
            placeholder="Search students by name, registration number, or program..."
            onChange={(e) => handleStudentSearch(e.target.value)}
            className="w-full border-2 border-[var(--color-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />

          <CustomDropDown
            label="Student"
            options={[
              { value: "", label: "Select a student" },
              ...filteredStudents.map(student => ({
                value: student.id,
                label: `${student.registrationNumber} - ${student.user?.firstName} ${student.user?.lastName} (${student.program} - Sem ${student.currentSemester})`
              }))
            ]}
            selectedOption={formik.values.studentId}
            onChange={(value) => formik.setFieldValue("studentId", value)}
            isInvalid={!!renderError("studentId")}
            validationMsg={renderError("studentId")}
          />
        </div>

        {/* Course Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <CustomDropDown
            label="Course"
            options={[
              { value: "", label: "Select a course" },
              ...courses.map(course => ({
                value: course.id,
                label: `${course.code} - ${course.title}`
              }))
            ]}
            selectedOption={formik.values.courseId}
            onChange={(value) => formik.setFieldValue("courseId", value)}
            isInvalid={!!renderError("courseId")}
            validationMsg={renderError("courseId")}
          />
        </div>

        {/* Selected Student and Course Preview */}
        {(formik.values.studentId || formik.values.courseId) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Enrollment Preview</h4>
            
            {formik.values.studentId && (
              <div className="mb-2">
                <p className="text-sm text-blue-700">
                  <strong>Student:</strong> {
                    filteredStudents.find(s => s.id === formik.values.studentId)?.user?.firstName
                  } {
                    filteredStudents.find(s => s.id === formik.values.studentId)?.user?.lastName
                  } ({filteredStudents.find(s => s.id === formik.values.studentId)?.registrationNumber})
                </p>
              </div>
            )}
            
            {formik.values.courseId && (
              <div>
                <p className="text-sm text-blue-700">
                  <strong>Course:</strong> {
                    courses.find(c => c.id === formik.values.courseId)?.code
                  } - {
                    courses.find(c => c.id === formik.values.courseId)?.title
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <CustomButton
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Enrolling..." : "Create Enrollment"}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default CreateEnrollmentForm;
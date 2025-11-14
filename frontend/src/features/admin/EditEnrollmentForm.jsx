import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import useAxios from "@/hooks/useAxios";
import CustomButton from "@/components/CustomButton";
import CustomDropDown from "@/components/CustomDropDown";
import FullPageLoader from "@/components/FullPageLoader";

const EditEnrollmentForm = ({ enrollment, onSave, onCancel }) => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const { response: studentsResponse, fetchData: fetchStudents } = useAxios();
  const { response: coursesResponse, fetchData: fetchCourses } = useAxios();
  const { response, error, loading, fetchData: updateEnrollment } = useAxios();

  // Fetch students and courses for dropdowns
  useEffect(() => {
    fetchStudents({ url: "/students", method: "get" });
    fetchCourses({ url: "/courses", method: "get" });
  }, []);

  useEffect(() => {
    if (studentsResponse) {
      setStudents(Array.isArray(studentsResponse) ? studentsResponse : []);
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
        text: "Enrollment updated successfully!",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
      
      const updatedEnrollment = {
        ...enrollment,
        ...response,
        student: response.student || enrollment.student,
        course: response.course || enrollment.course
      };
      
      onSave(updatedEnrollment);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to update enrollment",
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
      studentId: enrollment?.student?.id || "",
      courseId: enrollment?.course?.id || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        studentId: values.studentId,
        courseId: values.courseId,
      };

      await updateEnrollment({
        url: `/enrollments/${enrollment.id}`,
        method: "put",
        data: payload,
      });
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[var(--color-primary)] text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            Edit Enrollment
          </h2>
          <p className="text-white/80 text-center text-sm sm:text-base mt-1">
            Update student course enrollment
          </p>
        </div>

        {loading && <FullPageLoader />}

        <form onSubmit={formik.handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Current Enrollment Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Current Enrollment</h4>
            <p className="text-sm text-gray-600">
              <strong>Student:</strong> {enrollment.student?.user?.firstName} {enrollment.student?.user?.lastName} ({enrollment.student?.registrationNumber})
            </p>
            <p className="text-sm text-gray-600">
              <strong>Course:</strong> {enrollment.course?.code} - {enrollment.course?.title}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Enrolled:</strong> {new Date(enrollment.enrolledAt).toLocaleDateString()}
            </p>
          </div>

          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Change Student
            </label>
            <CustomDropDown
              label="Student"
              options={[
                { value: "", label: "Select a student" },
                ...students.map(student => ({
                  value: student.id,
                  label: `${student.registrationNumber} - ${student.user?.firstName} ${student.user?.lastName} (${student.program})`
                }))
              ]}
              selectedOption={formik.values.studentId}
              onChange={(value) => formik.setFieldValue("studentId", value)}
              isInvalid={!!formik.errors.studentId && formik.touched.studentId}
              validationMsg={formik.errors.studentId}
            />
          </div>

          {/* Course Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Change Course
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
              isInvalid={!!formik.errors.courseId && formik.touched.courseId}
              validationMsg={formik.errors.courseId}
            />
          </div>

          {/* Updated Enrollment Preview */}
          {(formik.values.studentId !== enrollment.student?.id || formik.values.courseId !== enrollment.course?.id) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Updated Enrollment</h4>
              
              {formik.values.studentId && (
                <div className="mb-2">
                  <p className="text-sm text-yellow-700">
                    <strong>New Student:</strong> {
                      students.find(s => s.id === formik.values.studentId)?.user?.firstName
                    } {
                      students.find(s => s.id === formik.values.studentId)?.user?.lastName
                    } ({students.find(s => s.id === formik.values.studentId)?.registrationNumber})
                  </p>
                </div>
              )}
              
              {formik.values.courseId && (
                <div>
                  <p className="text-sm text-yellow-700">
                    <strong>New Course:</strong> {
                      courses.find(c => c.id === formik.values.courseId)?.code
                    } - {
                      courses.find(c => c.id === formik.values.courseId)?.title
                    }
                  </p>
                </div>
              )}
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
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Enrollment"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEnrollmentForm;
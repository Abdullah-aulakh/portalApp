import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import useAxios from "@/hooks/useAxios";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import CustomDropDown from "@/components/CustomDropDown";
import FullPageLoader from "@/components/FullPageLoader";

const CreateEnrollmentForm = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { response: studentsResponse, fetchData: fetchStudents } = useAxios();
  const { response: coursesResponse, fetchData: fetchCourses } = useAxios();
  const { response: searchResponse, fetchData: searchStudent } = useAxios();
  const { response, error, loading, fetchData: createEnrollment } = useAxios();

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
    if (searchResponse) {
      setSearchResults(searchResponse);
    }
  }, [searchResponse]);

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Success!",
        text: "Enrollment created successfully!",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
      formik.resetForm();
      setSelectedStudent(null);
      setSearchQuery("");
      setSearchResults(null);
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

  const handleSearchStudent = async () => {
    if (!searchQuery.trim()) return;
    
    await searchStudent({
      url: `/students/reg/${searchQuery}`,
      method: "get",
    });
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    formik.setFieldValue("studentId", student.id);
    setSearchResults(null);
    setSearchQuery("");
  };

  const handleRemoveStudent = () => {
    setSelectedStudent(null);
    formik.setFieldValue("studentId", "");
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

      {loading && <FullPageLoader />}

      <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Student Search Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Student
          </label>

          {selectedStudent ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {selectedStudent.user?.firstName?.charAt(0)}
                    {selectedStudent.user?.lastName?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-sm sm:text-base">
                      {selectedStudent.user?.firstName} {selectedStudent.user?.lastName}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {selectedStudent.registrationNumber} • Semester {selectedStudent.currentSemester}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {selectedStudent.program} • {selectedStudent.department?.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveStudent}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Search by registration number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-2 border-[var(--color-primary)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearchStudent();
                    }
                  }}
                />
                <CustomButton
                  type="button"
                  onClick={handleSearchStudent}
                  disabled={!searchQuery.trim()}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Search
                </CustomButton>
              </div>

              {searchResults && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">Search Result:</p>
                    <button
                      type="button"
                      onClick={() => setSearchResults(null)}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {searchResults.user?.firstName?.charAt(0)}
                          {searchResults.user?.lastName?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium text-sm">
                            {searchResults.user?.firstName} {searchResults.user?.lastName}
                          </p>
                          <p className="text-gray-600 text-xs">
                            {searchResults.registrationNumber} • Semester {searchResults.currentSemester}
                          </p>
                        </div>
                      </div>
                      <CustomButton
                        type="button"
                        onClick={() => handleSelectStudent(searchResults)}
                        variant="primary"
                        size="sm"
                      >
                        Select
                      </CustomButton>
                    </div>
                  </div>
                </div>
              )}

              {formik.errors.studentId && formik.touched.studentId && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.studentId}</p>
              )}
            </div>
          )}
        </div>

        {/* Course Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
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
            isInvalid={!!renderError("courseId")}
            validationMsg={renderError("courseId")}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <CustomButton
            type="submit"
            variant="primary"
            disabled={loading || !formik.values.studentId || !formik.values.courseId}
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
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import useAxios from "@/hooks/useAxios";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import FullPageLoader from "@/components/FullPageLoader";

const StudentAttendanceSearch = ({ onStudentSelect }) => {
  const [searchResults, setSearchResults] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);

  const { response: searchResponse, fetchData: searchStudent } = useAxios();
  const { response: statsResponse, fetchData: fetchAttendanceStats } = useAxios();

  useEffect(() => {
    if (searchResponse) {
      setSearchResults(searchResponse);
      // Fetch attendance stats for the student
      if (searchResponse.id) {
        fetchAttendanceStats({
          url: `/attendance/student/${searchResponse.id}/stats`,
          method: "get",
        });
      }
    }
  }, [searchResponse]);

  useEffect(() => {
    if (statsResponse) {
      setAttendanceStats(statsResponse);
    }
  }, [statsResponse]);

  const validationSchema = Yup.object({
    registrationNumber: Yup.string().required("Registration number is required"),
  });

  const formik = useFormik({
    initialValues: {
      registrationNumber: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await searchStudent({
        url: `/students/reg/${values.registrationNumber}`,
        method: "get",
      });
    },
  });

  const handleSelectStudent = (student) => {
    onStudentSelect(student);
    setSearchResults(null);
    setAttendanceStats(null);
    formik.resetForm();
  };

  const calculatePercentage = (stats) => {
    if (!stats || !stats.totalClasses || stats.totalClasses === 0) return 0;
    return ((stats.presentClasses / stats.totalClasses) * 100).toFixed(1);
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white/90 rounded-xl shadow-lg border border-[var(--primary-color)] p-4 sm:p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
          Search Student Attendance
        </h3>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Find student by registration number to view attendance
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <CustomInput
            label="Registration Number"
            name="registrationNumber"
            value={formik.values.registrationNumber}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.registrationNumber && formik.touched.registrationNumber}
            validationMsg={formik.errors.registrationNumber}
            placeholder="Enter student registration number"
            className="flex-1"
          />
          <CustomButton
            type="submit"
            variant="primary"
            disabled={!formik.values.registrationNumber.trim()}
            className="w-full sm:w-auto mt-6"
          >
            Search
          </CustomButton>
        </div>
      </form>

      {searchResults && (
        <div className="mt-6 space-y-4">
          {/* Student Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {searchResults.user?.firstName?.charAt(0)}
                  {searchResults.user?.lastName?.charAt(0)}
                </div>
                <div>
                  <p className="text-gray-800 font-bold text-lg">
                    {searchResults.user?.firstName} {searchResults.user?.lastName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {searchResults.registrationNumber} • {searchResults.program}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Semester {searchResults.currentSemester} • {searchResults.department?.name}
                  </p>
                </div>
              </div>
              <CustomButton
                onClick={() => handleSelectStudent(searchResults)}
                variant="primary"
                size="sm"
              >
                View Attendance
              </CustomButton>
            </div>
          </div>

          {/* Attendance Statistics */}
          {attendanceStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{attendanceStats.presentClasses || 0}</p>
                <p className="text-xs text-green-800">Present</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-red-600">{attendanceStats.absentClasses || 0}</p>
                <p className="text-xs text-red-800">Absent</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{attendanceStats.totalClasses || 0}</p>
                <p className="text-xs text-blue-800">Total</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                <p className={`text-2xl font-bold ${getPercentageColor(calculatePercentage(attendanceStats))}`}>
                  {calculatePercentage(attendanceStats)}%
                </p>
                <p className="text-xs text-purple-800">Percentage</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentAttendanceSearch;
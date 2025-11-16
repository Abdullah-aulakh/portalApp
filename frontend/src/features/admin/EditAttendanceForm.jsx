import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import useAxios from "@/hooks/useAxios";
import CustomButton from "@/components/CustomButton";
import CustomDropDown from "@/components/CustomDropDown";
import FullPageLoader from "@/components/FullPageLoader";

const EditAttendanceForm = ({ attendance, onSave, onCancel }) => {
  const { response, error, loading, fetchData: updateAttendance } = useAxios();

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Success!",
        text: "Attendance updated successfully!",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
      
      const updatedAttendance = {
        ...attendance,
        ...response
      };
      
      onSave(updatedAttendance);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to update attendance",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  }, [error]);

  const validationSchema = Yup.object({
    isPresent: Yup.boolean().required("Attendance status is required"),
  });

  const formik = useFormik({
    initialValues: {
      isPresent: attendance?.isPresent || false,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        isPresent: values.isPresent,
      };

      await updateAttendance({
        url: `/attendance/${attendance.id}`,
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
            Edit Attendance
          </h2>
          <p className="text-white/80 text-center text-sm sm:text-base mt-1">
            Update attendance status
          </p>
        </div>

        {loading && <FullPageLoader />}

        <form onSubmit={formik.handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Student Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
              Student Information
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {attendance.student?.user?.firstName?.charAt(0)}
                {attendance.student?.user?.lastName?.charAt(0)}
              </div>
              <div>
                <p className="text-gray-800 font-medium text-sm sm:text-base">
                  {attendance.student?.user?.firstName} {attendance.student?.user?.lastName}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {attendance.student?.registrationNumber}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {attendance.student?.program} • Semester {attendance.student?.currentSemester}
                </p>
              </div>
            </div>
          </div>

          {/* Course Information */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
              Course Information
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                📚
              </div>
              <div>
                <p className="text-gray-800 font-medium text-sm sm:text-base">
                  {attendance.course?.code} - {attendance.course?.title}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {attendance.course?.creditHours} credit hours
                </p>
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
              Date
            </h3>
            <p className="text-gray-800 text-sm sm:text-base">
              {new Date(attendance.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Current Status */}
          <div className={`border rounded-lg p-3 sm:p-4 ${
            attendance.isPresent 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
              Current Status
            </h3>
            <div className="flex items-center gap-2">
              {attendance.isPresent ? (
                <>
                  <FaCheck className="text-green-500" />
                  <span className="text-green-800 font-medium">Present</span>
                </>
              ) : (
                <>
                  <FaTimes className="text-red-500" />
                  <span className="text-red-800 font-medium">Absent</span>
                </>
              )}
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Status
            </label>
            <CustomDropDown
              label="Select Status"
              options={[
                { value: "true", label: "Present" },
                { value: "false", label: "Absent" }
              ]}
              selectedOption={formik.values.isPresent.toString()}
              onChange={(value) => formik.setFieldValue("isPresent", value === "true")}
              isInvalid={!!formik.errors.isPresent && formik.touched.isPresent}
              validationMsg={formik.errors.isPresent}
            />
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
              {loading ? "Updating..." : "Update Attendance"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAttendanceForm;
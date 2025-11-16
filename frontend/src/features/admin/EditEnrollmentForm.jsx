import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import useAxios from "@/hooks/useAxios";
import CustomDropDown from "@/components/CustomDropDown";
import CustomButton from "@/components/CustomButton";
import FullPageLoader from "@/components/FullPageLoader";

const EditEnrollmentForm = ({ enrollment, onSave, onCancel }) => {
  const { response, error, loading, fetchData: updateEnrollment } = useAxios();

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Success!",
        text: "Enrollment status updated successfully!",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });

      const updatedEnrollment = { ...enrollment, ...response };
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
    status: Yup.string().required("Status is required"),
  });

  const formik = useFormik({
    initialValues: {
      status: enrollment?.status || "active",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await updateEnrollment({
        url: `/enrollments/${enrollment.id}`,
        method: "put",
        data: { status: values.status },
      });
    },
  });

  const statusOptions = [
    { value: "enrolled", label: "Enrolled" },
    { value: "completed", label: "Completed" },
    { value: "dropped", label: "Dropped" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[var(--color-primary)] text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            Edit Enrollment
          </h2>
          <p className="text-white/80 text-center text-sm sm:text-base mt-1">
            Update enrollment status
          </p>
        </div>

        {loading && <FullPageLoader />}

        <form onSubmit={formik.handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        

          {/* Current Status */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
              Current Status
            </h3>
            <p className="text-gray-800 font-medium text-sm sm:text-base">
              {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
            </p>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Change Status
            </label>
            <CustomDropDown
              label="Select Status"
              options={statusOptions}
              selectedOption={formik.values.status}
              onChange={(value) => formik.setFieldValue("status", value)}
              isInvalid={!!formik.errors.status && formik.touched.status}
              validationMsg={formik.errors.status}
            />
          </div>

          {/* Enrollment Date */}
          <div className="text-sm text-gray-600">
            <p>
              <strong>Enrollment Date:</strong> {new Date(enrollment.enrolledAt).toLocaleDateString()}
            </p>
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
              disabled={loading || !formik.values.status}
            >
              {loading ? "Updating..." : "Update Status"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEnrollmentForm;

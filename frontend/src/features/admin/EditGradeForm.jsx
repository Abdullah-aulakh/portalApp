// src/features/admin/EditGradeForm.jsx
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import CustomDropDown from "@/components/CustomDropDown";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";

const EditGradeForm = ({ grade, onSave, onCancel }) => {
  const { response, error, loading, fetchData: updateGrade } = useAxios();

  // Handle API responses
  React.useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Success!",
        text: "Grade updated successfully",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
      onSave(response);
    }
  }, [response, onSave]);

  React.useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to update grade",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  }, [error]);

  const validationSchema = Yup.object({
    marksObtained: Yup.number()
      .min(0, "Marks cannot be negative")
      .nullable(),
    totalMarks: Yup.number()
      .min(1, "Total marks must be at least 1")
      .nullable(),
    grade: Yup.string().nullable(),
    type: Yup.string().required("Grade type is required"),
  });

  const formik = useFormik({
    initialValues: {
      marksObtained: grade?.marksObtained || "",
      totalMarks: grade?.totalMarks || "",
      grade: grade?.grade || "",
      type: grade?.type || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        marksObtained: values.marksObtained ? Number(values.marksObtained) : null,
        totalMarks: values.totalMarks ? Number(values.totalMarks) : null,
        grade: values.grade || null,
      };

      await updateGrade({
        url: `/grades/${grade.id}`,
        method: "PUT",
        data: payload
      });
    },
  });

  // Calculate percentage for real-time feedback
  const percentage = formik.values.marksObtained && formik.values.totalMarks
    ? ((formik.values.marksObtained / formik.values.totalMarks) * 100).toFixed(1)
    : null;

  const gradeTypes = [
    { value: "assignment", label: "Assignment" },
    { value: "quiz", label: "Quiz" },
    { value: "project", label: "Project" },
    { value: "presentation", label: "Presentation" },
    { value: "midterm", label: "Midterm" },
    { value: "finalterm", label: "Final Term" },
  ];

  const gradeLetters = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "F", label: "F" },
    { value: "W", label: "W" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Grade</h3>
          
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Student and Course Info (Read-only) */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Student</p>
              <p className="text-sm text-gray-800">
                {grade.student?.user?.firstName} {grade.student?.user?.lastName}
              </p>
              <p className="text-sm font-medium text-gray-700 mt-2">Course</p>
              <p className="text-sm text-gray-800">
                {grade.course?.code} - {grade.course?.title}
              </p>
            </div>

            <CustomDropDown
              label="Grade Type"
              options={gradeTypes}
              selectedOption={formik.values.type}
              onChange={(value) => formik.setFieldValue('type', value)}
              isInvalid={formik.touched.type && formik.errors.type}
              validationMsg={formik.errors.type}
            />

            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Marks Obtained"
                name="marksObtained"
                type="number"
                value={formik.values.marksObtained}
                onChange={formik.handleChange}
                isInvalid={formik.touched.marksObtained && formik.errors.marksObtained}
                validationMsg={formik.errors.marksObtained}
              />

              <CustomInput
                label="Total Marks"
                name="totalMarks"
                type="number"
                value={formik.values.totalMarks}
                onChange={formik.handleChange}
                isInvalid={formik.touched.totalMarks && formik.errors.totalMarks}
                validationMsg={formik.errors.totalMarks}
              />
            </div>

            {/* Percentage Display */}
            {percentage && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800">Percentage</p>
                <p className="text-lg font-bold text-blue-600">{percentage}%</p>
              </div>
            )}

            <CustomDropDown
              label="Grade Letter"
              options={gradeLetters}
              selectedOption={formik.values.grade}
              onChange={(value) => formik.setFieldValue('grade', value)}
              isInvalid={formik.touched.grade && formik.errors.grade}
              validationMsg={formik.errors.grade}
            />

            <div className="flex gap-3 pt-4">
              <CustomButton
                type="button"
                variant="secondary"
                onClick={onCancel}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </CustomButton>
              <CustomButton
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Grade"}
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGradeForm;
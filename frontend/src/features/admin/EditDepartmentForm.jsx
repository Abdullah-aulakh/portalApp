import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import useAxios from "@/hooks/useAxios";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import CustomDropDown from "@/components/CustomDropDown";
import FullPageLoader from "@/components/FullPageLoader";

const EditDepartmentForm = ({ department, onSave, onCancel }) => {
  const [teachers, setTeachers] = useState([]);
  const [showHODDropdown, setShowHODDropdown] = useState(false);

  const { response: teachersResponse, fetchData: fetchTeachers } = useAxios();
  const { response, error, loading, fetchData: updateDepartment } = useAxios();

  // Fetch department teachers when component mounts
  useEffect(() => {
    if (department?.id) {
      fetchTeachers({ 
        url: `/departments/teachers/${department.id}`, 
        method: "get" 
      });
    }
  }, [department]);

  useEffect(() => {
    if (teachersResponse) {
      // Handle both array and object responses
      if (Array.isArray(teachersResponse)) {
        setTeachers(teachersResponse);
      } else if (teachersResponse.teachers) {
        setTeachers(teachersResponse.teachers);
      } else {
        setTeachers([]);
      }
    }
  }, [teachersResponse]);

  useEffect(() => {
    if (response) {
      Swal.fire({
        title: "Success!",
        text: "Department updated successfully!",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
      
      // Create the updated department object with the new HOD data
      const updatedDepartment = {
        ...department,
        name: formik.values.name,
        building: formik.values.building,
        headOfDepartment: formik.values.headOfDepartmentId 
          ? teachers.find(teacher => teacher.id === formik.values.headOfDepartmentId)
          : null
      };
      
      onSave(updatedDepartment);
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to update department",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  }, [error]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Department name is required"),
    building: Yup.string().required("Building name is required"),
    headOfDepartmentId: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      name: department?.name || "",
      building: department?.building || "",
      headOfDepartmentId: department?.headOfDepartment?.id || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        name: values.name,
        building: values.building,
        ...(values.headOfDepartmentId && { 
          headOfDepartmentId: values.headOfDepartmentId 
        }),
      };

      await updateDepartment({
        url: `/departments/${department.id}`,
        method: "put",
        data: payload,
      });
    },
  });

  const handleRemoveHOD = () => {
    formik.setFieldValue("headOfDepartmentId", "");
    setShowHODDropdown(false);
  };

  const currentHOD = department?.headOfDepartment;
  const selectedHOD = teachers.find(teacher => teacher.id === formik.values.headOfDepartmentId);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[var(--color-primary)] text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            Edit Department
          </h2>
          <p className="text-white/80 text-center text-sm sm:text-base mt-1">
            Update department information
          </p>
        </div>

        {loading && <FullPageLoader />}

        <form onSubmit={formik.handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Department Name */}
          <CustomInput
            label="Department Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.name && formik.touched.name}
            validationMsg={formik.errors.name}
            placeholder="Enter department name"
          />

          {/* Building Name */}
          <CustomInput
            label="Building"
            name="building"
            value={formik.values.building}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.building && formik.touched.building}
            validationMsg={formik.errors.building}
            placeholder="Enter building name"
          />

          {/* Head of Department Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Head of Department
            </label>

            {currentHOD && !showHODDropdown ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {currentHOD.user?.firstName?.charAt(0)}
                      {currentHOD.user?.lastName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium text-sm sm:text-base">
                        {currentHOD.user?.firstName} {currentHOD.user?.lastName}
                      </p>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {currentHOD.designation}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowHODDropdown(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {teachers.length > 0 ? (
                  <>
                    <CustomDropDown
                      label="Select Head of Department"
                      options={[
                        { value: "", label: "Select Head of Department" },
                        ...teachers.map(teacher => ({
                          value: teacher.id,
                          label: `${teacher.user?.firstName} ${teacher.user?.lastName} - ${teacher.designation}`
                        }))
                      ]}
                      selectedOption={formik.values.headOfDepartmentId}
                      onChange={(value) => formik.setFieldValue("headOfDepartmentId", value)}
                      isInvalid={!!formik.errors.headOfDepartmentId && formik.touched.headOfDepartmentId}
                      validationMsg={formik.errors.headOfDepartmentId}
                    />
                    
                    {formik.values.headOfDepartmentId && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleRemoveHOD}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove HOD
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm sm:text-base">
                      No teachers available in this department
                    </p>
                  </div>
                )}
                
                {showHODDropdown && (
                  <button
                    type="button"
                    onClick={() => setShowHODDropdown(false)}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Cancel Change
                  </button>
                )}
              </div>
            )}

            {!currentHOD && !showHODDropdown && teachers.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHODDropdown(true)}
                className="w-full py-2 border-2 border-dashed border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors text-sm sm:text-base"
              >
                + Assign Head of Department
              </button>
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
              {loading ? "Updating..." : "Update Department"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDepartmentForm;
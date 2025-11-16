// UserDetailsPage.jsx
import React, { use, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useLocation } from "react-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import CustomDropDown from "@/components/CustomDropDown";
import useAxios from "@/hooks/useAxios";
import FullpageLoader from "@/components/FullPageLoader";
import Swal from "sweetalert2";

const UserDetailsPage = () => {
  const location = useLocation();
  const { userData } = location.state;

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...userData });
  const [originalData, setOriginalData] = useState({ ...userData });

  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const api = useAxios();
  const updateApi = useAxios();

  const role = formData.user?.role || formData.role;
   const deleteApi = useAxios();

  // Fetch departments on mount
  useEffect(() => {
    setLoadingDepartments(true);
    api.fetchData({
      url: "/departments",
      method: "get",
    });
  }, []);

  useEffect(() => {
    if (api.response) {
      const options = api.response.map((d) => ({
        label: d.name,
        value: d.id,
      }));
      setDepartments(options);
    }
    setLoadingDepartments(api.loading);
  }, [api.response, api.loading]);
  useEffect(() => {
    if (updateApi.response) {
      Swal.fire({
        title: "Success!",
        text: "User updated successfully.",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  }, [updateApi.response]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleEditToggle = () => setEditMode(true);

  const handleCancel = () => {
    setFormData({ ...originalData });
    setEditMode(false);
  };

  const handleDelete = () => {
   
    deleteApi.fetchData({
      url: `/users/${formData.user?.id}`,
      method: "delete",
    });
  }

  useEffect(() => {
    if (deleteApi.response) {
      Swal.fire({
        title: "Success!",
        text: "User deleted successfully.",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  }, [deleteApi.response]);

  const handleSave = () => {
    const payload = {
      user: formData.user,
      ...(role === "student" && {
        student: {
          department: formData.department,
          program: formData.program,
          currentSemester: formData.currentSemester,
          registrationNumber: formData.registrationNumber,
        },
      }),
      ...(role === "teacher" && {
        teacher: {
          department: formData.department,
          designation: formData.designation,
          position: formData.position,
          experienceYears: formData.experienceYears,
          qualification: formData.qualification,
        },
      }),
      ...(role === "admin" && {
        admin: {
          accessLevel: formData.admin.accessLevel,
        },
      }),
    };

    console.log("Saved data:", payload);
    updateApi.fetchData({
      url: `/users/${formData.user?.id}`,
      method: "put",
      data: payload,
    });
    setOriginalData({ ...formData });
    setEditMode(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {loadingDepartments && <FullpageLoader />}
      <h1 className="text-2xl font-bold mb-6 text-center">User Details</h1>

      <form className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-start gap-4">
          {/* Name */}
          <div className="flex-1">
            <label className="text-gray-500 font-semibold">Name:</label>
            {editMode ? (
              <div className="flex flex-col gap-2">
                <CustomInput
                  value={formData.user?.firstName || formData.firstName || ""}
                  onChange={(e) => handleNestedChange("user", "firstName", e.target.value)}
                  placeholder="First Name"
                />
                <CustomInput
                  value={formData.user?.lastName || formData.lastName || ""}
                  onChange={(e) => handleNestedChange("user", "lastName", e.target.value)}
                  placeholder="Last Name"
                />
              </div>
            ) : (
              <p className="mt-1">
                {formData.user?.firstName
                  ? `${formData.user.firstName} ${formData.user.lastName}`
                  : `${formData.firstName || ""} ${formData.lastName || ""}`}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="flex-1">
            <label className="text-gray-500 font-semibold">Role:</label>
            <p className="mt-1">{role}</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            {!editMode ? (
              <CustomButton variant="primary" onClick={handleEditToggle}>
                <FaEdit /> Edit
              </CustomButton>
            ) : (
              <>
                <CustomButton variant="secondary" onClick={handleCancel}>
                  Cancel
                </CustomButton>
                <CustomButton variant="primary" onClick={handleSave}>
                  Save
                </CustomButton>
              </>
            )}
          </div>
        </div>

        {/* Student Details */}
        {role === "student" && (
          <div className="space-y-2">
            {/* Department as dropdown */}
            <div>
              <label className="text-gray-500 font-semibold">Department:</label>
              {editMode ? (
                <CustomDropDown
  options={departments}
  selectedOption={formData.department?.id || ""}
  onChange={(val) => {
    const selectedDept = departments.find((d) => d.value === val);
    handleChange("department", { id: selectedDept?.value, name: selectedDept?.label });
  }}
  label="Department"
/>

              ) : (
                <p>{formData.department?.name}</p>
              )}
            </div>

            {["program", "currentSemester", "registrationNumber"].map((field) => (
              <div key={field}>
                <label className="text-gray-500 font-semibold">
                  {field.replace(/([A-Z])/g, " $1")}:
                </label>
                {editMode ? (
                  <CustomInput
                    value={formData[field] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                ) : (
                  <p>{formData[field]}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Teacher Details */}
        {role === "teacher" && (
          <div className="space-y-2">
            <div>
              <label className="text-gray-500 font-semibold">Department:</label>
              {editMode ? (
               <CustomDropDown
  options={departments}
  selectedOption={formData.department?.id || ""}
  onChange={(val) => {
    const selectedDept = departments.find((d) => d.value === val);
    handleChange("department", { id: selectedDept?.value, name: selectedDept?.label });
  }}
  label="Department"
/>

              ) : (
                <p>{formData.department?.name}</p>
              )}
            </div>

            {["designation", "position", "experienceYears", "qualification"].map((field) => (
              <div key={field}>
                <label className="text-gray-500 font-semibold">
                  {field.replace(/([A-Z])/g, " $1")}:
                </label>
                {editMode ? (
                  <CustomInput
                    value={formData[field] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                ) : (
                  <p>{formData[field]}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Admin Details */}
        {role === "admin" && formData.admin && (
          <div className="space-y-2">
            <label className="text-gray-500 font-semibold">Access Level:</label>
            {editMode ? (
              <CustomInput
                value={formData.admin.accessLevel}
                onChange={(e) => handleNestedChange("admin", "accessLevel", e.target.value)}
              />
            ) : (
              <p>{formData.admin.accessLevel}</p>
            )}
            <label className="text-gray-500 font-semibold">Email:</label>
            {editMode ? (
              <CustomInput
                value={formData.email || formData.user?.email}
                onChange={(e) => handleNestedChange("user", "email", e.target.value)}
              />
            ) : (
              <p>{formData.email || formData.user?.email}</p>
            )}
          </div>
        )}

        {/* Delete Button */}
        <div className="flex justify-start mt-6">
          <CustomButton variant="danger" onClick={handleDelete}>
            Delete User
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default UserDetailsPage;

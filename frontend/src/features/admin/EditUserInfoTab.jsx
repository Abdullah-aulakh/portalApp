// UserInfoTab.jsx
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import CustomInput from "@/components/CustomInput"; // adjust the path

const EditUserInfoTab = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving data", formData);
    setEditMode(false);
  };

  const handleDelete = () => {
    console.log("Deleting user", user?.id);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Details</h2>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FaEdit className="inline mr-1" /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <FaTrash className="inline mr-1" /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CustomInput
          label="First Name"
          type="text"
          value={formData?.firstName ?? ""}
          placeholder="Enter first name"
          onChange={(e) => handleChange("firstName", e.target.value)}
          disabled={!editMode}
        />

        <CustomInput
          label="Last Name"
          type="text"
          value={formData?.lastName ?? ""}
          placeholder="Enter last name"
          onChange={(e) => handleChange("lastName", e.target.value)}
          disabled={!editMode}
        />

        <CustomInput
          label="Email"
          type="email"
          value={formData?.email ?? ""}
          placeholder="Enter email"
          onChange={(e) => handleChange("email", e.target.value)}
          disabled={!editMode}
        />

        <div>
          <label className="block text-gray-600 mb-2 text-sm font-medium">
            Role
          </label>
          <p className="text-gray-800">{user?.role ?? "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default EditUserInfoTab;

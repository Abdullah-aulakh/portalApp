import React, { use, useState,useEffect } from "react";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";
const CreateDepartmentForm = () => {
  const {response, error, loading, fetchData: createDepartment} = useAxios();
  const [formValues, setFormValues] = useState({
    name: "",
    building: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formValues.name) newErrors.name = "Department name is required";
    if (!formValues.building) newErrors.building = "Building is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    createDepartment({ url: "/departments", method: "post", data: formValues });
    setFormValues({ name: "", building: "" }); // Reset form
  };

  useEffect(() => {
    if (response) {
      Swal.fire("Success", "Department created successfully!", "success");
    } else if (error) {
      Swal.fire("Error", JSON.stringify(error?.message), "error");
    }
  },
  [response, error]);
  return (
    <div className="max-w-xl mx-auto p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border-2 border-[var(--primary-color)]">
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mt-6">
      <CustomInput
        label="Department Name"
        name="name"
        value={formValues.name}
        onChange={handleChange}
        isInvalid={!!errors.name}
        validationMsg={errors.name}
      />

      <CustomInput
        label="Building"
        name="building"
        value={formValues.building}
        onChange={handleChange}
        isInvalid={!!errors.building}
        validationMsg={errors.building}
      />

      <div className="flex justify-end">
        <CustomButton type="submit" variant="primary">
          Create Department
        </CustomButton>
      </div>
    </form>
    </div>
  );

};

export default CreateDepartmentForm;

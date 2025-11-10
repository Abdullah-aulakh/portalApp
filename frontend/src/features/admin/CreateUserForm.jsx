import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import useAxios from "@/hooks/useAxios";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import CustomDropDown from "@/components/CustomDropDown";

export const Roles = {
  STUDENT: "Student",
  TEACHER: "Teacher",
  ADMIN: "Admin",
};



const Stepper = ({ step }) => {
  const steps = ["Basic Info", "Role Details"];

  return (
    <div className="flex items-center w-full">
      {steps.map((label, index) => (
        <>
          {/* Step */}
          <div key={index} className="flex flex-col items-center text-center">
            {/* Step Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white mb-2 transition-all duration-300
                ${
                  step === index + 1
                    ? "bg-[var(--color-primary)] scale-110"
                    : "bg-gray-400"
                }`}
            >
              {index + 1}
            </div>

            {/* Step Label */}
            <span
              className={`text-sm font-medium ${
                step === index + 1
                  ? "text-[var(--color-primary)]"
                  : "text-gray-600"
              }`}
            >
              {label}
            </span>
          </div>

          {/* Line Between Steps */}
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-[4px] mx-4 rounded-full transition-colors duration-500 ${
                step > index + 1
                  ? "bg-[var(--color-primary)]"
                  : "bg-gray-300"
              }`}
            ></div>
          )}
        </>
      ))}
    </div>
  );
};




const CreateUserForm = () => {
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);

  const { response: deptResponse, fetchData: fetchDepartments } = useAxios();
  const { response, error, loading, fetchData: createUser } = useAxios();

  useEffect(() => {
    fetchDepartments({ url: "/departments", method: "get" });
  }, []);

  useEffect(() => {
    if (deptResponse) setDepartments(deptResponse);
  }, [deptResponse]);

  const step1Validation = Yup.object({
    firstName: Yup.string().required("First name required"),
    lastName: Yup.string().required("Last name required"),
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string()
      .min(6, "Min 6 characters")
      .required("Password required"),
    role: Yup.string().required("Select a role"),
  });

  const step2Validation = Yup.object({
    registrationNumber: Yup.string().when("role", {
      is: Roles.STUDENT,
      then: (schema) => schema.required("Registration number required"),
    }),
    program: Yup.string().when("role", {
      is: Roles.STUDENT,
      then: (schema) => schema.required("Program required"),
    }),
    currentSemester: Yup.number().when("role", {
      is: Roles.STUDENT,
      then: (schema) => schema.required("Semester required"),
    }),
    departmentId: Yup.string().when("role", {
      is: (r) => r === Roles.STUDENT || r === Roles.TEACHER,
      then: (schema) => schema.required("Department required"),
    }),
    designation: Yup.string().when("role", {
      is: Roles.TEACHER,
      then: (schema) => schema.required("Designation required"),
    }),
    position: Yup.string().when("role", {
      is: Roles.TEACHER,
      then: (schema) => schema.required("Position required"),
    }),
    accessLevel: Yup.string().when("role", {
      is: Roles.ADMIN,
      then: (schema) => schema.required("Access level required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      registrationNumber: "",
      program: "",
      currentSemester: 1,
      designation: "",
      position: "",
      experienceYears: 0,
      qualification: "",
      accessLevel: "",
      departmentId: "",
    },
    validationSchema: step === 1 ? step1Validation : step2Validation,
    onSubmit: async (values) => {
      if (step === 1) {
        setStep(2);
        return;
      }

      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: values.role.toLowerCase(),
      };

      if (values.role === Roles.STUDENT) {
        payload.student = {
          registrationNumber: values.registrationNumber,
          program: values.program,
          currentSemester: values.currentSemester,
          departmentId: values.departmentId,
        };
      } else if (values.role === Roles.TEACHER) {
        payload.teacher = {
          designation: values.designation,
          position: values.position,
          experienceYears: values.experienceYears,
          qualification: values.qualification,
          departmentId: values.departmentId,
        };
      } else if (values.role === Roles.ADMIN) {
        payload.admin = { accessLevel: values.accessLevel };
      }

      await createUser({ url: "auth/create", method: "post", data: payload });

    },
  });

  useEffect(() => {
    if (response) {
      Swal.fire("Success", "User created successfully!", "success");
      formik.resetForm();
      setStep(1);
    } else if (error) {
      Swal.fire("Error", JSON.stringify(error), "error");
    }
  }, [response, error]);

  const renderError = (field) =>
    formik.touched[field] && formik.errors[field] ? formik.errors[field] : "";

  return (
  <div className="max-w-xl mx-auto p-5 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-[var(--primary-color)]">
  {/* Stepper */}
  <Stepper step={step} />

  <form onSubmit={formik.handleSubmit} className="space-y-1.5 mt-1.5">
    {/* Step 1 */}
    {step === 1 && (
      <>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <CustomDropDown
            label="Role"
            options={Object.values(Roles).map((r) => ({ value: r, label: r }))}
            selectedOption={formik.values.role}
            onChange={(value) => formik.setFieldValue("role", value)}
            isInvalid={!!renderError("role")}
            validationMsg={renderError("role")}
          />
        </div>

        <CustomInput
          label="First Name"
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          isInvalid={!!renderError("firstName")}
          validationMsg={renderError("firstName")}
        />

        <CustomInput
          label="Last Name"
          name="lastName"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          isInvalid={!!renderError("lastName")}
          validationMsg={renderError("lastName")}
        />

        <CustomInput
          label="Email"
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          isInvalid={!!renderError("email")}
          validationMsg={renderError("email")}
        />

        <CustomInput
          label="Password"
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          isInvalid={!!renderError("password")}
          validationMsg={renderError("password")}
        />

        <div className="flex justify-end">
          <CustomButton variant="primary" type="submit" disabled={loading}>
            Next
          </CustomButton>
        </div>
      </>
    )}

    {/* Step 2 */}
    {step === 2 && (
      <>
        {/* Student Fields */}
        {formik.values.role === Roles.STUDENT && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <CustomDropDown
                label="Department"
                options={departments.map((d) => ({ value: d.id, label: d.name }))}
                selectedOption={formik.values.departmentId}
                onChange={(value) => formik.setFieldValue("departmentId", value)}
                isInvalid={!!renderError("departmentId")}
                validationMsg={renderError("departmentId")}
              />
            </div>

            <CustomInput
              label="Registration Number"
              name="registrationNumber"
              value={formik.values.registrationNumber}
              onChange={formik.handleChange}
              isInvalid={!!renderError("registrationNumber")}
              validationMsg={renderError("registrationNumber")}
            />

            <CustomInput
              label="Program"
              name="program"
              value={formik.values.program}
              onChange={formik.handleChange}
              isInvalid={!!renderError("program")}
              validationMsg={renderError("program")}
            />

            <CustomInput
              label="Current Semester"
              type="number"
              name="currentSemester"
              value={formik.values.currentSemester}
              onChange={formik.handleChange}
              isInvalid={!!renderError("currentSemester")}
              validationMsg={renderError("currentSemester")}
            />
          </>
        )}

        {/* Teacher Fields */}
        {formik.values.role === Roles.TEACHER && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <CustomDropDown
                label="Department"
                options={departments.map((d) => ({ value: d.id, label: d.name }))}
                selectedOption={formik.values.departmentId}
                onChange={(value) => formik.setFieldValue("departmentId", value)}
                isInvalid={!!renderError("departmentId")}
                validationMsg={renderError("departmentId")}
              />
            </div>

            <CustomInput
              label="Designation"
              name="designation"
              value={formik.values.designation}
              onChange={formik.handleChange}
              isInvalid={!!renderError("designation")}
              validationMsg={renderError("designation")}
            />

            <CustomInput
              label="Position"
              name="position"
              value={formik.values.position}
              onChange={formik.handleChange}
              isInvalid={!!renderError("position")}
              validationMsg={renderError("position")}
            />

            <CustomInput
              label="Experience Years"
              type="number"
              name="experienceYears"
              value={formik.values.experienceYears}
              onChange={formik.handleChange}
            />

            <CustomInput
              label="Qualification"
              name="qualification"
              value={formik.values.qualification}
              onChange={formik.handleChange}
            />
          </>
        )}

        {/* Admin Fields */}
        {formik.values.role === Roles.ADMIN && (
          <CustomInput
            label="Access Level"
            name="accessLevel"
            value={formik.values.accessLevel}
            onChange={formik.handleChange}
            isInvalid={!!renderError("accessLevel")}
            validationMsg={renderError("accessLevel")}
          />
        )}

        <div className="flex justify-between mt-3">
          <CustomButton variant="secondary" onClick={() => setStep(1)}>
            Back
          </CustomButton>
          <CustomButton type="submit" variant="primary" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </CustomButton>
        </div>
      </>
    )}
  </form>
</div>


  );
};

export default CreateUserForm;

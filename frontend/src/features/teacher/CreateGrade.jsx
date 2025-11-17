import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import CustomDropDown from "@/components/CustomDropDown";
import useAxios from "@/hooks/useAxios";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";

const GradeTypes = {
  ASSIGNMENT: "assignment",
  PROJECT: "project",
  QUIZ: "quiz",
  PRESENTATION: "presentation",
  MIDTERM: "midterm",
  FINALTERM: "finalterm",
};

const CreateGradePage = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const { user } = useAuth();

  const teacherApi = useAxios();
  const studentApi = useAxios();
  const submitApi = useAxios();

  // Load teacher courses on mount
  useEffect(() => {
    teacherApi.fetchData({
      url: `teachers/getCourses/${user.id}`,
      method: "get",
    });
  }, []);

  useEffect(() => {
    if (teacherApi.response) setCourses(teacherApi.response);
  }, [teacherApi.response]);

  // Load students dynamically when course changes
  const loadStudentsByCourse = (courseId) => {
    if (!courseId) return;

    studentApi.fetchData({
      url: `enrollments/studentsOfCourse/${courseId}`,
      method: "get",
    });
  };

  useEffect(() => {
    if (studentApi.response) setStudents(studentApi.response);
  }, [studentApi.response]);

  const initialValues = {
    studentId: "",
    courseId: "",
    marksObtained: "",
    totalMarks: "",
    type: "",
  };

  
  const validationSchema = Yup.object().shape({
    studentId: Yup.string().required("Required"),

    courseId: Yup.string().required("Required"),

    marksObtained: Yup.number()
      .typeError("Must be a number")
      .required("Required")
      .min(0, "Marks cannot be negative")
      .test(
        "less-than-total",
        "Marks obtained cannot be greater than total marks",
        function (value) {
          return value <= this.parent.totalMarks;
        }
      ),

    totalMarks: Yup.number()
      .typeError("Must be a number")
      .required("Required")
      .min(1, "Total marks must be at least 1"),

    type: Yup.string().required("Required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    console.log("Submitting:", values);
    submitApi.fetchData({
      url: "grades",
      method: "post",
      data: values,
    });

    resetForm();
  };
  useEffect(()=>{
    if(submitApi.response){
      Swal.fire({
        title: "Success!",
        text: "Grade created successfully.",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  },[submitApi.response])
  useEffect(()=>{
    if(submitApi.error){
      Swal.fire({
        title: "Error!",
        text: submitApi.error?.message || "Failed to create grade.",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  },[submitApi.error])

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Create New Grade
      </h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="flex flex-col space-y-4">

            {/* COURSE DROPDOWN */}
            <CustomDropDown
              label="Course"
              options={courses.map((c) => ({
                value: c.id,
                label: `${c.code} — ${c.title}`,
              }))}
              selectedOption={values.courseId}
              onChange={(courseId) => {
                setFieldValue("courseId", courseId);
                setFieldValue("studentId", "");
                loadStudentsByCourse(courseId);
              }}
              isInvalid={touched.courseId && !!errors.courseId}
              validationMsg={errors.courseId}
            />

            {/* STUDENT DROPDOWN */}
            <CustomDropDown
              label="Student"
              options={students.map((s) => ({
                value: s.id,
                label: `${s.registrationNumber} — ${s.user.firstName} ${s.user.lastName}`,
              }))}
              selectedOption={values.studentId}
              onChange={(val) => setFieldValue("studentId", val)}
              isInvalid={touched.studentId && !!errors.studentId}
              validationMsg={errors.studentId}
            />

            {/* MARKS OBTAINED */}
            <CustomInput
              label="Marks Obtained"
              name="marksObtained"
              type="number"
              min="0"
              value={values.marksObtained}
              onChange={(e) =>
                setFieldValue("marksObtained", e.target.value)
              }
            />
            {errors.marksObtained && touched.marksObtained && (
              <p className="text-red-500 text-sm">{errors.marksObtained}</p>
            )}

            {/* TOTAL MARKS */}
            <CustomInput
              label="Total Marks"
              name="totalMarks"
              type="number"
              min="1"
              value={values.totalMarks}
              onChange={(e) =>
                setFieldValue("totalMarks", e.target.value)
              }
            />
            {errors.totalMarks && touched.totalMarks && (
              <p className="text-red-500 text-sm">{errors.totalMarks}</p>
            )}

            {/* GRADE TYPE */}
            <CustomDropDown
              label="Grade Type"
              options={Object.values(GradeTypes).map((t) => ({
                value: t,
                label: t.toUpperCase(),
              }))}
              selectedOption={values.type}
              onChange={(val) => setFieldValue("type", val)}
              isInvalid={touched.type && !!errors.type}
              validationMsg={errors.type}
            />

            {/* SUBMIT */}
            <CustomButton type="submit" >
              {"Create Grade"}
            </CustomButton>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateGradePage;

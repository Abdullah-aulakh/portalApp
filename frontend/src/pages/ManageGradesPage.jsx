import React, { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import useAxios from "@/hooks/useAxios";
import GradeTile from "@/components/GradeTile";
import Swal from "sweetalert2";
import FullPageLoader from "@/components/FullPageLoader";

const ManageGradesPage = () => {
  const [result, setResult] = useState(null);
  const editGradesApi = useAxios();

  const handleSearch = (res) => {
    setResult(res);
  };

  const updateCourseGrades = (courseId, updatedCourse) => {
    setResult((prev) => {
      if (!prev) return prev;

      const updatedCourses = prev.courses.map((c) => {
        if (c.id !== courseId) return c;
        return { ...c, ...updatedCourse, grades: [...updatedCourse.grades] };
      });

      return { ...prev, courses: updatedCourses };
    });
  };

  const validate = (grades) => {
    for (const g of grades) {
      const obtained = Number(g.marksObtained);
      const total = Number(g.totalMarks);

      if (isNaN(obtained) || isNaN(total)) return "Marks must be numbers.";
      if (total <= 0) return "Total marks must be greater than zero.";
      if (obtained < 0) return "Obtained marks cannot be negative.";
      if (obtained > total) return "Obtained marks cannot be greater than total.";
    }
    return null;
  };

  const handleSave = (changedGrades, courseId) => {
    if (!changedGrades || changedGrades.length === 0) return;

    const error = validate(changedGrades);
    if (error) {
      Swal.fire({ icon: "error", title: "Invalid Input", text: error });
      return;
    }

    updateCourseGrades(courseId, { id: courseId, grades: changedGrades });

    const payload = changedGrades.map((g) => ({
      ...g,
      courseId,
      studentId: result?.student?.id,
    }));

    editGradesApi.fetchData({
      url: "grades/",
      method: "put",
      data: payload,
    });
  };

  useEffect(() => {
    if (!editGradesApi.response) return;

    Swal.fire({
      title: "Grades Updated",
      text: "Grades updated successfully.",
      icon: "success",
      confirmButtonText: "Ok",
    });
  }, [editGradesApi.response]);

  useEffect(() => {
    if (!editGradesApi.error) return;

    Swal.fire({
      title: "Update Failed",
      text: "An error occurred while saving grades.",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }, [editGradesApi.error]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {editGradesApi.loading && <FullPageLoader />}

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Grades</h1>

      <SearchBar
        placeholder="Search by student registration number..."
        endpoint="grades/reg"
        setResults={handleSearch}
      />

      {!result?.student ? (
        <p className="text-gray-500 mt-8 italic">Search a student to continue…</p>
      ) : (
        <div className="mt-8">
          <h2 className="font-bold text-xl mb-4">
            {result.student.user?.firstName} {result.student.user?.lastName} — Courses
          </h2>

          {result.courses.length === 0 ? (
            <p className="text-gray-400 italic">No enrolled courses</p>
          ) : (
            result.courses.map((c) => (
              <GradeTile
                key={c.id}
                gradeData={c}
                editable
                onSave={(changed) => handleSave(changed, c.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ManageGradesPage;

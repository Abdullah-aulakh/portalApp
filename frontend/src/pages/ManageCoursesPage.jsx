import React, { useState, useEffect } from "react";
import CourseTile from "@/components/CourseTile";
import SearchBar from "@/components/SearchBar";
import EditCourseForm from "@/features/admin/EditCourseForm";
import FullPageLoader from "@/components/FullPageLoader";
import CustomDropDown from "@/components/CustomDropDown";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";

const ManageCoursesPage = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [courses, setCourses] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  const { response, error, loading, fetchData } = useAxios();
  const { response: deptResponse, fetchData: fetchDepartments } = useAxios();

  // Fetch departments on mount
  useEffect(() => {
    fetchDepartments({ url: "/departments", method: "get" });
  }, []);

  useEffect(() => {
    if (deptResponse) {
      setDepartments(Array.isArray(deptResponse) ? deptResponse : []);
    }
  }, [deptResponse]);

  // Fetch courses whenever a department is selected
  useEffect(() => {
    if (selectedDepartment) {
      fetchCoursesByDepartment(selectedDepartment);
    } else {
      setCourses([]);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (response) {
      if (Array.isArray(response)) {
        setCourses(response);
      } else if (response.id) {
        setSearchResults(response);
      }
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to load courses",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  }, [error]);

  const fetchCoursesByDepartment = async (departmentId) => {
    await fetchData({ url: `/departments/courses/${departmentId}`, method: "get" });
  };


 
  const handleEdit = (course) => setEditingCourse(course);

  const handleDelete = async (course) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${course.code} - ${course.title}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "var(--color-primary)",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: { popup: 'text-sm sm:text-base' }
    });

    if (result.isConfirmed) {
      try {
        await fetchData({ url: `/courses/${course.id}`, method: "delete" });
        setCourses(prev => prev.filter(c => c.id !== course.id));
        Swal.fire({
          title: "Deleted!",
          text: `"${course.code}" has been deleted successfully.`,
          icon: "success",
          confirmButtonColor: "var(--color-primary)",
        });
      } catch (deleteError) {
        Swal.fire({
          title: "Error!",
          text: deleteError?.message || "Failed to delete course",
          icon: "error",
          confirmButtonColor: "var(--color-primary)",
        });
      }
    }
  };

  const handleEditSave = (updatedCourse) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    setEditingCourse(null);
  };

  const handleEditCancel = () => setEditingCourse(null);

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Courses</h2>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            View and manage all academic courses
          </p>
        </div>
        <div className="flex justify-center sm:justify-end">
          <CustomDropDown
            label="Select Department"
            options={[
              ...departments.map(dept => ({ value: dept.id, label: dept.name }))
            ]}
            selectedOption={selectedDepartment}
            onChange={setSelectedDepartment}
          />
        </div>
      </div>


      {loading && <FullPageLoader />}

      <div className="grid grid-cols-3 gap-6">
        {(searchResults || courses).length > 0 ? (
          (Array.isArray(searchResults || courses) ? (searchResults || courses) : [searchResults]).map(course => (
            <CourseTile
              key={course.id}
              course={course}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center py-8 sm:py-12 col-span-full">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📚</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
              No Courses Found
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              {selectedDepartment ? "No courses found in this department." : "There are no courses in the system yet."}
            </p>
          </div>
        )}
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <EditCourseForm
          course={editingCourse}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
};

export default ManageCoursesPage;

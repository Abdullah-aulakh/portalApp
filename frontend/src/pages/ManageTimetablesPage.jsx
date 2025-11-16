import React, { useState, useEffect } from "react";
import TimetableTile from "@/components/TimetableTile";
import SearchBar from "@/components/SearchBar";
import EditTimetableForm from "@/features/admin/EditTimetableForm";
import FullPageLoader from "@/components/FullPageLoader";
import CustomButton from "@/components/CustomButton";
import CustomDropDown from "@/components/CustomDropDown";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";

const ManageTimetablesPage = () => {
  // State
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [loading, setLoading] = useState(false);

  // APIs
  const departmentsApi = useAxios();
  const coursesApi = useAxios();
  const timetablesApi = useAxios();
  const editTimetableApi = useAxios();
  const deleteTimetableApi = useAxios();

  // Fetch all departments on load
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    await departmentsApi.fetchData({ url: "/departments", method: "get" });
    setLoading(false);
  };

  useEffect(() => {
    if (departmentsApi.response) setDepartments(departmentsApi.response);
    if (departmentsApi.error) showError(departmentsApi.error);
  }, [departmentsApi.response, departmentsApi.error]);

  // Fetch courses when a department is selected
  useEffect(() => {
    if (selectedDepartment) fetchCourses(selectedDepartment);
    else setCourses([]);
    setSelectedCourse("");
    setTimetables([]);
  }, [selectedDepartment]);

  const fetchCourses = async (departmentId) => {
    setLoading(true);
    await coursesApi.fetchData({
      url: `/departments/${departmentId}/courses`,
      method: "get",
    });
    setLoading(false);
  };

  useEffect(() => {
    if (coursesApi.response) setCourses(coursesApi.response);
    if (coursesApi.error) showError(coursesApi.error);
  }, [coursesApi.response, coursesApi.error]);

  // Fetch timetables when a course is selected
  useEffect(() => {
    if (selectedCourse) fetchTimetables(selectedCourse);
    else setTimetables([]);
  }, [selectedCourse]);

  const fetchTimetables = async (courseId) => {
    setLoading(true);
    await timetablesApi.fetchData({ url: `/timetables/${courseId}/courses`, method: "get" });
    setLoading(false);
  };

  useEffect(() => {
    if (timetablesApi.response) setTimetables(timetablesApi.response);
    if (timetablesApi.error) showError(timetablesApi.error);
  }, [timetablesApi.response, timetablesApi.error]);

  // Utility
  const showError = (error) => {
    Swal.fire({
      title: "Error!",
      text: error?.message || "Something went wrong",
      icon: "error",
      confirmButtonColor: "var(--color-primary)",
    });
  };

  const handleEdit = (timetable) => setEditingTimetable(timetable);
  const handleEditCancel = () => setEditingTimetable(null);

  const handleEditSave = async (updatedTimetable) => {
    try {
      await editTimetableApi.fetchData({
        url: `/timetables/${updatedTimetable.id}`,
        method: "put",
        data: updatedTimetable,
      });
      setTimetables((prev) =>
        prev.map((t) => (t.id === updatedTimetable.id ? updatedTimetable : t))
      );
      setEditingTimetable(null);
      Swal.fire({
        title: "Updated!",
        text: "Timetable updated successfully",
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
    } catch (err) {
      showError(err);
    }
  };

  const handleDelete = async (timetable) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete timetable for "${timetable.course?.code}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "var(--color-primary)",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await deleteTimetableApi.fetchData({ url: `/timetables/${timetable.id}`, method: "delete" });
        setTimetables((prev) => prev.filter((t) => t.id !== timetable.id));
        Swal.fire({
          title: "Deleted!",
          text: "Timetable deleted successfully",
          icon: "success",
          confirmButtonColor: "var(--color-primary)",
        });
      } catch (err) {
        showError(err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Timetables</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <CustomDropDown
          label="Department"
          options={departments.map((d) => ({ value: d.id, label: d.name }))}
          selectedOption={selectedDepartment}
          onChange={setSelectedDepartment}
        />
        <CustomDropDown
          label="Course"
          options={courses.map((c) => ({ value: c.id, label: c.title }))}
          selectedOption={selectedCourse}
          onChange={setSelectedCourse}
        />
      </div>

      {loading && <FullPageLoader />}

      {/* Timetable List */}
      {timetables.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {timetables.map((t) => (
            <TimetableTile
              key={t.id}
              timetable={t}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          {selectedCourse ? "No timetables found for this course." : "Select a department and course to view timetables."}
        </div>
      )}

      {/* Edit Modal */}
      {editingTimetable && (
        <EditTimetableForm
          timetable={editingTimetable}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
};

export default ManageTimetablesPage;

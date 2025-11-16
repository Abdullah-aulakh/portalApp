import React, { useState, useEffect } from "react";
import DepartmentTile from "@/components/DepartmentTile";
import SearchBar from "@/components/SearchBar";
import EditDepartmentForm from "@/features/admin/EditDepartmentForm";
import FullPageLoader from "@/components/FullPageLoader";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";

const ManageDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const { response, error, loading, fetchData } = useAxios();

  // Fetch all departments on mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (response) {
      if (Array.isArray(response)) {
        setDepartments(response);
      } else if (response.id) {
        setSearchResults(response);
      }
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to load departments",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  }, [error]);

  const fetchDepartments = async () => {
    await fetchData({ url: "/departments", method: "get" });
  };

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
  };

  const handleDelete = async (department) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${department.name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "var(--color-primary)",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await fetchData({ url: `/departments/${department.id}`, method: "delete" });
        setDepartments(prev => prev.filter(dept => dept.id !== department.id));
        if (searchResults) {
          if (Array.isArray(searchResults)) {
            setSearchResults(prev => prev.filter(dept => dept.id !== department.id));
          } else if (searchResults.id === department.id) {
            setSearchResults(null);
          }
        }
        Swal.fire({
          title: "Deleted!",
          text: `"${department.name}" has been deleted successfully.`,
          icon: "success",
          confirmButtonColor: "var(--color-primary)",
        });
      } catch (deleteError) {
        Swal.fire({
          title: "Error!",
          text: deleteError?.message || "Failed to delete department",
          icon: "error",
          confirmButtonColor: "var(--color-primary)",
        });
      }
    }
  };

  const handleEditSave = (updatedDepartment) => {
    setDepartments(prev => prev.map(dept => dept.id === updatedDepartment.id ? updatedDepartment : dept));
    if (searchResults) {
      if (Array.isArray(searchResults)) {
        setSearchResults(prev => prev.map(dept => dept.id === updatedDepartment.id ? updatedDepartment : dept));
      } else if (searchResults.id === updatedDepartment.id) {
        setSearchResults(updatedDepartment);
      }
    }
    setEditingDepartment(null);
  };

  const handleEditCancel = () => {
    setEditingDepartment(null);
  };

  const displayedDepartments = searchResults
    ? Array.isArray(searchResults)
      ? searchResults
      : [searchResults]
    : departments;

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Departments</h2>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            View and manage all academic departments
          </p>
        </div>
      </div>

     
      {loading && <FullPageLoader />}

      {/* Departments Grid */}
      {displayedDepartments.length > 0 ? (
        <div className="grid grid-cols-2 gap-6">
          {displayedDepartments.map(department => (
            <DepartmentTile
              key={department.id}
              department={department}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">🏢</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
            No Departments Found
          </h3>
          <p className="text-gray-500 text-sm sm:text-base">
            There are no departments in the system yet.
          </p>
        </div>
      )}

      {/* Statistics Footer */}
      <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">{departments.length}</div>
          <div className="text-xs sm:text-sm text-blue-800">Total Departments</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {departments.filter(dept => dept.headOfDepartment).length}
          </div>
          <div className="text-xs sm:text-sm text-green-800">Departments with HOD</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-purple-600">
            {departments.reduce((total, dept) => total + (dept.teachers?.length || 0), 0)}
          </div>
          <div className="text-xs sm:text-sm text-purple-800">Total Teachers</div>
        </div>
      </div>

      {/* Edit Department Modal */}
      {editingDepartment && (
        <EditDepartmentForm
          department={editingDepartment}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
};

export default ManageDepartmentsPage;

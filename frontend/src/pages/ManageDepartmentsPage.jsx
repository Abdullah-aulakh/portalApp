import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import DepartmentTile from "@/components/DepartmentTile";
import SearchBar from "@/components/SearchBar";
import EditDepartmentForm from "@/features/admin/EditDepartmentForm";
import FullPageLoader from "@/components/FullPageLoader";
import CustomButton from "@/components/CustomButton";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";

const ManageDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const { response, error, loading, fetchData } = useAxios();

  // Fetch all departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (response) {
      if (Array.isArray(response)) {
        setDepartments(response);
        setFilteredDepartments(response);
      } else if (response.id) {
        // Single department from search
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
    setActiveTab(1);
  };

  const handleViewDetails = (department) => {
    Swal.fire({
      title: `${department.name} - Full Details`,
      html: `
        <div class="text-left">
          <p><strong>Department ID:</strong> ${department.id}</p>
          <p><strong>Name:</strong> ${department.name}</p>
          <p><strong>Building:</strong> ${department.building || "Not specified"}</p>
          <p><strong>Head of Department:</strong> ${
            department.headOfDepartment 
              ? `${department.headOfDepartment.user?.firstName} ${department.headOfDepartment.user?.lastName} (${department.headOfDepartment.designation})`
              : "Not assigned"
          }</p>
          <p><strong>Total Teachers:</strong> ${department.teachers?.length || 0}</p>
          <p><strong>Total Students:</strong> ${department.students?.length || 0}</p>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "var(--color-primary)",
      customClass: {
        popup: 'text-sm sm:text-base',
        title: 'text-lg sm:text-xl'
      }
    });
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
  };

  const handleDelete = async (department) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete "${department.name}"? This action cannot be undone and will remove all associated data.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "var(--color-primary)",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: 'text-sm sm:text-base'
      }
    });

    if (result.isConfirmed) {
      await deleteDepartment(department);
    }
  };

  const deleteDepartment = async (department) => {
    try {
      const deleteResponse = await fetchData({
        url: `/departments/${department.id}`,
        method: "delete",
      });

      if (deleteResponse) {
        // IMMEDIATELY update the UI without waiting for refresh
        setDepartments(prev => prev.filter(dept => dept.id !== department.id));
        setFilteredDepartments(prev => prev.filter(dept => dept.id !== department.id));
        
        // Also update search results if needed
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
      }
    } catch (deleteError) {
      Swal.fire({
        title: "Error!",
        text: deleteError?.message || "Failed to delete department",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  };

  const handleEditSave = (updatedDepartment) => {
    console.log("Updated department:", updatedDepartment);
    
    // Update the department in the local state IMMEDIATELY
    setDepartments(prev => 
      prev.map(dept => dept.id === updatedDepartment.id ? updatedDepartment : dept)
    );
    setFilteredDepartments(prev => 
      prev.map(dept => dept.id === updatedDepartment.id ? updatedDepartment : dept)
    );
    
    // Also update search results
    if (searchResults) {
      if (Array.isArray(searchResults)) {
        setSearchResults(prev => 
          prev.map(dept => dept.id === updatedDepartment.id ? updatedDepartment : dept)
        );
      } else if (searchResults.id === updatedDepartment.id) {
        setSearchResults(updatedDepartment);
      }
    }
    
    setEditingDepartment(null);
  };

  const handleEditCancel = () => {
    setEditingDepartment(null);
  };

  const handleRefresh = () => {
    fetchDepartments();
    setSearchResults(null);
    setActiveTab(0);
  };

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
        <div className="flex justify-center sm:justify-end">
          <CustomButton 
            onClick={handleRefresh}
            variant="primary"
            disabled={loading}
            size="sm"
            className="w-full sm:w-auto"
          >
            Refresh
          </CustomButton>
        </div>
      </div>

      {loading && <FullPageLoader />}

      <div className="bg-white/90 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border-2 border-[var(--color-primary)] p-4 sm:p-6">
        <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
          <TabList className="flex flex-col sm:flex-row mb-4 sm:mb-6 gap-2 sm:gap-4 border-b border-gray-200">
            <Tab
              className="px-4 py-2 sm:px-6 sm:py-3 font-medium cursor-pointer border-b-2 border-transparent transition-all hover:text-[var(--color-primary)] text-center text-sm sm:text-base"
              selectedClassName="border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
            >
              All Departments ({departments.length})
            </Tab>
            <Tab
              className="px-4 py-2 sm:px-6 sm:py-3 font-medium cursor-pointer border-b-2 border-transparent transition-all hover:text-[var(--color-primary)] text-center text-sm sm:text-base"
              selectedClassName="border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
            >
              Search Department
            </Tab>
          </TabList>

          {/* Tab 1: All Departments */}
          <TabPanel>
            {filteredDepartments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {filteredDepartments.map((department) => (
                  <DepartmentTile
                    key={department.id}
                    department={department}
                    onViewDetails={handleViewDetails}
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
          </TabPanel>

          {/* Tab 2: Search Department */}
          <TabPanel>
            <div className="space-y-4 sm:space-y-6">
              <SearchBar
                endpoint="departments"
                placeholder="Search by department name or ID..."
                setResults={handleSearch}
              />
              
              {searchResults ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {Array.isArray(searchResults) ? (
                    searchResults.map((department) => (
                      <DepartmentTile
                        key={department.id}
                        department={department}
                        onViewDetails={handleViewDetails}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))
                  ) : (
                    <DepartmentTile
                      key={searchResults.id}
                      department={searchResults}
                      onViewDetails={handleViewDetails}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  )}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="text-gray-400 text-3xl sm:text-4xl mb-2 sm:mb-3">🔍</div>
                  <p className="text-gray-500 text-sm sm:text-base">
                    Use the search bar above to find departments by name or ID.
                  </p>
                </div>
              )}
            </div>
          </TabPanel>
        </Tabs>
      </div>

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
import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import EnrollmentTile from "@/components/EnrollmentTile";
import SearchBar from "@/components/SearchBar";
import EditEnrollmentForm from "@/features/admin/EditEnrollmentForm";
import FullPageLoader from "@/components/FullPageLoader";
import CustomButton from "@/components/CustomButton";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";

const ManageEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editingEnrollment, setEditingEnrollment] = useState(null);

  const { response, error, loading, fetchData } = useAxios();

  // Fetch all enrollments on component mount
  useEffect(() => {
    fetchEnrollments();
  }, []);

  useEffect(() => {
    if (response) {
      if (Array.isArray(response)) {
        setEnrollments(response);
        setFilteredEnrollments(response);
      } else if (response.id) {
        // Single enrollment from search
        setSearchResults(response);
      }
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error!",
        text: error?.message || "Failed to load enrollments",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  }, [error]);

  const fetchEnrollments = async () => {
    await fetchData({ url: "/enrollments", method: "get" });
  };

  const handleSearch = (results) => {
    setSearchResults(results);
    setActiveTab(1);
  };

  const handleViewDetails = (enrollment) => {
    Swal.fire({
      title: `Enrollment Details`,
      html: `
        <div class="text-left space-y-2">
          <div class="border-b pb-2">
            <p class="font-semibold text-gray-700">Student Information</p>
            <p><strong>Name:</strong> ${enrollment.student?.user?.firstName} ${enrollment.student?.user?.lastName}</p>
            <p><strong>Registration No:</strong> ${enrollment.student?.registrationNumber}</p>
            <p><strong>Program:</strong> ${enrollment.student?.program}</p>
            <p><strong>Semester:</strong> ${enrollment.student?.currentSemester}</p>
            <p><strong>Department:</strong> ${enrollment.student?.department?.name}</p>
          </div>
          <div class="border-b pb-2">
            <p class="font-semibold text-gray-700">Course Information</p>
            <p><strong>Course Code:</strong> ${enrollment.course?.code}</p>
            <p><strong>Course Title:</strong> ${enrollment.course?.title}</p>
            <p><strong>Credit Hours:</strong> ${enrollment.course?.creditHours}</p>
          </div>
          <div>
            <p class="font-semibold text-gray-700">Enrollment Details</p>
            <p><strong>Enrollment ID:</strong> ${enrollment.id}</p>
            <p><strong>Enrolled Date:</strong> ${new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
          </div>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "var(--color-primary)",
      width: 500,
      customClass: {
        popup: 'text-sm sm:text-base',
        title: 'text-lg sm:text-xl'
      }
    });
  };

  const handleEdit = (enrollment) => {
    setEditingEnrollment(enrollment);
  };

  const handleDelete = async (enrollment) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete enrollment for "${enrollment.student?.user?.firstName} ${enrollment.student?.user?.lastName}" in "${enrollment.course?.code}"?`,
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
      await deleteEnrollment(enrollment);
    }
  };

  const deleteEnrollment = async (enrollment) => {
    try {
      await fetchData({
        url: `/enrollments/${enrollment.id}`,
        method: "delete",
      });

      // Update UI immediately
      setEnrollments(prev => prev.filter(e => e.id !== enrollment.id));
      setFilteredEnrollments(prev => prev.filter(e => e.id !== enrollment.id));
      
      // Update search results if needed
      if (searchResults) {
        if (Array.isArray(searchResults)) {
          setSearchResults(prev => prev.filter(e => e.id !== enrollment.id));
        } else if (searchResults.id === enrollment.id) {
          setSearchResults(null);
        }
      }

      Swal.fire({
        title: "Deleted!",
        text: `Enrollment has been deleted successfully.`,
        icon: "success",
        confirmButtonColor: "var(--color-primary)",
      });
    } catch (deleteError) {
      Swal.fire({
        title: "Error!",
        text: deleteError?.message || "Failed to delete enrollment",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  };

  const handleEditSave = (updatedEnrollment) => {
    // Update the enrollment in the local state
    setEnrollments(prev => 
      prev.map(e => e.id === updatedEnrollment.id ? updatedEnrollment : e)
    );
    setFilteredEnrollments(prev => 
      prev.map(e => e.id === updatedEnrollment.id ? updatedEnrollment : e)
    );
    
    // Update search results
    if (searchResults) {
      if (Array.isArray(searchResults)) {
        setSearchResults(prev => 
          prev.map(e => e.id === updatedEnrollment.id ? updatedEnrollment : e)
        );
      } else if (searchResults.id === updatedEnrollment.id) {
        setSearchResults(updatedEnrollment);
      }
    }
    
    setEditingEnrollment(null);
  };

  const handleEditCancel = () => {
    setEditingEnrollment(null);
  };

  const handleRefresh = () => {
    fetchEnrollments();
    setSearchResults(null);
    setActiveTab(0);
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Enrollments</h2>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            View and manage all student course enrollments
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
              All Enrollments ({enrollments.length})
            </Tab>
            <Tab
              className="px-4 py-2 sm:px-6 sm:py-3 font-medium cursor-pointer border-b-2 border-transparent transition-all hover:text-[var(--color-primary)] text-center text-sm sm:text-base"
              selectedClassName="border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
            >
              Search Enrollment
            </Tab>
          </TabList>

          {/* Tab 1: All Enrollments */}
          <TabPanel>
            {filteredEnrollments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {filteredEnrollments.map((enrollment) => (
                  <EnrollmentTile
                    key={enrollment.id}
                    enrollment={enrollment}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">🎓</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                  No Enrollments Found
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  There are no course enrollments in the system yet.
                </p>
              </div>
            )}
          </TabPanel>

          {/* Tab 2: Search Enrollment */}
          <TabPanel>
            <div className="space-y-4 sm:space-y-6">
              <SearchBar
                endpoint="enrollments"
                placeholder="Search by enrollment ID..."
                setResults={handleSearch}
              />
              
              {searchResults ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {Array.isArray(searchResults) ? (
                    searchResults.map((enrollment) => (
                      <EnrollmentTile
                        key={enrollment.id}
                        enrollment={enrollment}
                        onViewDetails={handleViewDetails}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))
                  ) : (
                    <EnrollmentTile
                      key={searchResults.id}
                      enrollment={searchResults}
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
                    Use the search bar above to find enrollments by ID.
                  </p>
                </div>
              )}
            </div>
          </TabPanel>
        </Tabs>
      </div>

      {/* Statistics Footer */}
      <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">{enrollments.length}</div>
          <div className="text-xs sm:text-sm text-blue-800">Total Enrollments</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {new Set(enrollments.map(e => e.student?.id)).size}
          </div>
          <div className="text-xs sm:text-sm text-green-800">Unique Students</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-purple-600">
            {new Set(enrollments.map(e => e.course?.id)).size}
          </div>
          <div className="text-xs sm:text-sm text-purple-800">Unique Courses</div>
        </div>
      </div>

      {/* Edit Enrollment Modal */}
      {editingEnrollment && (
        <EditEnrollmentForm
          enrollment={editingEnrollment}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
};

export default ManageEnrollmentsPage;
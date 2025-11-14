import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import CourseTile from "@/components/CourseTile";
import SearchBar from "@/components/SearchBar";
import EditCourseForm from "@/features/admin/EditCourseForm";
import FullPageLoader from "@/components/FullPageLoader";
import CustomButton from "@/components/CustomButton";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";

const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editingCourse, setEditingCourse] = useState(null);

  const { response, error, loading, fetchData } = useAxios();

  // Fetch all courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (response) {
      if (Array.isArray(response)) {
        setCourses(response);
        setFilteredCourses(response);
      } else if (response.id) {
        // Single course from search
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

  const fetchCourses = async () => {
    await fetchData({ url: "/courses", method: "get" });
  };

  const handleSearch = (results) => {
    setSearchResults(results);
    setActiveTab(1);
  };

  const handleViewDetails = (course) => {
    Swal.fire({
      title: `${course.code} - Full Details`,
      html: `
        <div class="text-left">
          <p><strong>Course ID:</strong> ${course.id}</p>
          <p><strong>Code:</strong> ${course.code}</p>
          <p><strong>Title:</strong> ${course.title}</p>
          <p><strong>Credit Hours:</strong> ${course.creditHours}</p>
          <p><strong>Assigned Teacher:</strong> ${
            course.teacher 
              ? `${course.teacher.user?.firstName} ${course.teacher.user?.lastName} (${course.teacher.designation})`
              : "Not assigned"
          }</p>
          <p><strong>Total Enrollments:</strong> ${course.enrollments?.length || 0}</p>
          <p><strong>Total Grades:</strong> ${course.grades?.length || 0}</p>
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

  const handleEdit = (course) => {
    setEditingCourse(course);
  };

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
      customClass: {
        popup: 'text-sm sm:text-base'
      }
    });

    if (result.isConfirmed) {
      await deleteCourse(course);
    }
  };

  const deleteCourse = async (course) => {
    try {
      await fetchData({
        url: `/courses/${course.id}`,
        method: "delete",
      });

      // Update UI immediately
      setCourses(prev => prev.filter(c => c.id !== course.id));
      setFilteredCourses(prev => prev.filter(c => c.id !== course.id));
      
      // Update search results if needed
      if (searchResults) {
        if (Array.isArray(searchResults)) {
          setSearchResults(prev => prev.filter(c => c.id !== course.id));
        } else if (searchResults.id === course.id) {
          setSearchResults(null);
        }
      }

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
  };

  const handleEditSave = (updatedCourse) => {
    // Update the course in the local state
    setCourses(prev => 
      prev.map(c => c.id === updatedCourse.id ? updatedCourse : c)
    );
    setFilteredCourses(prev => 
      prev.map(c => c.id === updatedCourse.id ? updatedCourse : c)
    );
    
    // Update search results
    if (searchResults) {
      if (Array.isArray(searchResults)) {
        setSearchResults(prev => 
          prev.map(c => c.id === updatedCourse.id ? updatedCourse : c)
        );
      } else if (searchResults.id === updatedCourse.id) {
        setSearchResults(updatedCourse);
      }
    }
    
    setEditingCourse(null);
  };

  const handleEditCancel = () => {
    setEditingCourse(null);
  };

  const handleRefresh = () => {
    fetchCourses();
    setSearchResults(null);
    setActiveTab(0);
  };

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
              All Courses ({courses.length})
            </Tab>
            <Tab
              className="px-4 py-2 sm:px-6 sm:py-3 font-medium cursor-pointer border-b-2 border-transparent transition-all hover:text-[var(--color-primary)] text-center text-sm sm:text-base"
              selectedClassName="border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
            >
              Search Course
            </Tab>
            <Tab
              className="px-4 py-2 sm:px-6 sm:py-3 font-medium cursor-pointer border-b-2 border-transparent transition-all hover:text-[var(--color-primary)] text-center text-sm sm:text-base"
              selectedClassName="border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
            >
              Teacher Courses
            </Tab>
          </TabList>

          {/* Tab 1: All Courses */}
          <TabPanel>
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {filteredCourses.map((course) => (
                  <CourseTile
                    key={course.id}
                    course={course}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📚</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                  No Courses Found
                </h3>
                <p className="text-gray-500 text-sm sm:text-base">
                  There are no courses in the system yet.
                </p>
              </div>
            )}
          </TabPanel>

          {/* Tab 2: Search Course */}
          <TabPanel>
            <div className="space-y-4 sm:space-y-6">
              <SearchBar
                endpoint="courses"
                placeholder="Search by course code or ID..."
                setResults={handleSearch}
              />
              
              {searchResults ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {Array.isArray(searchResults) ? (
                    searchResults.map((course) => (
                      <CourseTile
                        key={course.id}
                        course={course}
                        onViewDetails={handleViewDetails}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))
                  ) : (
                    <CourseTile
                      key={searchResults.id}
                      course={searchResults}
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
                    Use the search bar above to find courses by code or ID.
                  </p>
                </div>
              )}
            </div>
          </TabPanel>

          {/* Tab 3: Teacher Courses */}
          <TabPanel>
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">👨‍🏫</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                Teacher Courses
              </h3>
              <p className="text-gray-500 text-sm sm:text-base mb-4">
                This feature will show courses assigned to specific teachers.
              </p>
              <CustomButton
                variant="primary"
                onClick={() => {
                  Swal.fire({
                    title: "Coming Soon!",
                    text: "Teacher courses feature will be implemented in the next update.",
                    icon: "info",
                    confirmButtonColor: "var(--color-primary)",
                  });
                }}
              >
                View Teacher Courses
              </CustomButton>
            </div>
          </TabPanel>
        </Tabs>
      </div>

      {/* Statistics Footer */}
      <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">{courses.length}</div>
          <div className="text-xs sm:text-sm text-blue-800">Total Courses</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {courses.filter(course => course.teacher).length}
          </div>
          <div className="text-xs sm:text-sm text-green-800">Courses with Teacher</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-purple-600">
            {courses.reduce((total, course) => total + (course.enrollments?.length || 0), 0)}
          </div>
          <div className="text-xs sm:text-sm text-purple-800">Total Enrollments</div>
        </div>
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
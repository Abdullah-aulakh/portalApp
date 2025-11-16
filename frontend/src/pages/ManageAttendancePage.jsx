import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AttendanceTile from "@/components/AttendanceTile";
import SearchBar from "@/components/SearchBar";
import EditAttendanceForm from "@/features/admin/EditAttendanceForm";
import StudentSearch from "@/features/attendance/StudentSearch";
import FullPageLoader from "@/components/FullPageLoader";
import CustomButton from "@/components/CustomButton";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";

const ManageAttendancePage = () => {
  const [attendances, setAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [attendancePercentage, setAttendancePercentage] = useState(null);

  const { response, error, loading, fetchData } = useAxios();

  // Handle student selection from search
  const handleStudentSelect = (student) => {
    console.log("Student selected:", student);
    setStudentData(student);
    loadStudentAttendance(student.id);
  };

  // Load attendance data for selected student
  const loadStudentAttendance = async (studentId) => {
    try {
      // Fetch attendance records
      const attendanceResponse = await fetchData({
        url: `/attendance/student/${studentId}`,
        method: "GET",
      });

      if (attendanceResponse.data) {
        setAttendances(attendanceResponse.data);
        setFilteredAttendances(attendanceResponse.data);
      }

      // Fetch attendance percentage
      const percentageResponse = await fetchData({
        url: `/attendance/student/${studentId}/percentage`,
        method: "GET",
      });

      if (percentageResponse.data) {
        setAttendancePercentage(percentageResponse.data);
      }
    } catch (err) {
      console.error("Error loading attendance data:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to load attendance data for this student",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  };

  // Handle API responses
  useEffect(() => {
    if (response) {
      console.log("API Response:", response);
      
      // Handle different response types
      if (Array.isArray(response)) {
        // Attendance records array
        setAttendances(response);
        setFilteredAttendances(response);
      } else if (response.percentage !== undefined) {
        // Attendance percentage
        setAttendancePercentage(response);
      } else if (response.id && !response.registrationNumber) {
        // Single attendance record from search
        setSearchResults(response);
      }
      // Student data is handled in handleStudentSelect
    }
  }, [response]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      console.error("API Error:", error);
      
      // Don't show Swal for 404 errors (student not found) as they're handled in StudentSearch
      if (error.status !== 404) {
        Swal.fire({
          title: "Error",
          text: error?.message || "An error occurred while processing your request",
          icon: "error",
          confirmButtonColor: "var(--color-primary)",
        });
      }
    }
  }, [error]);

  const handleSearch = (results) => {
    setSearchResults(results);
    setActiveTab(1);
  };

  const handleViewDetails = (attendance) => {
    Swal.fire({
      title: `Attendance Details`,
      html: `
        <div class="text-left space-y-3">
          <div class="border-b pb-2">
            <p class="font-semibold text-gray-700">Student Information</p>
            <p><strong>Name:</strong> ${attendance.student?.user?.firstName} ${attendance.student?.user?.lastName}</p>
            <p><strong>Registration No:</strong> ${attendance.student?.registrationNumber}</p>
            <p><strong>Program:</strong> ${attendance.student?.program}</p>
            <p><strong>Semester:</strong> ${attendance.student?.currentSemester}</p>
            <p><strong>Department:</strong> ${attendance.student?.department?.name}</p>
          </div>
          <div class="border-b pb-2">
            <p class="font-semibold text-gray-700">Course Information</p>
            <p><strong>Course Code:</strong> ${attendance.course?.code}</p>
            <p><strong>Course Title:</strong> ${attendance.course?.title}</p>
            <p><strong>Credit Hours:</strong> ${attendance.course?.creditHours}</p>
            <p><strong>Teacher:</strong> ${attendance.course?.teacher ? `${attendance.course.teacher.user?.firstName} ${attendance.course.teacher.user?.lastName}` : 'Not assigned'}</p>
          </div>
          <div class="border-b pb-2">
            <p class="font-semibold text-gray-700">Attendance Details</p>
            <p><strong>Date:</strong> ${new Date(attendance.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Status:</strong> <span class="${attendance.isPresent ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}">${attendance.isPresent ? 'Present' : 'Absent'}</span></p>
          </div>
          <div>
            <p class="font-semibold text-gray-700">Record Details</p>
            <p><strong>Attendance ID:</strong> ${attendance.id}</p>
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

  const handleEdit = (attendance) => {
    setEditingAttendance(attendance);
  };

  const handleDelete = async (attendance) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete attendance record for "${attendance.student?.user?.firstName} ${attendance.student?.user?.lastName}" on ${new Date(attendance.date).toLocaleDateString()}?`,
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
      await deleteAttendance(attendance);
    }
  };

  const deleteAttendance = async (attendance) => {
    try {
      const result = await fetchData({
        url: `/attendance/${attendance.id}`,
        method: "DELETE",
      });

      if (result.data) {
        // Update UI immediately
        setAttendances(prev => prev.filter(a => a.id !== attendance.id));
        setFilteredAttendances(prev => prev.filter(a => a.id !== attendance.id));
        
        // Update search results if needed
        if (searchResults) {
          if (Array.isArray(searchResults)) {
            setSearchResults(prev => prev.filter(a => a.id !== attendance.id));
          } else if (searchResults.id === attendance.id) {
            setSearchResults(null);
          }
        }

        Swal.fire({
          title: "Deleted!",
          text: `Attendance record has been deleted successfully.`,
          icon: "success",
          confirmButtonColor: "var(--color-primary)",
        });
      }
    } catch (deleteError) {
      Swal.fire({
        title: "Error!",
        text: deleteError?.message || "Failed to delete attendance record",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  };

  const handleEditSave = (updatedAttendance) => {
    // Update the attendance in the local state
    setAttendances(prev => 
      prev.map(a => a.id === updatedAttendance.id ? updatedAttendance : a)
    );
    setFilteredAttendances(prev => 
      prev.map(a => a.id === updatedAttendance.id ? updatedAttendance : a)
    );
    
    // Update search results
    if (searchResults) {
      if (Array.isArray(searchResults)) {
        setSearchResults(prev => 
          prev.map(a => a.id === updatedAttendance.id ? updatedAttendance : a)
        );
      } else if (searchResults.id === updatedAttendance.id) {
        setSearchResults(updatedAttendance);
      }
    }
    
    setEditingAttendance(null);
  };

  const handleEditCancel = () => {
    setEditingAttendance(null);
  };

  const handleRefresh = () => {
    if (studentData) {
      loadStudentAttendance(studentData.id);
    }
    setSearchResults(null);
  };

  const handleClearStudent = () => {
    setStudentData(null);
    setAttendances([]);
    setFilteredAttendances([]);
    setAttendancePercentage(null);
    setSearchResults(null);
    setActiveTab(0);
  };

  // Calculate statistics
  const presentCount = attendances.filter(a => a.isPresent).length;
  const absentCount = attendances.filter(a => !a.isPresent).length;
  const totalRecords = attendances.length;

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Attendance</h2>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            View and manage student attendance records
          </p>
        </div>
        <div className="flex justify-center sm:justify-end">
          <CustomButton 
            onClick={handleRefresh}
            variant="primary"
            disabled={loading || !studentData}
            size="sm"
            className="w-full sm:w-auto"
          >
            Refresh
          </CustomButton>
        </div>
      </div>

      {loading && <FullPageLoader />}

      {/* Student Search Section */}
      <StudentSearch
        onStudentSelect={handleStudentSelect}
        selectedStudent={studentData}
        onClearSelection={handleClearStudent}
      />

      {/* Attendance Data Section */}
      {studentData && (
        <>
          <div className="bg-white/90 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border-2 border-[var(--color-primary)] p-4 sm:p-6">
            <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
              <TabList className="flex flex-col sm:flex-row mb-4 sm:mb-6 gap-2 sm:gap-4 border-b border-gray-200">
                <Tab
                  className="px-4 py-2 sm:px-6 sm:py-3 font-medium cursor-pointer border-b-2 border-transparent transition-all hover:text-[var(--color-primary)] text-center text-sm sm:text-base"
                  selectedClassName="border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                >
                  All Records ({attendances.length})
                </Tab>
                <Tab
                  className="px-4 py-2 sm:px-6 sm:py-3 font-medium cursor-pointer border-b-2 border-transparent transition-all hover:text-[var(--color-primary)] text-center text-sm sm:text-base"
                  selectedClassName="border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                >
                  Search Record
                </Tab>
                <Tab
                  className="px-4 py-2 sm:px-6 sm:py-3 font-medium cursor-pointer border-b-2 border-transparent transition-all hover:text-[var(--color-primary)] text-center text-sm sm:text-base"
                  selectedClassName="border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                >
                  Statistics
                </Tab>
              </TabList>

              {/* Tab 1: All Attendance Records */}
              <TabPanel>
                {filteredAttendances.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {filteredAttendances.map((attendance) => (
                      <AttendanceTile
                        key={attendance.id}
                        attendance={attendance}
                        onViewDetails={handleViewDetails}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📊</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                      No Attendance Records Found
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base">
                      No attendance records found for this student.
                    </p>
                  </div>
                )}
              </TabPanel>

              {/* Tab 2: Search Attendance Record */}
              <TabPanel>
                <div className="space-y-4 sm:space-y-6">
                  <SearchBar
                    endpoint="attendance"
                    placeholder="Search by attendance ID..."
                    setResults={handleSearch}
                  />
                  
                  {searchResults ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                      {Array.isArray(searchResults) ? (
                        searchResults.map((attendance) => (
                          <AttendanceTile
                            key={attendance.id}
                            attendance={attendance}
                            onViewDetails={handleViewDetails}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        ))
                      ) : (
                        <AttendanceTile
                          key={searchResults.id}
                          attendance={searchResults}
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
                        Use the search bar above to find attendance records by ID.
                      </p>
                    </div>
                  )}
                </div>
              </TabPanel>

              {/* Tab 3: Statistics */}
              <TabPanel>
                <div className="space-y-6">
                  {/* Overall Statistics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-green-600">{presentCount}</div>
                      <div className="text-sm text-green-800">Present</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-red-600">{absentCount}</div>
                      <div className="text-sm text-red-800">Absent</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600">{totalRecords}</div>
                      <div className="text-sm text-blue-800">Total Records</div>
                    </div>
                  </div>

                  {/* Attendance Percentage from API */}
                  {attendancePercentage && (
                    <div className="bg-white border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 text-center">
                        Overall Attendance Percentage
                      </h4>
                      <div className="text-center mb-4">
                        <div className="text-3xl sm:text-4xl font-bold text-purple-600">
                          {attendancePercentage.percentage || 0}%
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Based on {attendancePercentage.totalDays || 0} total days
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-purple-600 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${attendancePercentage.percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Manual Calculation (fallback) */}
                  {totalRecords > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Calculated Attendance Rate</h4>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-green-600 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${(presentCount / totalRecords) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>0%</span>
                        <span className="font-semibold">{Math.round((presentCount / totalRecords) * 100)}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>
            </Tabs>
          </div>

          {/* Statistics Footer */}
          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{totalRecords}</div>
              <div className="text-xs sm:text-sm text-blue-800">Total Records</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{presentCount}</div>
              <div className="text-xs sm:text-sm text-green-800">Present Days</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">
                {totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0}%
              </div>
              <div className="text-xs sm:text-sm text-purple-800">Attendance Rate</div>
            </div>
          </div>
        </>
      )}

      {/* Edit Attendance Modal */}
      {editingAttendance && (
        <EditAttendanceForm
          attendance={editingAttendance}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
};

export default ManageAttendancePage;
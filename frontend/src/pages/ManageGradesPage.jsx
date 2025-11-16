// src/pages/ManageGradesPage.jsx
import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import GradeTile from "@/components/GradeTile";
import SearchBar from "@/components/SearchBar";
import StudentSearch from "@/features/attendance/StudentSearch";
import EditGradeForm from "@/features/admin/EditGradeForm";
import FullPageLoader from "@/components/FullPageLoader";
import CustomButton from "@/components/CustomButton";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";

const ManageGradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editingGrade, setEditingGrade] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [gradeStatistics, setGradeStatistics] = useState(null);
  const [loading, setLoading] = useState(false);

  const { response, error, fetchData } = useAxios();

  // Handle student selection from search
  const handleStudentSelect = (student) => {
    console.log("Student selected:", student);
    setStudentData(student);
    loadStudentGrades(student.id);
  };

  // Load grades data for selected student
  const loadStudentGrades = async (studentId) => {
    setLoading(true);
    try {
      await fetchData({
        url: `/grades/student/${studentId}`,
        method: "GET",
      });
    } catch (err) {
      console.error("Error loading grades data:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to load grades data for this student",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from grades
  const calculateStatistics = (gradesData) => {
    if (!gradesData || gradesData.length === 0) {
      setGradeStatistics(null);
      return;
    }

    const stats = {
      totalGrades: gradesData.length,
      averagePercentage: 0,
      gradeDistribution: {},
      typeDistribution: {},
      totalCourses: new Set(gradesData.map(grade => grade.course?.id)).size
    };

    let totalPercentage = 0;
    let validPercentageCount = 0;

    gradesData.forEach(grade => {
      // Grade distribution
      if (grade.grade) {
        stats.gradeDistribution[grade.grade] = (stats.gradeDistribution[grade.grade] || 0) + 1;
      }

      // Type distribution
      if (grade.type) {
        stats.typeDistribution[grade.type] = (stats.typeDistribution[grade.type] || 0) + 1;
      }

      // Calculate percentage
      if (grade.marksObtained && grade.totalMarks) {
        const percentage = (grade.marksObtained / grade.totalMarks) * 100;
        totalPercentage += percentage;
        validPercentageCount++;
      }
    });

    if (validPercentageCount > 0) {
      stats.averagePercentage = totalPercentage / validPercentageCount;
    }

    setGradeStatistics(stats);
  };

  // Handle API responses
  useEffect(() => {
    if (response) {
      if (Array.isArray(response)) {
        setGrades(response);
        setFilteredGrades(response);
        calculateStatistics(response);
      } else if (response.id && !response.registrationNumber) {
        setSearchResults(response);
      }
    }
  }, [response]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error",
        text: error?.message || "An error occurred while processing your request",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  }, [error]);

  const handleSearch = (results) => {
    setSearchResults(results);
    setActiveTab(1);
  };

  const handleViewDetails = (grade) => {
    const percentage = grade.marksObtained && grade.totalMarks 
      ? ((grade.marksObtained / grade.totalMarks) * 100).toFixed(1)
      : null;

    Swal.fire({
      title: `Grade Details`,
      html: `
        <div class="text-left space-y-4">
          <div class="border-b pb-3">
            <p class="font-semibold text-gray-700">Student Information</p>
            <p><strong>Name:</strong> ${grade.student?.user?.firstName} ${grade.student?.user?.lastName}</p>
            <p><strong>Registration No:</strong> ${grade.student?.registrationNumber}</p>
            <p><strong>Program:</strong> ${grade.student?.program}</p>
            <p><strong>Semester:</strong> ${grade.student?.currentSemester}</p>
          </div>
          <div class="border-b pb-3">
            <p class="font-semibold text-gray-700">Course Information</p>
            <p><strong>Course Code:</strong> ${grade.course?.code}</p>
            <p><strong>Course Title:</strong> ${grade.course?.title}</p>
            <p><strong>Credit Hours:</strong> ${grade.course?.creditHours}</p>
          </div>
          <div class="border-b pb-3">
            <p class="font-semibold text-gray-700">Grade Details</p>
            <p><strong>Type:</strong> <span class="capitalize">${grade.type}</span></p>
            ${grade.marksObtained && grade.totalMarks ? `
              <p><strong>Marks:</strong> ${grade.marksObtained}/${grade.totalMarks}</p>
              <p><strong>Percentage:</strong> ${percentage}%</p>
            ` : ''}
            ${grade.grade ? `<p><strong>Grade:</strong> <span class="font-bold">${grade.grade}</span></p>` : ''}
          </div>
          <div>
            <p class="font-semibold text-gray-700">Record Details</p>
            <p><strong>Grade ID:</strong> ${grade.id}</p>
          </div>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "var(--color-primary)",
      width: 500,
    });
  };

  const handleEdit = (grade) => {
    setEditingGrade(grade);
  };

  const handleDelete = async (grade) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete grade record for "${grade.student?.user?.firstName} ${grade.student?.user?.lastName}" in ${grade.course?.code}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "var(--color-primary)",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await deleteGrade(grade);
    }
  };

  const deleteGrade = async (grade) => {
    try {
      const result = await fetchData({
        url: `/grades/${grade.id}`,
        method: "DELETE",
      });

      if (result.data || result.message) {
        // Update UI immediately
        setGrades(prev => prev.filter(g => g.id !== grade.id));
        setFilteredGrades(prev => prev.filter(g => g.id !== grade.id));
        
        // Update search results if needed
        if (searchResults) {
          if (Array.isArray(searchResults)) {
            setSearchResults(prev => prev.filter(g => g.id !== grade.id));
          } else if (searchResults.id === grade.id) {
            setSearchResults(null);
          }
        }

        // Recalculate statistics
        calculateStatistics(grades.filter(g => g.id !== grade.id));

        Swal.fire({
          title: "Deleted!",
          text: `Grade record has been deleted successfully.`,
          icon: "success",
          confirmButtonColor: "var(--color-primary)",
        });
      }
    } catch (deleteError) {
      Swal.fire({
        title: "Error!",
        text: deleteError?.message || "Failed to delete grade record",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  };

  const handleEditSave = (updatedGrade) => {
    // Update the grade in the local state
    const updatedGrades = grades.map(g => g.id === updatedGrade.id ? updatedGrade : g);
    setGrades(updatedGrades);
    setFilteredGrades(updatedGrades);
    
    // Update search results
    if (searchResults) {
      if (Array.isArray(searchResults)) {
        setSearchResults(prev => 
          prev.map(g => g.id === updatedGrade.id ? updatedGrade : g)
        );
      } else if (searchResults.id === updatedGrade.id) {
        setSearchResults(updatedGrade);
      }
    }

    // Recalculate statistics
    calculateStatistics(updatedGrades);
    
    setEditingGrade(null);
  };

  const handleEditCancel = () => {
    setEditingGrade(null);
  };

  const handleRefresh = () => {
    if (studentData) {
      loadStudentGrades(studentData.id);
    }
    setSearchResults(null);
  };

  const handleClearStudent = () => {
    setStudentData(null);
    setGrades([]);
    setFilteredGrades([]);
    setGradeStatistics(null);
    setSearchResults(null);
    setActiveTab(0);
  };

  // Filter grades by type
  const filterGradesByType = (type) => {
    if (type === 'all') {
      setFilteredGrades(grades);
    } else {
      setFilteredGrades(grades.filter(grade => grade.type === type));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Grades</h2>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            View and manage student grade records
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

      {/* Grades Data Section */}
      {studentData && (
        <>
          <div className="bg-white/90 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border-2 border-[var(--color-primary)] p-4 sm:p-6">
            <Tabs selectedIndex={activeTab} onSelect={setActiveTab}>
              <TabList className="flex flex-col sm:flex-row mb-4 sm:mb-6 gap-2 sm:gap-4 border-b border-gray-200">
                <Tab
                  className="px-4 py-2 sm:px-6 sm:py-3 font-medium cursor-pointer border-b-2 border-transparent transition-all hover:text-[var(--color-primary)] text-center text-sm sm:text-base"
                  selectedClassName="border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                >
                  All Grades ({grades.length})
                </Tab>
                <Tab
                  className="px-4 py-2 sm:px-6 sm:py-3 font-medium cursor-pointer border-b-2 border-transparent transition-all hover:text-[var(--color-primary)] text-center text-sm sm:text-base"
                  selectedClassName="border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                >
                  Search Grade
                </Tab>
                <Tab
                  className="px-4 py-2 sm:px-6 sm:py-3 font-medium cursor-pointer border-b-2 border-transparent transition-all hover:text-[var(--color-primary)] text-center text-sm sm:text-base"
                  selectedClassName="border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                >
                  Statistics
                </Tab>
              </TabList>

              {/* Tab 1: All Grades */}
              <TabPanel>
                {/* Grade Type Filter */}
                {grades.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => filterGradesByType('all')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          filteredGrades.length === grades.length 
                            ? 'bg-[var(--color-primary)] text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        All ({grades.length})
                      </button>
                      {['assignment', 'quiz', 'project', 'midterm', 'finalterm'].map(type => {
                        const count = grades.filter(g => g.type === type).length;
                        if (count === 0) return null;
                        
                        return (
                          <button
                            key={type}
                            onClick={() => filterGradesByType(type)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                              filteredGrades.some(g => g.type === type) && filteredGrades.length < grades.length
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {type} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {filteredGrades.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {filteredGrades.map((grade) => (
                      <GradeTile
                        key={grade.id}
                        grade={grade}
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
                      {grades.length > 0 ? 'No Grades Match Filter' : 'No Grade Records Found'}
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base">
                      {grades.length > 0 
                        ? 'Try changing the filter criteria to see more results.'
                        : 'No grade records found for this student.'
                      }
                    </p>
                  </div>
                )}
              </TabPanel>

              {/* Tab 2: Search Grade Record */}
              <TabPanel>
                <div className="space-y-4 sm:space-y-6">
                  <SearchBar
                    endpoint="grades"
                    placeholder="Search by grade ID..."
                    setResults={handleSearch}
                  />
                  
                  {searchResults ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                      {Array.isArray(searchResults) ? (
                        searchResults.map((grade) => (
                          <GradeTile
                            key={grade.id}
                            grade={grade}
                            onViewDetails={handleViewDetails}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        ))
                      ) : (
                        <GradeTile
                          key={searchResults.id}
                          grade={searchResults}
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
                        Use the search bar above to find grade records by ID.
                      </p>
                    </div>
                  )}
                </div>
              </TabPanel>

              {/* Tab 3: Statistics */}
              <TabPanel>
                <div className="space-y-6">
                  {/* Overall Statistics */}
                  {gradeStatistics ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-blue-600">{gradeStatistics.totalGrades}</div>
                          <div className="text-sm text-blue-800">Total Grades</div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-green-600">{gradeStatistics.totalCourses}</div>
                          <div className="text-sm text-green-800">Total Courses</div>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                            {gradeStatistics.averagePercentage ? gradeStatistics.averagePercentage.toFixed(1) + '%' : 'N/A'}
                          </div>
                          <div className="text-sm text-purple-800">Avg Percentage</div>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                          <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                            {Object.keys(gradeStatistics.typeDistribution).length}
                          </div>
                          <div className="text-sm text-orange-800">Grade Types</div>
                        </div>
                      </div>

                      {/* Grade Distribution */}
                      {Object.keys(gradeStatistics.gradeDistribution).length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h3>
                          <div className="space-y-3">
                            {Object.entries(gradeStatistics.gradeDistribution)
                              .sort(([gradeA], [gradeB]) => gradeA.localeCompare(gradeB))
                              .map(([grade, count]) => (
                                <div key={grade} className="flex items-center justify-between">
                                  <span className="font-medium text-gray-700 capitalize">{grade}</span>
                                  <div className="flex items-center gap-3">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-[var(--color-primary)] h-2 rounded-full" 
                                        style={{ 
                                          width: `${(count / gradeStatistics.totalGrades) * 100}%` 
                                        }}
                                      ></div>
                                    </div>
                                    <span className="text-sm text-gray-600 w-8 text-right">
                                      {count}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Type Distribution */}
                      {Object.keys(gradeStatistics.typeDistribution).length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Assessment Type Distribution</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(gradeStatistics.typeDistribution)
                              .sort(([, countA], [, countB]) => countB - countA)
                              .map(([type, count]) => (
                                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <span className="font-medium text-gray-700 capitalize">{type}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                      {((count / gradeStatistics.totalGrades) * 100).toFixed(1)}%
                                    </span>
                                    <span className="bg-[var(--color-primary)] text-white text-xs font-medium px-2 py-1 rounded-full min-w-8 text-center">
                                      {count}
                                    </span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📊</div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                        No Statistics Available
                      </h3>
                      <p className="text-gray-500 text-sm sm:text-base">
                        {studentData 
                          ? 'No grade records found to calculate statistics.'
                          : 'Select a student to view grade statistics.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </TabPanel>
            </Tabs>
          </div>

          {/* Edit Grade Form Modal */}
          {editingGrade && (
            <EditGradeForm
              grade={editingGrade}
              onSave={handleEditSave}
              onCancel={handleEditCancel}
            />
          )}
        </>
      )}

      {/* Empty State when no student selected */}
      {!studentData && !loading && (
        <div className="bg-white/90 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border-2 border-[var(--color-primary)] p-6 sm:p-8 md:p-12 text-center">
          <div className="text-gray-400 text-5xl sm:text-6xl mb-4">🎓</div>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
            Select a Student
          </h3>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
            Use the student search above to select a student and view their grade records, statistics, and manage their academic performance.
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageGradesPage;
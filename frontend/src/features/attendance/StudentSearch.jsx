import React, { useState, useEffect } from "react";
import { FaSearch, FaUserGraduate, FaExclamationTriangle } from "react-icons/fa";
import useAxios from "@/hooks/useAxios";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import FullPageLoader from "@/components/FullPageLoader";
import Swal from "sweetalert2";

const StudentSearch = ({ onStudentSelect, selectedStudent, onClearSelection }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const { response, error, loading, fetchData, clearError } = useAxios();

  // Handle API response
  useEffect(() => {
    if (response) {
      console.log("Student search response:", response);
      
      // Handle different response structures
      let studentData = null;
      
      if (response.user) {
        // Direct student object with user relation
        studentData = response;
      } else if (response.data && response.data.user) {
        // Wrapped response
        studentData = response.data;
      } else if (Array.isArray(response) && response.length > 0) {
        // Array response - take first student
        studentData = response[0];
      }

      if (studentData) {
        setSearchResults(studentData);
        setSearchPerformed(true);
      } else {
        setSearchResults(null);
        Swal.fire({
          title: "No Student Found",
          text: "No student found with the provided registration number.",
          icon: "warning",
          confirmButtonColor: "var(--color-primary)",
        });
      }
    }
  }, [response]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      console.error("Student search error:", error);
      
      let errorMessage = "Failed to search for student";
      
      if (error.status === 404) {
        errorMessage = "Student not found with the provided registration number";
      } else if (error.status === 400) {
        errorMessage = "Invalid registration number format";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        title: "Search Error",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
      
      setSearchResults(null);
      setSearchPerformed(true);
      clearError();
    }
  }, [error, clearError]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Swal.fire({
        title: "Missing Information",
        text: "Please enter a registration number to search",
        icon: "warning",
        confirmButtonColor: "var(--color-primary)",
      });
      return;
    }

    // Clear previous results
    setSearchResults(null);
    setSearchPerformed(false);

    // Try multiple endpoint patterns
    const endpoints = [
      `/students/reg/${searchQuery.trim()}`,
      `/students/registration/${searchQuery.trim()}`,
      `/students?registrationNumber=${searchQuery.trim()}`,
      `/students/search?registrationNumber=${searchQuery.trim()}`
    ];

    let foundStudent = false;

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const result = await fetchData({
          url: endpoint,
          method: "GET",
        });

        if (result.data && !result.error) {
          foundStudent = true;
          break;
        }
      } catch (err) {
        console.log(`Endpoint ${endpoint} failed:`, err.message);
        // Continue to next endpoint
      }
    }

    if (!foundStudent) {
      setSearchPerformed(true);
      Swal.fire({
        title: "Student Not Found",
        text: "The student could not be found. Please check the registration number and try again.",
        icon: "error",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  };

  const handleSelectStudent = () => {
    if (searchResults && onStudentSelect) {
      onStudentSelect(searchResults);
      setSearchQuery("");
      setSearchResults(null);
      setSearchPerformed(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setSearchPerformed(false);
    if (onClearSelection) {
      onClearSelection();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white/90 rounded-xl sm:rounded-2xl shadow-xl border-2 border-[var(--color-primary)] p-4 sm:p-6 mb-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 text-center">
        {selectedStudent ? "Student Selected" : "Search Student Attendance"}
      </h3>

      {loading && <FullPageLoader />}

      {selectedStudent ? (
        // Selected Student Display
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0">
                {selectedStudent.user?.firstName?.charAt(0)}
                {selectedStudent.user?.lastName?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                  {selectedStudent.user?.firstName} {selectedStudent.user?.lastName}
                </h4>
                <p className="text-gray-600 text-sm sm:text-base">
                  {selectedStudent.registrationNumber} • {selectedStudent.program}
                </p>
                <p className="text-gray-600 text-sm">
                  Semester {selectedStudent.currentSemester} • {selectedStudent.department?.name}
                </p>
                <p className="text-green-600 text-sm font-medium mt-1">
                  ✓ Student successfully loaded
                </p>
              </div>
            </div>
            <button
              onClick={handleClearSearch}
              className="text-red-600 hover:text-red-800 font-medium text-sm bg-white px-3 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
            >
              Change Student
            </button>
          </div>
        </div>
      ) : (
        // Student Search Interface
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <CustomInput
                label="Student Registration Number"
                name="registrationNumber"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter student registration number (e.g., 2024-CS-001)"
                isInvalid={searchPerformed && !searchResults}
                validationMsg={searchPerformed && !searchResults ? "Student not found" : ""}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the exact registration number to search for student records
              </p>
            </div>
            <CustomButton
              onClick={handleSearch}
              disabled={!searchQuery.trim() || loading}
              variant="primary"
              className="w-full sm:w-auto min-w-[120px]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FaSearch />
                  Search
                </div>
              )}
            </CustomButton>
          </div>

          {/* Search Results */}
          {searchResults && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                  <FaUserGraduate />
                  Student Found
                </h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Ready to Select
                </span>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {searchResults.user?.firstName?.charAt(0)}
                  {searchResults.user?.lastName?.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-800 font-medium truncate">
                    {searchResults.user?.firstName} {searchResults.user?.lastName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {searchResults.registrationNumber}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {searchResults.program} • Semester {searchResults.currentSemester}
                  </p>
                  {searchResults.department && (
                    <p className="text-gray-600 text-sm">
                      {searchResults.department.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <CustomButton
                  onClick={handleSelectStudent}
                  variant="primary"
                  className="flex-1"
                >
                  Select This Student
                </CustomButton>
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* No Results Message */}
          {searchPerformed && !searchResults && !loading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="text-yellow-500 text-xl flex-shrink-0" />
                <div>
                  <p className="text-yellow-800 font-medium">No Student Found</p>
                  <p className="text-yellow-700 text-sm">
                    Please check the registration number and try again. Ensure you're using the correct format.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              <strong>Tip:</strong> Make sure to enter the exact registration number. 
              If you're unsure, check the student's ID card or registration documents.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSearch;
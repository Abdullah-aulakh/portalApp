import React, { useState, useEffect } from "react";
import EnrollmentTile from "@/components/EnrollmentTile";
import SearchBar from "@/components/SearchBar";
import EditEnrollmentForm from "@/features/admin/EditEnrollmentForm";
import FullPageLoader from "@/components/FullPageLoader";
import CustomButton from "@/components/CustomButton";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";

const ManageEnrollmentsPage = () => {
  const [results, setResults] = useState([]);
  const [editingEnrollment, setEditingEnrollment] = useState(null);


 

  const handleSearchResults = (results) => {
    setResults(results);
  };
  const handleEdit = (enrollment) => {
    setEditingEnrollment(enrollment);
  };

  const handleEditSave = (updatedEnrollment) => {
    setResults((prev) => 
      prev.enrollments.map((e) => (e.id === updatedEnrollment.id ? updatedEnrollment : e))
    );
    setEditingEnrollment(null);
  };

  const handleEditCancel = () => {
    setEditingEnrollment(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Manage Enrollments</h2>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Search a student and manage their course enrollments
          </p>
        </div>
      </div>

      {/* Search Student */}
      <SearchBar
        endpoint="enrollments/student"
        placeholder="Search by student name or ID..."
        setResults={handleSearchResults}
      />

    

      {/* Enrollments Grid */}
      {results?.student && (
        <>
          <h3 className="mt-4 mb-3 text-lg sm:text-xl font-semibold text-gray-700">
            Enrollments for {results?.student?.user.firstName} {results?.student?.user.lastName}
          </h3>

          {results?.enrollments.length > 0 ? (
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
              {results?.enrollments?.map((enrollment) => (
                <EnrollmentTile
                  key={enrollment.id}
                  enrollment={enrollment}
                  onEdit={handleEdit}
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
                This student has no course enrollments yet.
              </p>
            </div>
          )}
        </>
      )}

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

// src/components/GradeTile.jsx
import React from "react";
import { FaBook, FaUserGraduate, FaEdit, FaTrash, FaChartBar } from "react-icons/fa";

const GradeTile = ({ grade, onViewDetails, onEdit, onDelete }) => {
  const calculatePercentage = () => {
    if (grade.marksObtained && grade.totalMarks) {
      return ((grade.marksObtained / grade.totalMarks) * 100).toFixed(1);
    }
    return null;
  };

  const getGradeColor = (grade) => {
    switch (grade?.toUpperCase()) {
      case 'A': return 'text-green-600 bg-green-50 border-green-200';
      case 'B': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'C': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'D': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'F': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const percentage = calculatePercentage();

  return (
    <div className="bg-white/90 rounded-xl shadow-lg border-2 border-[var(--color-primary)] p-4 sm:p-6 transition-all hover:shadow-xl">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
            {grade.course?.title || "Unknown Course"}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <FaBook className="mr-2 text-[var(--color-primary)] flex-shrink-0" />
            <span className="text-sm sm:text-base">{grade.course?.code || "No code"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaUserGraduate className="mr-2 text-[var(--color-primary)] flex-shrink-0" />
            <span className="text-sm sm:text-base">
              {grade.student?.user?.firstName} {grade.student?.user?.lastName}
            </span>
          </div>
        </div>
      </div>

      {/* Grade Details Section */}
      <div className="mb-4 space-y-3">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Type</span>
          <span className="text-sm font-semibold text-gray-800 capitalize">{grade.type}</span>
        </div>

        {grade.marksObtained && grade.totalMarks && (
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{grade.marksObtained}</p>
              <p className="text-xs text-gray-600">Marks Obtained</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{grade.totalMarks}</p>
              <p className="text-xs text-gray-600">Total Marks</p>
            </div>
          </div>
        )}

        {percentage && (
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-center mb-1">
              <FaChartBar className="mr-2 text-green-600" />
              <span className="text-sm font-medium text-green-800">Percentage</span>
            </div>
            <p className="text-xl font-bold text-green-600">{percentage}%</p>
          </div>
        )}

        {grade.grade && (
          <div className={`text-center p-3 rounded-lg border ${getGradeColor(grade.grade)}`}>
            <p className="text-sm font-medium">Grade</p>
            <p className="text-2xl font-bold">{grade.grade}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={() => onViewDetails && onViewDetails(grade)}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          View Details
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit && onEdit(grade)}
            className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white rounded-lg transition-colors"
            title="Edit Grade"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => onDelete && onDelete(grade)}
            className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
            title="Delete Grade"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradeTile;
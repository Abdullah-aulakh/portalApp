import React from "react";
import { FaUserGraduate, FaBook, FaEdit, FaTrash, FaCalendar } from "react-icons/fa";

const EnrollmentTile = ({ enrollment, onEdit, onDelete, onViewDetails }) => {
  return (
    <div className="bg-white/90 shadow-lg rounded-xl p-4 sm:p-6 border-2 border-[var(--color-primary)] hover:shadow-xl transition-all duration-300 hover:scale-[1.02] w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 sm:p-3 bg-indigo-100 rounded-full flex-shrink-0">
            <FaUserGraduate className="text-indigo-600 text-lg sm:text-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              {enrollment.student?.registrationNumber}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base truncate">
              {enrollment.course?.code} - {enrollment.course?.title}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-1 sm:gap-2 justify-center sm:justify-start">
          <button
            onClick={() => onViewDetails && onViewDetails(enrollment)}
            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors flex-shrink-0"
            title="View Details"
          >
            <FaBook size={16} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onEdit && onEdit(enrollment)}
            className="p-1.5 sm:p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors flex-shrink-0"
            title="Edit Enrollment"
          >
            <FaEdit size={16} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onDelete && onDelete(enrollment)}
            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
            title="Delete Enrollment"
          >
            <FaTrash size={16} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Student Information Section */}
      <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {enrollment.student?.user?.firstName?.charAt(0)}
            {enrollment.student?.user?.lastName?.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-800 font-medium text-sm sm:text-base truncate">
              {enrollment.student?.user?.firstName} {enrollment.student?.user?.lastName}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm truncate">
              Semester {enrollment.student?.currentSemester} • {enrollment.student?.program}
            </p>
          </div>
        </div>

        {/* Course Information */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FaBook className="text-indigo-500 flex-shrink-0" />
          <span className="truncate">{enrollment.course?.title}</span>
        </div>
      </div>

      {/* Enrollment Date */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-2">
          <FaCalendar className="text-green-500" />
          <span>Enrolled:</span>
        </div>
        <span className="font-medium">
          {new Date(enrollment.enrolledAt).toLocaleDateString()}
        </span>
      </div>

      {/* Enrollment ID */}
      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center truncate">
          Enrollment ID: {enrollment.id?.substring(0, 8)}...
        </p>
      </div>
    </div>
  );
};

export default EnrollmentTile;
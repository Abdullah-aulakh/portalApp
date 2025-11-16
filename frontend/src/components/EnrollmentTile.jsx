import React from "react";
import { FaEdit, FaTrash, FaBook, FaCalendar } from "react-icons/fa";
import { capitalizeFirst } from "../utils/helperFunctions";

const EnrollmentTile = ({ enrollment, onEdit, onDelete }) => {
  return (
    <div className="bg-white/90 shadow-lg rounded-xl p-4 sm:p-6 border-2 border-[var(--color-primary)] hover:shadow-xl transition-all duration-300 hover:scale-[1.02] w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 sm:p-3 bg-indigo-100 rounded-full flex-shrink-0">
            <FaBook className="text-indigo-600 text-lg sm:text-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              {enrollment.student?.user?.firstName} {enrollment.student?.user?.lastName}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base font-medium truncate">
              {enrollment.course?.code} - {enrollment.course?.title}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 sm:gap-2 justify-center sm:justify-start">
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

      {/* Course Information Section */}
      

      {/* Enrollment Date & Status */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
        <div className="flex items-center gap-2">
          <FaCalendar className="text-green-500" />
          <span>{capitalizeFirst(enrollment.status)}</span>
        </div>
        <span className="font-medium">
          {new Date(enrollment.enrolledAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default EnrollmentTile;

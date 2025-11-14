import React from "react";
import { FaBook, FaChalkboardTeacher, FaEdit, FaTrash, FaClock } from "react-icons/fa";

const CourseTile = ({ course, onEdit, onDelete, onViewDetails }) => {
  return (
    <div className="bg-white/90 shadow-lg rounded-xl p-4 sm:p-6 border-2 border-[var(--color-primary)] hover:shadow-xl transition-all duration-300 hover:scale-[1.02] w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 sm:p-3 bg-purple-100 rounded-full flex-shrink-0">
            <FaBook className="text-purple-600 text-lg sm:text-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              {course.code}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base truncate">
              {course.title}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-1 sm:gap-2 justify-center sm:justify-start">
          <button
            onClick={() => onViewDetails && onViewDetails(course)}
            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors flex-shrink-0"
            title="View Details"
          >
            <FaChalkboardTeacher size={16} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onEdit && onEdit(course)}
            className="p-1.5 sm:p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors flex-shrink-0"
            title="Edit Course"
          >
            <FaEdit size={16} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onDelete && onDelete(course)}
            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
            title="Delete Course"
          >
            <FaTrash size={16} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Course Details Section */}
      <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
            <FaClock className="text-purple-500" />
            Credit Hours
          </h4>
          <span className="text-purple-600 font-bold text-sm sm:text-base">
            {course.creditHours}
          </span>
        </div>
        
        {/* Teacher Information */}
        {course.teacher && (
          <div className="mt-2 flex items-center gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
              {course.teacher.user?.firstName?.charAt(0)}
              {course.teacher.user?.lastName?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-800 font-medium text-sm sm:text-base truncate">
                {course.teacher.user?.firstName} {course.teacher.user?.lastName}
              </p>
              <p className="text-gray-600 text-xs sm:text-sm truncate">
                {course.teacher.designation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
          <FaChalkboardTeacher className="text-blue-600 mx-auto mb-1 text-sm sm:text-base" />
          <p className="text-lg sm:text-2xl font-bold text-blue-700">
            {course.enrollments?.length || 0}
          </p>
          <p className="text-xs text-gray-600">Enrollments</p>
        </div>
        
        <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
          <FaBook className="text-green-600 mx-auto mb-1 text-sm sm:text-base" />
          <p className="text-lg sm:text-2xl font-bold text-green-700">
            {course.grades?.length || 0}
          </p>
          <p className="text-xs text-gray-600">Grades</p>
        </div>
      </div>

      {/* Course ID */}
      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center truncate">
          ID: {course.id?.substring(0, 8)}...
        </p>
      </div>
    </div>
  );
};

export default CourseTile;
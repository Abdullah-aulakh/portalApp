import React from "react";
import { FaUserGraduate, FaCalendar, FaCheck, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const AttendanceTile = ({ attendance, onEdit, onDelete, onViewDetails }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (isPresent) => {
    return isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (isPresent) => {
    return isPresent ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />;
  };

  return (
    <div className="bg-white/90 shadow-lg rounded-xl p-4 sm:p-6 border-2 border-[var(--color-primary)] hover:shadow-xl transition-all duration-300 hover:scale-[1.02] w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0">
            <FaUserGraduate className="text-blue-600 text-lg sm:text-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              {attendance.student?.registrationNumber}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base truncate">
              {attendance.course?.code} - {attendance.course?.title}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-1 sm:gap-2 justify-center sm:justify-start">
          <button
            onClick={() => onViewDetails && onViewDetails(attendance)}
            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors flex-shrink-0"
            title="View Details"
          >
            <FaCalendar size={16} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onEdit && onEdit(attendance)}
            className="p-1.5 sm:p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors flex-shrink-0"
            title="Edit Attendance"
          >
            <FaEdit size={16} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onDelete && onDelete(attendance)}
            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
            title="Delete Attendance"
          >
            <FaTrash size={16} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Student Information Section */}
      <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {attendance.student?.user?.firstName?.charAt(0)}
            {attendance.student?.user?.lastName?.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-800 font-medium text-sm sm:text-base truncate">
              {attendance.student?.user?.firstName} {attendance.student?.user?.lastName}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm truncate">
              {attendance.student?.program} • Semester {attendance.student?.currentSemester}
            </p>
          </div>
        </div>

        {/* Course Information */}
        <div className="text-sm text-gray-600">
          <p className="truncate">{attendance.course?.title}</p>
        </div>
      </div>

      {/* Attendance Details */}
      <div className="space-y-2 mb-3">
        {/* Date */}
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Date</span>
          <div className="flex items-center gap-2 text-gray-600">
            <FaCalendar className="text-purple-500" />
            <span>{formatDate(attendance.date)}</span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Status</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(attendance.isPresent)}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(attendance.isPresent)}`}>
              {attendance.isPresent ? 'Present' : 'Absent'}
            </span>
          </div>
        </div>
      </div>

      {/* Attendance ID */}
      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center truncate">
          ID: {attendance.id?.substring(0, 8)}...
        </p>
      </div>
    </div>
  );
};

export default AttendanceTile;
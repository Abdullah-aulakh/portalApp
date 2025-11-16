import React from "react";
import { FaCalendar, FaClock, FaMapMarkerAlt, FaBook, FaEdit, FaTrash } from "react-icons/fa";

const TimetableTile = ({ timetable, onEdit, onDelete, onViewDetails }) => {
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const getDayColor = (day) => {
    const colors = {
      Monday: 'bg-blue-100 text-blue-800',
      Tuesday: 'bg-green-100 text-green-800',
      Wednesday: 'bg-yellow-100 text-yellow-800',
      Thursday: 'bg-purple-100 text-purple-800',
      Friday: 'bg-red-100 text-red-800',
      Saturday: 'bg-indigo-100 text-indigo-800',
      Sunday: 'bg-gray-100 text-gray-800'
    };
    return colors[day] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white/90 shadow-lg rounded-xl p-4 sm:p-6 border-2 border-[var(--color-primary)] hover:shadow-xl transition-all duration-300 hover:scale-[1.02] w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 sm:p-3 bg-orange-100 rounded-full flex-shrink-0">
            <FaCalendar className="text-orange-600 text-lg sm:text-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              {timetable.course?.code}
            </h3>
            <p className="text-gray-600 text-sm sm:text-base truncate">
              {timetable.course?.title}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-1 sm:gap-2 justify-center sm:justify-start">
          <button
            onClick={() => onViewDetails && onViewDetails(timetable)}
            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors flex-shrink-0"
            title="View Details"
          >
            <FaBook size={16} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onEdit && onEdit(timetable)}
            className="p-1.5 sm:p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors flex-shrink-0"
            title="Edit Timetable"
          >
            <FaEdit size={16} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onDelete && onDelete(timetable)}
            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
            title="Delete Timetable"
          >
            <FaTrash size={16} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Schedule Information Section */}
      <div className="mb-3 sm:mb-4 space-y-3">
        {/* Day of Week */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Day</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDayColor(timetable.dayOfWeek)}`}>
            {timetable.dayOfWeek}
          </span>
        </div>

        {/* Time Slot */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Time</span>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaClock className="text-green-500" />
            <span>{formatTime(timetable.startTime)} - {formatTime(timetable.endTime)}</span>
          </div>
        </div>

        {/* Room */}
        {timetable.room && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Room</span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaMapMarkerAlt className="text-red-500" />
              <span>{timetable.room}</span>
            </div>
          </div>
        )}
      </div>

      {/* Course Details */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            📚
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-800 font-medium text-sm sm:text-base truncate">
              {timetable.course?.title}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm">
              {timetable.course?.creditHours} credit hours
            </p>
            {timetable.course?.teacher && (
              <p className="text-gray-600 text-xs sm:text-sm truncate">
                By {timetable.course?.teacher?.user?.firstName} {timetable.course?.teacher?.user?.lastName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Timetable ID */}
      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center truncate">
          ID: {timetable.id?.substring(0, 8)}...
        </p>
      </div>
    </div>
  );
};

export default TimetableTile;
import React from "react";
import { FaBuilding, FaUserTie, FaUsers, FaEdit, FaTrash } from "react-icons/fa";

const DepartmentTile = ({ department, onEdit, onDelete, onViewDetails }) => {
  return (
    <div className="bg-white/90 shadow-lg rounded-xl p-4 sm:p-6 border-2 border-[var(--color-primary)] hover:shadow-xl transition-all duration-300 hover:scale-[1.02] w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0">
            <FaBuilding className="text-blue-600 text-lg sm:text-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              {department.name}
            </h3>
            {department.building && (
              <p className="text-gray-600 text-xs sm:text-sm truncate">
                Building: {department.building}
              </p>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-1 sm:gap-2 justify-center sm:justify-start">
         
          <button
            onClick={() => onEdit && onEdit(department)}
            className="p-1.5 sm:p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors flex-shrink-0"
            title="Edit Department"
          >
            <FaEdit size={16} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onDelete && onDelete(department)}
            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
            title="Delete Department"
          >
            <FaTrash size={16} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Head of Department Section */}
      <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
          <FaUserTie className="text-blue-500 text-sm sm:text-base" />
          Head of Department
        </h4>
        {department.headOfDepartment ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
              {department.headOfDepartment.user?.firstName?.charAt(0)}
              {department.headOfDepartment.user?.lastName?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-800 font-medium text-sm sm:text-base truncate">
                {department.headOfDepartment.user?.firstName} {department.headOfDepartment.user?.lastName}
              </p>
              <p className="text-gray-600 text-xs sm:text-sm truncate">
                {department.headOfDepartment.designation}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-xs sm:text-sm italic">No HOD assigned</p>
        )}
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
          <FaUsers className="text-blue-600 mx-auto mb-1 text-sm sm:text-base" />
          <p className="text-lg sm:text-2xl font-bold text-blue-700">
            {department.teachers?.length || 0}
          </p>
          <p className="text-xs text-gray-600">Teachers</p>
        </div>
        
        <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
          <FaUsers className="text-green-600 mx-auto mb-1 text-sm sm:text-base" />
          <p className="text-lg sm:text-2xl font-bold text-green-700">
            {department.students?.length || 0}
          </p>
          <p className="text-xs text-gray-600">Students</p>
        </div>
      </div>

      
    </div>
  );
};

export default DepartmentTile;
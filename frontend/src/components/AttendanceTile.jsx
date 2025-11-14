import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const AttendanceTile = ({ attendanceData }) => {
  const [collapsed, setCollapsed] = useState(true);
  console.log(attendanceData);

  // Determine progress bar color
  const getColor = (percent) => {
    if (percent >= 75) return "bg-green-500";
    if (percent >= 50) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div className="bg-white shadow-lg rounded-xl border-2 border-(--color-primary) mb-4">
      {/* Header */}
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="font-semibold text-gray-800">
          {attendanceData.title}
        </span>

        {/* Progress Bar */}
        <div className="flex-1 mx-4 bg-gray-200 h-4 rounded-full overflow-hidden">
          <div
            className={`${getColor(attendanceData.attendancePercentage)} h-4`}
            style={{ width: `${attendanceData.attendancePercentage}%` }}
          ></div>
        </div>

        {/* Percentage + Collapse Icon */}
        <div className="flex items-center ml-4 gap-2">
          <span className="font-medium text-gray-700">
            {attendanceData.attendancePercentage}%
          </span>
          {collapsed ? (
            <FaChevronDown className="text-gray-500" />
          ) : (
            <FaChevronUp className="text-gray-500" />
          )}
        </div>
      </div>

      {/* Collapsible Content */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          {/* Summary */}
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm">Classes Conducted</p>
              <p className="font-semibold">{attendanceData.totalClasses}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Classes Attended</p>
              <p className="font-semibold">{attendanceData.attendedClasses}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Attendance %</p>
              <p className="font-semibold">
                {attendanceData.attendancePercentage}%
              </p>
            </div>
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600 border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 border">Sr #</th>
                  <th className="px-3 py-2 border">Date</th>
                  <th className="px-3 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.records.map((rec, idx) => (
                  <tr key={rec.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border">{idx + 1}</td>
                    <td className="px-3 py-2 border">{rec.date}</td>
                    <td
                      className={`px-3 py-2 border font-semibold ${
                        rec.isPresent ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {rec.isPresent ? "Present" : "Absent"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTile;

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { capitalizeFirst } from "../../utils/helperFunctions";

const GradeTile = ({ gradeData }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="bg-white shadow-lg rounded-xl border-2 border-(--color-primary) mb-4">
      {/* Header */}
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="font-semibold text-gray-800">
          {gradeData?.title}
        </span>

        {/* Collapse Arrow */}
        <div className="flex items-center ml-4 gap-2">
          {collapsed ? (
            <FaChevronDown className="text-gray-500" />
          ) : (
            <FaChevronUp className="text-gray-500" />
          )}
        </div>
      </div>

      {/* Collapsible Section */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-gray-800 font-semibold mb-2">Marks Breakdown</h3>

          {/* If no grades */}
          {(!gradeData?.grades || gradeData.grades.length === 0) && (
            <div className="text-center text-gray-500 py-4 italic">
              No grades yet
            </div>
          )}

          {/* Grades Table */}
          {gradeData?.grades?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600 border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 border">Component</th>
                    <th className="px-3 py-2 border">Total Marks</th>
                    <th className="px-3 py-2 border">Obtained</th>
                  </tr>
                </thead>

                <tbody>
                  {gradeData.grades.map((item) => (
                    <tr key={item.name} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border">{capitalizeFirst(item?.type)}</td>
                      <td className="px-3 py-2 border">{item?.totalMarks}</td>
                      <td className="px-3 py-2 border">{item?.marksObtained}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GradeTile;

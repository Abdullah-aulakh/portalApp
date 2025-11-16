import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import CustomButton from "@/components/CustomButton";
import { capitalizeFirst } from "../utils/helperFunctions";

const GradeTile = ({ gradeData, editable, onSave }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [editing, setEditing] = useState(false);

  // deep copy for editing
  const [editGrades, setEditGrades] = useState([]);

  const startEditing = () => {
    setEditGrades(JSON.parse(JSON.stringify(gradeData.grades)));
    setEditing(true);
  };

  const updateMarks = (index, value) => {
    const updated = editGrades.map((g, i) =>
      i === index ? { ...g, marksObtained: Number(value) } : g
    );
    setEditGrades(updated);
  };

  // compare & extract changed items only
  const getChangedGrades = (original, edited) => {
    return edited.filter((g, i) => g.marksObtained !== original[i].marksObtained);
  };

  const saveChanges = () => {
    const changed = getChangedGrades(gradeData.grades, editGrades);
    onSave(changed); // parent should handle update
    setEditing(false);
    setCollapsed(true);
  };

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

        <div className="flex items-center ml-4 gap-2">
          {collapsed ? (
            <FaChevronDown className="text-gray-500" />
          ) : (
            <FaChevronUp className="text-gray-500" />
          )}
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">

          <h3 className="text-gray-800 font-semibold mb-3">Marks Breakdown</h3>

          {/* No grades */}
          {(!gradeData?.grades || gradeData.grades.length === 0) && (
            <div className="text-center text-gray-500 py-4 italic">
              No grades yet
            </div>
          )}

          {/* Normal View */}
          {!editing && gradeData?.grades?.length > 0 && (
            <>
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
                        <td className="px-3 py-2 border">{capitalizeFirst(item.type)}</td>
                        <td className="px-3 py-2 border">{item.totalMarks}</td>
                        <td className="px-3 py-2 border">{item.marksObtained}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Edit Button */}
              {editable && (
                <div className="flex justify-end">
                  <CustomButton
                    variant="primary"
                    className="mt-4"
                    onClick={startEditing}
                  >
                    Edit Grades
                  </CustomButton>
                </div>
              )}
            </>
          )}

          {/* Editing Mode */}
          {editing && (
            <div>
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
                    {editGrades.map((item, idx) => (
                      <tr key={item.name} className="hover:bg-gray-50">
                        <td className="px-3 py-2 border">{capitalizeFirst(item.type)}</td>
                        <td className="px-3 py-2 border">{item.totalMarks}</td>
                        <td className="px-3 py-2 border">
                          <input
                            type="number"
                            className="border rounded p-1 w-20"
                            value={item.marksObtained}
                            min={0}
                            max={item.totalMarks}
                            onChange={(e) => updateMarks(idx, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2">
                <CustomButton
                  variant="primary"
                  className="mt-4"
                  onClick={saveChanges}
                >
                  Save Changes
                </CustomButton>

                <CustomButton
                  variant="secondary"
                  className="mt-4"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </CustomButton>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default GradeTile;

import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import CustomButton from "@/components/CustomButton";







const AttendanceTile = ({ attendanceData, onSave,editable,s }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editRecords, setEditRecords] = useState([]);
  const [state, setState] = useState(0);

  function getChangedRecords(original, edited) {
  const changes = [];

  const originalMap = new Map();
  original.forEach(item => originalMap.set(item.id, item));

  edited.forEach(item => {
    const old = originalMap.get(item.id);

    if (!old) return; // no matching record found

    // compare relevant fields
    if (old.isPresent !== item.isPresent) {
      changes.push(item);
    }
  });

  return changes;
}








  // Colors for progress bar
  const getColor = (percent) => {
    if (percent >= 75) return "bg-green-500";
    if (percent >= 50) return "bg-yellow-400";
    return "bg-red-500";
  };

  const startEditing = () => {
    setEditRecords(JSON.parse(JSON.stringify(attendanceData.records)));
    setEditing(true);
  };

  const toggleRecord = (index) => {
    const updated = [...editRecords];
    updated[index].isPresent = !updated[index].isPresent;
    setEditRecords(updated);
  };

  const saveChanges = () => {
   
    const changedRecords = getChangedRecords(attendanceData.records, editRecords);
   onSave(changedRecords);
    setEditing(false);
    setCollapsed((prev) => !prev);
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

        {/* Percentage + Icon */}
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

      {/* Collapsible Section */}
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

          {/* Not editing → show normal table */}
          {!editing && (
            <>
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

              {/* Edit Button */}
              {editable &&(
                <div className="flex justify-end">
                <CustomButton
                onClick={startEditing}
                variant="primary"
                className="mt-4 w-full sm:w-auto"
                >
                  Edit Attendance
                  </CustomButton>
              </div>
              )}
            </>
          )}

          {/* Editing Mode */}
          {editing && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Edit Attendance</h3>

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
                    {editRecords.map((rec, idx) => (
                      <tr key={rec.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 border">{idx + 1}</td>
                        <td className="px-3 py-2 border">{rec.date}</td>
                        <td className="px-3 py-2 border">
                          <button
                            onClick={() => toggleRecord(idx)}
                            className={`px-3 py-1 rounded-lg font-semibold ${
                              rec.isPresent
                                ? "bg-green-200 text-green-700"
                                : "bg-red-200 text-red-700"
                            }`}
                          >
                            {rec.isPresent ? "Present" : "Absent"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-2">
                <CustomButton
                onClick={()=> saveChanges()}
                variant="primary"
                className="mt-4 w-full sm:w-auto"
                >
                  Save Changes
                  </CustomButton>
                  <CustomButton
                onClick={() => setEditing(false)}
                variant="secondary"
                className="mt-4 w-full sm:w-auto"
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

export default AttendanceTile;

// UserTile.jsx
import React from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { TbListDetails } from "react-icons/tb";
import { useNavigate } from "react-router";

const UserTile = ({ data, onViewDetails }) => {
  const navigate = useNavigate();

  const renderInfo = () => {
    // Admin: display data directly
    if (data.role === "admin") {
      return (
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-800">{data.name || "Admin"}</span>
          <span className="text-sm text-gray-500">{data.email || ""}</span>
        </div>
      );
    }

    // Student or Teacher
    const role = data.user?.role;
    const fullName = `${data.user?.firstName || ""} ${data.user?.lastName || ""}`;

    if (role === "student") {
      return (
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-800">{fullName}</span>
          <span className="text-sm text-gray-500">
            {`${data.department?.name || ""} | ${data.program || ""} | Semester ${data.currentSemester || ""}`}
          </span>
        </div>
      );
    }

    if (role === "teacher") {
      return (
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-800">{fullName}</span>
          <span className="text-sm text-gray-500">
            {`${data.department?.name || ""} | ${data.designation || ""}`}
          </span>
        </div>
      );
    }

    // Fallback
    return (
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-gray-800">{fullName}</span>
        <span className="text-sm text-gray-500">{role || ""}</span>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between bg-white/90 shadow-md rounded-lg p-4 gap-4 w-full border-2 border-[var(--color-primary)]">
      {/* Left: User Image */}
      <div className="flex items-center gap-4">
        {data.user?.profilePicture ? (
          <img
            src={data.user.profilePicture}
            alt="User Avatar"
            className="h-10 w-10 rounded-full object-cover border-2 border-white"
          />
        ) : (
          <FaRegCircleUser size={40} color="black" />
        )}

        {/* Right: User Info */}
        {renderInfo()}
      </div>

      {/* Right: View Details button */}
      <button
        onClick={() =>
          navigate(
           "/admin/users/details/"
         ,
            { state: { userData: data } }
          )
        }
        className="flex items-center justify-center p-2 rounded-full hover:cursor-pointer hover:text-white transition"
        title="View Details"
      >
        <TbListDetails size={20} color="black" />
      </button>
    </div>
  );
};

export default UserTile;

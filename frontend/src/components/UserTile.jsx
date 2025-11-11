// UserTile.jsx
import React from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { TbListDetails } from "react-icons/tb";

const UserTile = ({ data, onViewDetails }) => {
  return (
    <div className="flex items-center justify-between bg-white/90 shadow-md rounded-lg p-4 gap-4 w-full border-2 border-[var(--color-primary)]">
      {/* Left: User Image */}
      <div className="flex items-center gap-4">
        {data?.user?.profilePicture ? (
          <img
            src={data.user.profilePicture}
            alt="User Avatar"
            className="h-10 w-10 rounded-full object-cover border-2 border-white"
          />
        ) : (
          <FaRegCircleUser size={40} color="black" />
        )}

        {/* Right: User Info */}
        <div className="flex flex-col">
          {/* Name */}
          <span className="text-lg font-semibold text-gray-800">
            {`${data?.user?.firstName || ""} ${data?.user?.lastName || ""}`}
          </span>

          {/* Subheading: Department, Program, Semester */}
          {data?.user?.role === "student" ? (
            <span className="text-sm text-gray-500">
              {`${data?.department?.name || ""} | ${data?.program || ""} | Semester ${data?.currentSemester || ""}`}
            </span>
          ) : (
            <span className="text-sm text-gray-500">{data?.user?.role || ""}</span>
          )}
        </div>
      </div>

      {/* Right: View Details */}
      <button
        onClick={() => onViewDetails && onViewDetails(data)}
        className="flex items-center justify-center p-2 rounded-full hover:cursor-pointer hover:text-white transition"
        title="View Details"
      >
        <TbListDetails size={20} color="black" 
        />
      </button>
    </div>
  );
};

export default UserTile;

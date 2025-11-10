import React from "react";
import { useAuth } from "@/context/AuthContext";
import { FaGraduationCap } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
const TopNavbar = () => {
  const { user } = useAuth(); // { firstName, role, avatarUrl }

  return (
    <nav className="bg-[var(--color-primary)] p-4 flex items-center justify-between rounded-3xl mx-4 my-2 shadow-lg">
      {/* Left: Logo */}
      <div className="flex items-center">
       <FaGraduationCap size={40} color="white"/>
        <span className="ml-2 font-bold text-xl text-white">Portal</span>
      </div>

      {/* Right: User info */}
      <div className="flex items-center gap-3">
        {user?.profilePictureUrl ? (
          <img
            src={user?.profilePictureUrl}
            alt="User Avatar"
            className="h-10 w-10 rounded-full object-cover border-2 border-white"
          />
        ):(
         <FaRegCircleUser size={40} color="white"/>
        )}
        <div className="flex flex-col ">
          <span className="text-sm font-medium text-white">{user?.firstName}</span>
          <span className="text-xs text-white/70">{user?.role}</span>
        </div>
       
      </div>
    </nav>
  );
};

export default TopNavbar;

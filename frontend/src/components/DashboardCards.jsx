import React from "react";
import { FaGraduationCap, FaUsers, FaBuilding, FaDollarSign } from "react-icons/fa";

const DashboardCards = ({ stats }) => {
  return (
    <div className="flex flex-wrap gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bg} flex-1 min-w-[220px] flex items-center justify-between p-6 rounded-xl shadow-md transition-all hover:shadow-xl border-2 border-[var(--color-primary)]`}
        >
          <div>
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            <p className={`mt-1 text-2xl font-semibold ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>
          <div>{stat.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;

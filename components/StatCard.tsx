
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, icon, color = "emerald" }) => {
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <div className={`p-3 sm:p-4 rounded-lg border-2 ${colorClasses[color]} flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3`}> 
      <div className="w-full sm:flex-1">
        <p className="text-fluid-xs font-semibold opacity-80 mb-1 text-right">{label}</p>
        <h3 className="text-lg sm:text-2xl font-bold text-right">{value}</h3>
        {subValue && <p className="text-fluid-xs mt-1 font-medium opacity-70 text-right">{subValue}</p>}
      </div>
      <div className="p-2 sm:p-3 bg-white/50 rounded-lg shadow-sm text-sm flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
        {icon}
      </div>
    </div>
  );
};

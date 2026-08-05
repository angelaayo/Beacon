import React from "react";

type StatsCardProps = {
  label: string;
  value: number;
  color: string;
};
const StatsCard = ({ label, value, color }: StatsCardProps) => {
  return (
    <div
      className="border-3 px-3 py-2  bg-white rounded-md flex flex-col gap-2"
      style={{ borderLeftColor: color }}
    >
      <h5 className="font-jetbrains text-xs md:text-sm">{label}</h5>
      <h2 style={{ color: color }} className="font-bold text-3xl font-hanken">
        {value < 10 && 0}
        {value}
      </h2>
    </div>
  );
};

export default StatsCard;

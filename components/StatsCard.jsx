import React from "react";

const StatsCard = (props) => {
  return (
    <div className="border-3 px-3 py-2  bg-white rounded-md flex flex-col gap-2">
      <h5 className="font-jetbrains text-xs md:text-sm">{props.label}</h5>
      <h2
        style={{ color: props.color }}
        className="font-bold text-3xl font-hanken"
      >
        {props.value < 10 && 0}
        {props.value}
      </h2>
    </div>
  );
};

export default StatsCard;

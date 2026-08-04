import React from "react";

const IncidentActivity = ({ incident }) => {
  return (
    <div className="border-3 px-3 py-2  bg-white rounded-md flex flex-col gap-2">
      <div className="flex justify-between text-xs md:text-sm font-jetbrains">
        <span>INC-2045</span>
        <span>{incident.severity}</span>
      </div>
      <h3 className="font-hanken text-lg font-semibold">{incident.title}</h3>
      <div>
        <span className=" text-xs md:text-sm font-jetbrains">
          {incident.status}
        </span>
      </div>
    </div>
  );
};

export default IncidentActivity;

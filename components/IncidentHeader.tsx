import { Incident, IncidentSeverity } from "@/app/generated/prisma/client";
import React from "react";
import { formatDistanceToNow } from "date-fns";
const IncidentHeader = ({ incident }: { incident: Incident }) => {
  const date = new Date(incident.createdAt);
  const dateResult = formatDistanceToNow(date, { addSuffix: true });
  const statusColors: Record<IncidentSeverity, string> = {
    CRITICAL: "#ba1a1ac5",
    HIGH: "#f59f0ba8",
    MEDIUM: "#0059bebe",
    LOW: "#3a9157ad",
  };
  return (
    <div className="border-b-4 pb-2">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <span>INC-102</span>
          <span style={{ backgroundColor: statusColors[incident.severity] }} className="px-2 text-white font-bold">
            {incident.severity}
          </span>
        </div>
        <span className="text-sm md:text-base">{dateResult}</span>
      </div>
      <h3>{incident.title}</h3>
    </div>
  );
};

export default IncidentHeader;

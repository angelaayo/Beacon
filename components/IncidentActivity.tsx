import React from "react";
import Link from "next/link";
import type { Incident, IncidentSeverity } from "@/app/generated/prisma/client";
const IncidentActivity = ({ incident }: { incident: Incident }) => {
  const statusColors: Record<IncidentSeverity, string> = {
    CRITICAL: "#FFDAD6",
    HIGH: "#f59f0b5b",
    MEDIUM: "#E7EEFE",
    LOW: "#d6f1df",
  };
  return (
    <Link href={`/incidents/${incident.id}`} className="border-3 px-3 py-2  bg-white rounded-md flex flex-col gap-2">
      <div className="flex justify-between text-xs md:text-sm font-jetbrains">
        <span>INC-2045</span>
        <span
          style={{ backgroundColor: statusColors[incident.severity] }}
          className="px-1 font-semibold"
        >
          {incident.severity}
        </span>
      </div>
      <h3 className="font-hanken text-lg font-semibold">{incident.title}</h3>
      <div>
        <span className=" text-xs md:text-sm font-jetbrains">
          {incident.status}
        </span>
      </div>
    </Link>
  );
};

export default IncidentActivity;

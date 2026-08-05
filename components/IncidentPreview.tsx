import React from "react";
import { formatDistanceToNow } from "date-fns";
import type {
  Incident,
  IncidentSeverity,
} from "@/app/generated/prisma/client";
import Link from "next/link";

const IncidentPreview = ({ incident }: { incident: Incident }) => {
  const date = new Date(incident.createdAt);
  const dateResult = formatDistanceToNow(date, { addSuffix: true });
  const statusColors: Record<IncidentSeverity, string> = {
    CRITICAL: "#FFDAD6",
    HIGH: "#f59f0b5b",
    MEDIUM: "#E7EEFE",
    LOW: "#d6f1df",
  };
  return (
    <Link href={`/incidents/${incident.id}`} className="min-h-[120px] rounded-md border-2 p-2 flex flex-col gap-2 justify-center">
      <div className="flex justify-between font-jetbrains">
        <h3 className="text-xs md:text-sm">INC-4092</h3>
        <h3
          style={{ backgroundColor: statusColors[incident.severity] }}
          className="text-sm md:text-sm px-2 rounded font-bold"
        >
          {incident.severity}
        </h3>
      </div>
      <div className="flex justify-between">
        <h2 className="font-hanken line-clamp-2">{incident.title}</h2>
        <h3 className="text-xs md:text-sm">{dateResult}</h3>
      </div>
      <div className="font-jetbrains text-xs md:text-sm bg-[#F5F3F4] w-fit border-3 border-[#C9CAD0] px-2">
        {incident.status}
      </div>
    </Link>
  );
};

export default IncidentPreview;

// (parameter) incident: {
//  assignments: ({
//  user: {
//  id: string;
//  name: string;
//  };
//  } & {
//  id: string;
//  incidentId: string;
//  userId: string;
//  responsibility: string;
//  createdAt: Date;
//  })[];
//  service: {
//  id: string;
//  name: string;
//  organizationId: string;
//  description: string | null;
//  status: ServiceStatus;
//  createdAt: Date;
//  };
// } & {
//  id: string;
//  organizationId: string;
//  title: string;
//  description: string;
//  severity: IncidentSeverity;
//  status: IncidentStatus;
//  serviceId: string;
//  createdById: string;
//  createdAt: Date;
//  resolvedAt: Date | null;
// }

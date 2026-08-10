import Link from "next/link";
import type { Incident } from "@/app/generated/prisma/client";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";

const IncidentActivity = ({ incident }: { incident: Incident }) => {
  return (
    <Link
      href={`/incidents/${incident.id}`}
      className="border rounded-lg bg-card px-3 py-3 flex flex-col gap-2 hover:shadow-sm transition-shadow"
    >
      <div className="flex justify-between items-center text-xs md:text-sm font-jetbrains">
        <span className="text-muted-foreground">INC-{incident.id.slice(-4).toUpperCase()}</span>
        <SeverityBadge severity={incident.severity} />
      </div>
      <h3 className="font-hanken text-lg font-semibold">{incident.title}</h3>
      <div>
        <StatusBadge status={incident.status} />
      </div>
    </Link>
  );
};

export default IncidentActivity;

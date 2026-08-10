import { formatDistanceToNow } from "date-fns";
import type { Incident } from "@/app/generated/prisma/client";
import Link from "next/link";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";

const IncidentPreview = ({ incident }: { incident: Incident }) => {
  const dateResult = formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true });

  return (
    <Link
      href={`/incidents/${incident.id}`}
      className="min-h-[120px] rounded-lg border bg-card p-3 flex flex-col gap-2 justify-center hover:shadow-sm transition-shadow"
    >
      <div className="flex justify-between items-center font-jetbrains">
        <h3 className="text-xs md:text-sm text-muted-foreground">
          INC-{incident.id.slice(-4).toUpperCase()}
        </h3>
        <SeverityBadge severity={incident.severity} />
      </div>
      <div className="flex justify-between gap-2">
        <h2 className="font-hanken line-clamp-2">{incident.title}</h2>
        <h3 className="text-xs md:text-sm text-muted-foreground shrink-0">{dateResult}</h3>
      </div>
      <div>
        <StatusBadge status={incident.status} />
      </div>
    </Link>
  );
};

export default IncidentPreview;
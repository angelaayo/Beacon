import { Incident } from "@/app/generated/prisma/client";
import { formatDistanceToNow } from "date-fns";
import { SeverityBadge } from "@/components/SeverityBadge";

const IncidentHeader = ({ incident }: { incident: Incident }) => {
  const dateResult = formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true });

  return (
    <div className="border-b pb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="font-jetbrains text-sm text-muted-foreground">
            INC-{incident.id.slice(-4).toUpperCase()}
          </span>
          <SeverityBadge severity={incident.severity} />
        </div>
        <span className="text-sm md:text-base text-muted-foreground">{dateResult}</span>
      </div>
      <h3 className="text-xl font-hanken font-semibold mt-2">{incident.title}</h3>
    </div>
  );
};

export default IncidentHeader;

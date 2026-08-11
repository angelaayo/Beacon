import React from "react";
import { getIncident } from "@/lib/queries/incedentQueries";
import { verifyToken } from "@/lib/auth/jwt";
import MessagesPanel from "./MessagesPanel";
import IncidentActions from "./IncidentActions";
import IncidentEventHistory from "./IncidentEventHistory";
import ImpactedServices from "./ImpactedServices";

type Incident = NonNullable<Awaited<ReturnType<typeof getIncident>>>;
type User = NonNullable<Awaited<ReturnType<typeof verifyToken>>>;

type Props = {
  incident: Incident;
  user: User;
};

const IncidentOverview = ({ incident, user }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)] gap-6 pt-4 font-hanken">
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-6 min-w-0">
        {/* DESCRIPTION */}
        <section>
          <h2 className="text-sm text-muted-foreground font-semibold mb-2">
            DESCRIPTION
          </h2>

          <div className="bg-card border rounded-lg p-4">
            <p className="text-base leading-relaxed">{incident.description}</p>
          </div>
        </section>

        {/* MOBILE ONLY: impacted services */}
        <div className="lg:hidden">
          <ImpactedServices incident={incident} />
        </div>

        {/* MOBILE ONLY: activity */}
        <div className="lg:hidden">
          <IncidentEventHistory events={incident.events} />
        </div>

        {/* MESSAGES */}
        <MessagesPanel incident={incident} user={user} />

        {/* MOBILE ONLY: actions */}
        <div className="lg:hidden">
          <IncidentActions incident={incident}/>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex flex-col gap-6 min-w-0">
        <IncidentActions incident={incident}/>

        <IncidentEventHistory events={incident.events} />

        <ImpactedServices incident={incident} />
      </div>
    </div>
  );
};

export default IncidentOverview;

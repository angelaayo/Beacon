import IncidentPreview from "@/components/IncidentPreview";
import { verifyToken } from "@/lib/auth/jwt";
import { getIncident } from "@/lib/queries/incedentQueries";
import { redirect, notFound } from "next/navigation";
import IncidentHeader from "@/components/IncidentHeader";
import IncidentBody from "@/components/IncidentBody";
import React from "react";

const IncidentDetailPage = async ({
  params,
}: {
  params: Promise<{ incidentId: string }>;
}) => {
  const { incidentId } = await params;
  const user = await verifyToken();
  if (!user) redirect("/login");

  const incident = await getIncident(incidentId, user.organizationId);
  if (!incident) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-3">
      <IncidentHeader key={incident.id} incident={incident} />
      <IncidentBody incident={incident} user={user}/>
    </div>
  );
};

export default IncidentDetailPage;

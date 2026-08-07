import React from "react";
import { getIncident } from "@/lib/queries/incedentQueries";
import MessageCard from "@/components/Message";
import { verifyToken } from "@/lib/auth/jwt";
import MessageInput from "./MessageInput";
import MessagesPanel from "./MessagesPanel";
type Incident = NonNullable<Awaited<ReturnType<typeof getIncident>>>;
type User = NonNullable<Awaited<ReturnType<typeof verifyToken>>>;
type Props = {
  incident: Incident;
  user: User;
};
const IncidentOverview = ({ incident, user }: Props) => {
  return (
    <div className="flex flex-col gap-2 pt-4 font-hanken">
      <h2 className="text-sm text-gray-600 font-semibold">DESCRIPTION</h2>
      <div className="border-4 bg-[#F5F3F4] p-2 text-base">
        {incident.description}
      </div>
      <h2 className="text-sm text-gray-600 font-semibold">IMPACTED SERVICE</h2>
      <h3 className="bg-[#EAE7E9] w-fit px-2 py-1">{incident.service.name}</h3>
      <MessagesPanel incident={incident} user={user} />
    </div>
  );
};

export default IncidentOverview;

import { verifyToken } from "@/lib/auth/jwt";
import {
  getAllIncidents,
  getIncidentCount,
} from "@/lib/queries/incedentQueries";
import React from "react";
import { redirect } from "next/navigation";
import IncidentPreview from "@/components/IncidentPreview";
import IncidentsPagination from "@/components/IncidentsPagination";
import IncidentSearch from "@/components/IncidentSearch";

const IncidentPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const pageSize = 10;

  const user = await verifyToken();
  if (!user) redirect("/login");

  const [incidents, totalCount] = await Promise.all([
    getAllIncidents(user!.organizationId, page, pageSize),
    getIncidentCount(user!.organizationId),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="font-hanken font-semibold text-xl">Incidents</h1>
        <h3 className="text-sm">{totalCount} Total Incidents</h3>
      </div>
      <div>
        <IncidentSearch placeholderText="Search incidents, ID, or services..." />
      </div>
      <div className="flex flex-col gap-3 ">
        {incidents.map((incident) => (
          <IncidentPreview key={incident.id} incident={incident} />
        ))}
      </div>
      <IncidentsPagination page={page} totalPages={totalPages} />
    </div>
  );
};

export default IncidentPage;

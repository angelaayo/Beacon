import { verifyToken } from "@/lib/auth/jwt";
import {
  getAllIncidents,
  getIncidentCount,
} from "@/lib/queries/incedentQueries";
import IncidentPreview from "@/components/IncidentPreview";
import IncidentSearch from "@/components/IncidentSearch";
import IncidentsPagination from "@/components/IncidentsPagination";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q ?? "";
  const page = Number(params.page) || 1;
  const pageSize = 5;

  const user = await verifyToken();
  const [incidents, totalCount] = await Promise.all([
    getAllIncidents(user!.organizationId, page, pageSize, query),
    getIncidentCount(user!.organizationId, query),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="font-hanken font-semibold text-xl">Search Results</h1>
        <h3 className="text-sm text-muted-foreground">
          {totalCount} result{totalCount !== 1 && "s"} for &ldquo;{query}&rdquo;
        </h3>
      </div>

      <IncidentSearch placeholderText="Search incidents, ID, or services..." />

      {incidents.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No incidents match your search.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {incidents.map((incident) => (
            <IncidentPreview key={incident.id} incident={incident} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <IncidentsPagination page={page} totalPages={totalPages} />
      )}
    </div>
  );
}

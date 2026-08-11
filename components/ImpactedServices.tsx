import { getIncident } from "@/lib/queries/incedentQueries";
type Incident = NonNullable<Awaited<ReturnType<typeof getIncident>>>;
const ImpactedServices = ({ incident }: { incident: Incident }) => {
  return (
    <section>
      <h2 className="text-sm text-muted-foreground font-semibold mb-2">
        IMPACTED SERVICE
      </h2>

      <div className="flex flex-wrap gap-2">
        <div className="bg-secondary px-3 py-2 rounded-md text-sm">
          {incident.service.name}
        </div>
      </div>
    </section>
  );
};

export default ImpactedServices;

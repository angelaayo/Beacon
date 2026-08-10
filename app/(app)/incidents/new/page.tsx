import { verifyToken } from "@/lib/auth/jwt";
import { getServices } from "@/lib/queries/serviceQueries";
import NewIncidentForm from "@/components/NewIncidentForm";

export default async function NewIncidentPage() {
  const user = await verifyToken();

  const services = await getServices(user!.organizationId);

  return (
    <div className="flex justify-center py-8 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="font-hanken font-semibold text-xl">
          Report an Incident
        </h1>
        <p className="text-sm text-muted-foreground">
          This will be visible to your whole team immediately.
        </p>
        <NewIncidentForm services={services} />
      </div>
    </div>
  );
}

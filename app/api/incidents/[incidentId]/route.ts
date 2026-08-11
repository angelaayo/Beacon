import { verifyToken } from "@/lib/auth/jwt";
import { updateIncidentSchema } from "@/lib/validation/incidentSchema";
import {
  updateIncidentSeverity,
  updateIncidentStatus,
} from "@/lib/queries/incedentQueries";
import { createEvent } from "@/lib/queries/eventQueries";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ incidentId: string }> },
) {
  const user = await verifyToken();
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { incidentId } = await params;
  const result = updateIncidentSchema.safeParse(await request.json());
  if (!result.success) {
    return Response.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  let incident;

  if (result.data.status) {
    incident = await updateIncidentStatus(
      incidentId,
      user.organizationId,
      result.data.status,
    );
    const description =
      result.data.status === "RESOLVED"
        ? `resolved this incident`
        : `changed status to ${result.data.status}`;
    await createEvent(
      incidentId,
      user.id,
      result.data.status === "RESOLVED" ? "RESOLVED" : "STATUS_CHANGED",
      description,
      { to: result.data.status },
    );
  }

  if (result.data.severity) {
    incident = await updateIncidentSeverity(
      incidentId,
      user.organizationId,
      result.data.severity,
    );
    await createEvent(
      incidentId,
      user.id,
      "SEVERITY_CHANGED",
      `changed severity to ${result.data.severity}`,
      { to: result.data.severity },
    );
  }

  return Response.json(incident);
}

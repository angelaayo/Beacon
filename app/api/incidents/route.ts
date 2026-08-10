import { verifyToken } from "@/lib/auth/jwt";
import { createIncidentSchema } from "@/lib/validation/incidentSchema";
import { createIncident } from "@/lib/queries/incedentQueries";
import { createEvent } from "@/lib/queries/eventQueries";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await verifyToken();
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = createIncidentSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const service = await prisma.service.findUnique({
    where: { id: result.data.serviceId, organizationId: user.organizationId },
  });
  if (!service) {
    return Response.json({ errors: { serviceId: ["Invalid service"] } }, { status: 400 });
  }

  const incident = await createIncident(user.organizationId, user.id, result.data);

  await createEvent(incident.id, user.id, "CREATED", `created this incident`);

  await prisma.incidentAssignment.create({
    data: {
      incidentId: incident.id,
      userId: user.id,
      responsibility: "Reported and investigating",
    },
  });

  return Response.json(incident);
}
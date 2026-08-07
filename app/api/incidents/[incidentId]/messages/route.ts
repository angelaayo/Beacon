import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { createMessage } from "@/lib/queries/messageQueries";
import { createMessageSchema } from "@/lib/validation/messageSchema";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ incidentId: string }> },
) {
  const user = await verifyToken();
  if (!user) {
    return Response.json({ message: "Unathorized" }, { status: 401 });
  }
  const { incidentId } = await params;

  const incident = await prisma.incident.findUnique({
    where: { id: incidentId, organizationId: user.organizationId },
  });
  if (!incident) {
    return Response.json({ message: "Incident not found" }, { status: 404 });
  }

  const body = await request.json();
  const result = createMessageSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const message = await createMessage(result.data.content, incidentId, user.id);
  global.io.to(`incidents:${incidentId}`).emit("newMessage", message);
  return Response.json(message);
}

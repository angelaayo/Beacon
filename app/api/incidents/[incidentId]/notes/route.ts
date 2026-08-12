import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import {
  getIncidentNotes,
  saveIncidentNotes,
} from "@/lib/queries/notesQueries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ incidentId: string }> },
) {
  const user = await verifyToken();
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { incidentId } = await params;
  const content = await getIncidentNotes(incidentId, user.organizationId);
  return Response.json({
    content: content ? Buffer.from(content).toString("base64") : null,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ incidentId: string }> },
) {
  const user = await verifyToken();
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { incidentId } = await params;
  const { content } = await request.json();

  if (typeof content !== "string") {
    return Response.json({ message: "Invalid content" }, { status: 400 });
  }

  const incident = await prisma.incident.findUnique({
    where: { id: incidentId, organizationId: user.organizationId },
  });
  if (!incident) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  const bytes = new Uint8Array(Buffer.from(content, "base64"));
  await saveIncidentNotes(incidentId, bytes);

  return Response.json({ success: true });
}

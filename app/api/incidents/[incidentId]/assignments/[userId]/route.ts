import { verifyToken } from "@/lib/auth/jwt";
import { deleteAssignment } from "@/lib/queries/assignmentQueries";
import { createEvent } from "@/lib/queries/eventQueries";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ incidentId: string; userId: string }> },
) {
  const user = await verifyToken();
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { incidentId, userId } = await params;

  if (userId !== user.id && user.role !== "ADMIN") {
    return Response.json(
      { message: "Only admins can remove other responders" },
      { status: 403 },
    );
  }

  const incident = await prisma.incident.findUnique({
    where: { id: incidentId, organizationId: user.organizationId },
  });
  if (!incident) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  await deleteAssignment(incidentId, userId);
  await createEvent(incidentId, user.id, "UNASSIGNED", `removed an assignment`);

  return Response.json({ success: true });
}

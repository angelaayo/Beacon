import { verifyToken } from "@/lib/auth/jwt";
import { createAssignmentSchema } from "@/lib/validation/assignmentSchema";
import { createAssignment } from "@/lib/queries/assignmentQueries";
import { createEvent } from "@/lib/queries/eventQueries";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ incidentId: string }> },
) {
  const user = await verifyToken();
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { incidentId } = await params;
  const result = createAssignmentSchema.safeParse(await request.json());
  if (!result.success) {
    return Response.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  if (result.data.userId !== user.id && user.role != "ADMIN") {
    return Response.json(
      { message: "Only admins can assign other responders" },
      { status: 403 },
    );
  }
  const [incident, targetUser] = await Promise.all([
    prisma.incident.findUnique({
      where: { id: incidentId, organizationId: user.organizationId },
    }),
    prisma.user.findUnique({
      where: { id: result.data.userId, organizationId: user.organizationId },
    }),
  ]);

  if (!incident || !targetUser) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  const assignment = await createAssignment(
    incidentId,
    result.data.userId,
    result.data.responsibility,
  );

  await createEvent(
    incidentId,
    user.id,
    "USER_ASSIGNED",
    result.data.userId === user.id
      ? `self-assigned`
      : `assigned ${targetUser.name}`,
    { assignedUserId: result.data.userId },
  );

  return Response.json(assignment);
}

import { IncidentEventType } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function getRecentActivity(organizationId: string) {
  return prisma.incidentEvent.findMany({
    where: { incident: { organizationId } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: {
        select: { id: true, name: true },
      },
      incident: {
        select: { id: true, title: true },
      },
    },
  });
}

export async function createEvent(
  incidentId: string,
  userId: string | null,
  type: IncidentEventType,
  description: string,
  metadata?: object,
) {
  return prisma.incidentEvent.create({
    data: { incidentId, userId, type, description, metadata },
  });
}

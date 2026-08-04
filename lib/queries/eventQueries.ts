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

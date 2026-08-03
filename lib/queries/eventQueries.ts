import { prisma } from "@/lib/prisma";

export async function getRecentActivity(organizationId: string) {
  return prisma.incidentEvent.findMany({
    where: { incident: { organizationId } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: true,
      incident: { select: { id: true, title: true } },
    },
  });
}

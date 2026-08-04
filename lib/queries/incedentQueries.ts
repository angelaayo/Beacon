import { prisma } from "@/lib/prisma";

export async function getTopIncidents(organizationId: string) {
  return prisma.incident.findMany({
    where: { organizationId, status: { not: "RESOLVED" } },
    orderBy: [{ severity: "desc" }, { createdAt: "desc" }],
    take: 3,
    include: {
      service: true,
      assignments: { include: { user: { select: { id: true, name: true } } } },
    },
  });
}

export async function getIncidentStats(organizationId: string) {
  const [critical, high, medium, totalOpen] = await Promise.all([
    prisma.incident.count({
      where: {
        organizationId,
        status: { not: "RESOLVED" },
        severity: "CRITICAL",
      },
    }),
    prisma.incident.count({
      where: { organizationId, status: { not: "RESOLVED" }, severity: "HIGH" },
    }),
    prisma.incident.count({
      where: {
        organizationId,
        status: { not: "RESOLVED" },
        severity: "MEDIUM",
      },
    }),
    prisma.incident.count({
      where: { organizationId, status: { not: "RESOLVED" } },
    }),
  ]);
  return { critical, high, medium, totalOpen };
}

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

export async function getAllIncidents(
  organizationId: string,
  page: number,
  pageSize: number,
) {
  return prisma.incident.findMany({
    where: { organizationId },
    orderBy: [{ severity: "desc" }, { createdAt: "desc" }],
    include: {
      service: true,
      assignments: { include: { user: { select: { id: true, name: true } } } },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
}

export async function getIncidentCount(organizationId: string) {
  return prisma.incident.count({ where: { organizationId } });
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

export async function getIncident(id: string, organizationId: string) {
  return prisma.incident.findFirst({
    where: {
      id,
      organizationId,
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
      messages: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      events: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      notes: true,
    },
  });
}

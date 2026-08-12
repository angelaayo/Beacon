import {
  IncidentSeverity,
  IncidentStatus,
} from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { CreateIncidentInput } from "@/lib/validation/incidentSchema";
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
  search?: string,
) {
  const codeMatch = search?.match(/^(?:INC-)?([A-Za-z0-9]{4})$/);

  return prisma.incident.findMany({
    where: {
      organizationId,
      ...(search && {
        OR: [
          { id: { contains: search, mode: "insensitive" } },
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { service: { name: { contains: search, mode: "insensitive" } } },
          ...(codeMatch
            ? [{ id: { endsWith: codeMatch[1], mode: "insensitive" as const } }]
            : []),
        ],
      }),
    },
    orderBy: [{ severity: "desc" }, { createdAt: "desc" }],
    include: {
      service: true,
      assignments: { include: { user: { select: { id: true, name: true } } } },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
}

export async function getIncidentCount(
  organizationId: string,
  search?: string,
) {
  const codeMatch = search?.match(/^(?:INC-)?([A-Za-z0-9]{4})$/);
  return prisma.incident.count({
    where: {
      organizationId,
      ...(search && {
        OR: [
          { id: { contains: search, mode: "insensitive" } },
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { service: { name: { contains: search, mode: "insensitive" } } },
          ...(codeMatch
            ? [{ id: { endsWith: codeMatch[1], mode: "insensitive" as const } }]
            : []),
        ],
      }),
    },
  });
}

export async function getIncidentStats(organizationId: string) {
  const [critical, high, medium, totalOpen, unassigned] = await Promise.all([
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
    prisma.incident.count({
      where: {
        organizationId,
        status: { not: "RESOLVED" },
        assignments: { none: {} },
      },
    }),
  ]);
  return { critical, high, medium, totalOpen, unassigned };
}

export async function getIncident(id: string, organizationId: string) {
  return prisma.incident.findFirst({
    where: { id, organizationId },
    include: {
      service: { select: { id: true, name: true, status: true } },
      messages: { include: { user: { select: { id: true, name: true, avatarColor: true } } } },
      events: { include: { user: { select: { name: true } } } },
      assignments: { include: { user: { select: { id: true, name: true } } } },
      notes: true,
    },
  });
}

export async function createIncident(
  organizationId: string,
  createdById: string,
  data: CreateIncidentInput,
) {
  return prisma.incident.create({
    data: {
      ...data,
      organizationId,
      createdById,
    },
    include: {
      service: true,
      assignments: { include: { user: { select: { id: true, name: true } } } },
    },
  });
}

export async function updateIncidentStatus(
  id: string,
  organizationId: string,
  status: IncidentStatus,
) {
  return prisma.incident.update({
    where: { id, organizationId },
    data: {
      status,
      resolvedAt: status === "RESOLVED" ? new Date() : null,
    },
  });
}

export async function updateIncidentSeverity(
  id: string,
  organizationId: string,
  severity: IncidentSeverity,
) {
  return prisma.incident.update({
    where: { id, organizationId },
    data: { severity },
  });
}

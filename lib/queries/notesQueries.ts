import { prisma } from "@/lib/prisma";

export async function getIncidentNotes(
  incidentId: string,
  organizationId: string,
) {
  const incident = await prisma.incident.findUnique({
    where: { id: incidentId, organizationId },
    select: { notes: { select: { content: true } } },
  });
  return incident?.notes?.content ?? null;
}

export async function saveIncidentNotes(
  incidentId: string,
  content: Uint8Array<ArrayBuffer>,
) {
  return prisma.incidentNotes.upsert({
    where: { incidentId },
    create: { incidentId, content },
    update: { content },
  });
}

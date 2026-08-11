import { prisma } from "@/lib/prisma";

export async function createAssignment(incidentId: string, userId: string, responsibility: string) {
  return prisma.incidentAssignment.create({
    data: { incidentId, userId, responsibility },
    include: { user: { select: { id: true, name: true } } },
  });
}

export async function deleteAssignment(incidentId: string, userId: string) {
  return prisma.incidentAssignment.deleteMany({
    where: { incidentId, userId },
  });
}
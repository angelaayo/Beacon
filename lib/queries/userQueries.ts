import { prisma } from "@/lib/prisma";

export async function getOrgMembers(organizationId: string) {
  return prisma.user.findMany({
    where: { organizationId },
    select: { id: true, name: true, role: true },
    orderBy: { name: "asc" },
  });
}

export async function updateAvatarColor(userId: string, avatarColor: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { avatarColor },
    select: { id: true, name: true, avatarColor: true },
  });
}
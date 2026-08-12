import { prisma } from "@/lib/prisma";

export async function getOrgMembers(organizationId: string) {
  return prisma.user.findMany({
    where: { organizationId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarColor: true,
    },
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });
}

export async function updateUser(
  userId: string,
  data: { name?: string; avatarColor?: string },
) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, avatarColor: true },
  });
}

export async function getUserInfo(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: { avatarColor: true, name: true },
  });
}

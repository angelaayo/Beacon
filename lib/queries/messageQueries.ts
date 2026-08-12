import { prisma } from "@/lib/prisma";

export async function createMessage(
  content: string,
  incidentId: string,
  userId: string,
) {
  return prisma.message.create({
    data: { incidentId, userId, content },
    include: {
      user: { select: { id: true, name: true, avatarColor: true } },
    },
  });
}

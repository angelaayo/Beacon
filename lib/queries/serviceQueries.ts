import { prisma } from "@/lib/prisma";
import { CreateServiceInput } from "../validation/serviceSchema";

export async function getServices(organizationId: string) {
  return prisma.service.findMany({
    where: { organizationId },
    select: { id: true, name: true, status: true },
    orderBy: { name: "asc" },
  });
}

export async function createService(
  organizationId: string,
  data: CreateServiceInput,
) {
  return prisma.service.create({
    data: { ...data, organizationId },
  });
}

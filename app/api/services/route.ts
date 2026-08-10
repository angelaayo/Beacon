import { verifyToken } from "@/lib/auth/jwt";
import { createServiceSchema } from "@/lib/validation/serviceSchema";
import { createService } from "@/lib/queries/serviceQueries";

export async function POST(request: Request) {
  const user = await verifyToken();

  if (user!.role !== "ADMIN") {
    return Response.json(
      { message: "Only admins can create services" },
      { status: 403 },
    );
  }

  const result = createServiceSchema.safeParse(await request.json());
  if (!result.success) {
    return Response.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const service = await createService(user!.organizationId, result.data);
  return Response.json(service);
}

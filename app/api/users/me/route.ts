import { verifyToken } from "@/lib/auth/jwt";
import { updateUserSchema } from "@/lib/validation/userSchema";
import { updateUser } from "@/lib/queries/userQueries";

export async function PATCH(request: Request) {
  const user = await verifyToken();
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = updateUserSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const updated = await updateUser(user.id, result.data);
  return Response.json(updated);
}
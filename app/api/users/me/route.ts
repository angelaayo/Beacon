import { verifyToken } from "@/lib/auth/jwt";
import { updateAvatarSchema } from "@/lib/validation/userSchema";
import { updateAvatarColor } from "@/lib/queries/userQueries";

export async function PATCH(request: Request) {
  const user = await verifyToken();
  if (!user) {
    return Response.json({ message: "Unathorized" }, { status: 401 });
  }
  const result = updateAvatarSchema.safeParse(await request.json());
  if (!result.success) {
    return Response.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const updated = await updateAvatarColor(user.id, result.data.avatarColor);
  return Response.json(updated);
}

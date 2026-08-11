import { verifyToken } from "@/lib/auth/jwt";
import { getOrgMembers } from "@/lib/queries/userQueries";

export async function GET() {
  const user = await verifyToken();
  if (!user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const members = await getOrgMembers(user.organizationId);
  return Response.json(members);
}
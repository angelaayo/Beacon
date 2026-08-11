import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyToken() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
      organizationId: string;
      name: string;
      avatarColor: string;
      email: string;
    };
  } catch {
    return null;
  }
}
//returns user info on token verification

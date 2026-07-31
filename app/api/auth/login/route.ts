import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { loginSchema } from "@/lib/validation/authSchema";

export async function POST(request: Request) {
  const result = loginSchema.safeParse(await request.json());
  if (!result.success) {
    return Response.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return Response.json(
      { message: "User not found, create an account!" },
      { status: 401 },
    );
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" },
  );

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return Response.json({ message: "Logged In" });
}

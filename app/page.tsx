import { verifyToken } from "@/lib/auth/jwt";
import { redirect } from "next/navigation";
export default async function Home() {
  const user = await verifyToken();
  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}

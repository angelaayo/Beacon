// app/dashboard/layout.tsx
import { verifyToken } from "@/lib/auth/jwt";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await verifyToken();
  if (!user) redirect("/login");

  return <>{children}</>;
}
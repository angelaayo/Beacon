// components/AppSideBar.tsx — async Server Component, no "use client"
import { verifyToken } from "@/lib/auth/jwt";
import SidebarNav from "./SideBarNav";

export default async function AppSideBar() {
  const user = await verifyToken();
  const isAdmin = user?.role === "ADMIN";

  return <SidebarNav isAdmin={isAdmin} />;
}
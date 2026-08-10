// app/(app)/layout.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSideBar from "@/components/AppSideBar";
import NewIncidentFAB from "@/components/NewIncidentFAB";
import { verifyToken } from "@/lib/auth/jwt";
import { redirect } from "next/navigation";
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await verifyToken();
  if(!user) redirect("/login");
  return (
    <SidebarProvider className="flex min-h-screen">
      <div className="hidden md:block">
        <AppSideBar />
      </div>
      <NewIncidentFAB />
      <div className="flex min-h-screen flex-1 flex-col gap-5 bg-[#F9F9F8]">
        <Header />
        <main className="flex-1 px-4">
          <div className="hidden md:block">
            <SidebarTrigger></SidebarTrigger>
          </div>
          <div className="">{children}</div>
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}

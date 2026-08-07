// app/(app)/layout.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSideBar from "@/components/AppSideBar";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="flex min-h-screen">
      <div className="hidden md:block">
        <AppSideBar />
      </div>
      <div className="flex min-h-screen flex-1 flex-col gap-5 bg-[#F9F9F8]">
        <Header />
        <main className="flex-1 px-4">
          <div className="hidden md:block">
            <SidebarTrigger></SidebarTrigger>
          </div>
          {children}
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
}

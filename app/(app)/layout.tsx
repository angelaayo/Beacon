// app/(app)/layout.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/SideBar";
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:block w-54 shrink-0">
        <Sidebar />
      </aside>
      <div className="flex min-h-screen flex-1 flex-col gap-5 bg-[#F9F9F8]">
        <Header />
        <main className="flex-1 px-4">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

import { verifyToken } from "@/lib/auth/jwt";
import { redirect } from "next/navigation";
import NewServiceForm from "@/components/NewServiceForm";

export default async function NewServicePage() {
  const user = await verifyToken();
  if (user!.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex justify-center py-8 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="font-hanken font-semibold text-xl">Add a Service</h1>
        <NewServiceForm />
      </div>
    </div>
  );
}

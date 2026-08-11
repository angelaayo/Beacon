import { verifyToken } from "@/lib/auth/jwt";
import { redirect } from "next/navigation";
import AccountForm from "@/components/AccountForm";

export default async function AccountPage() {
  const user = await verifyToken();

  return (
    <div className="flex flex-col gap-2 py-4 max-w-lg">
      <h1 className="font-hanken font-semibold text-xl">My Account</h1>
      <AccountForm
        name={user!.name}
        email={user!.email}
        role={user!.role}
        avatarColor={user!.avatarColor}
      />
    </div>
  );
}

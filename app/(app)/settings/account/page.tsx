import { verifyToken } from "@/lib/auth/jwt";
import { getUserAssignments } from "@/lib/queries/assignmentQueries";
import AccountForm from "@/components/AccountForm";
import { getUserInfo } from "@/lib/queries/userQueries";
export default async function AccountPage() {
  const user = await verifyToken();
  const userAvatar = await getUserInfo(user!.id);

  const assignments = await getUserAssignments(user!.id, user!.organizationId);

  return (
    <div className="flex flex-col gap-2 py-4 max-w-lg">
      <h1 className="font-hanken font-semibold text-xl">My Account</h1>
      <AccountForm
        name={userAvatar!.name}
        email={user!.email}
        role={user!.role}
        avatarColor={userAvatar!.avatarColor}
        assignments={assignments}
      />
    </div>
  );
}

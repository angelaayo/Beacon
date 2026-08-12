import { verifyToken } from "@/lib/auth/jwt";
import { getOrgMembers } from "@/lib/queries/userQueries";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";

export default async function TeamPage() {
  const user = await verifyToken();

  const members = await getOrgMembers(user!.organizationId);

  return (
    <div className="flex flex-col gap-3 py-4">
      <div>
        <h1 className="font-hanken font-semibold text-xl">Team Members</h1>
        <p className="text-sm text-muted-foreground">
          {members.length} {members.length === 1 ? "person" : "people"} in your organization
        </p>
      </div>

      <div className="border rounded-lg bg-card divide-y">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar name={member.name} color={member.avatarColor} size="md" />
              <div>
                <p className="text-sm font-medium">
                  {member.name}
                  {member.id === user!.id && (
                    <span className="text-muted-foreground font-normal"> (you)</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
            </div>
            <Badge variant="outline" className="capitalize shrink-0">
              {member.role.toLowerCase()}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
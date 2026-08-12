import { verifyToken } from "@/lib/auth/jwt";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import IncidentSearch from "@/components/IncidentSearch";
import { Avatar } from "@/components/Avatar";
import { getUserInfo } from "@/lib/queries/userQueries";
const Header = async () => {
  const user = await verifyToken();
  if (!user) {
    redirect("/login");
  }

  const userAvatar = await getUserInfo(user.id);

  if (!userAvatar) {
    redirect("/login");
  }

  return (
    <div className="border-b flex items-center justify-between gap-4 px-4 py-2 bg-card">
      <Link href="/dashboard" className="font-hanken font-semibold shrink-0">
        Beacon
      </Link>

      <div className="hidden md:block flex-1 max-w-md">
        <IncidentSearch
          placeholderText="Search incidents, ID, or services..."
          compact
        />
      </div>

      <Link
        href="/search"
        className="md:hidden text-muted-foreground"
        aria-label="Search"
      >
        <Search className="size-5" />
      </Link>

      <Link
        href="/settings/account"
        className="flex items-center gap-2 shrink-0"
      >
        <Avatar
          name={userAvatar.name}
          color={userAvatar.avatarColor}
          size="sm"
        />
        <div className="hidden sm:block text-left">
          <h3 className="text-sm font-medium leading-tight">
            {userAvatar.name}
          </h3>
          <h3 className="text-xs text-muted-foreground capitalize leading-tight">
            {user.role.toLowerCase()}
          </h3>
        </div>
      </Link>
    </div>
  );
};

export default Header;

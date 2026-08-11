import { verifyToken } from "@/lib/auth/jwt";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import IncidentSearch from "@/components/IncidentSearch";
import { Avatar } from "@/components/Avatar";
import { prisma } from "@/lib/prisma";
const Header = async () => {
  const user = await verifyToken();
  const userAvatar = await prisma.user.findUnique({
    where: { id: user!.id },
    select: { avatarColor: true },
  });
  if (!userAvatar) {
    throw new Error("User not found");
  }
  const avatarColor = userAvatar.avatarColor;
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
        <Avatar name={user!.name} color={avatarColor} size="sm" />
        <div className="hidden sm:block text-left">
          <h3 className="text-sm font-medium leading-tight">{user!.name}</h3>
          <h3 className="text-xs text-muted-foreground capitalize leading-tight">
            {user!.role.toLowerCase()}
          </h3>
        </div>
      </Link>
    </div>
  );
};

export default Header;

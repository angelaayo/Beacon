import { verifyToken } from "@/lib/auth/jwt";
import React from "react";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
const Header = async () => {
  const user = await verifyToken();
  if (!user) redirect("/login");
  return (
    <div className="border-b-3 flex items-center justify-between gap-4 px-4 py-1">
      <Link href="/dashboard">Incident Management</Link>


      {/* small screens: icon-only button */}
      <button type="button" className="sm:hidden">
        <Search className="size-5" />
      </button>

      {/* larger screens: full search input */}
      <input
        type="search"
        placeholder="Search incidents..."
        className="hidden sm:block border rounded-md px-3 py-2 w-full max-w-sm"
      />

      <div>
        <h3>{user.name}</h3>
        <h3 className="capitalize">{user.role.toLocaleLowerCase()}</h3>
      </div>
    </div>
  );
};

export default Header;

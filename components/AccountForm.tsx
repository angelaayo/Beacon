"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { SeverityBadge } from "@/components/SeverityBadge";
import { cn } from "@/lib/utils";
import { getUserAssignments } from "@/lib/queries/assignmentQueries";

const COLORS = ["gray", "green", "blue", "amber", "rose"] as const;

type Assignment = Awaited<ReturnType<typeof getUserAssignments>>[number];

export default function AccountForm({
  name,
  email,
  role,
  avatarColor,
  assignments,
}: {
  name: string;
  email: string;
  role: string;
  avatarColor: string;
  assignments: Assignment[];
}) {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(avatarColor);
  const [displayName, setDisplayName] = useState(name);
  const [loading, setLoading] = useState(false);

  async function patchUser(body: { name?: string; avatarColor?: string }) {
    try {
      setLoading(true);
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to update account");
      router.refresh();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectColor(color: string) {
    setSelectedColor(color);
    const ok = await patchUser({ avatarColor: color });
    if (!ok) setSelectedColor(avatarColor);
  }

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim() || displayName === name) return;
    const ok = await patchUser({ name: displayName.trim() });
    if (!ok) setDisplayName(name);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Avatar name={displayName || name} color={selectedColor} size="lg" />
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
          <p className="text-xs text-muted-foreground capitalize mt-0.5">
            {role.toLowerCase()}
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveName} className="flex flex-col gap-2 max-w-xs">
        <label className="text-sm font-medium">Display Name</label>
        <div className="flex gap-2">
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Button
            type="submit"
            disabled={loading || !displayName.trim() || displayName === name}
          >
            Save
          </Button>
        </div>
      </form>

      <div>
        <h3 className="text-sm font-medium mb-2">Avatar Color</h3>
        <div className="flex gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              disabled={loading}
              onClick={() => handleSelectColor(color)}
              className={cn(
                "size-8 rounded-full ring-2 ring-offset-2 ring-offset-background transition disabled:opacity-50",
                selectedColor === color ? "ring-primary" : "ring-transparent",
              )}
            >
              <Avatar name="" color={color} size="sm" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">My Assignments</h3>
        {assignments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No active assignments.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {assignments.map((a) => (
              <Link
                key={a.id}
                href={`/incidents/${a.incident.id}`}
                className="flex items-center justify-between border rounded-lg bg-card px-3 py-2 hover:shadow-sm transition-shadow"
              >
                <span className="text-sm font-medium truncate">
                  {a.incident.title}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <SeverityBadge severity={a.incident.severity} />
                  <StatusBadge status={a.incident.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

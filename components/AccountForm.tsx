"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { cn } from "@/lib/utils";


export default function AccountForm({
  name,
  email,
  role,
  avatarColor,
}: {
  name: string;
  email: string;
  role: string;
  avatarColor: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(avatarColor);
  const [loading, setLoading] = useState(false);

  const COLORS = ["gray", "green", "blue", "amber", "rose"] as const;

  async function handleSelect(color: string) {
    setSelected(color);
    try {
      setLoading(true);
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "applications/json" },
        body: JSON.stringify({ avatarColor: color }),
      });
      if (!res.ok) throw new Error("Failed to update avatar");
      router.refresh();
    } catch (err) {
      console.error(err);
      setSelected(avatarColor);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar name={name} color={selected} size="lg" />
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
          <p className="text-xs text-muted-foreground capitalize mt-0.5">
            {role.toLowerCase()}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Avatar Color</h3>
        <div className="flex gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              disabled={loading}
              onClick={() => handleSelect(color)}
              className={cn(
                "size-8 rounded-full ring-2 ring-offset-2 ring-offset-background transition disabled:opacity-50",
                selected === color ? "ring-foreground" : "ring-transparent",
              )}
            >
              <Avatar name="" color={color} size="sm" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

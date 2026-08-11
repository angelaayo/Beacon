"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getIncident } from "@/lib/queries/incedentQueries";
import { getOrgMembers } from "@/lib/queries/userQueries";
import { cn } from "@/lib/utils";

type Incident = NonNullable<Awaited<ReturnType<typeof getIncident>>>;
type Member = Awaited<ReturnType<typeof getOrgMembers>>[number];

export default function IncidentActions({
  incident,
  currentUserId,
  isAdmin,
}: {
  incident: Incident;
  currentUserId: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [showSeverity, setShowSeverity] = useState(false);
  const [showResponders, setShowResponders] = useState(false);
  const [members, setMembers] = useState<Member[] | null>(null);
  const [loading, setLoading] = useState(false);

  // const isResolved = incident.status === "RESOLVED";
  const assignedUserIds = new Set(incident.assignments.map((a) => a.userId));

  useEffect(() => {
    if (!showResponders || members) return;
    fetch("/api/users")
      .then((res) => res.json())
      .then(setMembers);
  }, [showResponders, members]);

  async function updateIncident(body: object) {
    try {
      setLoading(true);
      const res = await fetch(`/api/incidents/${incident.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok)
        throw new Error((await res.json()).message || "Failed to update");
      setShowSeverity(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAssign(userId: string) {
    try {
      setLoading(true);
      const res = await fetch(`/api/incidents/${incident.id}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok)
        throw new Error((await res.json()).message || "Failed to assign");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUnassign(userId: string) {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/incidents/${incident.id}/assignments/${userId}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok)
        throw new Error((await res.json()).message || "Failed to unassign");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2 className="text-sm text-muted-foreground font-semibold mb-2">
        ACTIONS
      </h2>

      <div className="bg-card border rounded-lg p-3 flex flex-col gap-2">
        <div>
          <h3 className="text-xs text-muted-foreground font-medium mb-1.5 px-0.5">
            Status
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {(["OPEN", "INVESTIGATING", "MITIGATING", "RESOLVED"] as const).map(
              (status) => {
                const isCurrent = incident.status === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateIncident({ status })}
                    disabled={loading || isCurrent}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs font-medium transition disabled:pointer-events-none",
                      isCurrent
                        ? "border-transparent bg-primary text-primary-foreground"
                        : "bg-card hover:bg-secondary",
                    )}
                  >
                    {status === "MITIGATING"
                      ? "Mitigating"
                      : status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                );
              },
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowSeverity((prev) => !prev)}
          className="w-full rounded-md border px-4 py-2 text-sm font-semibold hover:bg-secondary transition"
        >
          Change Severity
        </button>
        {showSeverity && (
          <div className="grid grid-cols-2 gap-2 p-2 bg-muted rounded-md">
            {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => updateIncident({ severity: sev })}
                disabled={loading}
                className="rounded-md border bg-card px-2 py-1.5 text-xs font-medium hover:bg-secondary transition disabled:opacity-50"
              >
                {sev}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setShowResponders((prev) => !prev)}
          className="w-full rounded-md border px-4 py-2 text-sm font-semibold hover:bg-secondary transition"
        >
          Manage Responders
        </button>
        {showResponders && (
          <div className="bg-muted rounded-md p-2 flex flex-col gap-1">
            {!members && (
              <p className="text-xs text-muted-foreground px-2 py-1">
                Loading...
              </p>
            )}
            {members?.map((member) => {
              const isAssigned = assignedUserIds.has(member.id);
              const canManage = member.id === currentUserId || isAdmin;

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between px-2 py-1.5 text-sm"
                >
                  <span
                    className={
                      isAssigned ? "font-medium" : "text-muted-foreground"
                    }
                  >
                    {member.name}
                  </span>
                  {canManage && (
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        isAssigned
                          ? handleUnassign(member.id)
                          : handleAssign(member.id)
                      }
                      className="text-xs rounded-md border px-2 py-1 bg-card hover:bg-secondary transition disabled:opacity-50"
                    >
                      {isAssigned ? "Remove" : "Assign"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { getIncident } from "@/lib/queries/incedentQueries";
import { useState } from "react";

type Incident = NonNullable<Awaited<ReturnType<typeof getIncident>>>;

export default function IncidentActions({ incident }: { incident: Incident }) {
  const router = useRouter();
  const [showSeverity, setShowSeverity] = useState(false);
  const [showResponders, setShowResponders] = useState(false);
  const [loading, setLoading] = useState(false);

  const isResolved = incident.status === "RESOLVED";

  async function updateIncident(body: { status?: string; severity?: string }) {
    try {
      setLoading(true);
      const res = await fetch(`/api/incidents/${incident.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update incident");
      }

      if (showSeverity) {
        setShowSeverity(false);
      }
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
        <button
          type="button"
          onClick={() => updateIncident({ status: "RESOLVED" })}
          disabled={isResolved || loading}
          className="w-full rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary/80 transition disabled:opacity-50 disabled:pointer-events-none"
        >
          {isResolved
            ? "Resolved"
            : loading
              ? "Resolving..."
              : "Resolve Incident"}
        </button>

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
          Assign Responder
        </button>

        {showResponders && (
          <div className="bg-muted rounded-md p-2">{/* next up */}</div>
        )}
      </div>
    </section>
  );
}

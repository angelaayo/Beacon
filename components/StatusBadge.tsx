import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  OPEN: "bg-status-open/10 text-status-open",
  INVESTIGATING: "bg-status-investigating/10 text-status-investigating",
  MITIGATING: "bg-status-mitigating/10 text-status-mitigating",
  RESOLVED: "bg-status-resolved/10 text-status-resolved",
} as const;

const STATUS_LABELS = {
  OPEN: "Open",
  INVESTIGATING: "Investigating",
  MITIGATING: "Mitigating",
  RESOLVED: "Resolved",
} as const;

export function StatusBadge({
  status,
}: {
  status: keyof typeof STATUS_STYLES;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

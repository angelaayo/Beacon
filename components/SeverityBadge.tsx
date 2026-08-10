import { cn } from "@/lib/utils";

const SEVERITY_STYLES = {
  CRITICAL: "bg-severity-critical-bg text-severity-critical",
  HIGH: "bg-severity-high-bg text-severity-high",
  MEDIUM: "bg-severity-medium-bg text-severity-medium",
  LOW: "bg-severity-low-bg text-severity-low",
} as const;

export function SeverityBadge({
  severity,
}: {
  severity: keyof typeof SEVERITY_STYLES;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        SEVERITY_STYLES[severity],
      )}
    >
      {severity}
    </span>
  );
}

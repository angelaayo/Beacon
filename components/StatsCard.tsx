import { cn } from "@/lib/utils";

type StatsCardProps = {
  label: string;
  value: number;
  severity?: "critical" | "high" | "medium" | "low";
};

const SEVERITY_BORDER = {
  critical: "border-l-severity-critical",
  high: "border-l-severity-high",
  medium: "border-l-severity-medium",
  low: "border-l-severity-low",
} as const;

const SEVERITY_TEXT = {
  critical: "text-severity-critical",
  high: "text-severity-high",
  medium: "text-severity-medium",
  low: "text-severity-low",
} as const;

const StatsCard = ({ label, value, severity }: StatsCardProps) => {
  return (
    <div
      className={cn(
        "border border-l-4 px-4 py-3 bg-card rounded-lg flex flex-col gap-1",
        severity ? SEVERITY_BORDER[severity] : "border-l-foreground",
      )}
    >
      <h5 className="font-jetbrains text-xs md:text-sm text-muted-foreground">{label}</h5>
      <h2 className={cn("font-bold text-3xl font-hanken", severity ? SEVERITY_TEXT[severity] : "text-foreground")}>
        {String(value).padStart(2, "0")}
      </h2>
    </div>
  );
};

export default StatsCard;
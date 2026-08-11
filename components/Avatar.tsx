import { cn } from "@/lib/utils";

const COLOR_MAP: Record<string, string> = {
  gray: "bg-muted text-muted-foreground",
  green: "bg-primary/15 text-primary",
  blue: "bg-status-investigating/15 text-status-investigating",
  amber: "bg-severity-medium/15 text-severity-medium",
  rose: "bg-severity-critical/15 text-severity-critical",
};

export function Avatar({
  name,
  color = "gray",
  size = "md",
}: {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeClasses = { sm: "size-7 text-xs", md: "size-9 text-sm", lg: "size-14 text-lg" };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold shrink-0",
        COLOR_MAP[color] ?? COLOR_MAP.gray,
        sizeClasses[size],
      )}
    >
      {initials}
    </div>
  );
}
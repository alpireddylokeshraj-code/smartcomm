import { cn } from "@/lib/utils";
import type { HealthStatus } from "@/lib/mock-data";

const config: Record<
  HealthStatus,
  { label: string; dot: string; text: string; bg: string }
> = {
  healthy: {
    label: "Healthy",
    dot: "bg-success",
    text: "text-success",
    bg: "bg-success/10",
  },
  degraded: {
    label: "Degraded",
    dot: "bg-warning",
    text: "text-warning",
    bg: "bg-warning/10",
  },
  down: {
    label: "Down",
    dot: "bg-destructive",
    text: "text-destructive",
    bg: "bg-destructive/10",
  },
};

export function HealthBadge({
  status,
  label,
  className,
}: {
  status: HealthStatus;
  label?: string;
  className?: string;
}) {
  const c = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        c.bg,
        c.text,
        className
      )}
    >
      <span className={cn("relative flex h-1.5 w-1.5")}>
        <span
          className={cn(
            "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
            c.dot
          )}
        />
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", c.dot)} />
      </span>
      {label ?? c.label}
    </span>
  );
}

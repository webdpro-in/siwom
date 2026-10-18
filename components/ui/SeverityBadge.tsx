import { CircleAlert, Info, OctagonAlert, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

export type Severity = "critical" | "high" | "medium" | "low";

export const severityMeta: Record<Severity, { label: string; rank: number }> = {
  critical: { label: "Critical", rank: 0 },
  high: { label: "High", rank: 1 },
  medium: { label: "Medium", rank: 2 },
  low: { label: "Low", rank: 3 },
};

const styles: Record<Severity, string> = {
  critical: "text-sev-critical border-sev-critical/50 bg-sev-critical/10",
  high: "text-sev-high border-sev-high/50 bg-sev-high/10",
  medium: "text-sev-medium border-sev-medium/50 bg-sev-medium/10",
  low: "text-sev-low border-sev-low/50 bg-sev-low/10",
};

const icons = { critical: OctagonAlert, high: TriangleAlert, medium: CircleAlert, low: Info } as const;

/** Icon + word + colour. Only for safety and exception UI. */
export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  const Icon = icons[severity];
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1 rounded-xs border px-1.5 font-mono text-pill uppercase tracking-pill",
        styles[severity],
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" strokeWidth={2} />
      {severityMeta[severity].label}
    </span>
  );
}

export const severityTextClass: Record<Severity, string> = {
  critical: "text-sev-critical",
  high: "text-sev-high",
  medium: "text-sev-medium",
  low: "text-sev-low",
};

export const severityStrokeClass: Record<Severity, string> = {
  critical: "stroke-sev-critical",
  high: "stroke-sev-high",
  medium: "stroke-sev-medium",
  low: "stroke-sev-low",
};

export const severityFillClass: Record<Severity, string> = {
  critical: "fill-sev-critical",
  high: "fill-sev-high",
  medium: "fill-sev-medium",
  low: "fill-sev-low",
};

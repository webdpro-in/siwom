import type { ReactNode } from "react";
import { Info, ShieldCheck, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

type CalloutVariant = "info" | "safety" | "warning";

const styles: Record<CalloutVariant, { box: string; icon: string; Icon: typeof Info; label: string }> = {
  info: { box: "border-border-strong bg-surface-2", icon: "text-sev-low", Icon: Info, label: "Note" },
  safety: { box: "border-accent/40 bg-surface-2", icon: "text-accent-text", Icon: ShieldCheck, label: "Safety note" },
  warning: { box: "border-sev-medium/50 bg-surface-2", icon: "text-sev-medium", Icon: TriangleAlert, label: "Warning" },
};

/** Info, safety disclaimer or warning. The safety variant sits directly under any detection demo. */
export function Callout({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const s = styles[variant];
  return (
    <div
      role="note"
      aria-label={title ?? s.label}
      className={cn("flex gap-3 rounded-card border p-4 sm:p-5", s.box, className)}
    >
      <s.Icon aria-hidden className={cn("mt-0.5 size-5 shrink-0", s.icon)} strokeWidth={1.5} />
      <div className="flex flex-col gap-1 text-small text-text-muted">
        {title ? <p className="font-medium text-text">{title}</p> : null}
        <div className="max-w-reading">{children}</div>
      </div>
    </div>
  );
}

/** Full-width banner carried by every demo. Not dismissable. */
export function DemoBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 border-b border-border-strong bg-surface-3 px-4 py-2 text-center font-mono text-pill uppercase tracking-pill text-text",
        className,
      )}
    >
      <Info aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
      <span>
        Illustrative demo data <span aria-hidden>—</span>
        <span className="sr-only">:</span> not connected to live operations
      </span>
    </div>
  );
}

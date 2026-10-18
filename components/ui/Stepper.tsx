import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Step = {
  title: string;
  description: ReactNode;
  /** Small tag shown above the title, e.g. "CURRENT FOCUS". */
  tag?: string;
  icon?: ReactNode;
  extra?: ReactNode;
};

/**
 * Horizontal on desktop, vertical on mobile. Used for the safety workflow
 * (Observe → Detect → Review → Respond → Improve) and the roadmap.
 * `current` highlights one step with a lime ring; later steps get quieter.
 */
export function Stepper({
  steps,
  current,
  fadeAfterCurrent = false,
  label,
  className,
  breakpoint = "lg",
}: {
  steps: Step[];
  current?: number;
  fadeAfterCurrent?: boolean;
  label: string;
  className?: string;
  breakpoint?: "md" | "lg";
}) {
  const horizontal = breakpoint === "lg" ? "lg:grid lg:grid-flow-col lg:auto-cols-fr lg:gap-6" : "md:grid md:grid-flow-col md:auto-cols-fr md:gap-5";
  return (
    <ol aria-label={label} className={cn("flex flex-col", horizontal, className)}>
      {steps.map((step, i) => {
        const isCurrent = current === i;
        const distance = current !== undefined && fadeAfterCurrent ? Math.max(0, i - current) : 0;
        const quiet = distance > 0 ? "step-future" : "";
        const last = i === steps.length - 1;
        return (
          <li
            key={step.title}
            aria-current={isCurrent ? "step" : undefined}
            className={cn("relative flex gap-4 pb-8", breakpoint === "lg" ? "lg:flex-col lg:pb-0" : "md:flex-col md:pb-0", quiet)}
          >
            {/* Connector */}
            {!last ? (
              <span
                aria-hidden
                className={cn(
                  "absolute left-5 top-11 bottom-0 w-px bg-border-strong",
                  breakpoint === "lg"
                    ? "lg:left-12 lg:right-0 lg:top-5 lg:bottom-auto lg:h-px lg:w-auto"
                    : "md:left-12 md:right-0 md:top-5 md:bottom-auto md:h-px md:w-auto",
                )}
              />
            ) : null}
            <span
              aria-hidden
              className={cn(
                "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border bg-bg font-mono text-small tabular",
                isCurrent ? "border-accent text-accent-text ring-4 ring-accent/15" : "border-border-strong text-text-muted",
              )}
            >
              {step.icon ?? String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-2 pt-1.5">
              {step.tag ? (
                <span
                  className={cn(
                    "font-mono text-pill uppercase tracking-pill",
                    isCurrent ? "text-accent-text" : "text-text-muted",
                  )}
                >
                  {step.tag}
                </span>
              ) : null}
              <h3 className="text-h3 text-text">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <div className="text-body text-text-muted">{step.description}</div>
              {step.extra}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

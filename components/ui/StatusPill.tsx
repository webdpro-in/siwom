"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/cn";
import { statusMeta, type Status } from "@/data/status";

const styles: Record<Status, string> = {
  "in-development": "border-accent text-accent-text",
  research: "border-border-control text-text",
  vision: "border-dashed border-border-control text-text-muted",
  demo: "border-border-strong bg-surface-3 text-text",
};

function Marker({ status }: { status: Status }) {
  switch (status) {
    case "in-development":
      return <span aria-hidden className="size-1.5 rounded-full bg-accent" />;
    case "research":
      return <span aria-hidden className="size-2 rounded-full border border-current" />;
    case "vision":
      return <span aria-hidden className="size-2 rounded-full border border-dashed border-current" />;
    case "demo":
      return <Info aria-hidden className="size-3.5" strokeWidth={1.75} />;
  }
}

type StatusPillProps = {
  status: Status;
  className?: string;
  /** Static pills (inside demo posters, legends) skip the tooltip button. */
  interactive?: boolean;
};

/**
 * One of the four status labels, identical everywhere. The pill is a button
 * so its one-sentence explanation is reachable by keyboard: it opens on hover
 * or focus, stays open while hovered, and Escape dismisses it.
 */
export function StatusPill({ status, className, interactive = true }: StatusPillProps) {
  const meta = statusMeta[status];
  const tooltipId = useId();
  const [open, setOpen] = useState(false);
  const [alignEnd, setAlignEnd] = useState(false);
  const tipRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!open || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const tipWidth = tipRef.current?.offsetWidth ?? 256;
    setAlignEnd(rect.left + tipWidth > window.innerWidth - 16);
  }, [open]);

  const pillClasses = cn(
    "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border px-2.5 font-mono text-pill uppercase tracking-pill whitespace-nowrap",
    styles[status],
    className,
  );

  if (!interactive) {
    return (
      <span className={pillClasses}>
        <Marker status={status} />
        {meta.label}
      </span>
    );
  }

  return (
    <span
      ref={wrapRef}
      className="relative z-10 inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(pillClasses, "cursor-help")}
        aria-describedby={tooltipId}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && open) {
            e.stopPropagation();
            setOpen(false);
          }
        }}
      >
        <Marker status={status} />
        {meta.label}
      </button>
      <span
        ref={tipRef}
        id={tooltipId}
        role="tooltip"
        className={
          open
            ? cn(
                "absolute top-full z-30 mt-2 block w-tooltip max-w-[calc(100vw-2rem)] rounded-control border border-border-strong bg-surface-2 p-3 text-small font-sans normal-case tracking-normal text-text shadow-float",
                alignEnd ? "right-0" : "left-0",
              )
            : "sr-only"
        }
      >
        {meta.meaning}
      </span>
    </span>
  );
}

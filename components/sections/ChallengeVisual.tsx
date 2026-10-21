"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FileSpreadsheet, Globe, Mail, MessageSquare, NotebookPen, PhoneMissed } from "lucide-react";
import { cn } from "@/lib/cn";

type Fragment = {
  id: string;
  Icon: typeof Mail;
  kind: string;
  text: string;
  /** Scattered position (percent of stage) and rotation. */
  x: number;
  y: number;
  r: number;
};

const fragments: Fragment[] = [
  { id: "sheet", Icon: FileSpreadsheet, kind: "Spreadsheet", text: "fleet_status_v7_FINAL.xlsx", x: 2, y: 6, r: -4 },
  { id: "call", Icon: PhoneMissed, kind: "Phone call", text: "3 missed calls · customs broker", x: 60, y: 2, r: 3 },
  { id: "chat", Icon: MessageSquare, kind: "Chat message", text: "Has the vessel berthed yet? Need a new ETA", x: 70, y: 40, r: -2 },
  { id: "paper", Icon: NotebookPen, kind: "Paper log", text: "Gate register · handwritten, 18/10", x: 4, y: 58, r: 3 },
  { id: "portal", Icon: Globe, kind: "Carrier portal", text: "Login 3 of 4 · status last updated yesterday", x: 34, y: 72, r: -3 },
  { id: "email", Icon: Mail, kind: "Email", text: "RE: RE: FW: revised berth window", x: 30, y: 30, r: 2 },
];

const rows = [
  { id: "INT-24-0425", text: "Berth delay at Mundra · rail cut-off at risk", tag: "High", tone: "text-sev-high" },
  { id: "INT-24-0418", text: "Customs query on classification · Chennai", tag: "Medium", tone: "text-sev-medium" },
  { id: "INT-24-0431", text: "Certificate of origin not yet issued", tag: "Low", tone: "text-sev-low" },
  { id: "INT-24-0412", text: "Ocean leg on schedule · Red Sea", tag: "On track", tone: "text-text" },
  { id: "INT-24-0437", text: "Air freight lands in Bengaluru tomorrow", tag: "On track", tone: "text-text" },
];

function FragmentCard({ f, className }: { f: Fragment; className?: string }) {
  return (
    <div className={cn("flex w-60 flex-col gap-1.5 rounded-card border border-border-strong bg-surface-2 p-3 shadow-float", className)}>
      <span className="inline-flex items-center gap-2 font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">
        <f.Icon aria-hidden className="size-4" strokeWidth={1.5} />
        {f.kind}
      </span>
      <span className="text-small text-text">{f.text}</span>
    </div>
  );
}

function UnifiedPanel({ className, animate, visible = true }: { className?: string; animate?: boolean; visible?: boolean }) {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-panel border border-border-strong bg-surface-1", className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">One operational view</span>
        <span className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Illustrative</span>
      </div>
      <ul className="divide-y divide-border">
        {rows.map((r, i) => (
          <li
            key={r.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              animate && "transition-[opacity,transform] duration-reveal ease-emphasis",
              animate && !visible && "translate-y-3 opacity-0",
            )}
            style={animate ? { transitionDelay: `calc(var(--motion-ui) + ${i} * var(--motion-stagger))` } : undefined}
          >
            <span className="w-28 shrink-0 font-mono text-small text-text">{r.id}</span>
            <span className="min-w-0 flex-1 truncate text-small text-text-muted">{r.text}</span>
            <span className={cn("font-mono text-pill uppercase tracking-pill", r.tone)}>{r.tag}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Segmented({ value, onChange }: { value: "today" | "unified"; onChange: (v: "today" | "unified") => void }) {
  const opts = [
    { v: "today" as const, label: "Today" },
    { v: "unified" as const, label: "With one view" },
  ];
  return (
    <div role="radiogroup" aria-label="Compare" className="inline-flex rounded-control border border-border-strong p-1">
      {opts.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={value === o.v}
          onClick={() => onChange(o.v)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              const next = value === "today" ? "unified" : "today";
              onChange(next);
              (e.currentTarget.parentElement?.querySelector(`[data-v="${next}"]`) as HTMLElement | null)?.focus();
            }
          }}
          tabIndex={value === o.v ? 0 : -1}
          data-v={o.v}
          className={cn(
            "h-10 rounded-xs px-4 text-small font-medium transition-colors duration-hover",
            value === o.v ? "bg-surface-3 text-text" : "text-text-muted hover:text-text",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * "Fragmented → unified". Desktop: six fragments scattered on the grid glide
 * into one panel as the section enters view (transform + opacity only).
 * Mobile: a two-state segmented control. Reduced motion: both states side by side.
 */
export function ChallengeVisual({ caption }: { caption: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [unified, setUnified] = useState(false);
  const [mobileState, setMobileState] = useState<"today" | "unified">("today");

  useEffect(() => {
    const el = stageRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setUnified(true);
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="flex flex-col gap-4">
      {/* Desktop, motion allowed */}
      <div
        ref={stageRef}
        aria-hidden
        className="relative hidden h-120 overflow-hidden rounded-panel border border-border bg-bg lg:block motion-reduce:lg:hidden"
        style={{ containerType: "size" }}
      >
        <div className="absolute inset-0 bg-grid" />
        {fragments.map((f, i) => (
          <div
            key={f.id}
            className="absolute transition-[transform,opacity] duration-reveal ease-emphasis"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              // Glide toward the panel centre (container units), shrink and fade.
              transform: unified
                ? `translate(calc(${50 - f.x}cqw - 50%), calc(${50 - f.y}cqh - 50%)) scale(0.55) rotate(0deg)`
                : `rotate(${f.r}deg)`,
              opacity: unified ? 0 : 1,
              transitionDelay: `calc(${i} * var(--motion-stagger))`,
            }}
          >
            <FragmentCard f={f} />
          </div>
        ))}
        <div
          className={cn(
            "absolute inset-x-0 top-1/2 mx-auto w-full max-w-xl -translate-y-1/2 transition-[opacity,transform] duration-reveal ease-emphasis",
            unified ? "scale-100 opacity-100" : "scale-95 opacity-0",
          )}
          style={{ transitionDelay: "var(--motion-ui)" }}
        >
          <UnifiedPanel animate visible={unified} />
        </div>
      </div>

      {/* Desktop, reduced motion: both states side by side */}
      <div aria-hidden className="hidden gap-6 motion-reduce:lg:grid lg:grid-cols-2">
        <div className="relative grid grid-cols-2 gap-3 rounded-panel border border-border bg-bg p-4">
          <span className="col-span-2 font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Today</span>
          {fragments.map((f) => (
            <FragmentCard key={f.id} f={f} className="w-auto shadow-none" />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">With one view</span>
          <UnifiedPanel />
        </div>
      </div>

      {/* Mobile and tablet: segmented control */}
      <div className="flex flex-col gap-4 lg:hidden">
        <Segmented value={mobileState} onChange={setMobileState} />
        <div aria-live="polite">
          {mobileState === "today" ? (
            <ul className="grid gap-3 sm:grid-cols-2" aria-label="Today: information is scattered">
              {fragments.map((f) => (
                <li key={f.id}>
                  <FragmentCard f={f} className="w-auto shadow-none" />
                </li>
              ))}
            </ul>
          ) : (
            <UnifiedPanel />
          )}
        </div>
      </div>
      <figcaption className="max-w-reading text-small text-text-muted">{caption}</figcaption>
    </figure>
  );
}

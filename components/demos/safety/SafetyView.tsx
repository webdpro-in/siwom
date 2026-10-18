import Image from "next/image";
import { ArrowUpRight, Ban, Camera, Check, ChevronDown, CircleDashed, Clock, Eye, EyeOff, MapPin, RotateCcw, ShieldAlert, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { DemoBanner } from "@/components/ui/Callout";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { Tabs } from "@/components/ui/Tabs";
import { FRAME, reviewStatusLabels, scenarios, type Detection, type ReviewStatus, type ScenarioId } from "@/data/demo/detections";
import { activeDetection, currentScenario, pendingCount, type ReviewAction, type SafetyState } from "./model";

export type SafetyActions = {
  setScenario: (id: ScenarioId) => void;
  select: (detectionId: string) => void;
  toggleDetections: () => void;
  review: (detectionId: string, action: ReviewAction) => void;
  dismissHint: () => void;
  reset: () => void;
};

const boxColour = {
  critical: "border-sev-critical",
  high: "border-sev-high",
  medium: "border-sev-medium",
  low: "border-sev-low",
} as const;
const chipColour = {
  critical: "bg-sev-critical",
  high: "bg-sev-high",
  medium: "bg-sev-medium",
  low: "bg-sev-low",
} as const;

const statusIcon: Record<ReviewStatus, typeof Clock> = {
  pending: CircleDashed,
  confirmed: ShieldAlert,
  dismissed: Ban,
  escalated: ArrowUpRight,
};

export function ReviewStatusTag({ status }: { status: ReviewStatus }) {
  const Icon = statusIcon[status];
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 font-mono text-pill uppercase tracking-pill",
        status === "pending" && "border-border-control border-dashed text-text",
        status === "confirmed" && "border-sev-high/60 text-sev-high",
        status === "dismissed" && "border-border-strong text-text-muted",
        status === "escalated" && "border-sev-critical/60 text-sev-critical",
      )}
    >
      <Icon aria-hidden className="size-3.5" strokeWidth={1.75} />
      {reviewStatusLabels[status]}
    </span>
  );
}

const pct = (n: number, of: number) => `${((n / of) * 100).toFixed(3)}%`;

function DetectionBox({
  d,
  active,
  onSelect,
}: {
  d: Detection;
  active: boolean;
  onSelect?: () => void;
}) {
  const labelBelow = d.box.y < 60;
  // Boxes in the right part of the frame anchor their label to the right edge
  // so it stays inside the frame; others extend rightward.
  const labelRight = d.box.x > FRAME.width * 0.6;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={`${d.id}: ${d.label}, ${d.severity} severity, ${d.confidence.toLowerCase()} confidence (illustrative)`}
      className={cn(
        "group absolute rounded-xs border-2 transition-shadow duration-hover focus-visible:outline-offset-4",
        boxColour[d.severity],
        active ? "shadow-glow" : "hover:bg-text/5",
      )}
      style={{ left: pct(d.box.x, FRAME.width), top: pct(d.box.y, FRAME.height), width: pct(d.box.w, FRAME.width), height: pct(d.box.h, FRAME.height) }}
    >
      <span
        aria-hidden
        className={cn(
          "absolute whitespace-nowrap rounded-xs px-1.5 py-0.5 font-mono text-pill uppercase tracking-pill text-severity-ink",
          labelRight ? "-right-0.5" : "-left-0.5",
          labelBelow ? "top-full mt-1" : "bottom-full mb-1",
          chipColour[d.severity],
        )}
      >
        {d.label}
      </span>
    </button>
  );
}

/**
 * The inspection demo as a pure function of state. The visitor plays the
 * qualified reviewer: AI flags, a person decides.
 */
export function SafetyView({
  state,
  actions,
  idBase = "sfy",
  loadingLabel,
  logOpen = false,
  onToggleLog,
}: {
  state: SafetyState;
  actions?: SafetyActions;
  idBase?: string;
  loadingLabel?: string;
  /** Incident log is always open on desktop and collapsed by default on mobile. */
  logOpen?: boolean;
  onToggleLog?: () => void;
}) {
  const scenario = currentScenario(state);
  const d = activeDetection(state);
  const status: ReviewStatus | null = d.reviewable ? (state.statuses[d.id] ?? "pending") : null;
  const pending = pendingCount(state);

  const log = (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-0 text-left text-small">
        <caption className="sr-only">Incident log, demo data, newest first</caption>
        <thead>
          <tr>
            {["Time", "Detection", "Action", "By"].map((h) => (
              <th key={h} scope="col" className="h-9 border-b border-border px-3 font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted first:pl-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {state.log.map((entry, i) => (
            <tr key={`${entry.detectionId}-${entry.time}-${i}`} className={cn(i === 0 && state.log.length > 2 && "bg-surface-2")}>
              <td className="h-10 whitespace-nowrap border-b border-border px-3 pl-4 font-mono text-text-muted">{entry.time}</td>
              <td className="border-b border-border px-3 text-text">
                <span className="font-mono">{entry.detectionId}</span> · {entry.label}
              </td>
              <td className="border-b border-border px-3 text-text">{entry.action}</td>
              <td className="border-b border-border px-3 text-text-muted">{entry.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="relative overflow-hidden rounded-panel border border-border-strong bg-bg" aria-busy={loadingLabel ? true : undefined}>
      <DemoBanner />
      <div className="flex flex-col gap-3 border-b border-border px-4 pt-3 pb-3 md:flex-row md:items-end md:justify-between md:pb-0">
        <Tabs<ScenarioId>
          label="Inspection scenarios"
          idBase={idBase}
          renderPanels={false}
          panelIdPrefix={`${idBase}-panel`}
          value={state.scenario}
          onValueChange={actions?.setScenario}
          variant="adaptive"
          className="-mx-4 md:mx-0"
          listClassName="px-4 md:px-0"
          items={scenarios.map((s, i) => ({ value: s.id, label: <><span className="max-md:hidden">{i + 1}. </span>{s.tab}</> }))}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 md:pb-2">
          <button
            type="button"
            role="switch"
            aria-checked={state.showDetections}
            onClick={actions?.toggleDetections}
            className="inline-flex h-10 items-center gap-2.5 whitespace-nowrap rounded-control px-2 text-small font-medium text-text hover:bg-surface-2"
          >
            <span
              aria-hidden
              className={cn(
                "relative h-5 w-9 rounded-full border transition-colors duration-micro",
                state.showDetections ? "border-accent bg-accent" : "border-border-control bg-surface-3",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 size-3.5 rounded-full transition-transform duration-micro motion-reduce:transition-none",
                  state.showDetections ? "translate-x-4.5 bg-accent-ink" : "translate-x-0.5 bg-text-muted",
                )}
              />
            </span>
            {state.showDetections ? <Eye aria-hidden className="size-4" /> : <EyeOff aria-hidden className="size-4" />}
            Show detections
          </button>
          <button
            type="button"
            onClick={actions?.reset}
            className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-control px-3 text-small font-medium text-text-muted hover:bg-surface-2 hover:text-text"
          >
            <RotateCcw aria-hidden className="size-4" strokeWidth={1.75} />
            Reset demo
          </button>
        </div>
      </div>

      {!state.hintDismissed || loadingLabel ? (
        <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2 py-1.5 pl-4 pr-2 text-small text-text">
          {loadingLabel ? (
            <span role="status" className="inline-flex items-center gap-2 text-text-muted">
              <span aria-hidden className="size-2 animate-skeleton rounded-full bg-text-muted" />
              {loadingLabel}
            </span>
          ) : (
            <span>
              <span className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Try </span>
              You are the reviewer. Pick a flagged detection, then confirm, dismiss or escalate it.
            </span>
          )}
          {!loadingLabel ? (
            <button
              type="button"
              onClick={actions?.dismissHint}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-control text-text-muted hover:bg-surface-3 hover:text-text"
            >
              <X aria-hidden className="size-4" />
              <span className="sr-only">Dismiss hint</span>
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 p-4 lg:grid-cols-12">
        {/* Viewer */}
        <div
          className="flex flex-col gap-3 lg:col-span-8"
          role="tabpanel"
          id={`${idBase}-panel-${state.scenario}`}
          aria-labelledby={`${idBase}-tab-${state.scenario}`}
        >
          <div className="relative aspect-video overflow-hidden rounded-card border border-border bg-surface-2">
            <Image
              src={scenario.image}
              alt={scenario.alt}
              fill
              sizes="(min-width: 1440px) 900px, (min-width: 1024px) 62vw, 100vw"
              placeholder="blur"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-2 whitespace-nowrap bg-scrim px-3 py-1.5 font-mono text-eyebrow uppercase tracking-eyebrow text-text">
              <span className="inline-flex items-center gap-1.5">
                <Camera aria-hidden className="size-3.5" /> {scenario.camera}
              </span>
              <span>
                {scenario.capturedAt} <span className="max-sm:hidden">· still</span> · demo
              </span>
            </div>
            {state.showDetections ? (
              <div className="absolute inset-0">
                {scenario.detections.map((det) => (
                  <DetectionBox key={det.id} d={det} active={det.id === d.id} onSelect={actions ? () => actions.select(det.id) : undefined} />
                ))}
              </div>
            ) : null}
          </div>
          <p className="text-small text-text-muted">{scenario.sceneNote}</p>
          {/* Text equivalent of the overlays */}
          <div>
            <h3 className="mb-2 font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted">
              Detections in this frame · illustrative
            </h3>
            <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {scenario.detections.map((det) => {
                const st = det.reviewable ? (state.statuses[det.id] ?? "pending") : null;
                return (
                  <li key={det.id}>
                    <button
                      type="button"
                      aria-pressed={det.id === d.id}
                      onClick={actions ? () => actions.select(det.id) : undefined}
                      className={cn(
                        "flex min-h-11 w-full items-center gap-2 rounded-control border px-3 py-1.5 text-left text-small sm:w-auto",
                        det.id === d.id ? "border-accent bg-surface-2 text-text" : "border-border text-text-muted hover:border-border-strong hover:text-text",
                      )}
                    >
                      <SeverityBadge severity={det.severity} />
                      <span>
                        <span className="font-mono">{det.id}</span> · {det.label} · {det.confidence} confidence
                        {st ? ` · ${reviewStatusLabels[st]}` : " · context only"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Alert panel */}
        <section aria-labelledby={`${idBase}-alert-title`} className="flex flex-col gap-4 rounded-card border border-border bg-surface-1 p-4 lg:col-span-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SeverityBadge severity={d.severity} />
            {status ? <ReviewStatusTag status={status} /> : <span className="font-mono text-pill uppercase tracking-pill text-text-muted">Context only</span>}
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">{d.type}</p>
            <h3 id={`${idBase}-alert-title`} className="text-h3 text-text">
              {d.label}
            </h3>
            <p className="text-small text-text-muted">{d.description}</p>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-small">
            <div>
              <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Location</dt>
              <dd className="mt-1 inline-flex items-center gap-1.5 text-text">
                <MapPin aria-hidden className="size-3.5 text-text-muted" />
                {scenario.location}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Camera</dt>
              <dd className="mt-1 font-mono text-text">{scenario.camera}</dd>
            </div>
            <div>
              <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Captured</dt>
              <dd className="mt-1 font-mono text-text">18 Oct 2026, {scenario.capturedAt}</dd>
            </div>
            <div>
              <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Confidence</dt>
              <dd className="mt-1 text-text">
                {d.confidence} <span className="text-text-muted">(illustrative)</span>
              </dd>
            </div>
          </dl>
          <div className="rounded-control border border-border bg-bg p-3">
            <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Recommended next step</p>
            <p className="mt-1 text-small text-text">{d.nextStep}</p>
          </div>
          {d.reviewable ? (
            <div className="flex flex-col gap-2">
              <p className="text-small text-text-muted">
                {status && status !== "pending"
                  ? `Reviewed at ${state.reviewedAt[d.id] ?? ""}. You can change the decision.`
                  : "A qualified reviewer decides. Choose one:"}
              </p>
              {(
                [
                  ["confirmed", "Confirm hazard", ShieldAlert],
                  ["dismissed", "Mark as false alarm", Ban],
                  ["escalated", "Escalate to supervisor", ArrowUpRight],
                ] as const
              ).map(([action, label, Icon]) => (
                <button
                  key={action}
                  type="button"
                  aria-pressed={status === action}
                  onClick={actions ? () => actions.review(d.id, action) : undefined}
                  className={cn(
                    "inline-flex min-h-11 w-full items-center gap-2 rounded-control border px-4 text-small font-medium transition-colors duration-hover",
                    status === action ? "border-accent bg-accent/10 text-text" : "border-border-strong text-text hover:border-text-muted hover:bg-surface-2",
                  )}
                >
                  <Icon aria-hidden className="size-4" strokeWidth={1.75} />
                  {label}
                  {status === action ? <Check aria-hidden className="ml-auto size-4 text-accent-text" /> : null}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-small text-text-muted">Context detections help the reviewer read the scene. They are not hazards to act on.</p>
          )}
          <p className="mt-auto border-t border-border pt-3 font-mono text-eyebrow text-text-muted">{pending} detections pending review · demo</p>
        </section>

        {/* Incident log */}
        <section aria-labelledby={`${idBase}-log-title`} className="rounded-card border border-border bg-surface-1 lg:col-span-12">
          <h3 id={`${idBase}-log-title`} className="font-sans text-small font-medium text-text">
            <button
              type="button"
              aria-expanded={logOpen}
              aria-controls={`${idBase}-log`}
              onClick={onToggleLog}
              className="flex min-h-12 w-full items-center justify-between gap-3 px-4 text-left md:pointer-events-none md:cursor-default"
            >
              <span>Incident log · {state.log.length} entries</span>
              <ChevronDown
                aria-hidden
                className={cn("size-5 text-text-muted transition-transform duration-ui motion-reduce:transition-none md:hidden", logOpen && "rotate-180")}
              />
            </button>
          </h3>
          <div id={`${idBase}-log`} className={cn("border-t border-border", !logOpen && "max-md:hidden")}>
            {log}
          </div>
        </section>
      </div>
    </div>
  );
}

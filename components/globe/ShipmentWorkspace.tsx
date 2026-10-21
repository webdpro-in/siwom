"use client";

import { useMemo, useState } from "react";
import {
  Anchor,
  CalendarCheck,
  Check,
  CircleAlert,
  Clock,
  FileCheck2,
  Handshake,
  Package,
  PackageCheck,
  Pause,
  Play,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/hooks";
import {
  dayLabel,
  docStatusLabels,
  industryLabels,
  internationalShipments,
  modeLabels,
  places,
  type DocStatus,
  type Industry,
  type InternationalShipment,
  type LegStatus,
  type Mode,
  type Step,
} from "@/data/demo/international";
import { DemoBanner } from "@/components/ui/Callout";
import { FilterChips } from "@/components/ui/FilterChips";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { EmptyState } from "@/components/ui/States";
import { Globe } from "./Globe";
import { ModeChain, ModeLegend, ShipmentStatusBadge, modeIcons, placeLabel } from "./parts";

const legStatusText: Record<LegStatus, string> = { done: "Completed", current: "In progress", upcoming: "Upcoming" };

const stepIcons: Record<Step["kind"], LucideIcon> = {
  booking: CalendarCheck,
  pickup: Package,
  terminal: Anchor,
  transport: Package,
  customs: FileCheck2,
  handoff: Handshake,
  delivery: PackageCheck,
};

const docIcons: Record<DocStatus, LucideIcon> = { ready: Check, pending: Clock, action: CircleAlert };

const industryOptions = (Object.keys(industryLabels) as Industry[]).map((value) => ({ value, label: industryLabels[value] }));
const modeOptions = (["ocean", "air", "rail"] as Mode[]).map((value) => ({ value, label: modeLabels[value] }));

function stepIcon(step: Step) {
  return step.kind === "transport" && step.mode ? modeIcons[step.mode] : stepIcons[step.kind];
}

/**
 * The international shipment workspace: filter the shipment list, follow the
 * selected shipment on the globe, check its documents and exceptions, and
 * read every leg and handoff from supplier to consignee, with who is
 * responsible for each. Illustrative demo data only.
 */
export function ShipmentWorkspace({
  product = "SIWOM Logistics",
  view = "International shipments",
}: {
  product?: string;
  view?: string;
}) {
  const reduced = useReducedMotion();
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [modes, setModes] = useState<Mode[]>([]);
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const [selected, setSelected] = useState(internationalShipments[0].ref);
  const [paused, setPaused] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const motion = !reduced && !paused;

  const needsAttention = (s: InternationalShipment) => Boolean(s.exception && !acknowledged.includes(s.exception.id));
  const visible = useMemo(
    () =>
      internationalShipments.filter(
        (s) =>
          (industries.length === 0 || industries.includes(s.industry)) &&
          (modes.length === 0 || s.legs.some((l) => modes.includes(l.mode))) &&
          (!attentionOnly || (s.exception && !acknowledged.includes(s.exception.id))),
      ),
    [industries, modes, attentionOnly, acknowledged],
  );
  const openCount = internationalShipments.filter(needsAttention).length;
  const shipment =
    visible.find((s) => s.ref === selected) ?? visible[0] ?? internationalShipments.find((s) => s.ref === selected) ?? internationalShipments[0];
  const filtered = industries.length > 0 || modes.length > 0 || attentionOnly;

  const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  function clearFilters() {
    setIndustries([]);
    setModes([]);
    setAttentionOnly(false);
  }
  function acknowledge(id: string, ref: string) {
    setAcknowledged((a) => (a.includes(id) ? a : [...a, id]));
    setAnnouncement(`Exception on ${ref} acknowledged.`);
  }

  const exception = shipment.exception;
  const exceptionOpen = exception && !acknowledged.includes(exception.id);

  return (
    <div className="overflow-hidden rounded-panel border border-border-strong bg-surface-1">
      <DemoBanner />
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <p className="text-small font-medium text-text">
          {product} <span className="text-text-muted">/ {view}</span>
        </p>
        <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">
          {internationalShipments.length} shipments · {openCount} need attention
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-border px-4 py-3">
        <FilterChips label="Industry" options={industryOptions} selected={industries} onToggle={(v) => setIndustries((x) => toggle(x, v))} onClear={() => setIndustries([])} />
        <FilterChips label="Mode" options={modeOptions} selected={modes} onToggle={(v) => setModes((x) => toggle(x, v))} onClear={() => setModes([])} />
        <button
          type="button"
          aria-pressed={attentionOnly}
          onClick={() => setAttentionOnly((v) => !v)}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-small transition-colors duration-hover",
            attentionOnly ? "border-accent bg-accent/10 text-text" : "border-border-strong text-text-muted hover:text-text",
          )}
        >
          <CircleAlert aria-hidden className="size-4" strokeWidth={1.75} />
          Needs attention · {openCount}
        </button>
        {filtered ? (
          <button type="button" onClick={clearFilters} className="inline-flex h-10 items-center text-small text-text-muted underline underline-offset-4 hover:text-text">
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="grid lg:grid-cols-12">
        {/* Shipment list */}
        <section aria-labelledby="intl-list-title" className="border-b border-border lg:col-span-4 lg:border-b-0 lg:border-r">
          <h3 id="intl-list-title" className="flex min-h-12 items-center border-b border-border px-4 font-sans text-small font-medium text-text">
            Shipments · {visible.length}
          </h3>
          {visible.length === 0 ? (
            <EmptyState
              className="m-4"
              title="No shipments match these filters"
              action={
                <button type="button" onClick={clearFilters} className="inline-flex h-10 items-center rounded-control border border-border-strong px-4 text-small font-medium text-text hover:bg-surface-2">
                  Clear filters
                </button>
              }
            />
          ) : (
            <ul className="divide-y divide-border">
              {visible.map((s) => {
                const on = s.ref === shipment.ref;
                return (
                  <li key={s.ref}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setSelected(s.ref)}
                      className={cn("relative flex w-full flex-col gap-1.5 px-4 py-3 text-left transition-colors duration-hover", on ? "bg-surface-2" : "hover:bg-surface-2")}
                    >
                      {on ? <span aria-hidden className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" /> : null}
                      <span className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 font-mono text-small text-text">
                          {s.ref}
                          {needsAttention(s) ? (
                            <CircleAlert aria-label="Needs attention" className="size-4 text-sev-high" strokeWidth={2} />
                          ) : null}
                        </span>
                        <ShipmentStatusBadge status={s.status} />
                      </span>
                      <span className="text-small text-text">
                        {places[s.origin].name} <span aria-hidden>→</span>
                        <span className="sr-only">to</span> {places[s.destination].name}
                      </span>
                      <span className="flex items-center justify-between gap-2">
                        <ModeChain shipment={s} />
                        <span className="font-mono text-eyebrow text-text-muted">
                          {industryLabels[s.industry]} · ETA {dayLabel(s.etaDay)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Globe */}
        <div className="flex flex-col items-center gap-4 border-b border-border p-4 sm:p-6 lg:col-span-5 lg:border-b-0 lg:border-r">
          <div className="w-full max-w-md">
            <Globe shipments={internationalShipments} selected={shipment.ref} motion={motion} />
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-3">
            <ModeLegend />
            {!reduced ? (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                className="inline-flex h-11 items-center gap-2 rounded-control px-3 text-small text-text-muted hover:bg-surface-2 hover:text-text"
              >
                {paused ? <Play aria-hidden className="size-4" strokeWidth={1.75} /> : <Pause aria-hidden className="size-4" strokeWidth={1.75} />}
                {paused ? "Play" : "Pause"}
                <span className="sr-only"> globe motion</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Shipment summary */}
        <section aria-labelledby="intl-summary-title" className="flex flex-col gap-4 p-4 sm:p-5 lg:col-span-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <h3 id="intl-summary-title" className="font-mono text-small font-normal text-text">
                {shipment.ref}
              </h3>
              <ShipmentStatusBadge status={shipment.status} />
            </div>
            <p className="text-body font-medium text-text">
              {placeLabel(shipment.origin)} <span aria-hidden>→</span>
              <span className="sr-only">to</span> {placeLabel(shipment.destination)}
            </p>
            <p className="text-small text-text-muted">
              {shipment.cargo} · {shipment.unit}
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-3 rounded-control border border-border p-3 text-small">
            <div>
              <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Delivery ETA</dt>
              <dd className="mt-1 font-mono text-text">{dayLabel(shipment.etaDay)}</dd>
            </div>
            <div>
              <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">{shipment.direction === "import" ? "Import" : "Export"}</dt>
              <dd className="mt-1 text-text">{industryLabels[shipment.industry]}</dd>
            </div>
            <div className="col-span-2">
              <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Status</dt>
              <dd className="mt-1 text-text">{shipment.statusDetail}</dd>
            </div>
          </dl>

          {exception ? (
            <div className={cn("flex flex-col gap-2 rounded-control border p-3", exceptionOpen ? "border-sev-high/50" : "border-border")}>
              <div className="flex items-center justify-between gap-2">
                <SeverityBadge severity={exception.severity} />
                {!exceptionOpen ? (
                  <span className="inline-flex items-center gap-1 text-small text-text-muted">
                    <Check aria-hidden className="size-4 text-accent-text" /> Acknowledged
                  </span>
                ) : null}
              </div>
              <p className="text-small font-medium text-text">{exception.title}</p>
              <p className="text-small text-text-muted">{exception.detail}</p>
              <div className="rounded-xs bg-surface-2 p-2.5">
                <p className="flex items-center gap-1.5 font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">
                  <Sparkles aria-hidden className="size-3.5 text-accent-text" strokeWidth={1.75} />
                  Suggested by SI · your team decides
                </p>
                <p className="mt-1 text-small text-text">{exception.nextStep}</p>
              </div>
              {exceptionOpen ? (
                <button
                  type="button"
                  onClick={() => acknowledge(exception.id, shipment.ref)}
                  className="inline-flex h-10 items-center justify-center rounded-control border border-border-strong px-4 text-small font-medium text-text hover:border-text-muted hover:bg-surface-2"
                >
                  Acknowledge
                </button>
              ) : null}
            </div>
          ) : null}

          <div>
            <h4 className="mb-2 font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted">Documents</h4>
            <ul className="flex flex-col gap-1.5">
              {shipment.documents.map((d) => {
                const Icon = docIcons[d.status];
                return (
                  <li key={d.name} className="flex items-center justify-between gap-3 text-small">
                    <span className="text-text">{d.name}</span>
                    <span className={cn("inline-flex shrink-0 items-center gap-1", d.status === "action" ? "text-sev-high" : "text-text-muted")}>
                      <Icon aria-hidden className={cn("size-3.5", d.status === "ready" && "text-accent-text")} strokeWidth={2} />
                      {docStatusLabels[d.status]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>

      {/* Journey: every leg and handoff, with who is responsible */}
      <section aria-labelledby="intl-journey-title" className="border-t border-border p-4 sm:p-5">
        <h3 id="intl-journey-title" className="mb-4 font-sans text-small font-medium text-text">
          Journey · supplier to consignee
        </h3>
        <ol aria-label={`Journey of ${shipment.ref}`} className="flex flex-col lg:grid lg:auto-cols-fr lg:grid-flow-col lg:gap-4">
          {shipment.steps.map((step, i) => {
            const Icon = stepIcon(step);
            const last = i === shipment.steps.length - 1;
            return (
              <li key={i} className="relative flex gap-3 pb-5 last:pb-0 lg:flex-col lg:gap-3 lg:pb-0">
                {!last ? (
                  <span aria-hidden className="absolute bottom-0 left-3.5 top-8 w-px bg-border-strong lg:bottom-auto lg:left-9 lg:right-0 lg:top-3.5 lg:h-px lg:w-auto" />
                ) : null}
                <span
                  aria-hidden
                  className={cn(
                    "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border",
                    step.status === "done" && "border-border-strong bg-surface-2 text-text",
                    step.status === "current" && "border-accent-text bg-surface-1 text-accent-text",
                    step.status === "upcoming" && "border-dashed border-border-control bg-surface-1 text-text-muted",
                  )}
                >
                  {step.status === "done" ? <Check className="size-3.5" strokeWidth={2.25} /> : <Icon className="size-3.5" strokeWidth={2} />}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className={cn("text-small font-medium", step.status === "upcoming" ? "text-text-muted" : "text-text")}>{step.label}</span>
                  <span className="text-small text-text-muted">
                    <span className="sr-only">{legStatusText[step.status]}. </span>
                    {step.party}
                  </span>
                  <span className="font-mono text-eyebrow text-text-muted">
                    {step.status === "current" ? "Since " : step.status === "upcoming" ? "Planned · " : ""}
                    {dayLabel(step.day)}
                    {step.note ? ` · ${step.note}` : ""}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </section>
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

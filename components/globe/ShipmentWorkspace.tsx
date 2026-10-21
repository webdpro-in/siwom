"use client";

import { useState } from "react";
import { Check, Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/hooks";
import { internationalShipments, modeLabels, places, SNAPSHOT_LABEL, type LegStatus } from "@/data/demo/international";
import { DemoBanner } from "@/components/ui/Callout";
import { Globe } from "./Globe";
import { ModeChain, ModeLegend, ShipmentStatusBadge, modeIcons, placeLabel } from "./parts";

const legStatusText: Record<LegStatus, string> = { done: "Completed", current: "In progress", upcoming: "Upcoming" };

/**
 * International shipments workspace: list, globe and journey for the selected
 * shipment, from origin pickup to final delivery. Illustrative demo data only.
 */
export function ShipmentWorkspace({
  product = "SIWOM Global Trade",
  view = "Shipment map",
}: {
  product?: string;
  view?: string;
}) {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState(internationalShipments[0].ref);
  const [paused, setPaused] = useState(false);
  const motion = !reduced && !paused;
  const shipment = internationalShipments.find((s) => s.ref === selected) ?? internationalShipments[0];

  return (
    <div className="overflow-hidden rounded-panel border border-border-strong bg-surface-1">
      <DemoBanner />
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <p className="text-small font-medium text-text">
          {product} <span className="text-text-muted">/ {view}</span>
        </p>
        <p className="font-mono text-eyebrow text-text-muted">{SNAPSHOT_LABEL}</p>
      </div>

      <div className="grid lg:grid-cols-12">
        {/* Shipment list */}
        <section aria-labelledby="intl-list-title" className="border-b border-border lg:col-span-4 lg:border-b-0 lg:border-r">
          <h3 id="intl-list-title" className="flex min-h-12 items-center border-b border-border px-4 font-sans text-small font-medium text-text">
            Shipments · {internationalShipments.length}
          </h3>
          <ul className="divide-y divide-border">
            {internationalShipments.map((s) => {
              const on = s.ref === selected;
              return (
                <li key={s.ref}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSelected(s.ref)}
                    className={cn(
                      "relative flex w-full flex-col gap-1.5 px-4 py-3 text-left transition-colors duration-hover",
                      on ? "bg-surface-2" : "hover:bg-surface-2",
                    )}
                  >
                    {on ? <span aria-hidden className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" /> : null}
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-mono text-small text-text">{s.ref}</span>
                      <ShipmentStatusBadge status={s.status} />
                    </span>
                    <span className="text-small text-text">
                      {places[s.origin].name} <span aria-hidden>→</span>
                      <span className="sr-only">to</span> {places[s.destination].name}
                    </span>
                    <span className="flex items-center justify-between gap-2">
                      <ModeChain shipment={s} />
                      <span className="font-mono text-eyebrow text-text-muted">ETA {s.eta}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
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

        {/* Journey */}
        <section aria-labelledby="intl-journey-title" aria-live="polite" className="flex flex-col gap-4 p-4 sm:p-5 lg:col-span-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <h3 id="intl-journey-title" className="font-mono text-small font-normal text-text">
                {shipment.ref}
              </h3>
              <ShipmentStatusBadge status={shipment.status} />
            </div>
            <p className="text-body font-medium text-text">
              {placeLabel(shipment.origin)} <span aria-hidden>→</span>
              <span className="sr-only">to</span> {placeLabel(shipment.destination)}
            </p>
            <p className="text-small text-text-muted">
              {shipment.cargo} · {shipment.unit} · {shipment.direction === "import" ? "Import" : "Export"}
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-3 rounded-control border border-border p-3 text-small">
            <div>
              <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">ETA</dt>
              <dd className="mt-1 font-mono text-text">{shipment.eta}</dd>
            </div>
            <div>
              <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Status</dt>
              <dd className="mt-1 text-text">{shipment.statusDetail}</dd>
            </div>
          </dl>
          <ol aria-label={`Journey of ${shipment.ref}`} className="flex flex-col">
            {shipment.legs.map((leg, i) => {
              const Icon = modeIcons[leg.mode];
              const last = i === shipment.legs.length - 1;
              return (
                <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
                  {!last ? <span aria-hidden className="absolute bottom-0 left-3.5 top-8 w-px bg-border-strong" /> : null}
                  <span
                    aria-hidden
                    className={cn(
                      "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border",
                      leg.status === "done" && "border-border-strong bg-surface-2 text-text",
                      leg.status === "current" && "border-accent-text bg-surface-1 text-accent-text",
                      leg.status === "upcoming" && "border-dashed border-border-control bg-surface-1 text-text-muted",
                    )}
                  >
                    {leg.status === "done" ? <Check className="size-3.5" strokeWidth={2.25} /> : <Icon className="size-3.5" strokeWidth={2} />}
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-small font-medium text-text">
                      {modeLabels[leg.mode]}: {places[leg.from].name} → {places[leg.to].name}
                    </span>
                    <span className="text-small text-text-muted">
                      <span className="sr-only">{legStatusText[leg.status]}. </span>
                      {leg.when}
                      {leg.note ? ` · ${leg.note}` : ""}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
      <p className="border-t border-border px-4 py-3 text-small text-text-muted">
        Sample shipments between real ports. Ocean routes follow the main sea lanes through the Suez Canal and the
        Strait of Malacca.
      </p>
    </div>
  );
}

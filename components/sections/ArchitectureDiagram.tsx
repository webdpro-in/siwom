import { Fragment } from "react";
import { cn } from "@/lib/cn";

type Item = { label: string };
type Column = { title: string; items: Item[] };

/** The four layers of the SIWOM platform, from data sources to people. */
export const architecture: Column[] = [
  {
    title: "Data sources",
    items: [
      { label: "Carrier and forwarder systems" },
      { label: "Port, airport and terminal milestones" },
      { label: "Customs and trade documents" },
      { label: "Telematics and sensors" },
      { label: "Cameras and inspection images" },
    ],
  },
  {
    title: "SIWOM platform",
    items: [
      { label: "One shipment record" },
      { label: "Maps, routes and positions" },
      { label: "Event processing" },
      { label: "Workflow and permissions" },
    ],
  },
  {
    title: "SIWOM Intelligence (SI)",
    items: [
      { label: "ETA prediction and route options" },
      { label: "Exception ranking and next steps" },
      { label: "Document checks" },
      { label: "Computer vision for safety" },
      { label: "Supplier matching" },
    ],
  },
  {
    title: "People and connected systems",
    items: [
      { label: "Operator workspace" },
      { label: "Alerts and exception queues" },
      { label: "Reports and audit trails" },
      { label: "Updates to partners" },
    ],
  },
];

function Connector({ index }: { index: number }) {
  return (
    <div aria-hidden className="flex items-center justify-center py-2 lg:py-0" style={{ "--i": index } as React.CSSProperties}>
      {/* Horizontal on desktop */}
      <svg viewBox="0 0 48 12" className="hidden h-3 w-12 overflow-visible lg:block">
        <line x1="0" y1="6" x2="44" y2="6" className="stroke-accent" strokeWidth="1" pathLength={100} />
        <line x1="0" y1="6" x2="44" y2="6" className="arch-pulse stroke-accent motion-reduce:hidden" strokeWidth="3" pathLength={100} strokeLinecap="round" />
        <path d="M40 2 L46 6 L40 10" fill="none" className="stroke-accent" strokeWidth="1.25" />
      </svg>
      {/* Vertical on mobile */}
      <svg viewBox="0 0 12 40" className="h-10 w-3 overflow-visible lg:hidden">
        <line x1="6" y1="0" x2="6" y2="36" className="stroke-accent" strokeWidth="1" pathLength={100} />
        <line x1="6" y1="0" x2="6" y2="36" className="arch-pulse stroke-accent motion-reduce:hidden" strokeWidth="3" pathLength={100} strokeLinecap="round" />
        <path d="M2 32 L6 38 L10 32" fill="none" className="stroke-accent" strokeWidth="1.25" />
      </svg>
    </div>
  );
}

/**
 * Four-column flow: data sources → platform → intelligence → people and
 * systems. Boxes are HTML so text stays legible at every size; connectors are
 * SVG and pulse once, left to right, when the diagram is revealed.
 */
export function ArchitectureDiagram({ className, headingLevel: H = "h3" }: { className?: string; headingLevel?: "h3" | "h4" }) {
  return (
    <div data-reveal className={className}>
      <p className="sr-only">
        Diagram: data from fleet and shipment systems, cameras, sensors, warehouse and port systems and external APIs
        flows into the SIWOM platform, then an intelligence layer, and ends with people making decisions through
        dashboards, alerts, reports and approved integrations.
      </p>
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_3rem_1fr_3rem_1fr_3rem_1fr] lg:items-stretch">
        {architecture.map((col, i) => (
          <Fragment key={col.title}>
            <div
              className={cn(
                "flex flex-col gap-3 rounded-panel border border-border bg-surface-1 p-4",
                i === architecture.length - 1 && "border-border-strong",
              )}
            >
              <H className="font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted">
                <span className="text-accent-text">{String(i + 1).padStart(2, "0")}</span> {col.title}
              </H>
              <ul className="flex flex-col gap-2">
                {col.items.map((item) => (
                  <li
                    key={item.label}
                    className={cn(
                      "rounded-control border px-3 py-2.5 text-small",
                      "border-border-strong bg-surface-2 text-text",
                    )}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
            {i < architecture.length - 1 ? <Connector index={i} /> : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

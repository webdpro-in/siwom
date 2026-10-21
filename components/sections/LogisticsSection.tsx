import { Eye, ListOrdered, Route, Siren } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { LogisticsDemoSection } from "@/components/demos/Demos";
import { ShipmentWorkspaceLazy } from "@/components/globe/ShipmentWorkspaceLazy";

/** Only what the demo below actually shows. */
const callouts = [
  { Icon: Eye, title: "Shipment visibility", text: "Every consignment with its current leg and its planned and current ETA, in one list and one map." },
  { Icon: Siren, title: "Exceptions first", text: "Delays sorted by severity, each with its cause and a suggested next step. Your team decides." },
  { Icon: Route, title: "Dispatch", text: "Match waiting loads with available vehicles from one queue. A person confirms every assignment." },
  { Icon: ListOrdered, title: "Milestone timeline", text: "Booked, picked up, at hub, out for delivery: each handoff with its time, in one record." },
];

export function LogisticsSection() {
  return (
    <section id="demo" aria-labelledby="logistics-title" className="section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div data-reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="logistics-title"
            eyebrow="02 — What SIWOM Logistics does"
            badge={<StatusPill status="in-development" />}
            title="One shared record for every shipment."
            intro="SIWOM Logistics brings shipments, vehicles, documents and exceptions into one workspace, from pickup in the origin country to final delivery. Select a shipment below to follow its route."
          />
          <Button href="/logistics" variant="secondary" icon="arrow" className="shrink-0" trackAs="home_logistics_os">
            See all features
          </Button>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {callouts.map(({ Icon, title, text }, i) => (
            <li key={title} data-reveal style={{ "--reveal-i": i } as React.CSSProperties} className="flex flex-col gap-2 border-t border-border pt-5">
              <span className="inline-flex items-center gap-2 text-body font-medium text-text">
                <Icon aria-hidden className="size-5 text-text-muted" strokeWidth={1.5} />
                {title}
              </span>
              <p className="text-body text-text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto mt-10 max-w-wide gutter-x">
        <ShipmentWorkspaceLazy product="SIWOM Logistics" view="International shipments" />
      </div>
      <div className="mx-auto mt-16 max-w-content gutter-x">
        <h3 className="text-h3 text-text">Dispatch and exceptions</h3>
        <p className="mt-2 max-w-reading text-body text-text-muted">
          Filter shipments, open a delayed one, acknowledge an exception or assign a vehicle.
        </p>
      </div>
      <div className="mx-auto mt-6 max-w-wide gutter-x">
        <LogisticsDemoSection idBase="home-lgx" />
      </div>
    </section>
  );
}

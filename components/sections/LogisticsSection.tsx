import InternationalWorkspace from "@/components/demos/logistics/InternationalWorkspace";
import { Eye, Route, Siren } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { StatusLegend } from "@/components/layout/StatusLegend";
import { LogisticsDemoSection } from "@/components/demos/Demos";

import { TransportSummary } from "./TransportExplorer";

const callouts = [
  { Icon: Eye, title: "Visibility", text: "Shipments, vehicles and hubs on one schematic map and table." },
  { Icon: Route, title: "Dispatch", text: "Match waiting loads with available vehicles from one queue." },
  { Icon: Siren, title: "Exceptions", text: "Delays sorted by severity, each with a suggested next step." },
];

export function LogisticsSection() {
  return (
    <section aria-labelledby="logistics-title" className="section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div data-reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="logistics-title"
            eyebrow="02 — SIWOM Stream, our Logistics OS"
            badge={<StatusPill status="in-development" />}
            title="The operational layer connecting logistics."
            intro="SIWOM Stream is in development: a shared workspace to discover logistics providers, plan multimodal journeys, compare options and coordinate the handoffs between international freight and local delivery."
          />
          <Button href="/logistics-os" variant="secondary" icon="arrow" className="shrink-0" trackAs="home_explore_platform">
            Explore the platform
          </Button>
        </div>
        <div className="mt-10"><InternationalWorkspace /></div>
        <TransportSummary />
        <StatusLegend className="mt-10" />
      </div>
      <div className="mx-auto mt-8 max-w-wide gutter-x">
        <div className="mx-auto mb-6 max-w-content"><p className="mb-2 font-mono text-eyebrow uppercase tracking-eyebrow text-accent-text">The local operations layer</p><h3 className="text-h3 text-text">From the terminal to the final mile.</h3><p className="mt-3 max-w-reading text-small text-text-muted">Explore the existing dispatch, shipment and exception demo. All routes and movements are schematic sample data.</p></div>
        <LogisticsDemoSection idBase="home-lgx" />
      </div>
      <div className="mx-auto mt-10 max-w-content gutter-x">
        <ul className="grid gap-6 md:grid-cols-3">
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
    </section>
  );
}

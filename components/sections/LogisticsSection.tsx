import { Eye, FileCheck2, ListOrdered, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ShipmentWorkspaceLazy } from "@/components/globe/ShipmentWorkspaceLazy";

/** What the workspace below shows. */
const callouts = [
  { Icon: Eye, title: "Every leg in one view", text: "Ocean, air, rail and road legs on one route, with the shipment's position and ETA." },
  { Icon: Sparkles, title: "Exceptions first, with SI", text: "SIWOM Intelligence ranks delays by urgency and suggests a next step. Your team decides." },
  { Icon: FileCheck2, title: "Documents and handoffs", text: "See which documents are ready, pending or need action before cargo reaches the port." },
  { Icon: ListOrdered, title: "Who has the shipment", text: "Every milestone shows the responsible party, from origin forwarder to local partner." },
];

/** Section 02: the product experience, led by the international shipment workspace. */
export function LogisticsSection() {
  return (
    <section id="platform" aria-labelledby="logistics-title" className="section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div data-reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="logistics-title"
            eyebrow="02 — The platform"
            title="Every leg, every handoff, one view."
            intro="Select a shipment to follow its route, check its documents and act on its exceptions, from pickup in the origin country to delivery at the consignee."
          />
          <Button href="/logistics" variant="secondary" icon="arrow" className="shrink-0" trackAs="home_logistics">
            Explore SIWOM Logistics
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
      <div id="demo" className="mx-auto mt-10 max-w-wide gutter-x">
        <ShipmentWorkspaceLazy product="SIWOM Logistics" view="International shipments" />
      </div>
    </section>
  );
}

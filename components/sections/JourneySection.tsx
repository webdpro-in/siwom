import { Anchor, Factory, FileCheck2, Handshake, PackageCheck, Ship, Truck } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * The international shipment model SIWOM coordinates. SIWOM does not move the
 * cargo: carriers, terminals, customs brokers and local partners perform their
 * own services; SIWOM keeps every party working from the same record.
 */
const stages = [
  { Icon: Factory, title: "Supplier", text: "Goods packed; invoice and packing list prepared.", party: "Shipper" },
  { Icon: Truck, title: "Origin pickup", text: "Collected and moved to the port or airport.", party: "Origin forwarder" },
  { Icon: Anchor, title: "Origin port or airport", text: "Export clearance, gate-in and loading.", party: "Terminal · customs broker" },
  { Icon: Ship, title: "International freight", text: "Ocean or air freight between countries.", party: "Ocean carrier or airline" },
  { Icon: Anchor, title: "Destination port or airport", text: "Discharge, or arrival at the cargo terminal.", party: "Destination terminal" },
  { Icon: FileCheck2, title: "Customs and release", text: "Import clearance and release from the terminal.", party: "Customs broker" },
  { Icon: Handshake, title: "Local logistics partner", text: "Inland road or rail to the destination city.", party: "Inland transport partner" },
  { Icon: PackageCheck, title: "Consignee", text: "Delivery and proof of delivery.", party: "Consignee" },
];

const example = ["Eindhoven, Netherlands", "Rotterdam", "Ocean freight", "Nhava Sheva, India", "Inland partner", "Pune"];

/** Section 03: how an international shipment moves, and who is responsible at each step. */
export function JourneySection({ eyebrow = "03 — International logistics" }: { eyebrow?: string }) {
  return (
    <section id="journey" aria-labelledby="journey-title" className="border-y border-border bg-surface-1 section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div data-reveal className="mb-12">
          <SectionHeader
            id="journey-title"
            eyebrow={eyebrow}
            title="How an international shipment moves."
            intro="Eight stages and at least five organisations. SIWOM keeps them working from one record: it records each milestone, checks the documents and tells the next party what is coming."
          />
        </div>
        <ol className="grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {stages.map(({ Icon, title, text, party }, i) => (
            <li key={title} className="flex flex-col gap-3 bg-bg p-5">
              <div className="flex items-center justify-between">
                <Icon aria-hidden className="size-5 text-accent-text" strokeWidth={1.5} />
                <span className="font-mono text-eyebrow text-text-muted">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="font-display text-body-l font-medium text-text">{title}</h3>
              <p className="text-small text-text-muted">{text}</p>
              <p className="mt-auto border-t border-border pt-3 text-small text-text">
                <span className="text-text-muted">Performed by </span>
                {party}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-small text-text">
            <span className="font-sans text-text-muted">Example:</span>
            {example.map((e, i) => (
              <span key={e} className="inline-flex items-center gap-2">
                {i > 0 ? <span aria-hidden className="text-text-muted">→</span> : null}
                {e}
              </span>
            ))}
          </p>
          <p className="max-w-md text-small text-text-muted">
            The legs change with each shipment: other ports, airports, countries and modes work the same way.
          </p>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Item = { name: string; text: string; href: string };

/**
 * Section 06: the product hierarchy. SIWOM Logistics is the current product;
 * Global Trade and Safety are in research and development; the rest are
 * long-term directions.
 */
const groups: { title: string; intro: string; items: Item[] }[] = [
  {
    title: "Now",
    intro: "The current product.",
    items: [
      { name: "SIWOM Logistics", text: "Shipment coordination for freight forwarders, transporters and warehouse operators.", href: "/logistics" },
    ],
  },
  {
    title: "Research and development",
    intro: "Being built and validated with partners.",
    items: [
      { name: "SIWOM Global Trade", text: "Supplier discovery, international sourcing, trade intelligence and shipment-linked compliance.", href: "/global-trade" },
      { name: "SIWOM Safety", text: "Human-reviewed computer vision for industrial hazard flagging.", href: "/safety" },
    ],
  },
  {
    title: "Long-term direction",
    intro: "Where the platform is headed.",
    items: [
      { name: "Space and aerospace", text: "Logistics and intelligence for satellite and launch supply chains.", href: "/vision#space" },
      { name: "Robotics and automation", text: "Physical-world automation in warehouses, ports and factories.", href: "/vision#autonomy" },
      { name: "Autonomous mobility", text: "Vehicle software and connected, autonomous mobility.", href: "/vision#mobility" },
      { name: "Energy and infrastructure", text: "Intelligence for energy systems and industrial infrastructure.", href: "/vision#energy" },
    ],
  },
];

export function HomeRoadmapSection() {
  return (
    <section aria-labelledby="roadmap-title" className="border-t border-border section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div data-reveal className="mb-12">
          <SectionHeader
            id="roadmap-title"
            eyebrow="06 — Roadmap"
            title="Start with logistics. Build the intelligence layer."
            intro="Each step builds on the data, the platform and the trust earned by the one before it."
          />
        </div>
        <div className="grid gap-px overflow-hidden rounded-card border border-border bg-border lg:grid-cols-3">
          {groups.map((g) => (
            <section key={g.title} aria-labelledby={`rm-${g.title}`} className="flex flex-col gap-5 bg-bg p-6">
              <div>
                <h3 id={`rm-${g.title}`} className="font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-accent-text">
                  {g.title}
                </h3>
                <p className="mt-1 text-small text-text-muted">{g.intro}</p>
              </div>
              <ul className="flex flex-col divide-y divide-border">
                {g.items.map((item) => (
                  <li key={item.name} className="py-4 first:pt-0 last:pb-0">
                    <Link href={item.href} className="group flex items-start justify-between gap-4">
                      <span className="flex flex-col gap-1">
                        <span className="font-display text-body-l font-medium text-text">{item.name}</span>
                        <span className="text-small text-text-muted">{item.text}</span>
                      </span>
                      <ArrowRight aria-hidden className="mt-1 size-4 shrink-0 text-text-muted transition-transform duration-hover group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0" strokeWidth={1.5} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { ArrowDown, ArrowRight, ArrowUpRight, Globe2, Handshake, PackageCheck, Ship, Plane, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { contactHref } from "@/data/navigation";

const modes = [
  { name: "Ocean freight", number: "01", image: "water-container.webp", alt: "Container vessel and ship-to-shore cranes at a terminal.", text: "Connect shipping networks to ports, inland terminals and the next carrier.", Icon: Ship },
  { name: "Air freight", number: "02", image: "air-cargo.webp", alt: "Dedicated cargo aircraft on an airport apron at night.", text: "Coordinate international air cargo, airport handoffs and local delivery.", Icon: Plane },
  { name: "Land freight", number: "03", image: "road-sunset.webp", alt: "Road freight truck travelling at sunset.", text: "Bring road, rail, cross-border movements and the final mile into the same plan.", Icon: Truck },
];

export function GlobalNetwork() {
  return (
    <section aria-labelledby="global-network-title" className="section-y border-b border-border">
      <div className="mx-auto max-w-content gutter-x">
        <div className="mb-10 grid gap-6 lg:grid-cols-2 lg:items-end">
          <div><p className="mb-4 font-mono text-eyebrow uppercase tracking-eyebrow text-accent-text">International ambition. Local understanding.</p><h2 id="global-network-title" className="max-w-headline text-h2 text-text">The world moves through connections.</h2></div>
          <p className="max-w-reading text-body-l text-text-muted">A global journey depends on local expertise. SIWOM’s platform vision brings international freight networks and local logistics businesses into one shared operational picture.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {modes.map(({name,number,image,alt,text,Icon}) => (
            <a href="/logistics-os#transport" key={name} className="mode-photo-card group overflow-hidden rounded-card border border-border bg-surface-1">
              <div className="relative aspect-card overflow-hidden"><Image src={`/images/${image}`} alt={alt} fill sizes="(min-width: 1024px) 400px, (min-width: 768px) 32vw, 100vw" className="object-cover" /><span className="photo-surface absolute top-4 left-4 flex size-10 items-center justify-center rounded-full border border-border bg-scrim font-mono text-small text-text">{number}</span></div>
              <div className="p-6"><div className="mb-3 flex items-center justify-between gap-4"><h3 className="flex items-center gap-3 text-h3 text-text"><Icon aria-hidden className="size-5 text-accent-text" strokeWidth={1.5}/>{name}</h3><ArrowUpRight aria-hidden className="size-5 text-text-muted" /></div><p className="text-small text-text-muted">{text}</p></div>
            </a>
          ))}
        </div>
        <div className="mt-12 grid items-start gap-4 rounded-panel border border-border bg-surface-1 p-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-8 md:p-8">
          <div><Globe2 aria-hidden className="mb-4 size-6 text-accent-text" strokeWidth={1.5}/><h3 className="mb-2 text-body-l text-text">International origin</h3><p className="text-small text-text-muted">Supplier → origin carrier → ocean, air or land freight.</p></div>
          <span aria-hidden className="text-text-muted"><ArrowRight className="hidden size-5 md:mt-12 md:block"/><ArrowDown className="size-5 md:hidden"/></span>
          <div><Handshake aria-hidden className="mb-4 size-6 text-accent-text" strokeWidth={1.5}/><h3 className="mb-2 text-body-l text-text">The local connection</h3><p className="text-small text-text-muted">Port, airport or inland terminal → document handoff → local logistics partner.</p></div>
          <span aria-hidden className="text-text-muted"><ArrowRight className="hidden size-5 md:mt-12 md:block"/><ArrowDown className="size-5 md:hidden"/></span>
          <div><PackageCheck aria-hidden className="mb-4 size-6 text-accent-text" strokeWidth={1.5}/><h3 className="mb-2 text-body-l text-text">Final destination</h3><p className="text-small text-text-muted">Warehouse, business or doorstep, with context carried through every handoff.</p></div>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"><p className="max-w-reading text-small text-text-muted">Transport providers remain responsible for their services. SIWOM is developing coordination software; carrier discovery, customs integrations and live tracking are not connected yet.</p><Button href={contactHref({interest:"partnership"})} variant="secondary" icon="arrow">Become a partner</Button></div>
      </div>
    </section>
  );
}

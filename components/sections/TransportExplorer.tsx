import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Ship, Plane, Truck, TrainFront, Pipette, Package, Warehouse, Anchor } from "lucide-react";
import { transportModes } from "@/data/transport";
import { Tabs } from "@/components/ui/Tabs";
import { StatusPill } from "@/components/ui/StatusPill";

const icons = { water: Ship, air: Plane, road: Truck, rail: TrainFront, pipeline: Pipette };

export function TransportSummary() {
  return (
    <div className="mt-16 border-t border-border pt-10">
      <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-3 font-mono text-eyebrow uppercase tracking-eyebrow text-accent-text">One network. Many ways to move.</p>
          <h3 className="max-w-xl text-h3 text-text">Built around the connections that keep industry moving.</h3>
        </div>
        <Link href="/logistics-os#transport" className="inline-flex items-center gap-3 text-small text-text">Explore every mode <ArrowUpRight aria-hidden className="size-5" /></Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {transportModes.map((mode) => {
          const Icon = icons[mode.id];
          return (
            <Link href={`/logistics-os#transport`} key={mode.id} className="mode-photo-card group overflow-hidden rounded-card border border-border bg-surface-1" aria-label={`Explore ${mode.label.toLowerCase()} transport`}>
              <div className="relative aspect-card overflow-hidden">
                <Image src={`/images/${mode.image}`} alt={mode.alt} fill sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 46vw" className="object-cover" />
              </div>
              <div className="flex items-center justify-between gap-2 px-4 py-4"><span className="flex items-center gap-2 text-small text-text"><Icon aria-hidden className="size-4 text-accent-text" />{mode.label}</span><ArrowUpRight aria-hidden className="size-4 text-text-muted" /></div>
            </Link>
          );
        })}
      </div>
      <p className="mt-4 text-small text-text-muted">Our connected logistics vision. Current demonstrations use fictional data; multimodal integrations are planned.</p>
    </div>
  );
}

export function TransportExplorer() {
  return (
    <section id="transport" aria-labelledby="transport-title" className="border-y border-border bg-surface-1 section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div className="mb-10 grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3"><p className="font-mono text-eyebrow uppercase tracking-eyebrow text-accent-text">Connected by design</p><StatusPill status="vision" /></div>
            <h2 id="transport-title" className="max-w-headline text-h2 text-text">One connected view of the world’s logistics networks.</h2>
          </div>
          <p className="text-body-l text-text-muted">From oceans and rivers to air freight, roads, railways and pipelines, we’re building software to help teams coordinate operations, improve visibility and manage exceptions across connected supply chains.</p>
        </div>
        <Tabs
          idBase="transport"
          label="Explore transport modes"
          fullWidth
          listClassName="transport-tablist"
          panelClassName="pt-8"
          items={transportModes.map((mode) => {
            const Icon = icons[mode.id];
            return {
              value: mode.id,
              label: mode.label,
              icon: <Icon aria-hidden className="size-5" strokeWidth={1.5} />,
              content: (
                <div>
                  <div className="grid overflow-hidden rounded-panel border border-border lg:grid-cols-2">
                    <div className="transport-photo relative">
                      <Image src={`/images/${mode.image}`} alt={mode.alt} fill sizes="(min-width: 1024px) 620px, 100vw" className="object-cover" />
                      <span className="photo-surface absolute bottom-4 left-4 rounded-control bg-scrim px-3 py-2 font-mono text-eyebrow uppercase tracking-eyebrow text-text">{mode.number} / {mode.label} transport</span>
                    </div>
                    <div className="flex flex-col justify-center gap-5 bg-bg p-6 md:p-10">
                      <h3 className="text-h2 text-text">{mode.title}</h3>
                      <p className="text-body-l text-text-muted">{mode.description}</p>
                      <div className="mt-2 border-t border-border pt-5">
                        <p className="mb-2 font-mono text-eyebrow uppercase tracking-eyebrow text-accent-text">Where coordination matters</p>
                        <p className="text-body text-text-muted">{mode.coordination}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {mode.equipment.map((item) => (
                      <article key={item.title} className="flex flex-col gap-5 rounded-card border border-border p-5 sm:flex-row md:p-6">
                        {"image" in item ? <div className="relative aspect-video min-h-28 shrink-0 overflow-hidden rounded-control sm:aspect-auto sm:w-32"><Image src={`/images/${item.image}`} alt={item.alt} fill sizes="(min-width: 640px) 128px, 90vw" className="object-cover" /></div> : null}
                        <div><h4 className="mb-2 font-display text-body-l font-medium text-text">{item.title}</h4><p className="text-small text-text-muted">{item.text}</p></div>
                      </article>
                    ))}
                  </div>
                </div>
              ),
            };
          })}
        />
        <p className="mt-5 text-small text-text-muted">Representative photography of real infrastructure. SIWOM does not own these assets or operate these transport services. This explorer describes equipment and product direction, not live tracking capabilities.</p>
        <div className="mt-16 border-t border-border pt-10">
          <p className="mb-3 font-mono text-eyebrow uppercase tracking-eyebrow text-accent-text">The handoffs are the story</p>
          <h3 className="mb-7 text-h3 text-text">A shipment moves. Its context should move with it.</h3>
          <ol aria-label="Example multimodal shipment journey" className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {[{ label: "Supplier", Icon: Package }, { label: "Truck", Icon: Truck }, { label: "Port terminal", Icon: Anchor }, { label: "Cargo ship", Icon: Ship }, { label: "Destination port", Icon: Anchor }, { label: "Rail or road", Icon: TrainFront }, { label: "Warehouse", Icon: Warehouse }, { label: "Final delivery", Icon: Package }].map(({ label, Icon }, i) => (
              <li key={label} className="relative flex flex-col gap-3 border-l border-border pl-4 py-3">
                <span className="font-mono text-eyebrow text-text-muted">0{i + 1}</span><Icon aria-hidden className="size-6 text-accent-text" strokeWidth={1.5} /><span className="text-small text-text">{label}</span>{i < 7 ? <ArrowRight aria-hidden className="absolute top-4 right-2 size-3 text-text-muted" /> : null}
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-reading text-small text-text-muted">One illustrative journey, not a universal route. Air, inland waterways, rail and pipelines suit different cargoes and infrastructure networks. Every handoff brings its own documents, deadlines and people.</p>
        </div>
      </div>
    </section>
  );
}

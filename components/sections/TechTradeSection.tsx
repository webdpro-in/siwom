import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { photoDisclaimer, sectors, tradeFlows, tradePhotos } from "@/data/trade";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { flowIcons, sectorIcons } from "@/components/trade/TradeParts";

/**
 * Global industrial technology trade, led by space. Research only: no live
 * supplier directory, marketplace or trade volumes are shown or implied.
 */
export function TechTradeSection() {
  const space = sectors.filter((s) => s.group === "space");
  const photo = tradePhotos.coreStageBarge;
  return (
    <section aria-labelledby="tech-trade-title" className="section-y border-b border-border">
      <div className="mx-auto max-w-content gutter-x">
        <div data-reveal className="mb-10 grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-accent-text">Global technology trade</p>
              <StatusPill status="research" />
            </div>
            <h2 id="tech-trade-title" className="max-w-headline text-h2 text-text">
              Connecting supply chains for advanced industries.
            </h2>
          </div>
          <p className="max-w-reading text-body-l text-text-muted">
            SIWOM Global Trade, our technology trade network, is research into linking international suppliers with
            Indian manufacturers and buyers, and helping Indian companies reach global markets. Space comes first.
          </p>
        </div>

        {/* Space feature */}
        <div className="grid overflow-hidden rounded-panel border border-border bg-surface-1 lg:grid-cols-2">
          <figure className="relative flex flex-col">
            <div className="relative aspect-card lg:aspect-auto lg:flex-1">
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" placeholder="blur" className="object-cover" />
            </div>
            <figcaption className="border-t border-border px-6 py-3 text-small text-text-muted">
              {photo.credit} {photoDisclaimer}
            </figcaption>
          </figure>
          <div className="flex flex-col gap-6 p-6 md:p-10">
            <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Space first</p>
            <h3 className="text-h3 text-text md:text-h2">Space logistics, from clean room to launch site.</h3>
            <p className="text-body text-text-muted">
              Satellites, rocket stages and space robotics are high-value, often one of a kind and frequently
              export-controlled. They need logistics partners who plan every handoff before the first quote.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {space.map((s) => {
                const Icon = sectorIcons[s.id];
                return (
                  <li key={s.id} className="flex items-start gap-3">
                    <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-text" strokeWidth={1.5} />
                    <span className="text-small text-text">{s.name}</span>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/global-trade#space"
              className="mt-auto inline-flex items-center gap-2 text-body font-medium text-text underline-offset-4 hover:text-accent-text hover:underline"
            >
              Explore space logistics
              <ArrowRight aria-hidden className="size-5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        {/* Trade flows */}
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tradeFlows.map((f, i) => {
            const Icon = flowIcons[f.id];
            return (
              <li key={f.id} data-reveal style={{ "--reveal-i": i } as React.CSSProperties} className="flex flex-col gap-3 border-t border-border pt-5">
                <Icon aria-hidden className="size-6 text-accent-text" strokeWidth={1.5} />
                <h3 className="text-body-l font-medium text-text">{f.title}</h3>
                <p className="text-small text-text-muted">{f.text}</p>
              </li>
            );
          })}
        </ul>

        {/* All sectors */}
        <div className="mt-12 rounded-panel border border-border p-6 md:p-8">
          <h3 className="mb-5 font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted">
            Sectors we are researching
          </h3>
          <ul className="flex flex-wrap gap-2">
            {sectors.map((s) => {
              const Icon = sectorIcons[s.id];
              return (
                <li key={s.id} className="inline-flex h-10 items-center gap-2 rounded-full border border-border-strong px-4 text-small text-text">
                  <Icon aria-hidden className="size-4 text-text-muted" strokeWidth={1.5} />
                  {s.name}
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <p className="max-w-reading text-small text-text-muted">
              For freight forwarders, customs brokers, carriers and warehouses who want to move technology cargo. No
              supplier directory, marketplace or quotation service is live yet.
            </p>
            <Button href="/global-trade" variant="secondary" icon="arrow" className="shrink-0" trackAs="home_global_trade">
              Explore Global Trade
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

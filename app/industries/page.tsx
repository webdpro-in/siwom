import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import freightWide from "@/public/images/road-sunset.webp";
import { cn } from "@/lib/cn";
import { pageMetadata } from "@/lib/metadata";
import { contactHref } from "@/data/navigation";
import { industries, type Industry } from "@/data/industries";
import { PageHero } from "@/components/layout/PageHero";
import { NextBlock } from "@/components/layout/NextBlock";
import { CheckList } from "@/components/layout/PageSection";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { StatusPill } from "@/components/ui/StatusPill";

export const metadata: Metadata = pageMetadata({
  title: "Industries: ports, freight and warehousing",
  description:
    "SIWOM is built for ports, road freight, warehousing and manufacturing supply chains, plus space logistics, green energy, robotics and advanced mobility.",
  path: "/industries",
});

const core = industries.filter((i) => !i.featured);
const featured = industries.filter((i) => i.featured);

function IndustryBlock({ ind, index, mirrored }: { ind: Industry; index: number; mirrored: boolean }) {
  return (
    <section id={ind.id} aria-labelledby={`${ind.id}-title`} className="border-t border-border py-14 first:border-t-0 md:py-20">
      <div className="layout-grid gap-y-8">
        <div data-reveal className={cn("col-span-4 md:col-span-3 lg:col-span-5", mirrored && "lg:order-2 lg:col-start-8")}>
          <figure className="flex flex-col gap-3">
            <div className="relative aspect-tile overflow-hidden rounded-panel border border-border bg-surface-2">
              <Image src={ind.image} alt={ind.alt} fill sizes="(min-width: 1024px) 40vw, (min-width: 768px) 35vw, 100vw" placeholder="blur" className="object-cover" />
            </div>
            {ind.credit ? <figcaption className="text-small text-text-muted">{ind.credit}</figcaption> : null}
          </figure>
        </div>
        <div className={cn("col-span-4 flex flex-col gap-6 md:col-span-5 lg:col-span-6", mirrored ? "lg:order-1 lg:col-start-1" : "lg:col-start-7")}>
          <div className="flex flex-wrap items-center gap-3">
            <Eyebrow>{String(index + 1).padStart(2, "0")} — {ind.featured ? "Emerging industry" : "Industry"}</Eyebrow>
            <StatusPill status={ind.product.status} />
          </div>
          <h2 id={`${ind.id}-title`} className="text-h2 text-text">
            {ind.name}
          </h2>
          <div className="flex flex-col gap-2">
            <h3 className="font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted">The operational problem</h3>
            <p className="max-w-reading text-body text-text-muted">{ind.problem}</p>
          </div>
          {ind.moves ? (
            <div className="flex flex-col gap-3">
              <h3 className="font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted">What moves</h3>
              <ul className="flex flex-wrap gap-2">
                {ind.moves.map((m) => (
                  <li key={m} className="rounded-full border border-border-strong px-3 py-1 text-small text-text">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="flex flex-col gap-3">
            <h3 className="font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted">How SIWOM could help</h3>
            <CheckList items={ind.couldHelp} />
          </div>
          <p className="text-small text-text-muted">
            Relevant:{" "}
            <Link href={ind.product.href} className="text-text underline underline-offset-4 hover:text-accent-text">
              {ind.product.name}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]}
        eyebrow="Industries"
        title="Industries we design for."
        summary="SIWOM Logistics is built for ports, road freight, warehousing and manufacturing supply chains. Space logistics, green energy, robotics and advanced mobility are covered at the end."
        cta={{ label: "Discuss your operation", href: "/contact" }}
        media={
          <Figure
            src={freightWide}
            alt="Freight truck travelling on a road at sunset."
            preload
            sizes="(min-width: 1440px) 1392px, 100vw"
            caption="Representative road freight photography. SIWOM does not own or operate fleets, ports or terminals."
          />
        }
      >
        <nav aria-label="Jump to industry" className="pt-4">
          <ul className="flex flex-wrap gap-2">
            {industries.map((i) => (
              <li key={i.id}>
                <a
                  href={`#${i.id}`}
                  className={cn(
                    "inline-flex h-10 items-center rounded-full border px-4 text-small transition-colors hover:text-text",
                    i.featured ? "border-accent text-text" : "border-border-strong text-text-muted hover:border-text-muted",
                  )}
                >
                  {i.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <div className="mx-auto max-w-content gutter-x pt-8">
        {core.map((ind, idx) => (
          <IndustryBlock key={ind.id} ind={ind} index={idx} mirrored={idx % 2 === 1} />
        ))}
      </div>

      {/* Highlighted emerging industries */}
      <section aria-labelledby="emerging-title" className="mt-8 border-t-2 border-accent bg-surface-1 pt-14 md:pt-20">
        <div className="mx-auto max-w-content gutter-x">
          <div data-reveal className="flex flex-col gap-5">
            <Eyebrow>Highlighted</Eyebrow>
            <h2 id="emerging-title" className="max-w-headline text-h2 text-text">
              Space logistics, green energy and robotics.
            </h2>
            <p className="max-w-reading text-body-l text-text-muted">
              These industries run on global supply chains of components, materials and machinery. SIWOM Global Trade
              connects them: international suppliers, Indian manufacturers and buyers, and the logistics companies who
              move it all.
            </p>
            <div>
              <Button href="/global-trade" variant="secondary" icon="arrow" trackAs="industries_global_trade">
                Explore Global Trade
              </Button>
            </div>
          </div>
          <div className="mt-8">
            {featured.map((ind, idx) => (
              <IndustryBlock key={ind.id} ind={ind} index={core.length + idx} mirrored={idx % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content gutter-x pb-8">
        <div className="flex flex-col items-start gap-4 py-14 md:flex-row md:items-center md:justify-between">
          <p className="max-w-reading text-body-l text-text">Running one of these operations? Start with one real problem.</p>
          <div className="flex flex-wrap gap-3">
            <Button href="/contact" icon="arrow" trackAs="industries_discuss">
              Discuss your operation
            </Button>
            <Button href={contactHref({ interest: "space" })} variant="secondary" trackAs="industries_space">
              Discuss space logistics
            </Button>
          </div>
        </div>
      </div>

      <NextBlock title="Global Trade" description="How SIWOM Global Trade could connect suppliers, buyers and logistics companies across space, robotics and mobility." href="/global-trade" />
    </>
  );
}

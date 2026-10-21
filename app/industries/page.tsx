import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import portWide from "@/public/images/port-hero.webp";
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

export const metadata: Metadata = pageMetadata({
  title: "Industries",
  description:
    "SIWOM works across six industries: AI and industrial intelligence, global logistics, space and aerospace, automotive and autonomous mobility, robotics, and energy and infrastructure.",
  path: "/industries",
});

function IndustryBlock({ ind, index }: { ind: Industry; index: number }) {
  const mirrored = index % 2 === 1;
  return (
    <section id={ind.id} aria-labelledby={`${ind.id}-title`} className="border-t border-border py-14 first:border-t-0 md:py-20">
      <div className="layout-grid gap-y-8">
        <div data-reveal className={cn("col-span-4 md:col-span-3 lg:col-span-5", mirrored && "lg:order-2 lg:col-start-8")}>
          <figure className="flex flex-col gap-3">
            <div className="relative aspect-tile overflow-hidden rounded-panel border border-border bg-surface-2">
              <Image src={ind.image} alt={ind.alt} fill sizes="(min-width: 1024px) 40vw, (min-width: 768px) 35vw, 100vw" placeholder="blur" className="object-cover" />
            </div>
            {ind.credit ? <figcaption className="text-small text-text-muted">Photo: {ind.credit}</figcaption> : null}
          </figure>
        </div>
        <div className={cn("col-span-4 flex flex-col gap-6 md:col-span-5 lg:col-span-6", mirrored ? "lg:order-1 lg:col-start-1" : "lg:col-start-7")}>
          <Eyebrow>{String(index + 1).padStart(2, "0")} — Industry</Eyebrow>
          <h2 id={`${ind.id}-title`} className="text-h2 text-text">
            {ind.name}
          </h2>
          <p className="max-w-reading text-body-l text-text-muted">{ind.useCase}</p>
          <div className="flex flex-col gap-3">
            <h3 className="font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted">Who it is for</h3>
            <ul className="flex flex-wrap gap-2">
              {ind.segments.map((m) => (
                <li key={m} className="rounded-full border border-border-strong px-3 py-1 text-small text-text">
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted">The problem</h3>
            <p className="max-w-reading text-body text-text-muted">{ind.problem}</p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted">How SIWOM helps</h3>
            <CheckList items={ind.howSiwomHelps} />
          </div>
          <p className="text-small text-text-muted">
            <span className="font-medium text-text">In practice: </span>
            {ind.examples.join(" · ")}
          </p>
          <p className="text-small text-text-muted">
            Related:{" "}
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
        title="Six industries, one intelligence layer."
        summary="From AI and industrial intelligence to global logistics, space, mobility, robotics and energy: industries that run on high-value, international supply chains, where every signal and handoff matters."
        cta={{ label: "Discuss your operation", href: contactHref({ interest: "logistics", pilot: true }) }}
        media={
          <Figure
            src={portWide}
            alt="Container cranes and freight vessels at a working port at sunset."
            preload
            sizes="(min-width: 1440px) 1392px, 100vw"
            caption="Representative photograph. SIWOM coordinates shipments; it does not own or operate ports or fleets."
          />
        }
      >
        <nav aria-label="Jump to industry" className="pt-4">
          <ul className="flex flex-wrap gap-2">
            {industries.map((i) => (
              <li key={i.id}>
                <a
                  href={`#${i.id}`}
                  className="inline-flex h-10 items-center rounded-full border border-border-strong px-4 text-small text-text-muted transition-colors hover:border-text-muted hover:text-text"
                >
                  {i.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <div className="mx-auto max-w-content gutter-x pt-8">
        {industries.map((ind, idx) => (
          <IndustryBlock key={ind.id} ind={ind} index={idx} />
        ))}
        <div className="flex flex-col items-start gap-4 border-t border-border py-14 md:flex-row md:items-center md:justify-between">
          <p className="max-w-reading text-body-l text-text">Working in one of these industries? Start with one real problem.</p>
          <Button href={contactHref({ interest: "logistics", pilot: true })} icon="arrow" trackAs="industries_discuss">
            Discuss a pilot
          </Button>
        </div>
      </div>

      <NextBlock title="SIWOM Logistics" description="See the international shipment workspace: every leg, document and handoff in one view." href="/logistics" />
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { industries } from "@/data/industries";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Section 05: the six industries SIWOM works across. */
export function FocusIndustriesSection() {
  return (
    <section aria-labelledby="focus-title" className="border-t border-border section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div data-reveal className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="focus-title"
            eyebrow="05 — Industries"
            title="Six industries, one intelligence layer."
            intro="Industries that run on high-value, international supply chains and complex operations, where a missed signal or handoff costs days."
          />
          <Button href="/industries" variant="secondary" icon="arrow" className="shrink-0" trackAs="home_industries">
            See industries
          </Button>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, i) => (
            <li key={ind.id} data-reveal style={{ "--reveal-i": i } as React.CSSProperties}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface-1 transition-colors duration-hover hover:border-border-strong">
                <div className="relative aspect-card overflow-hidden border-b border-border bg-surface-2">
                  <Image src={ind.image} alt={ind.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" placeholder="blur" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="text-h3 text-text">
                    <Link href={`/industries#${ind.id}`} className="outline-none after:absolute after:inset-0 after:rounded-card after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent">
                      {ind.name}
                    </Link>
                  </h3>
                  <p className="text-body text-text-muted">{ind.useCase}</p>
                  {ind.credit ? <p className="text-small text-text-muted">Photo: {ind.credit}</p> : null}
                  <span aria-hidden className="mt-auto inline-flex items-center gap-2 pt-2 text-small font-medium text-text">
                    Learn more
                    <ArrowRight className="size-4 transition-transform duration-hover group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0" strokeWidth={1.5} />
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

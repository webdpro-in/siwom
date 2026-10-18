import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Status } from "@/data/status";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Container";
import { StatusPill } from "@/components/ui/StatusPill";

/**
 * Consistent subpage hero: breadcrumbs, eyebrow (division + status pill), H1,
 * one-sentence summary, one primary CTA, then a 16:9 image or demo.
 */
export function PageHero({
  eyebrow,
  status,
  title,
  summary,
  cta,
  secondary,
  media,
  breadcrumbs,
  className,
  children,
}: {
  eyebrow: string;
  status?: Status;
  title: ReactNode;
  summary: ReactNode;
  cta?: { label: string; href: string };
  secondary?: { label: string; href: string };
  media?: ReactNode;
  breadcrumbs?: Crumb[];
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section data-hero aria-labelledby="page-title" className={cn("relative overflow-hidden", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-160 bg-grid" />
      <div className="relative mx-auto max-w-content gutter-x pt-[calc(var(--header-h)+2.5rem)] pb-12 md:pt-[calc(var(--header-h)+4rem)] md:pb-16">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} className="mb-8" /> : null}
        <div className="flex max-w-narrow flex-col gap-6">
          <div className="hero-rise flex flex-wrap items-center gap-3">
            <Eyebrow>{eyebrow}</Eyebrow>
            {status ? <StatusPill status={status} /> : null}
          </div>
          <h1 id="page-title" className="hero-rise text-h1 text-text">
            {title}
          </h1>
          <p className="hero-rise max-w-reading text-body-l text-text-muted hero-delay-1">{summary}</p>
          {cta || secondary ? (
            <div className="hero-rise flex flex-wrap gap-3 pt-2 hero-delay-2">
              {cta ? (
                <Button href={cta.href} size="lg" icon="arrow" trackAs={`hero_${cta.label}`}>
                  {cta.label}
                </Button>
              ) : null}
              {secondary ? (
                <Button href={secondary.href} size="lg" variant="secondary" trackAs={`hero_${secondary.label}`}>
                  {secondary.label}
                </Button>
              ) : null}
            </div>
          ) : null}
          {children}
        </div>
      </div>
      {media ? <div className="relative mx-auto max-w-wide gutter-x pb-4">{media}</div> : null}
    </section>
  );
}

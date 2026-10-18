import Image from "next/image";
import safetyTeam from "@/public/images/safety-team.webp";
import { contactHref } from "@/data/navigation";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { SafetyDemoSection } from "@/components/demos/Demos";
import { SafetyDisclaimer, SafetyLimitations, SafetyWorkflow } from "./SafetyParts";

/**
 * The largest section on the homepage: its own band (surface-1, full width,
 * 2 px lime top border) so it reads as a distinct chapter.
 */
export function SafetySection() {
  return (
    <section aria-labelledby="safety-title" className="border-t-2 border-accent bg-surface-1 section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div data-reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="safety-title"
            eyebrow="03 — SIWOM Safety, our Safety AI"
            badge={<StatusPill status="research" />}
            title={<>Safety isn&apos;t an <span className="whitespace-nowrap">add-on.</span> It&apos;s the foundation.</>}
            intro="SIWOM is exploring AI-assisted safety monitoring and inspection tools that help industrial teams identify potential hazards, document incidents, and respond with greater awareness."
          />
          <Button href={contactHref({ interest: "safety-ai" })} icon="arrow" className="shrink-0" trackAs="home_discuss_safety">
            Discuss Safety AI
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-content gutter-x">
        <figure className="relative overflow-hidden rounded-panel">
          <Image src={safetyTeam} alt="Industrial workers wearing protective equipment in a factory." sizes="(min-width: 1280px) 1232px, 100vw" className="aspect-video w-full object-cover md:aspect-[21/9]" />
          <figcaption className="photo-surface absolute inset-x-0 bottom-0 bg-scrim px-5 py-4 text-small text-text-muted">Real people. Real responsibility. Representative photography; AI observations always require qualified human review.</figcaption>
        </figure>
      </div>

      <div className="mx-auto mt-10 max-w-wide gutter-x">
        <SafetyDemoSection idBase="home-sfy" />
        <SafetyDisclaimer className="mt-4" />
      </div>

      <div className="mx-auto mt-20 max-w-content gutter-x">
        <h3 data-reveal className="mb-8 font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted">
          How it is meant to work
        </h3>
        <SafetyWorkflow />
      </div>

      <div className="mx-auto mt-20 max-w-content gutter-x">
        <blockquote data-reveal className="border-l-2 border-accent pl-6 md:pl-10">
          <p className="max-w-headline font-display text-h2 font-medium text-text">
            AI assists safety decisions. Qualified people remain accountable for critical safety actions.
          </p>
          <footer className="mt-4 font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">SIWOM safety principle</footer>
        </blockquote>
      </div>

      <div className="mx-auto mt-20 max-w-content gutter-x">
        <div className="layout-grid gap-y-8">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <h3 className="text-h3 text-text">What this can and can&apos;t do</h3>
            <p className="mt-3 text-body text-text-muted">The limits matter as much as the capabilities.</p>
            <Button href="/safety-ai" variant="ghost" className="mt-4" trackAs="home_safety_limits">
              Read about responsible use
            </Button>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-8">
            <SafetyLimitations headingLevel="h4" />
          </div>
        </div>
      </div>
    </section>
  );
}

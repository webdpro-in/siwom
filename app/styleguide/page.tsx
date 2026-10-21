import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Boxes, Route, ShieldCheck } from "lucide-react";
import autonomyImg from "@/public/images/robotics.webp";
import warehouseImg from "@/public/images/warehouse.webp";
import { SiwomSymbol, Lockup, Wordmark } from "@/components/brand/Logo";
import { StatusLegend } from "@/components/layout/StatusLegend";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Callout, DemoBanner } from "@/components/ui/Callout";
import { FeatureCard, MediaCard, StatBlock } from "@/components/ui/Cards";
import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { Skeleton } from "@/components/ui/States";
import { StatusPill } from "@/components/ui/StatusPill";
import { Stepper } from "@/components/ui/Stepper";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { InteractiveSamples } from "@/components/styleguide/InteractiveSamples";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const colours = [
  ["bg", "bg-bg", "#0A0D12"],
  ["surface-1", "bg-surface-1", "#121820"],
  ["surface-2", "bg-surface-2", "#18202A"],
  ["surface-3", "bg-surface-3", "#1F2833"],
  ["border", "bg-border", "#28313B"],
  ["border-strong", "bg-border-strong", "#3A4552"],
  ["border-control", "bg-border-control", "#6E7681"],
  ["text", "bg-text", "#FFFFFF"],
  ["text-muted", "bg-text-muted", "#A1A8B3"],
  ["text-subtle", "bg-text-subtle", "#6E7681"],
  ["accent", "bg-accent", "#C8F169"],
  ["sev-critical", "bg-sev-critical", "#FF5A5F"],
  ["sev-high", "bg-sev-high", "#FF9F43"],
  ["sev-medium", "bg-sev-medium", "#F5D04A"],
  ["sev-low", "bg-sev-low", "#7CC4FF"],
] as const;

const type = [
  ["Display", "text-display", "Coordinate every shipment."],
  ["H1", "text-h1", "SIWOM Stream, our Logistics OS"],
  ["H2", "text-h2", "Every movement. One operational picture."],
  ["H3", "text-h3", "Exceptions and delay management"],
  ["Body L", "text-body-l", "Bring shipments, fleets and dispatches into one operational view."],
  ["Body", "text-body", "Help teams coordinate shipments and dispatches with the information they need, when they need it."],
  ["Small", "text-small", "Captions and helper text."],
] as const;

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-border py-16">
      <h2 id={`${id}-title`} className="mb-8 text-h2">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <Container className="pt-[calc(var(--header-h)+3rem)] pb-24">
      <div className="mb-12 flex flex-col gap-4">
        <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Internal · noindex</p>
        <h1 className="text-h1">Styleguide</h1>
        <p className="max-w-reading text-body-l text-text-muted">
          Every token and component with its states, for review in isolation. Hover, focus and press the live
          elements; the forced-state rows show those states statically.
        </p>
      </div>

      <Section id="colour" title="Colour">
        <p className="mb-6 text-small text-text-muted">Swatches follow your selected theme. Hex values below document the original dark palette; the light palette is defined in the shared CSS tokens.</p>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {colours.map(([name, cls, hex]) => (
            <li key={name} className="flex flex-col gap-2">
              <span className={cn("h-16 rounded-card border border-border-strong", cls)} />
              <span className="font-mono text-small text-text">{name}</span>
              <span className="font-mono text-eyebrow text-text-muted">{hex}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-reading text-small text-text-muted">
          Contrast on bg (scripts/qa/contrast.mjs): text 19.5:1, text-muted 8.1:1, accent 15.1:1. text-subtle is 4.2:1, so it is used only
          for disabled states. border-control (4.2:1) outlines form controls to meet the 3:1 non-text minimum.
        </p>
      </Section>

      <Section id="type" title="Typography">
        <div className="flex flex-col gap-8">
          {type.map(([name, cls, sample]) => (
            <div key={name} className="grid gap-2 md:grid-cols-[8rem_1fr] md:items-baseline">
              <span className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">{name}</span>
              <p className={cn(cls, name.startsWith("H") || name === "Display" ? "font-display font-semibold" : "text-text-muted")}>
                {sample}
              </p>
            </div>
          ))}
          <div className="grid gap-2 md:grid-cols-[8rem_1fr] md:items-baseline">
            <span className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Eyebrow</span>
            <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">03 — Safety AI</p>
          </div>
          <div className="grid gap-2 md:grid-cols-[8rem_1fr] md:items-baseline">
            <span className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Data</span>
            <p className="font-mono text-body text-text">SHP-24-0918 · 1,25,000 · 18 Oct 2026, 14:30 IST</p>
          </div>
        </div>
      </Section>

      <Section id="brand" title="Logo">
        <div className="flex flex-wrap items-center gap-10">
          <Lockup size="lg" />
          <SiwomSymbol className="size-16" />
          <SiwomSymbol variant="mono" className="size-16 text-text" />
          <SiwomSymbol className="size-4" />
          <Wordmark className="text-h2" />
        </div>
      </Section>

      <Section id="buttons" title="Buttons">
        <div className="flex flex-col gap-8">
          {(["primary", "secondary", "ghost", "destructive"] as const).map((variant) => (
            <div key={variant} className="flex flex-col gap-3">
              <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">{variant}</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant={variant} size="sm" icon="arrow">Small 40</Button>
                <Button variant={variant} size="md" icon="arrow">Medium 48</Button>
                <Button variant={variant} size="lg" icon="arrow">Large 56</Button>
                <Button variant={variant} disabled>Disabled</Button>
                <Button variant={variant} loading>Sending…</Button>
              </div>
              <div role="group" className="flex flex-wrap items-center gap-4" aria-label={`${variant} forced states`}>
                <span className={cn(buttonClasses({ variant }), variant === "primary" ? "shadow-glow" : variant === "ghost" ? "text-accent-text" : variant === "destructive" ? "bg-sev-critical/10" : "border-text-muted bg-surface-2")}>
                  Hover
                </span>
                <span className={cn(buttonClasses({ variant }), "outline-2 outline-offset-2 outline-focus", variant === "primary" && "shadow-glow")}>
                  Focus-visible
                </span>
                <span className={cn(buttonClasses({ variant }), "translate-y-px")}>Active</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="status" title="Status pills and severity">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-3">
            <StatusPill status="in-development" />
            <StatusPill status="research" />
            <StatusPill status="vision" />
            <StatusPill status="demo" />
          </div>
          <StatusLegend />
          <div className="flex flex-wrap gap-3">
            <SeverityBadge severity="critical" />
            <SeverityBadge severity="high" />
            <SeverityBadge severity="medium" />
            <SeverityBadge severity="low" />
          </div>
        </div>
      </Section>

      <Section id="headers" title="Section header">
        <SectionHeader
          eyebrow="03 — Safety AI"
          badge={<StatusPill status="research" />}
          title="Safety isn't an add-on. It's the foundation."
          intro="SIWOM is exploring AI-assisted safety monitoring that helps teams identify potential hazards."
          action={<Button href="/contact?interest=safety-ai" icon="arrow">Discuss Safety AI</Button>}
        />
      </Section>

      <Section id="cards" title="Cards and stats">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard icon={Route} title="Visibility" description="Shipments, fleets and hubs in one operational view." status="in-development" href="/logistics-os" linkLabel="Explore Logistics OS" />
          <FeatureCard icon={ShieldCheck} title="Human review" description="Every flag goes to a qualified person who decides what happens next." />
          <FeatureCard icon={Boxes} title="Not linked" description="A static card with no link and no status." />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <MediaCard image={autonomyImg} alt="Real robotic arms inside a guarded industrial automation cell." title="SIWOM Autonomy" description="Robotics and machine perception for logistics facilities." status="vision" aspect="4/5" href="/vision#autonomy" linkLabel="Explore our vision" />
          <MediaCard image={warehouseImg} alt="Warehouse storage racks and goods." title="Warehousing" description="Inventory movement tracking." aspect="4/3" />
          <dl className="grid content-start gap-8 rounded-card border border-border bg-surface-1 p-6">
            <StatBlock label="Open exceptions · demo" value="6" footnote="Sample value from the demo dataset." />
            <StatBlock label="Distance · demo" value="1,250" unit="km" size="md" />
          </dl>
        </div>
      </Section>

      <Section id="callouts" title="Callouts and banners">
        <div className="flex flex-col gap-4">
          <Callout variant="info" title="Info">Integrations with existing TMS and WMS are planned, not built.</Callout>
          <Callout variant="safety" title="Safety disclaimer">Sample detections for illustration. AI flags potential hazards for qualified human review.</Callout>
          <Callout variant="warning" title="Warning">This route is a draft and needs legal review.</Callout>
          <div className="overflow-hidden rounded-panel border border-border">
            <DemoBanner />
          </div>
        </div>
      </Section>

      <Section id="stepper" title="Stepper">
        <Stepper
          label="Sample workflow"
          current={0}
          fadeAfterCurrent
          steps={[
            { title: "Observe", description: "Cameras and sensors capture.", tag: "Current focus" },
            { title: "Detect", description: "Software flags potential hazards." },
            { title: "Review", description: "A qualified person checks." },
            { title: "Respond", description: "People act." },
          ]}
        />
      </Section>

      <Section id="media" title="Image with caption">
        <div className="grid gap-6 md:grid-cols-2">
          <Figure src={warehouseImg} alt="Warehouse storage racks and goods." aspect="card" caption="Standard caption." sizes="(min-width: 768px) 50vw, 100vw" />
          <Figure src={autonomyImg} alt="Real robotic arms inside a guarded industrial automation cell." aspect="card" caption="Representative industry photography; not a SIWOM deployment." sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
      </Section>

      <Section id="nav" title="Breadcrumbs and loading">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Safety AI" }]} />
        <div className="mt-6 flex flex-col gap-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Section>

      <Section id="interactive" title="Interactive components">
        <InteractiveSamples />
      </Section>
    </Container>
  );
}

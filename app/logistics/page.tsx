import type { Metadata } from "next";
import { BarChart3, Boxes, Clock, FileCheck2, Handshake, PlugZap, Send, Sparkles } from "lucide-react";
import portsWide from "@/public/images/water-container.webp";
import { TransportModes } from "@/components/sections/TransportModes";
import { JourneySection } from "@/components/sections/JourneySection";
import { pageMetadata } from "@/lib/metadata";
import { contactHref } from "@/data/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { NextBlock } from "@/components/layout/NextBlock";
import { CheckList, PageSection, Prose } from "@/components/layout/PageSection";
import { Accordion } from "@/components/ui/Accordion";
import { FeatureCard } from "@/components/ui/Cards";
import { Figure } from "@/components/ui/Figure";
import { Stepper } from "@/components/ui/Stepper";
import { ShipmentWorkspaceLazy } from "@/components/globe/ShipmentWorkspaceLazy";

export const metadata: Metadata = pageMetadata({
  title: "Logistics: international shipment coordination",
  description:
    "SIWOM Logistics coordinates international shipments for freight forwarders, transporters and warehouse operators: every leg, document and handoff in one record.",
  path: "/logistics",
});

const pilotHref = contactHref({ interest: "logistics", pilot: true });

const capabilities = [
  { icon: Boxes, title: "One shipment record", text: "Every leg, milestone and document of an international shipment, in one place for every party." },
  { icon: Sparkles, title: "Exceptions with SI", text: "SIWOM Intelligence ranks delays by urgency and suggests a next step. Your team decides." },
  { icon: FileCheck2, title: "Document readiness", text: "Which documents are ready, pending or need action, before cargo reaches the port." },
  { icon: Handshake, title: "Handoffs and responsibility", text: "Who holds the shipment at every stage: carrier, terminal, customs broker or local partner." },
  { icon: Clock, title: "Milestones and ETAs", text: "Planned and current ETA for each leg and for final delivery." },
  { icon: Send, title: "Partner updates", text: "The next party sees what is coming, so handoffs happen without chasing." },
  { icon: BarChart3, title: "Reporting", text: "On-time performance, dwell times and exception trends across lanes and partners." },
  { icon: PlugZap, title: "Integrations", text: "Spreadsheet import on day one; APIs and connectors are added as a rollout grows." },
];

const pilotSteps = [
  { title: "Map one lane", description: "Pick one lane, port or customer. We map where shipments start, who handles them and where they get stuck." },
  { title: "Bring in your data", description: "Start from the spreadsheets and exports you already keep; connect partner systems as the pilot grows." },
  { title: "Work from one record", description: "Your team sees each shipment's status, next handoff and open exceptions, with the urgent ones first." },
  { title: "Measure the result", description: "We agree the measures before we start, such as delays caught earlier, and review them together." },
];

const faq = [
  {
    id: "carrier",
    title: "Does SIWOM move the cargo?",
    content: (
      <p>
        No. Carriers, terminals, customs brokers and local partners perform their services. SIWOM Logistics coordinates
        them: one record, clear responsibility at each handoff and early warning when something slips.
      </p>
    ),
  },
  {
    id: "replace",
    title: "Does it replace our TMS or WMS?",
    content: (
      <p>
        No. SIWOM Logistics sits alongside the systems you already run and brings their shipment data into one
        operational view.
      </p>
    ),
  },
  {
    id: "integrations",
    title: "How does it connect to our systems?",
    content: (
      <p>
        A pilot starts with spreadsheet and file imports. APIs, webhooks and connectors for TMS, WMS and telematics are
        set up with each customer as the rollout grows, depending on what your partners can share.
      </p>
    ),
  },
  {
    id: "decide",
    title: "Does SI make decisions automatically?",
    content: <p>No. SIWOM Intelligence suggests next steps, such as confirming a new cut-off. Your team decides.</p>,
  },
  {
    id: "pilot",
    title: "What does a pilot look like?",
    content: (
      <p>
        One lane, port or exception type, an agreed measure of success, the minimum data needed, and a joint review
        before anything expands.
      </p>
    ),
  },
];

export default function LogisticsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Logistics" }]}
        eyebrow="SIWOM Logistics · Current product"
        title="Every shipment, supplier to consignee."
        summary="SIWOM Logistics gives freight forwarders, transporters and warehouse operators one shared record of each shipment: every leg, document and handoff, and who is responsible at each step."
        cta={{ label: "Discuss a pilot", href: pilotHref }}
        secondary={{ label: "Try the workspace", href: "#demo" }}
        media={
          <Figure
            src={portsWide}
            alt="Container vessel alongside terminal gantry cranes, seen from above."
            preload
            sizes="(min-width: 1440px) 1392px, 100vw"
            caption="Representative photograph. SIWOM coordinates shipments; it does not own or operate terminals."
          />
        }
      />

      <div className="mx-auto max-w-content gutter-x pt-12 md:pt-20">
        <PageSection id="problem" eyebrow="The problem" title="Why coordination breaks down.">
          <div className="grid gap-10 lg:grid-cols-2">
            <Prose>
              <p>
                A single container can move by road, vessel and rail through five organisations in a few weeks. Each
                keeps its own records, and the people coordinating them fill the gaps by phone.
              </p>
              <p>
                By the time a delay is visible, the berth window, rail cut-off or delivery slot it affects has often
                already been missed.
              </p>
            </Prose>
            <CheckList
              items={[
                "Status lives in spreadsheets, chat groups and carrier portals",
                "Port, air, rail and road legs are tracked separately",
                "Missing documents hold cargo at the port",
                "Exceptions arrive unsorted, so urgent ones wait behind routine ones",
              ]}
            />
          </div>
        </PageSection>

        <PageSection
          id="features"
          eyebrow="What SIWOM Logistics does"
          title="Built around the shipment, not the system."
          intro="For the people who coordinate international shipments every day."
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c) => (
              <li key={c.title}>
                <FeatureCard icon={c.icon} title={c.title} description={c.text} className="h-full" />
              </li>
            ))}
          </ul>
        </PageSection>
      </div>

      <section id="demo" aria-labelledby="demo-title" className="border-t border-border py-14 md:py-20">
        <div className="mx-auto mb-8 flex max-w-content flex-col gap-4 gutter-x">
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">The workspace</p>
          <h2 id="demo-title" className="max-w-headline text-h2 text-text">
            Every leg, every handoff, one view.
          </h2>
          <p className="max-w-reading text-body-l text-text-muted">
            Filter by industry or mode, select a shipment to follow its route, check its documents and acknowledge an
            exception.
          </p>
        </div>
        <div className="mx-auto max-w-wide gutter-x">
          <ShipmentWorkspaceLazy product="SIWOM Logistics" view="International shipments" />
        </div>
      </section>

      <JourneySection eyebrow="International logistics" />

      <div className="mx-auto max-w-content gutter-x pt-4">
        <PageSection
          id="modes"
          eyebrow="Transport modes"
          title="Ocean, air, road and rail in one plan."
          intro="The milestones SIWOM Logistics follows for each mode, so the next party knows what is coming."
        >
          <TransportModes />
        </PageSection>

        <PageSection id="pilot" eyebrow="Getting started" title="How a pilot works.">
          <Stepper label="How a SIWOM Logistics pilot works" steps={pilotSteps} />
        </PageSection>

        <PageSection id="faq" eyebrow="FAQ" title="Questions we hear.">
          <Accordion items={faq} />
        </PageSection>
      </div>

      <NextBlock
        title="Industries"
        description="The six industries SIWOM works across, from global logistics to space and energy."
        href="/industries"
      />
    </>
  );
}

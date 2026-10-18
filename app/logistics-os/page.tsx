import InternationalWorkspace from "@/components/demos/logistics/InternationalWorkspace";
import type { Metadata } from "next";
import { BarChart3, Boxes, CalendarClock, Clock, Map as MapIcon, PlugZap, Route, Send, Siren, Truck, Warehouse } from "lucide-react";
import portsWide from "@/public/images/water-container.webp";
import { TransportExplorer } from "@/components/sections/TransportExplorer";
import { pageMetadata } from "@/lib/metadata";
import { contactHref } from "@/data/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { NextBlock } from "@/components/layout/NextBlock";
import { CheckList, PageSection, Prose } from "@/components/layout/PageSection";
import { Accordion } from "@/components/ui/Accordion";
import { Callout } from "@/components/ui/Callout";
import { FeatureCard } from "@/components/ui/Cards";
import { Figure } from "@/components/ui/Figure";
import { Stepper } from "@/components/ui/Stepper";
import { LogisticsDemoSection } from "@/components/demos/Demos";

export const metadata: Metadata = pageMetadata({
  title: "Logistics OS",
  description:
    "SIWOM Stream, our Logistics OS, is in development: an international-to-local workspace for partner discovery, multimodal planning, shipment handoffs and logistics analysis.",
  path: "/logistics-os",
});

const pilotHref = contactHref({ interest: "logistics-os", pilot: true });

const capabilities = [
  { icon: Boxes, title: "Global-to-local connections", text: "Bring international freight networks and local logistics providers into a shared coordination workspace.", status: "in-development" as const },
  { icon: MapIcon, title: "Partner discovery", text: "Planned discovery by geography, transport mode, cargo requirements and service capabilities.", status: "in-development" as const },
  { icon: Route, title: "Multimodal planning", text: "Compare transport combinations, service coverage, requested quotations and transit assumptions.", status: "research" as const },
  { icon: BarChart3, title: "AI-assisted logistics analysis", text: "Research into route options, estimated costs, potential delays and provider suitability using available data. No live AI analysis is connected.", status: "research" as const },
  { icon: Send, title: "Shipment handoffs", text: "Coordinate documents and milestones between international carriers, terminals and local partners. Providers execute their own services.", status: "in-development" as const },
  { icon: Boxes, title: "One shared workspace", text: "A planned central view of shipment records, provider details, documents, quotations and coordination status.", status: "in-development" as const },
  { icon: Boxes, title: "Shipment and order tracking", text: "Every consignment, its legs and its documents in one record.", status: "in-development" as const },
  { icon: Truck, title: "Fleet availability", text: "Which vehicles are free, where, and for how long.", status: "in-development" as const },
  { icon: Route, title: "Route planning", text: "Suggested routes that account for distance, cut-offs and rest stops.", status: "research" as const },
  { icon: Send, title: "Dispatch coordination", text: "Match waiting loads to available vehicles from one queue.", status: "in-development" as const },
  { icon: Clock, title: "ETAs and timelines", text: "Planned versus current ETA, with the full status timeline.", status: "in-development" as const },
  { icon: Siren, title: "Exception and delay management", text: "Delays sorted by severity, each with a suggested next step.", status: "in-development" as const },
  { icon: Warehouse, title: "Port and warehouse visibility", text: "Berth, yard, gate and dock milestones next to the road and rail legs.", status: "in-development" as const },
  { icon: BarChart3, title: "Analytics and reporting", text: "On-time performance, dwell times and exception trends.", status: "research" as const },
  { icon: PlugZap, title: "Integration-ready APIs", text: "Planned APIs to exchange data with existing systems.", status: "research" as const },
];

const faq = [
  {
    id: "available",
    title: "Is this available today?",
    content: (
      <p>
        Not as a general product. SIWOM Stream is in development, and the demo on this page uses illustrative data.
        We are looking for pilot partners with a real coordination problem to shape it with us.
      </p>
    ),
  },
  {
    id: "replace",
    title: "Does it replace our TMS or WMS?",
    content: (
      <p>
        No. The intent is to sit alongside the systems you already run and bring their data into one operational
        view. Integrations are planned, not built yet.
      </p>
    ),
  },
  {
    id: "devices",
    title: "Do we need new GPS devices?",
    content: (
      <p>
        Our approach is to use the telematics and tracking data you already have where possible. What is feasible
        depends on your providers and is scoped during a pilot.
      </p>
    ),
  },
  {
    id: "decide",
    title: "Does it make dispatch decisions automatically?",
    content: (
      <p>
        No. It suggests next steps, such as reassigning a vehicle or moving an unloading slot. Your operators decide.
      </p>
    ),
  },
  {
    id: "pilot",
    title: "What does a pilot look like?",
    content: (
      <p>
        We start with one lane, hub or exception type, agree what success means and how it is measured, connect the
        minimum data needed, and review results with your team before anything expands.
      </p>
    ),
  },
];

export default function LogisticsOsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Logistics OS" }]}
        eyebrow="SIWOM Stream · Logistics OS"
        status="in-development"
        title="The operational layer connecting logistics."
        summary="Connect global freight to local logistics through one intelligent platform. SIWOM Stream is in development, with partner discovery, multimodal planning and coordinated shipment handoffs at its core."
        cta={{ label: "Discuss a pilot", href: pilotHref }}
        media={
          <Figure
            src={portsWide}
            alt="Container vessel alongside terminal gantry cranes, seen from above."
            preload
            sizes="(min-width: 1440px) 1392px, 100vw"
            caption="Real infrastructure. Representative photography; SIWOM does not own or operate this terminal."
          />
        }
      />

      <section id="international-demo" aria-labelledby="international-demo-title" className="mx-auto max-w-content gutter-x section-y">
        <p className="mb-4 font-mono text-eyebrow uppercase tracking-eyebrow text-accent-text">Global to local · Product direction</p>
        <h2 id="international-demo-title" className="mb-5 max-w-headline text-h2 text-text">One journey. Every connection.</h2>
        <p className="mb-8 max-w-reading text-body-l text-text-muted">Explore how international shipments, local providers, document handoffs and planning decisions could come together. The workspace below is interactive and uses fictional demonstration data.</p>
        <InternationalWorkspace />
      </section>
      <TransportExplorer />

      <div className="mx-auto max-w-content gutter-x pt-12 md:pt-20">
        <PageSection
          id="overview"
          eyebrow="Overview"
          title="Every movement in one place."
          intro="SIWOM Stream is built to look and behave like an industrial control platform: dense, calm and fast to scan, not a generic analytics dashboard."
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => (
              <li key={c.title}>
                <FeatureCard icon={c.icon} title={c.title} description={c.text} status={c.status} className="h-full" />
              </li>
            ))}
          </ul>
        </PageSection>

        <PageSection id="challenges" eyebrow="Operational challenges" title="Why coordination breaks down.">
          <div className="grid gap-10 lg:grid-cols-2">
            <Prose>
              <p>
                A single container can move by vessel, rail and road through three or four organisations in a week. Each
                keeps its own records, and the people coordinating them fill the gaps by phone.
              </p>
              <p>
                By the time a delay is visible, the berth window, rail cut-off or unloading slot it affects has often
                already been missed.
              </p>
            </Prose>
            <CheckList
              items={[
                "Status lives in spreadsheets, chat groups and carrier portals",
                "Port, rail and road legs are tracked separately",
                "Document deadlines, such as e-way bill validity, are easy to miss",
                "Exceptions arrive unsorted, so urgent ones wait behind routine ones",
              ]}
            />
          </div>
        </PageSection>

        <PageSection id="visibility" eyebrow="Shipment and fleet visibility" title="See shipments and vehicles together.">
          <div className="grid gap-10 lg:grid-cols-2">
            <Prose>
              <p>
                Shipments, the vehicles carrying them and the hubs they pass through share one schematic map, one table
                and one timeline. Selecting a shipment anywhere highlights it everywhere.
              </p>
              <p>
                The current demo uses fictional snapshots on a schematic map, not live GPS positions. Connections to
                carrier systems, fleets and warehouses are planned and have not been implemented.
              </p>
            </Prose>
            <CheckList
              items={[
                "Filter by status (on time, at risk, delayed, delivered) and mode (road, rail, port)",
                "Fleet availability by hub, including vehicles in maintenance",
                "Planned versus current ETA for every shipment",
              ]}
            />
          </div>
        </PageSection>

        <PageSection id="dispatch" eyebrow="Dispatch workflows" title="Match loads and vehicles from one queue.">
          <div className="grid gap-10 lg:grid-cols-2">
            <Prose>
              <p>
                Waiting loads sit in a dispatch queue with pickup windows and load type. Available vehicles at the origin
                hub are offered first. The dispatcher assigns; the load moves to Assigned and the fleet view updates.
              </p>
            </Prose>
            <CheckList
              items={[
                "Vehicles at the origin hub listed first",
                "Assignment history kept for audit",
                "No automatic dispatch: a person confirms every assignment",
              ]}
            />
          </div>
        </PageSection>

        <PageSection id="exceptions" eyebrow="Exceptions and delivery timelines" title="Deal with the urgent ones first.">
          <Prose className="mb-10">
            <p>
              Exceptions are sorted by severity, from a missed berth window to a driver approaching duty-hour limits.
              Each carries its reason, its effect on the ETA and a suggested next step. Suggestions are only
              suggestions: the operator decides.
            </p>
          </Prose>
          <Stepper
            label="Shipment status timeline"
            current={2}
            steps={[
              { title: "Booked", description: "Order and documents created." },
              { title: "Picked up", description: "Load collected at origin." },
              { title: "In transit", description: "Moving by road, rail or sea." },
              { title: "At hub", description: "Port, ICD or warehouse." },
              { title: "Out for delivery", description: "Final leg to the consignee." },
              { title: "Delivered", description: "Proof of delivery recorded." },
            ]}
          />
        </PageSection>
      </div>

      <section id="demo" aria-labelledby="demo-title" className="border-t border-border py-14 md:py-20">
        <div className="mx-auto mb-8 flex max-w-content flex-col gap-4 gutter-x">
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Full demo</p>
          <h2 id="demo-title" className="max-w-headline text-h2 text-text">
            Try the Logistics OS demo.
          </h2>
          <p className="max-w-reading text-body-l text-text-muted">
            Filter, select a delayed shipment, acknowledge an exception and assign a vehicle. Everything here is sample
            data.
          </p>
        </div>
        <div className="mx-auto max-w-wide gutter-x">
          <LogisticsDemoSection idBase="page-lgx" />
        </div>
        <div className="mx-auto mt-4 max-w-content gutter-x">
          <Callout variant="info" title="About the map">
            The map is schematic and does not draw national boundaries. A geographic basemap is planned; it would use a
            provider that depicts India&apos;s official boundaries.
          </Callout>
        </div>
      </section>

      <div className="mx-auto max-w-content gutter-x">
        <PageSection
          id="integrations"
          eyebrow="Integration approach"
          status="research"
          title="Work with the systems you already run."
          intro="None of these integrations is built yet. They describe how we intend SIWOM Stream to connect, and are scoped with each pilot partner."
        >
          <ul className="grid gap-4 md:grid-cols-2">
            {[
              { icon: PlugZap, title: "APIs", text: "Planned REST APIs and webhooks to exchange shipments, events and exceptions." },
              { icon: Boxes, title: "Existing TMS and WMS", text: "Planned connectors so orders and inventory movements flow in without re-keying." },
              { icon: MapIcon, title: "Telematics and tracking", text: "Planned use of the GPS and telematics feeds you already pay for." },
              { icon: CalendarClock, title: "Ports, ICDs and rail", text: "Planned ingestion of terminal and rail milestones where access is available." },
            ].map((c) => (
              <li key={c.title}>
                <FeatureCard icon={c.icon} title={c.title} description={c.text} status="research" className="h-full" />
              </li>
            ))}
          </ul>
        </PageSection>

        <PageSection id="faq" eyebrow="FAQ" title="Questions we hear.">
          <Accordion items={faq} />
        </PageSection>
      </div>

      <NextBlock
        title="Safety AI"
        description="See how SIWOM Safety is exploring AI-assisted hazard flagging, with people accountable for every decision."
        href="/safety-ai"
      />
    </>
  );
}

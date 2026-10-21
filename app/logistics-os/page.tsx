import type { Metadata } from "next";
import { BarChart3, Boxes, Clock, FileCheck2, Map as MapIcon, PlugZap, Route, Siren, Truck, CalendarClock } from "lucide-react";
import portsWide from "@/public/images/water-container.webp";
import InternationalWorkspace from "@/components/demos/logistics/InternationalWorkspace";
import { TransportModes } from "@/components/sections/TransportModes";
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
  title: "Logistics OS: shipment coordination software",
  description:
    "SIWOM Stream is shipment coordination software for freight forwarders, transporters and warehouse teams in India. In development, with a sample-data demo.",
  path: "/logistics-os",
});

const pilotHref = contactHref({ interest: "logistics-os", pilot: true });

/** In development = being built now (most are in the demo). Research = not started in code. */
const capabilities = [
  { icon: Boxes, title: "Shipment tracking", text: "Every consignment with its legs, current status and documents in one record.", status: "in-development" as const },
  { icon: Siren, title: "Exceptions and delays", text: "Delays sorted by severity, each with its cause, its effect on the ETA and a suggested next step.", status: "in-development" as const },
  { icon: Route, title: "Dispatch", text: "Match waiting loads with available vehicles from one queue. A person confirms every assignment.", status: "in-development" as const },
  { icon: Truck, title: "Fleet availability", text: "Which vehicles are free, at which hub, and which are in maintenance.", status: "in-development" as const },
  { icon: Clock, title: "Milestones and ETAs", text: "Planned and current ETA for every shipment, with the full timeline from booking to delivery.", status: "in-development" as const },
  { icon: FileCheck2, title: "Handoffs and documents", text: "What the next partner needs, and which documents, such as e-way bills, are due or expiring.", status: "in-development" as const },
  { icon: BarChart3, title: "Reporting", text: "On-time performance, dwell times and exception trends across lanes and partners.", status: "research" as const },
  { icon: PlugZap, title: "Integrations", text: "Spreadsheet import first. APIs and connectors for TMS, WMS and telematics are planned per pilot.", status: "research" as const },
];

const faq = [
  {
    id: "available",
    title: "Is this available today?",
    content: (
      <p>
        Not as a general product. SIWOM Stream is in development, and the demo on this page uses sample data. We are
        looking for logistics companies with a real coordination problem to pilot it with us.
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
        title="Shipments, vehicles and delays in one workspace."
        summary="SIWOM Stream, our Logistics OS, is shipment coordination software for freight forwarders, transporters and warehouse operators in India. It is in development: the demo on this page uses sample data, and we are looking for pilot partners."
        cta={{ label: "Discuss a pilot", href: pilotHref }}
        secondary={{ label: "Try the demo", href: "#demo" }}
        media={
          <Figure
            src={portsWide}
            alt="Container vessel alongside terminal gantry cranes, seen from above."
            preload
            sizes="(min-width: 1440px) 1392px, 100vw"
            caption="Representative photograph. SIWOM does not own or operate this terminal."
          />
        }
      />

      <div className="mx-auto max-w-content gutter-x pt-12 md:pt-20">
        <PageSection id="problem" eyebrow="The problem" title="Why coordination breaks down.">
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

        <PageSection
          id="features"
          eyebrow="What SIWOM Stream does"
          title="Built around the shipment, not the system."
          intro="Each feature carries its real status. In development means we are building it now; most of these appear in the demo below."
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c) => (
              <li key={c.title}>
                <FeatureCard icon={c.icon} title={c.title} description={c.text} status={c.status} className="h-full" />
              </li>
            ))}
          </ul>
        </PageSection>
      </div>

      <section id="demo" aria-labelledby="demo-title" className="border-t border-border py-14 md:py-20">
        <div className="mx-auto mb-8 flex max-w-content flex-col gap-4 gutter-x">
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Interactive demo</p>
          <h2 id="demo-title" className="max-w-headline text-h2 text-text">
            Try SIWOM Stream with sample data.
          </h2>
          <p className="max-w-reading text-body-l text-text-muted">
            Filter by status or mode, open a delayed shipment, acknowledge an exception and assign a vehicle. Nothing here
            is connected to live operations.
          </p>
        </div>
        <div className="mx-auto max-w-wide gutter-x">
          <LogisticsDemoSection idBase="page-lgx" />
        </div>
        <div className="mx-auto mt-4 max-w-content gutter-x">
          <Callout variant="info" title="About the map">
            The map is schematic and does not draw national boundaries. Positions are snapshot values, not live GPS. A
            geographic basemap is planned; it would use a provider that depicts India&apos;s official boundaries.
          </Callout>
        </div>
      </section>

      <div className="mx-auto max-w-content gutter-x">
        <PageSection
          id="modes"
          eyebrow="Transport modes"
          title="Ocean, air, road and rail in one plan."
          intro="The milestones SIWOM Stream is designed to follow for each mode, so the next partner knows what is coming."
        >
          <TransportModes />
        </PageSection>

        <PageSection id="timeline" eyebrow="Milestones" title="From booking to delivery.">
          <Prose className="mb-10">
            <p>
              Every shipment carries one timeline. Each milestone records when it happened and who handled it, and
              exceptions attach to the milestone they put at risk.
            </p>
          </Prose>
          <Stepper
            label="Shipment milestone timeline"
            current={2}
            steps={[
              { title: "Booked", description: "Order and documents created." },
              { title: "Picked up", description: "Load collected at origin." },
              { title: "In transit", description: "Moving by road, rail, sea or air." },
              { title: "At hub", description: "Port, airport, CFS, ICD or warehouse." },
              { title: "Out for delivery", description: "Final leg to the consignee." },
              { title: "Delivered", description: "Proof of delivery recorded." },
            ]}
          />
        </PageSection>

        <PageSection
          id="international"
          eyebrow="International shipments"
          status="research"
          title="Planning the handoff at the port or airport."
          intro="We are researching how to plan imports and exports end to end: compare ocean and air options, see which local partner takes over, and check documents before each handoff. The workspace below is a concept with fictional data."
        >
          <InternationalWorkspace />
        </PageSection>

        <PageSection
          id="integrations"
          eyebrow="Integrations"
          status="research"
          title="Work with the systems you already run."
          intro="None of these connections is built yet. They describe how we intend SIWOM Stream to connect, scoped with each pilot partner."
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
        title="Industries"
        description="The operations SIWOM Stream is designed for: ports, road freight, warehousing and manufacturing supply chains."
        href="/industries"
      />
    </>
  );
}

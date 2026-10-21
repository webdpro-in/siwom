import type { Metadata } from "next";
import spaceLaunch from "@/public/images/space-launch.webp";
import spaceWide from "@/public/images/space-core-stage-barge.webp";
import autonomyWide from "@/public/images/robotics.webp";
import mobilityWide from "@/public/images/electric-mobility.webp";
import energyWide from "@/public/images/green-energy-solar.webp";
import { pageMetadata } from "@/lib/metadata";
import { contactHref } from "@/data/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { NextBlock } from "@/components/layout/NextBlock";
import { CheckList, PageSection, Prose } from "@/components/layout/PageSection";
import { Callout } from "@/components/ui/Callout";
import { Eyebrow } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { RoadmapStepper } from "@/components/sections/RoadmapSection";

export const metadata: Metadata = pageMetadata({
  title: "Vision and roadmap",
  description:
    "Where SIWOM is headed: from shipment coordination today toward space, robotics, autonomous mobility and energy, built on one intelligence layer.",
  path: "/vision",
});

const directions = [
  {
    id: "space",
    name: "Space and aerospace",
    title: "Supply chains for the space economy.",
    image: spaceWide,
    alt: "A barge carrying a full-size rocket core stage crosses calm water at dusk.",
    caption: "NASA/Cory Huston. Representative image; no NASA endorsement or SIWOM involvement implied.",
    body: "Satellites, rocket stages and ground equipment are among the most demanding cargo there is. The direction: logistics and intelligence built for clean rooms, oversized moves and export-controlled components.",
    points: [
      "Handling limits recorded and checked from clean room to launch site",
      "Licences and documents tied to every handoff",
      "Starts with SIWOM Global Trade, which is in research and development",
    ],
  },
  {
    id: "autonomy",
    name: "Robotics and automation",
    title: "Robots that work safely alongside people.",
    image: autonomyWide,
    alt: "Industrial robotic arms inside a guarded manufacturing cell.",
    caption: "Representative photograph (Pexels).",
    body: "Warehouse robots and AMRs, robotic inspection, machine perception and robot fleet coordination for ports, warehouses and factories.",
    points: [
      "Starts with integrations and controlled pilots with partners who operate the equipment",
      "People and robots separated by design, under each site's safety processes",
      "SIWOM Intelligence (SI) coordinates; people stay accountable",
    ],
  },
  {
    id: "mobility",
    name: "Autonomous mobility",
    title: "Vehicles that know the whole journey.",
    image: mobilityWide,
    alt: "An electric vehicle connected to a charging plug.",
    caption: "Representative photograph (Pexels).",
    body: "Vehicle software, connected systems, diagnostics, predictive maintenance and driver assistance for electric and autonomous vehicles, linked to the logistics operations they serve.",
    points: [
      "Software and diagnostics first, connected to logistics operations",
      "Any vehicle requires dedicated engineering, testing, safety validation and regulatory approval",
      "Built with manufacturers, not around them",
    ],
  },
  {
    id: "energy",
    name: "Energy and infrastructure",
    title: "Intelligence for the energy transition.",
    image: energyWide,
    alt: "Aerial view of rows of solar panels stretching across desert land.",
    caption: "Sarvajanik Puralekh, CC BY-SA 2.0. Bhadla, Rajasthan. No endorsement implied.",
    body: "Digital twins, sensor networks and predictive maintenance for solar, wind, storage and the infrastructure that connects them, used where the data supports it.",
    points: [
      "Starts with the logistics of project cargo to remote sites",
      "Sensors chosen for the question, not the other way round",
      "Predictions shown with their uncertainty, for people to judge",
    ],
  },
];

export default function VisionPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Vision" }]}
        eyebrow="Vision and roadmap"
        title="Intelligence for the physical world, built step by step."
        summary="SIWOM starts with logistics, where the problem is real and the data already exists. Space, robotics, autonomous mobility and energy are long-term directions for the same intelligence layer."
        cta={{ label: "Partner with us", href: contactHref({ interest: "partnership" }) }}
        media={
          <Figure
            src={spaceLaunch}
            alt="A large rocket lifts off at night between lightning towers."
            preload
            sizes="(min-width: 1440px) 1392px, 100vw"
            caption="NASA/Bill Ingalls. Artemis I launch, 2022. Representative image; no NASA endorsement or SIWOM involvement implied."
          />
        }
      />

      <div className="mx-auto max-w-content gutter-x pt-12 md:pt-20">
        <PageSection id="mission" eyebrow="Mission" title="Connect data, decisions and physical operations.">
          <Prose>
            <p>
              Goods, energy and machines move through systems that rarely share a record. SIWOM builds the intelligence
              layer that connects them, so the people who run them can see further ahead and decide better.
            </p>
          </Prose>
        </PageSection>

        <PageSection id="strategy" eyebrow="Logistics first" title="Why we start with logistics.">
          <Prose>
            <p>
              Logistics delivers value now, with data that already exists. It gives SIWOM the operational model, the
              integrations and the trust that every later direction depends on. India&apos;s ports, corridors and
              warehouses are among the most demanding operating environments anywhere; building for them first is how we
              build technology that holds up globally.
            </p>
          </Prose>
        </PageSection>

        <PageSection id="principles" eyebrow="Principles" title="Principles we will not trade away.">
          <CheckList
            items={[
              "Safety comes before speed of delivery or cost",
              "SIWOM Intelligence (SI) assists; qualified people remain accountable for critical actions",
              "We say clearly what exists today and what is still being built",
              "We never imply control of cranes, vehicles or dangerous machinery",
            ]}
          />
        </PageSection>
      </div>

      {directions.map((d) => (
        <section key={d.id} id={d.id} aria-labelledby={`${d.id}-title`} className="border-t border-border py-16 md:py-24">
          <div className="mx-auto max-w-wide gutter-x">
            <Figure src={d.image} alt={d.alt} caption={d.caption} sizes="(min-width: 1440px) 1392px, 100vw" />
          </div>
          <div className="mx-auto mt-10 max-w-content gutter-x">
            <div className="layout-grid gap-y-8">
              <div data-reveal className="col-span-4 flex flex-col gap-5 md:col-span-8 lg:col-span-6">
                <Eyebrow>{d.name} · Long-term direction</Eyebrow>
                <h2 id={`${d.id}-title`} className="text-h2 text-text">
                  {d.title}
                </h2>
                <p className="max-w-reading text-body-l text-text-muted">{d.body}</p>
              </div>
              <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8 lg:self-end">
                <CheckList items={d.points} />
              </div>
            </div>
          </div>
        </section>
      ))}

      <section id="roadmap" aria-labelledby="vision-roadmap-title" className="border-t border-border py-16 md:py-24">
        <div className="mx-auto max-w-content gutter-x">
          <div data-reveal className="mb-12 flex flex-col gap-4">
            <Eyebrow>Roadmap</Eyebrow>
            <h2 id="vision-roadmap-title" className="max-w-headline text-h2 text-text">
              Start with logistics. Build the intelligence layer.
            </h2>
          </div>
          <RoadmapStepper />
          <Callout variant="info" title="On future vehicles" className="mt-10">
            Future vehicles require dedicated engineering, prototyping, testing, safety validation, regulatory approval
            and manufacturing capability.
          </Callout>
        </div>
      </section>

      <NextBlock title="About SIWOM" description="Who we are, how we engineer and how we work with partners." href="/about" />
    </>
  );
}

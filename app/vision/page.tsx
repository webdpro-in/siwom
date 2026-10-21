import type { Metadata } from "next";
import autonomyWide from "@/public/images/robotics.webp";
import nightPort from "@/public/images/port-hero.webp";
import mobilityWide from "@/public/images/electric-mobility.webp";
import intelligenceWide from "@/public/images/industrial-control.webp";
import { pageMetadata } from "@/lib/metadata";
import { contactHref } from "@/data/navigation";
import { divisions } from "@/data/divisions";
import { PageHero } from "@/components/layout/PageHero";
import { NextBlock } from "@/components/layout/NextBlock";
import { CheckList, PageSection, Prose } from "@/components/layout/PageSection";
import { StatusLegend } from "@/components/layout/StatusLegend";
import { Callout } from "@/components/ui/Callout";
import { Eyebrow } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { StatusPill } from "@/components/ui/StatusPill";
import { RoadmapStepper } from "@/components/sections/RoadmapSection";

export const metadata: Metadata = pageMetadata({
  title: "Our Vision",
  description:
    "SIWOM's long-term vision: robotics and autonomous systems, future electric mobility and industrial intelligence, built step by step from a logistics-first start.",
  path: "/vision",
});

const visions = [
  {
    division: divisions.autonomy,
    id: "autonomy",
    title: "Robots that work safely alongside people.",
    image: autonomyWide,
    alt: "Industrial robotic arms inside a guarded manufacturing cell.",
    body: "SIWOM Autonomy is our long-term research direction for warehouse robots and AMRs, robotic facility inspection, machine perception, robot fleet coordination, sensor integration and digital twins for ports, warehouses, factories and logistics hubs.",
    points: [
      "Starts with integrations and controlled pilots with partners who operate the equipment",
      "People and robots separated by design, under each site's safety processes",
      "No robots are built or deployed by SIWOM today",
    ],
  },
  {
    division: divisions.mobility,
    id: "mobility",
    title: "Future electric mobility, engineered properly.",
    image: mobilityWide,
    alt: "Electric vehicle connected to a charging plug.",
    body: "SIWOM Mobility is our long-term ambition: electric passenger and commercial vehicles, vehicle software, connected systems, diagnostics, predictive maintenance and, later, driver-assistance research.",
    points: [
      "Any vehicle needs dedicated engineering, prototyping, testing and safety validation",
      "It also needs regulatory approval and manufacturing capability, which SIWOM does not have today",
      "Software and diagnostics research can begin long before any vehicle exists",
    ],
  },
  {
    division: divisions.intelligence,
    id: "industrial-intelligence",
    title: "Digital twins that earn their keep.",
    image: intelligenceWide,
    alt: "Server hardware and cabling inside a data centre.",
    body: "SIWOM Industrial Intelligence is research into digital twins, simulation, sensor networks and predictive maintenance, used only where the data supports it.",
    points: [
      "Start small: one yard, one warehouse, one asset class",
      "Sensors chosen for the question, not the other way round",
      "Predictions shown with their uncertainty, for people to judge",
    ],
  },
];

export default function VisionPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Our Vision" }]}
        eyebrow="Our Vision"
        title="Where SIWOM is headed."
        summary="We start with shipment coordination software for logistics companies, because that problem is real today. Robotics, electric mobility and industrial intelligence are long-term ambitions; none has started as a product."
        cta={{ label: "Partner with us", href: contactHref({ interest: "partnership" }) }}
        media={
          <Figure
            src={nightPort}
            alt="Container port cranes and vessels at sunset."
            preload
            sizes="(min-width: 1440px) 1392px, 100vw"
            caption="Representative photography of real infrastructure. These images do not depict SIWOM products or deployments."
          />
        }
      />

      <div className="mx-auto max-w-content gutter-x pt-4">
        <StatusLegend />
      </div>

      <div className="mx-auto max-w-content gutter-x pt-12 md:pt-20">
        <PageSection id="mission" eyebrow="Mission" title="Make industrial work safer and more connected.">
          <Prose>
            <p>
              SIWOM&apos;s mission is to help industries move goods and operate assets more safely and more
              predictably, with software that people trust because it is honest about what it knows.
            </p>
          </Prose>
        </PageSection>

        <PageSection id="principles" eyebrow="Safety-first principles" title="Principles we will not trade away.">
          <CheckList
            items={[
              "Safety comes before speed of delivery or cost",
              "AI assists; qualified people remain accountable for critical safety actions",
              "Every product and roadmap item is labelled with its real status",
              "We never imply control of cranes, vehicles or dangerous machinery",
            ]}
          />
        </PageSection>

        <PageSection id="india" eyebrow="Indian engineering ambition" title="Built for Indian operations first.">
          <Prose>
            <p>
              India&apos;s ports, freight corridors, warehouses and factories are among the most demanding operating
              environments anywhere. Building for them first is how we intend to build technology that holds up
              globally.
            </p>
          </Prose>
        </PageSection>

        <PageSection id="strategy" eyebrow="Logistics-first strategy" title="Why we start with logistics.">
          <Prose>
            <p>
              Logistics software can deliver value now, with data that already exists. It gives us the operational
              model, the integrations and the trust that safety intelligence, automation and mobility will later depend
              on.
            </p>
          </Prose>
        </PageSection>
      </div>

      {visions.map((v) => (
        <section key={v.id} id={v.id} aria-labelledby={`${v.id}-title`} className="border-t border-border py-16 md:py-24">
          <div className="mx-auto max-w-wide gutter-x">
            <Figure src={v.image} alt={v.alt} caption="Representative industry photography. This is not a SIWOM product or deployment." sizes="(min-width: 1440px) 1392px, 100vw" />
          </div>
          <div className="mx-auto mt-10 max-w-content gutter-x">
            <div className="layout-grid gap-y-8">
              <div data-reveal className="col-span-4 flex flex-col gap-5 md:col-span-8 lg:col-span-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Eyebrow>{v.division.product}</Eyebrow>
                  <StatusPill status={v.division.status} />
                </div>
                <h2 id={`${v.id}-title`} className="text-h2 text-text">
                  {v.title}
                </h2>
                <p className="max-w-reading text-body-l text-text-muted">{v.body}</p>
              </div>
              <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8 lg:self-end">
                <CheckList items={v.points} />
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
              Start with a real problem. Build toward a bigger future.
            </h2>
          </div>
          <RoadmapStepper />
          <Callout variant="info" title="On future vehicles" className="mt-10">
            Future vehicles require dedicated engineering, prototyping, testing, safety validation, regulatory approval
            and manufacturing capability. SIWOM does not manufacture vehicles or hold road approval.
          </Callout>
        </div>
      </section>

      <NextBlock title="About SIWOM" description="Who we are, how we engineer and how we like to work with partners." href="/about" />
    </>
  );
}

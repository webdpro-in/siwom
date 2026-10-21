import type { Metadata } from "next";
import { Database, FileClock, KeyRound, Lock, ScrollText, UserCog } from "lucide-react";
import twinWide from "@/public/images/industrial-control.webp";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/layout/PageHero";
import { NextBlock } from "@/components/layout/NextBlock";
import { CheckList, LongPage, PageSection, Prose } from "@/components/layout/PageSection";
import { FeatureCard } from "@/components/ui/Cards";
import { Figure } from "@/components/ui/Figure";
import { ArchitectureDiagram } from "@/components/sections/ArchitectureDiagram";

export const metadata: Metadata = pageMetadata({
  title: "Technology and architecture",
  description:
    "How the SIWOM platform works: data integration, trade intelligence, mapping, computer vision, optimisation and security.",
  path: "/technology",
});

const toc = [
  { id: "architecture", label: "Architecture" },
  { id: "data", label: "Data integration" },
  { id: "trade-intelligence", label: "Trade intelligence" },
  { id: "trade-compliance", label: "Trade compliance" },
  { id: "space-cargo", label: "Space and specialised cargo" },
  { id: "geospatial", label: "Mapping and geospatial" },
  { id: "computer-vision", label: "Computer vision" },
  { id: "optimisation", label: "Optimisation" },
  { id: "sensors-robotics", label: "Sensors and robotics" },
  { id: "security", label: "Security and access" },
  { id: "research", label: "What we are working on" },
];

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Technology" }]}
        eyebrow="Technology · Platform and architecture"
        title="How the SIWOM platform works."
        summary="One data platform underneath SIWOM Logistics, Global Trade and Safety, so each capability builds on the last."
        cta={{ label: "Talk to our team", href: "/contact" }}
        media={
          <Figure
            src={twinWide}
            alt="Real server hardware and cabling inside a data centre."
            preload
            sizes="(min-width: 1440px) 1392px, 100vw"
            caption="Representative computing infrastructure."
          />
        }
      />

      <LongPage toc={toc}>
        <PageSection
          id="architecture"
          eyebrow="Architecture"
          status="in-development"
          title="One foundation, four layers."
          intro="Data flows from the systems and sensors a site already has, through the SIWOM platform and an intelligence layer, to people who make the decisions."
        >
          <ArchitectureDiagram headingLevel="h3" />
        </PageSection>

        <PageSection id="data" eyebrow="Data integration" status="in-development" title="Use the data that already exists.">
          <div className="grid gap-10 xl:grid-cols-2">
            <Prose>
              <p>
                Most operations already produce the data they need, spread across shipment systems, carrier portals,
                spreadsheets and telematics. The platform normalises shipments, vehicles, hubs and events into one
                operational model.
              </p>
            </Prose>
            <CheckList
              items={[
                "Event-based model: every status change is an event with a time and a source",
                "Imports from files and APIs, with deeper connectors set up per customer",
                "Source of every value is kept, so operators can see where it came from",
              ]}
            />
          </div>
        </PageSection>

        <PageSection
          id="trade-intelligence"
          eyebrow="Trade intelligence and supplier matching"
          status="research"
          title="Matching what buyers need with who can make it."
          intro="The engine behind SIWOM Global Trade: connecting international suppliers with Indian manufacturers and buyers across space, aerospace, robotics, automotive and green energy."
        >
          <div className="grid gap-10 xl:grid-cols-2">
            <Prose>
              <p>
                The goal is a structured record of what each supplier makes, the certifications they hold and the
                capacity they offer, so a buyer can search by part, material or process rather than by company name.
              </p>
              <p>
                The same records could surface domestic alternatives: Indian manufacturers who may supply a component
                that is imported today. Matches are suggestions; the buyer always qualifies the supplier.
              </p>
            </Prose>
            <CheckList
              items={[
                "Search by part, material, process and certification, not just by name",
                "Domestic-alternative suggestions for imported components",
                "Landed-cost estimates that include freight, duty and handling",
                "No automated purchasing: people choose and qualify every supplier",
              ]}
            />
          </div>
        </PageSection>

        <PageSection id="trade-compliance" eyebrow="Trade documents and compliance" status="research" title="Documents that travel with the goods.">
          <div className="grid gap-10 xl:grid-cols-2">
            <Prose>
              <p>
                Advanced-technology trade carries more paperwork than most freight: commercial documents, origin
                certificates, dangerous-goods declarations and, for many space, aerospace, drone and robotics items,
                export licences such as SCOMET authorisations from the DGFT.
              </p>
              <p>
                The platform is meant to keep those documents attached to the shipment and visible at each handoff. It
                assists licensed customs brokers and compliance teams; it never decides classification or grants a
                licence.
              </p>
            </Prose>
            <CheckList
              items={[
                "Checklists per shipment, built from the goods, route and destination",
                "Classification notes and licence references kept with the shipment",
                "Clear ownership: who must provide each document, and by when",
                "Audit trail of every document version and handoff",
              ]}
            />
          </div>
        </PageSection>

        <PageSection id="space-cargo" eyebrow="Space and specialised cargo" status="research" title="Handling profiles for cargo that cannot be replaced.">
          <div className="grid gap-10 xl:grid-cols-2">
            <Prose>
              <p>
                Satellites, rocket stages and precision robotics need more than a tracking number. Handling profiles record
                shock, temperature, humidity and cleanliness limits, and data from shipment loggers confirms those limits
                were kept from clean room to launch site.
              </p>
            </Prose>
            <CheckList
              items={[
                "Handling limits captured before the first quote",
                "Condition data from shipment loggers attached to each leg",
                "Oversized and dangerous-goods requirements carried through every mode",
                "Chain of custody recorded at each handoff",
              ]}
            />
          </div>
        </PageSection>

        <PageSection id="geospatial" eyebrow="Mapping and geospatial" status="in-development" title="Maps that respect what we know.">
          <Prose>
            <p>
              Operational views use schematic network maps that show hubs, routes and snapshot positions without
              implying GPS precision the data cannot support. Geographic basemaps use providers that depict
              India&apos;s official boundaries.
            </p>
          </Prose>
        </PageSection>

        <PageSection id="computer-vision" eyebrow="Computer vision" status="research" title="Flag, never certify.">
          <Prose>
            <p>
              Our computer vision focuses on visible conditions: possible damage on containers and assets,
              PPE, and people inside marked zones. Outputs are flags with a qualitative confidence band, routed to a
              qualified reviewer.
            </p>
            <p>
              Ordinary cameras cannot see internal structural integrity, electrical safety or hidden material defects.
              Those need engineering inspection, specialised sensors and non-destructive testing.
            </p>
          </Prose>
        </PageSection>

        <PageSection id="optimisation" eyebrow="Optimisation" status="research" title="Suggestions operators can check.">
          <Prose>
            <p>
              Route and dispatch optimisation suggests options, such as which available vehicle suits a waiting load,
              and explains why. Operators accept, change or ignore every suggestion. We favour methods whose reasoning
              can be shown over ones that cannot.
            </p>
          </Prose>
        </PageSection>

        <PageSection id="sensors-robotics" eyebrow="Sensors and robotics" status="vision" title="Robotics, taken carefully.">
          <Prose>
            <p>
              Sensor networks, robotics integrations and digital twins start with controlled pilots, alongside partners
              who own and operate the equipment, under their safety processes.
            </p>
          </Prose>
        </PageSection>

        <PageSection
          id="security"
          eyebrow="Security and access"
          status="in-development"
          title="Our approach to security."
          intro="The practices the SIWOM platform is built around."
        >
          <ul className="grid gap-4 md:grid-cols-2">
            {[
              { icon: UserCog, title: "Role-based access", text: "People see only the sites, data and actions their role needs." },
              { icon: ScrollText, title: "Audit trails", text: "Who changed what, and when, is recorded for operational and safety decisions." },
              { icon: Lock, title: "Encryption", text: "Data encrypted in transit and at rest." },
              { icon: KeyRound, title: "Least-privilege integrations", text: "Integrations use scoped credentials that can be rotated or revoked." },
              { icon: Database, title: "Data ownership", text: "Customers own their operational data; retention is agreed per engagement." },
              { icon: FileClock, title: "Footage retention", text: "Camera footage kept only as long as the site's policy allows." },
            ].map((c) => (
              <li key={c.title}>
                <FeatureCard icon={c.icon} title={c.title} description={c.text} className="h-full" />
              </li>
            ))}
          </ul>
        </PageSection>

        <PageSection id="research" eyebrow="What we are working on" status="research" title="Questions we are working on.">
          <CheckList
            items={[
              "Reliable ETAs when data arrives late, partial or from several sources",
              "Exception detection that ranks urgency without flooding operators",
              "Computer vision that degrades safely in rain, glare and low light",
              "Measuring false-alarm and miss rates honestly on each site's own data",
              "Digital twins that are useful at the scale of one yard or one warehouse",
            ]}
          />
        </PageSection>
      </LongPage>

      <NextBlock title="Industries" description="Where this technology could help first: ports, freight, warehousing, manufacturing and infrastructure." href="/industries" />
    </>
  );
}

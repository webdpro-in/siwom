import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { contactHref } from "@/data/navigation";
import {
  logisticsRoles,
  photoDisclaimer,
  productCategories,
  sectorGroups,
  sectors,
  tradeFlows,
  tradePhotos,
  tradeSteps,
} from "@/data/trade";
import { PageHero } from "@/components/layout/PageHero";
import { NextBlock } from "@/components/layout/NextBlock";
import { PageSection } from "@/components/layout/PageSection";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Eyebrow } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { StatusPill } from "@/components/ui/StatusPill";
import { Stepper } from "@/components/ui/Stepper";
import { PhotoTile, flowIcons, sectorIcons } from "@/components/trade/TradeParts";
import { ShipmentWorkspace } from "@/components/globe/ShipmentWorkspace";

export const metadata: Metadata = pageMetadata({
  title: "Global Trade research: space and technology cargo",
  description:
    "Research, not a live service: planning and handing off space and advanced-technology cargo, and helping Indian manufacturers source and export it.",
  path: "/global-trade",
});

const jump = [
  { id: "space", label: "Space" },
  { id: "flows", label: "Import and export" },
  { id: "journeys", label: "Shipment map" },
  { id: "what-moves", label: "What moves" },
  { id: "sectors", label: "Robotics, mobility and energy" },
  { id: "logistics-companies", label: "For logistics companies" },
  { id: "how-it-works", label: "How it works" },
  { id: "compliance", label: "Compliance" },
  { id: "faq", label: "FAQ" },
];

const spaceSectors = sectors.filter((s) => s.group === "space");
const otherSectors = sectors.filter((s) => s.group !== "space");

const faq = [
  {
    id: "live",
    title: "Is SIWOM Global Trade available today?",
    content: (
      <p>
        No. It is in research. There is no live supplier directory, marketplace or quotation service yet. We are
        talking to manufacturers, buyers and logistics companies to decide what to build first.
      </p>
    ),
  },
  {
    id: "broker",
    title: "Does SIWOM buy, sell or broker goods?",
    content: (
      <p>
        No. SIWOM does not take ownership of goods, act as importer or exporter of record, or negotiate on anyone&apos;s
        behalf. Buyers, suppliers and licensed logistics providers keep those roles.
      </p>
    ),
  },
  {
    id: "alternative",
    title: "Can you find an Indian supplier for a part we import?",
    content: (
      <p>
        Not as a service yet. Tell us what you import and why you want an alternative. Requests like these shape which
        categories we research first. Any supplier would still need to be qualified by you.
      </p>
    ),
  },
  {
    id: "licences",
    title: "Do you handle export licences or customs clearance?",
    content: (
      <p>
        No. Licences come from the relevant authorities, and clearance is handled by licensed customs brokers. The
        platform is meant to keep documents and responsibilities clear between partners, not to replace them.
      </p>
    ),
  },
  {
    id: "partner",
    title: "We are a logistics company. How do we get involved?",
    content: (
      <p>
        Use the contact form and choose Global trade or Space logistics. Tell us your lanes, modes and any specialised
        capability, such as dangerous goods, oversized cargo, charter or climate-controlled handling.
      </p>
    ),
  },
];

export default function GlobalTradePage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Global Trade" }]}
        eyebrow="SIWOM Global Trade"
        status="research"
        title="Logistics for space and technology cargo."
        summary="SIWOM Global Trade, our research into technology supply chains, is not a live service. We are studying how to plan and hand off cargo such as satellites and rocket parts, and how to help Indian manufacturers source and export components, materials and machinery."
        cta={{ label: "Discuss space logistics", href: contactHref({ interest: "space" }) }}
        secondary={{ label: "Discuss global trade", href: contactHref({ interest: "global-trade" }) }}
        media={
          <Figure
            src={tradePhotos.satelliteAirfreight.src}
            alt={tradePhotos.satelliteAirfreight.alt}
            preload
            sizes="(min-width: 1440px) 1392px, 100vw"
            caption={`${tradePhotos.satelliteAirfreight.credit} ${photoDisclaimer}`}
          />
        }
      >
        <nav aria-label="Jump to section" className="pt-4">
          <ul className="flex flex-wrap gap-2">
            {jump.map((j) => (
              <li key={j.id}>
                <a
                  href={`#${j.id}`}
                  className="inline-flex h-10 items-center rounded-full border border-border-strong px-4 text-small text-text-muted transition-colors hover:border-text-muted hover:text-text"
                >
                  {j.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {/* Space: the lead focus, given its own band */}
      <section id="space" aria-labelledby="space-title" className="mt-8 border-t-2 border-accent bg-surface-1 section-y">
        <div className="mx-auto max-w-content gutter-x">
          <div data-reveal className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>01 — Space first</Eyebrow>
              <StatusPill status="research" />
            </div>
            <h2 id="space-title" className="max-w-headline text-h2 text-text">
              Why space comes first.
            </h2>
            <p className="max-w-reading text-body-l text-text-muted">
              With India&apos;s space sector opening to private companies, satellite makers, launch providers and their
              suppliers need supply chains built for cargo that is high-value, often one of a kind, and frequently
              export-controlled.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-12">
            <PhotoTile photo={tradePhotos.rocketStageFactory} fixedHeight sizes="(min-width: 768px) 58vw, 100vw" className="md:col-span-7" />
            <PhotoTile photo={tradePhotos.satelliteCleanroom} fixedHeight sizes="(min-width: 768px) 40vw, 100vw" className="md:col-span-5" />
            <PhotoTile photo={tradePhotos.spaceRobotics} fixedHeight sizes="(min-width: 768px) 40vw, 100vw" className="md:col-span-5" />
            <PhotoTile photo={tradePhotos.coreStageBarge} fixedHeight sizes="(min-width: 768px) 58vw, 100vw" className="md:col-span-7" />
          </div>
          <p className="mt-3 text-small text-text-muted">{photoDisclaimer}</p>

          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {spaceSectors.map((s) => {
              const Icon = sectorIcons[s.id];
              return (
                <li key={s.id} className="flex flex-col gap-4 rounded-card border border-border bg-bg p-6">
                  <div className="flex items-start justify-between gap-3">
                    <Icon aria-hidden className="size-6 text-accent-text" strokeWidth={1.5} />
                    <StatusPill status={s.status} />
                  </div>
                  <h3 className="text-h3 text-text">{s.name}</h3>
                  <p className="text-body text-text-muted">{s.summary}</p>
                  <div>
                    <p className="mb-2 font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">What moves</p>
                    <ul className="flex flex-wrap gap-2">
                      {s.moves.map((m) => (
                        <li key={m} className="rounded-full border border-border-strong px-3 py-1 text-small text-text">
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-auto border-t border-border pt-4 text-small text-text-muted">
                    <span className="font-medium text-text">Handling: </span>
                    {s.handling}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-reading text-body text-text-muted">
              Building or moving satellites, launch vehicle parts or ground equipment? Start with one real shipment.
            </p>
            <Button href={contactHref({ interest: "space" })} icon="arrow" trackAs="trade_space">
              Discuss space logistics
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-content gutter-x pt-14 md:pt-20">
        <PageSection
          id="flows"
          eyebrow="02 — Import and export"
          status="research"
          title="Four trade flows we are studying."
          intro="Trade runs in both directions, and some of what India imports today could be made in India instead."
        >
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {tradeFlows.map((f) => {
              const Icon = flowIcons[f.id];
              return (
                <li key={f.id} className="flex flex-col gap-4 rounded-card border border-border bg-surface-1 p-6">
                  <Icon aria-hidden className="size-6 text-accent-text" strokeWidth={1.5} />
                  <h3 className="text-h3 text-text">{f.title}</h3>
                  <p className="text-body text-text-muted">{f.text}</p>
                  <ul className="mt-auto flex flex-col gap-1.5 border-t border-border pt-4">
                    {f.examples.map((e) => (
                      <li key={e} className="flex gap-2 text-small text-text-muted">
                        <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-text-muted" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>

          <div id="journeys" className="mt-14 flex flex-col gap-4">
            <h3 className="text-h3 text-text">Follow an import or export from origin to delivery.</h3>
            <p className="max-w-reading text-body text-text-muted">
              Each journey runs from pickup in the origin country, through the port or airport, to delivery inland.
              Select a shipment to see its route on the globe and every leg of its journey.
            </p>
            <ShipmentWorkspace product="SIWOM Global Trade" />
          </div>
        </PageSection>

        <PageSection
          id="what-moves"
          eyebrow="03 — What moves"
          title="Components, materials, machinery and finished products."
          intro="Each category has its own packing, documents and risks, so each needs its own logistics plan."
        >
          <dl className="grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {productCategories.map((c) => (
              <div key={c.id} className="flex flex-col gap-2 bg-surface-1 p-6">
                <dt className="text-h3 text-text">{c.title}</dt>
                <dd className="text-body text-text-muted">{c.text}</dd>
              </div>
            ))}
          </dl>
        </PageSection>

        <PageSection
          id="sectors"
          eyebrow="04 — Robotics, mobility and energy"
          title="The industries that follow space."
          intro="The same research applies to robotics, electric and autonomous vehicles, drones, future air taxis and green energy, where supply chains are just as international."
        >
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[tradePhotos.robotics, tradePhotos.electricMobility, tradePhotos.evtol, tradePhotos.solar].map((photo) => (
              <PhotoTile key={photo.alt} photo={photo} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
            ))}
          </div>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {otherSectors.map((s) => {
              const Icon = sectorIcons[s.id];
              return (
                <li key={s.id} className="flex flex-col gap-3 rounded-card border border-border bg-surface-1 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <Icon aria-hidden className="size-6 text-accent-text" strokeWidth={1.5} />
                    <StatusPill status={s.status} />
                  </div>
                  <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">{sectorGroups[s.group]}</p>
                  <h3 className="text-h3 text-text">{s.name}</h3>
                  <p className="text-body text-text-muted">{s.summary}</p>
                  <p className="text-small text-text-muted">
                    <span className="font-medium text-text">Moves: </span>
                    {s.moves.join(" · ")}
                  </p>
                  <p className="mt-auto border-t border-border pt-3 text-small text-text-muted">
                    <span className="font-medium text-text">Handling: </span>
                    {s.handling}
                  </p>
                </li>
              );
            })}
          </ul>
        </PageSection>

        <PageSection
          id="logistics-companies"
          eyebrow="05 — For logistics companies"
          title="Designed with logistics companies."
          intro="Technology cargo needs specialist logistics. The aim is for forwarders, customs brokers, carriers and warehouses to see the work early, with the handling details they need already captured."
        >
          <ul className="grid gap-4 md:grid-cols-2">
            {logisticsRoles.map((r) => (
              <li key={r.id} className="flex flex-col gap-2 rounded-card border border-border bg-surface-1 p-6">
                <h3 className="text-h3 text-text">{r.title}</h3>
                <p className="text-body text-text-muted">{r.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-card border border-border p-6">
              <p className="mb-3 font-medium text-text">What the platform is meant to do</p>
              <ul className="flex flex-col gap-2">
                {["Bring buyers, suppliers and logistics partners into one plan", "Capture handling limits and documents before the first quote", "Keep each handoff clear: who holds the goods, and what comes next"].map((t) => (
                  <li key={t} className="flex gap-2 text-small text-text-muted">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card border border-border p-6">
              <p className="mb-3 font-medium text-text">What it does not do</p>
              <ul className="flex flex-col gap-2">
                {["Replace your contracts, rates or carrier relationships", "Take responsibility for transport, customs or storage", "Promise volumes, customers or shipments"].map((t) => (
                  <li key={t} className="flex gap-2 text-small text-text-muted">
                    <X aria-hidden className="mt-0.5 size-4 shrink-0 text-text-muted" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8">
            <Button href={contactHref({ interest: "partnership" })} variant="secondary" icon="arrow" trackAs="trade_logistics_partner">
              Become a logistics partner
            </Button>
          </div>
        </PageSection>

        <PageSection id="how-it-works" eyebrow="06 — How it is meant to work" title="From first enquiry to delivery.">
          <Stepper label="How SIWOM Global Trade is meant to work" steps={tradeSteps} />
        </PageSection>

        <PageSection
          id="compliance"
          eyebrow="07 — Compliance"
          title="Compliance is part of the plan."
          intro="Advanced-technology trade is regulated. These limits are part of the design, not fine print."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Callout variant="warning" title="Export controls">
              Many space, aerospace, drone and robotics items are controlled. Exports from India may need SCOMET
              authorisation from the DGFT, and items from other countries can carry their own licences and end-use
              conditions. SIWOM does not grant, replace or work around any licence.
            </Callout>
            <Callout variant="warning" title="Dangerous goods">
              Lithium-ion batteries ship as Class 9 dangerous goods, and some propulsion items are explosives. They need
              certified packaging, declarations and carriers approved to move them.
            </Callout>
            <Callout variant="info" title="Customs and duties">
              Classification, duties and clearance are the responsibility of the importer, exporter and their licensed
              customs broker. The platform is meant to keep their documents together, not to decide for them.
            </Callout>
            <Callout variant="info" title="Supplier qualification">
              A domestic alternative is only an alternative once the buyer has checked capability, certification and
              test results. SIWOM never certifies a supplier or a part.
            </Callout>
          </div>
        </PageSection>

        <PageSection id="faq" eyebrow="FAQ" title="Questions we hear.">
          <Accordion items={faq} />
        </PageSection>
      </div>

      <NextBlock
        title="Industries"
        description="Where SIWOM could help: ports, freight and warehousing, plus space logistics, green energy and robotics."
        href="/industries"
      />
    </>
  );
}

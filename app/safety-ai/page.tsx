import type { Metadata } from "next";
import { ArrowUpRight, ClipboardCheck, Construction, FileWarning, HardHat, PackageSearch, ScanSearch, TriangleAlert, Weight } from "lucide-react";
import zoneImg from "@/public/images/safety-team.webp";
import { pageMetadata } from "@/lib/metadata";
import { contactHref } from "@/data/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { NextBlock } from "@/components/layout/NextBlock";
import { CheckList, LongPage, PageSection, Prose } from "@/components/layout/PageSection";
import { Accordion } from "@/components/ui/Accordion";
import { Callout } from "@/components/ui/Callout";
import { FeatureCard } from "@/components/ui/Cards";
import { Figure } from "@/components/ui/Figure";
import { SafetyDemoSection } from "@/components/demos/Demos";
import { SafetyDisclaimer, SafetyLimitations, SafetyWorkflow } from "@/components/sections/SafetyParts";

export const metadata: Metadata = pageMetadata({
  title: "Safety AI: hazard flagging research",
  description:
    "SIWOM Safety, our Safety AI, is research into AI-assisted inspection and hazard flagging for industrial sites. AI flags potential hazards; qualified people review and decide.",
  path: "/safety-ai",
});

const toc = [
  { id: "philosophy", label: "Safety-first philosophy" },
  { id: "workflow", label: "Workflow" },
  { id: "demo", label: "Inspection demo" },
  { id: "vision-examples", label: "Computer vision examples" },
  { id: "ppe-zones", label: "PPE and restricted zones" },
  { id: "incidents", label: "Incident management" },
  { id: "review", label: "Human review and escalation" },
  { id: "limitations", label: "Limitations and responsible use" },
  { id: "faq", label: "FAQ" },
];

const examples = [
  { icon: ScanSearch, title: "Visible damage", text: "Possible cracks, dents, corrosion and leaks, where image quality and access allow." },
  { icon: HardHat, title: "PPE compliance", text: "Possible missing helmets or hi-vis vests in areas where they are required." },
  { icon: Construction, title: "Restricted-zone intrusion", text: "People or vehicles inside marked zones such as exclusion areas." },
  { icon: TriangleAlert, title: "Lifting and traffic conflicts", text: "People near active lifting zones, and vehicle–pedestrian conflict points." },
  { icon: Weight, title: "Load monitoring", text: "Load conditions, only with suitable sensors. Cameras alone cannot weigh a load." },
];

const faq = [
  {
    id: "buy",
    title: "Can we buy SIWOM Safety today?",
    content: <p>No. It is in research. We are looking for partners who want to explore it on real sites, under their existing safety processes.</p>,
  },
  {
    id: "cameras",
    title: "Do we need new cameras?",
    content: (
      <p>
        Possibly not. Existing CCTV can sometimes be used, but coverage, resolution, angle and lighting decide what is
        feasible. That is assessed per site before anything is promised.
      </p>
    ),
  },
  {
    id: "certify",
    title: "Will this help us certify compliance?",
    content: (
      <p>
        No. It can make inspection records more consistent and easier to audit, but it does not certify a site, asset
        or process as safe or compliant. Qualified people and the applicable inspections still do that.
      </p>
    ),
  },
  {
    id: "false",
    title: "What happens with false alarms?",
    content: (
      <p>
        Reviewers mark them as false alarms, and that outcome is logged. Over time, those outcomes help tune the
        system for the site. False alarms will never reach zero.
      </p>
    ),
  },
];

export default function SafetyAiPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Safety AI" }]}
        eyebrow="SIWOM Safety · Safety AI"
        status="research"
        title="Hazard flags, reviewed by people."
        summary="SIWOM Safety, our Safety AI, is research into camera-assisted inspection and hazard flagging for ports, yards and industrial sites. AI flags possible hazards; a qualified person reviews every flag and decides."
        cta={{ label: "Discuss Safety AI", href: contactHref({ interest: "safety-ai" }) }}
        media={
          <Figure
            src={zoneImg}
            alt="Industrial team wearing protective equipment inside a manufacturing facility."
            preload
            sizes="(min-width: 1440px) 1392px, 100vw"
            caption="Safety starts with people. Representative industrial photography; these are not SIWOM employees."
          />
        }
      />

      <LongPage toc={toc}>
        <PageSection id="philosophy" eyebrow="Safety-first philosophy" title="AI assists. People decide.">
          <Prose>
            <p>
              Industrial safety depends on trained people, good procedures and proper inspections. SIWOM Safety explores
              whether AI can help those people notice potential hazards sooner and record what they find more
              consistently.
            </p>
            <p>
              <strong>It is never a replacement for them.</strong> AI flags potential hazards for qualified human
              review. It does not certify a site as safe, and SIWOM does not control cranes, vehicles or dangerous
              machinery.
            </p>
          </Prose>
        </PageSection>

        <PageSection id="workflow" eyebrow="Workflow" title="Observe, detect, review, respond, improve.">
          <SafetyWorkflow />
        </PageSection>

        <PageSection
          id="demo"
          eyebrow="Inspection demo"
          title="You are the reviewer."
          intro="Pick a scenario, select a flagged detection and decide: confirm, mark as false alarm or escalate. Each decision is logged."
        >
          <SafetyDemoSection idBase="page-sfy" />
          <SafetyDisclaimer className="mt-4" />
        </PageSection>

        <PageSection id="vision-examples" eyebrow="Computer vision examples" status="research" title="What we are exploring.">
          <ul className="grid gap-4 md:grid-cols-2">
            {examples.map((e) => (
              <li key={e.title}>
                <FeatureCard icon={e.icon} title={e.title} description={e.text} status="research" className="h-full" />
              </li>
            ))}
          </ul>
          <Callout variant="safety" title="Feasibility first" className="mt-6">
            Each of these is a research question, not a capability. Whether it works on a given site depends on camera
            quality, sensor coverage, lighting, weather and validation on that site&apos;s data.
          </Callout>
        </PageSection>

        <PageSection id="ppe-zones" eyebrow="PPE and restricted zones" status="research" title="Flags for the right person, quickly.">
          <div className="grid gap-10 xl:grid-cols-2">
            <Prose>
              <p>
                A possible missing helmet or a person near an active lifting zone matters only if the right person hears
                about it in time. The concept is simple: a flag with the frame, location, camera and time goes to a
                reviewer, who decides what happens next.
              </p>
            </Prose>
            <CheckList
              items={[
                "Zones are drawn and owned by the site's safety team",
                "Confidence is shown as a band (low, moderate, high), never a precise score",
                "A possible PPE gap is a prompt to check, not a disciplinary record",
              ]}
            />
          </div>
        </PageSection>

        <PageSection id="incidents" eyebrow="Incident management" status="research" title="From observation to corrective action.">
          <ul className="grid gap-4 md:grid-cols-3">
            <li>
              <FeatureCard icon={ClipboardCheck} title="Inspection records" description="Consistent records with photos, location and the inspector's findings." status="research" className="h-full" />
            </li>
            <li>
              <FeatureCard icon={FileWarning} title="Incident reporting" description="Structured reports that capture what happened, where and who responded." status="research" className="h-full" />
            </li>
            <li>
              <FeatureCard icon={PackageSearch} title="Corrective actions" description="Actions with owners and due dates, tracked to closure." status="research" className="h-full" />
            </li>
          </ul>
        </PageSection>

        <PageSection id="review" eyebrow="Human review and escalation" title="Every flag reaches a person.">
          <div className="grid gap-10 xl:grid-cols-2">
            <Prose>
              <p>
                Reviewers can confirm a hazard, mark a flag as a false alarm or escalate it to a supervisor. Each choice
                is time-stamped in an audit trail, so the record shows who decided what, and when.
              </p>
            </Prose>
            <ul className="flex flex-col gap-3">
              {[
                ["Confirm hazard", "Recorded as a confirmed observation; follow-up actions start."],
                ["Mark as false alarm", "Recorded with the reason, and used to reduce future false alarms."],
                ["Escalate to supervisor", "Sent to the person with authority to pause work or act."],
              ].map(([title, text]) => (
                <li key={title} className="flex gap-3 rounded-card border border-border bg-surface-1 p-4">
                  <ArrowUpRight aria-hidden className="mt-0.5 size-5 shrink-0 text-text-muted" strokeWidth={1.5} />
                  <span className="flex flex-col gap-1">
                    <span className="text-body font-medium text-text">{title}</span>
                    <span className="text-small text-text-muted">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </PageSection>

        <PageSection
          id="limitations"
          eyebrow="Limitations and responsible use"
          title="What this cannot do."
          intro="These limits are part of the product, not fine print."
        >
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <Callout variant="warning" title="Cameras see surfaces only">
              Ordinary cameras cannot assess internal structural integrity, electrical safety or hidden material
              defects. Those need engineering inspections, specialised sensors and non-destructive testing.
            </Callout>
            <Callout variant="warning" title="No guarantees">
              AI flags potential hazards for qualified human review. It never guarantees a site is safe, and detection
              performance depends on cameras, coverage, environment and validation.
            </Callout>
            <Callout variant="warning" title="No control of machinery">
              SIWOM does not control cranes, vehicles or dangerous machinery. Stopping work is a human decision made
              through the site&apos;s procedures.
            </Callout>
            <Callout variant="warning" title="Validated before relied on">
              Any deployment would be validated on the site&apos;s own data, with false-alarm and miss rates shared openly
              with the safety team.
            </Callout>
          </div>
          <SafetyLimitations />
        </PageSection>

        <PageSection id="faq" eyebrow="FAQ" title="Questions we hear.">
          <Accordion items={faq} />
        </PageSection>
      </LongPage>

      <NextBlock
        title="Technology"
        description="How the platform, data integration and computer vision research fit together."
        href="/technology"
      />
    </>
  );
}

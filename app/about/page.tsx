import type { Metadata } from "next";
import { Blocks, Gauge, Handshake, HardHat, ListChecks, Microscope } from "lucide-react";
import railWide from "@/public/images/rail-containers.webp";
import { pageMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/layout/PageHero";
import { NextBlock } from "@/components/layout/NextBlock";
import { CheckList, PageSection, Prose } from "@/components/layout/PageSection";
import { Button } from "@/components/ui/Button";
import { FeatureCard } from "@/components/ui/Cards";
import { Figure } from "@/components/ui/Figure";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "SIWOM is a software company in India building SIWOM Logistics for logistics companies. Our principles, and how we work with customers.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About SIWOM"
        title="About SIWOM"
        summary="SIWOM is a software company built in India. We make SIWOM Logistics, shipment coordination software for logistics companies, along with SIWOM Global Trade and SIWOM Safety."
        cta={{ label: "Contact SIWOM", href: "/contact" }}
        media={
          <Figure
            src={railWide}
            alt="Freight train hauling intermodal containers."
            preload
            sizes="(min-width: 1440px) 1392px, 100vw"
            caption="Rail freight in the wider industrial network. Representative photography; not a SIWOM facility."
          />
        }
      />

      <div className="mx-auto max-w-content gutter-x pt-12 md:pt-20">
        <PageSection id="mission" eyebrow="Mission and philosophy" title="More predictable logistics. Safer industry.">
          <Prose>
            <p>
              SIWOM exists to make industrial operations more predictable and safer. We start with shipment
              coordination for logistics companies, because the problem is real today and the data to address it
              already exists.
            </p>
            <p>
              Our core principle is simple: <strong>Safety First. Intelligence Everywhere.</strong> Intelligence should
              help people see and decide better; it should never take accountability away from them.
            </p>
          </Prose>
        </PageSection>

        <PageSection id="engineering" eyebrow="Engineering approach" title="Serious engineering, honestly labelled.">
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: HardHat, title: "Safety-first thinking", text: "Every feature is assessed for how it could fail and who it could affect." },
              { icon: Blocks, title: "Modular by design", text: "Adopt one capability without replacing the systems you run." },
              { icon: Gauge, title: "Measured value", text: "Agree what success means, and how to measure it, before a pilot starts." },
              { icon: ListChecks, title: "Clear scope", text: "What will be delivered, by when and how it is measured is agreed up front." },
              { icon: Microscope, title: "Research that compounds", text: "Long-term R&D in perception, optimisation and industrial data." },
              { icon: Handshake, title: "Built with operators", text: "Designed alongside the people who run the sites, not just for them." },
            ].map((c) => (
              <li key={c.title}>
                <FeatureCard icon={c.icon} title={c.title} description={c.text} className="h-full" />
              </li>
            ))}
          </ul>
        </PageSection>

        <PageSection id="principles" eyebrow="Product development principles" title="How we decide what to build.">
          <CheckList
            items={[
              "Start from a real operational problem, named by the people who have it",
              "Ship the smallest useful thing, then measure it",
              "Show uncertainty instead of hiding it",
              "Say clearly what a feature does and does not do",
              "Prefer suggestions people can check over automation they cannot",
            ]}
          />
        </PageSection>

        <PageSection id="partners" eyebrow="Collaboration and partnerships" title="We would rather build with you.">
          <Prose>
            <p>
              We work with logistics operators, port and terminal teams, manufacturers and safety leaders on real
              problems, starting with a scoped pilot.
            </p>
          </Prose>
        </PageSection>

        <PageSection id="contact" eyebrow="Contact" title="Start a conversation.">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <p className="max-w-reading text-body text-text-muted">
              Use the contact form to tell us about your operation and where shipments get stuck. A person on our team
              reads every message.
            </p>
            <Button href="/contact" icon="arrow" trackAs="about_contact">
              Contact SIWOM
            </Button>
          </div>
        </PageSection>
      </div>

      <NextBlock title="Talk to SIWOM" description="Tell us about the operation and the problem you want to solve." href="/contact" />
    </>
  );
}

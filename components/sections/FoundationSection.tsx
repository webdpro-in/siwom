import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArchitectureDiagram } from "./ArchitectureDiagram";

/** Section 04: data, SIWOM Intelligence (SI) and people working together. */
export function FoundationSection() {
  return (
    <section aria-labelledby="foundation-title" className="relative overflow-hidden section-y">
      <div aria-hidden className="absolute inset-0 bg-grid" />
      <div className="relative mx-auto max-w-content gutter-x">
        <div data-reveal className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="foundation-title"
            eyebrow="04 — Technology foundation"
            title="Data, intelligence and people, working together."
            intro="SIWOM connects the systems partners already use. SIWOM Intelligence (SI) finds what needs attention and suggests a next step. People make every decision that matters."
          />
          <Button href="/technology" variant="secondary" icon="arrow" className="shrink-0" trackAs="home_technology">
            See the technology
          </Button>
        </div>
        <ArchitectureDiagram />
      </div>
    </section>
  );
}

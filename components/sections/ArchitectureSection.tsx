import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArchitectureDiagram } from "./ArchitectureDiagram";

export function ArchitectureSection() {
  return (
    <section aria-labelledby="architecture-title" className="relative overflow-hidden border-y border-border section-y">
      <div aria-hidden className="absolute inset-0 bg-grid" />
      <div className="relative mx-auto max-w-content gutter-x">
        <div data-reveal className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="architecture-title"
            eyebrow="06 — How the technology connects"
            title="One foundation. Multiple industrial applications."
            intro="Logistics and safety share one data platform, so every new capability builds on the last."
          />
          <Button href="/technology" variant="secondary" icon="arrow" className="shrink-0" trackAs="home_architecture">
            See the architecture
          </Button>
        </div>
        <ArchitectureDiagram />
      </div>
    </section>
  );
}

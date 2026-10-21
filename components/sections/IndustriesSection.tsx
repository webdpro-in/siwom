import { industries } from "@/data/industries";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IndustriesExplorer } from "./IndustriesExplorer";

export function IndustriesSection() {
  // Core logistics operations first; space logistics last.
  const items = industries
    .filter((i) => i.onHomepage)
    .sort((a, b) => Number(a.id === "space") - Number(b.id === "space"))
    .map(({ id, name, image, alt, useCase, product, credit }) => ({ id, name, image, alt, useCase, product, credit }));
  return (
    <section aria-labelledby="industries-title" className="section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div data-reveal className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="industries-title"
            eyebrow="04 — Who it is for"
            title="Built for the companies that move freight."
            intro="Freight forwarders, transporters, CFS, ICD and warehouse operators, and the manufacturers who depend on them. These are the operations we design for, not a list of customers."
          />
          <Button href="/industries" variant="secondary" icon="arrow" className="shrink-0" trackAs="home_explore_industries">
            See industries
          </Button>
        </div>
        <IndustriesExplorer items={items} />
      </div>
    </section>
  );
}

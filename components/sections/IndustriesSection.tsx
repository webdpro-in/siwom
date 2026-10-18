import { industries } from "@/data/industries";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IndustriesExplorer } from "./IndustriesExplorer";

export function IndustriesSection() {
  // Space leads: it is SIWOM's main focus for global technology trade.
  const items = industries
    .filter((i) => i.onHomepage)
    .sort((a, b) => Number(b.id === "space") - Number(a.id === "space"))
    .map(({ id, name, image, alt, useCase, product, credit }) => ({ id, name, image, alt, useCase, product, credit }));
  return (
    <section aria-labelledby="industries-title" className="section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div data-reveal className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="industries-title"
            eyebrow="04 — Industries"
            title="From ports to launch sites to industrial networks."
            intro="Where SIWOM could help first, from ports and freight to space logistics. These are the operations we design for, not a list of customers."
          />
          <Button href="/industries" variant="secondary" icon="arrow" className="shrink-0" trackAs="home_explore_industries">
            Explore industries
          </Button>
        </div>
        <IndustriesExplorer items={items} />
      </div>
    </section>
  );
}

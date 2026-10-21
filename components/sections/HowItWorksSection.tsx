import { contactHref } from "@/data/navigation";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stepper } from "@/components/ui/Stepper";

const steps = [
  {
    title: "Tell us how shipments move",
    description: "Pick one lane, hub or customer. We map where shipments start, who handles them and where they get stuck.",
  },
  {
    title: "Bring in the data you have",
    description: "Start from the spreadsheets and exports you already keep. Connections to carrier and transporter systems are planned per pilot.",
  },
  {
    title: "Work from one list",
    description: "Your team sees each shipment's status, next handoff and open exceptions, with the urgent ones first.",
  },
  {
    title: "Measure the result",
    description: "We agree the measures before we start, such as delays caught earlier, and review them together.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="border-y border-border bg-surface-1 section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div data-reveal className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="how-title"
            eyebrow="03 — How it works"
            title="How a pilot works."
            intro="SIWOM Stream is not on general sale yet. We work with a small number of logistics companies, one real problem at a time."
          />
          <Button href={contactHref({ interest: "logistics-os", pilot: true })} icon="arrow" className="shrink-0" trackAs="home_how_pilot">
            Discuss a pilot
          </Button>
        </div>
        <Stepper label="How a SIWOM Stream pilot works" steps={steps} />
      </div>
    </section>
  );
}

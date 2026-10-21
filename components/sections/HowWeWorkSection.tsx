import { Activity, Database, Gauge, HardHat, ListChecks, UserCheck } from "lucide-react";
import railImg from "@/public/images/rail-containers.webp";
import { Figure } from "@/components/ui/Figure";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Operating principles a customer can hold us to. No customer logos until they exist. */
const commitments = [
  { Icon: HardHat, title: "Safety first", text: "Every feature is weighed for how it could fail and who it could affect." },
  { Icon: Activity, title: "Reliability", text: "Built to keep working when data arrives late, partial or from several sources." },
  { Icon: Gauge, title: "Measurable value", text: "Every pilot starts with an agreed measure of success, reviewed together." },
  { Icon: ListChecks, title: "Transparent limitations", text: "We say clearly what each capability does, what it does not do, and what is still being built." },
  { Icon: UserCheck, title: "Human accountability", text: "SIWOM Intelligence (SI) suggests. People decide, and every decision is recorded." },
  { Icon: Database, title: "Your data stays yours", text: "You own your operational data, and how long we keep it is agreed with you." },
];

export function HowWeWorkSection() {
  return (
    <section aria-labelledby="how-we-work-title" className="border-t border-border section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div className="layout-grid items-center gap-y-12">
          <div data-reveal className="col-span-4 md:col-span-8 lg:col-span-5">
            <Figure
              src={railImg}
              alt="Freight train carrying shipping containers through a landscape."
              aspect="tall"
              sizes="(min-width: 1024px) 40vw, 100vw"
              caption="Representative photograph. Not a SIWOM facility or customer."
            />
          </div>
          <div className="col-span-4 flex flex-col gap-10 md:col-span-8 lg:col-span-6 lg:col-start-7">
            <div data-reveal>
              <SectionHeader
                id="how-we-work-title"
                eyebrow="07 — Operating principles"
                title="Principles we work by."
                intro="SIWOM is an industrial technology company built in India. These are the commitments you can hold us to."
              />
            </div>
            <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {commitments.map(({ Icon, title, text }, i) => (
                <li key={title} data-reveal style={{ "--reveal-i": i } as React.CSSProperties} className="flex gap-3">
                  <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-text-muted" strokeWidth={1.5} />
                  <span className="flex flex-col gap-1">
                    <span className="text-body font-medium text-text">{title}</span>
                    <span className="text-small text-text-muted">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

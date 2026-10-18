import { Blocks, Gauge, Handshake, HardHat, Microscope, Wrench } from "lucide-react";
import railImg from "@/public/images/rail-containers.webp";
import { Figure } from "@/components/ui/Figure";
import { SectionHeader } from "@/components/ui/SectionHeader";

const principles = [
  { Icon: Wrench, title: "Practical engineering", text: "Start from how sites actually run." },
  { Icon: HardHat, title: "Safety-first thinking", text: "Every feature is weighed for risk." },
  { Icon: Blocks, title: "Modular technology", text: "Adopt one piece without replacing everything." },
  { Icon: Handshake, title: "Industry collaboration", text: "Build with operators, not just for them." },
  { Icon: Gauge, title: "Measurable operational value", text: "Agree the metrics before a pilot starts." },
  { Icon: Microscope, title: "Long-term R&D commitment", text: "Research that compounds over years." },
];

export function IndiaSection() {
  return (
    <section aria-labelledby="india-title" className="section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div className="layout-grid items-center gap-y-12">
          <div data-reveal className="col-span-4 md:col-span-8 lg:col-span-5">
            <Figure
              src={railImg}
              alt="Freight train carrying shipping containers through a landscape."
              aspect="tall"
              sizes="(min-width: 1024px) 40vw, 100vw"
              caption="Global freight infrastructure. Representative photography; not an Indian or SIWOM facility."
            />
          </div>
          <div className="col-span-4 flex flex-col gap-10 md:col-span-8 lg:col-span-6 lg:col-start-7">
            <div data-reveal>
              <SectionHeader
                id="india-title"
                eyebrow="07 — Built from India"
                title="Engineered in India. Built for global industry."
                intro="SIWOM is an Indian industrial technology initiative focused on solving practical operational challenges while building toward globally relevant logistics, safety, robotics, and mobility technologies."
              />
            </div>
            <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {principles.map(({ Icon, title, text }, i) => (
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

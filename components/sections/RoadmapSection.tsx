import { roadmap, roadmapNote } from "@/data/roadmap";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { Stepper } from "@/components/ui/Stepper";

export function RoadmapStepper() {
  return (
    <div className="flex flex-col gap-8">
      <Stepper
        label="SIWOM roadmap, in intended order"
        current={0}
        fadeAfterCurrent
        steps={roadmap.map((stage, i) => ({
          title: stage.title,
          tag: i === 0 ? "Current focus" : `Stage ${i + 1}`,
          description: (
            <ul className="flex flex-col gap-1">
              {stage.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ),
          extra: <StatusPill status={stage.status} className="mt-2 w-fit" />,
        }))}
      />
      <p className="max-w-reading border-t border-border pt-5 text-small text-text-muted">{roadmapNote}</p>
    </div>
  );
}

export function RoadmapSection({ eyebrow = "08 — Roadmap" }: { eyebrow?: string }) {
  return (
    <section aria-labelledby="roadmap-title" className="section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div data-reveal className="mb-12">
          <SectionHeader
            id="roadmap-title"
            eyebrow={eyebrow}
            title="Start with a real problem. Build toward a bigger future."
            intro="Each stage builds on the data, trust and engineering of the one before it."
          />
        </div>
        <RoadmapStepper />
      </div>
    </section>
  );
}

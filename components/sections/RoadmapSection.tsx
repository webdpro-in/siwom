import { roadmap, roadmapNote } from "@/data/roadmap";
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

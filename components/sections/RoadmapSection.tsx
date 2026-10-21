import { roadmap, roadmapNote } from "@/data/roadmap";
import { Stepper } from "@/components/ui/Stepper";

export function RoadmapStepper() {
  return (
    <div className="flex flex-col gap-8">
      <Stepper
        label="SIWOM roadmap, in order"
        current={0}
        fadeAfterCurrent
        steps={roadmap.map((stage) => ({
          title: stage.title,
          tag: stage.phase,
          description: (
            <ul className="flex flex-col gap-1">
              {stage.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ),
        }))}
      />
      <p className="max-w-reading border-t border-border pt-5 text-small text-text-muted">{roadmapNote}</p>
    </div>
  );
}

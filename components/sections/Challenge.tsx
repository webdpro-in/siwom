import { Clock, EyeOff, FileWarning, PhoneCall, ShieldAlert, Split } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ChallengeVisual } from "./ChallengeVisual";

const challenges = [
  { Icon: Split, text: "Disconnected shipment systems" },
  { Icon: PhoneCall, text: "Manual coordination between teams and vehicles" },
  { Icon: Clock, text: "Delayed updates and missed windows" },
  { Icon: EyeOff, text: "Limited fleet and warehouse visibility" },
  { Icon: ShieldAlert, text: "Hazards that go unnoticed" },
  { Icon: FileWarning, text: "Slow, inconsistent inspection and incident reporting" },
];

export function Challenge() {
  return (
    <section aria-labelledby="challenge-title" className="section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div className="layout-grid gap-y-10">
          <div data-reveal className="col-span-4 md:col-span-8 lg:col-span-5">
            <SectionHeader
              id="challenge-title"
              eyebrow="01 — The challenge"
              title="Complex operations. One intelligent view."
              intro="Industrial operations run on many systems, calls and checklists that rarely talk to each other."
            />
          </div>
          <ul className="col-span-4 grid gap-x-6 gap-y-4 self-end sm:grid-cols-2 md:col-span-8 lg:col-span-6 lg:col-start-7">
            {challenges.map(({ Icon, text }, i) => (
              <li key={text} data-reveal style={{ "--reveal-i": i } as React.CSSProperties} className="flex items-start gap-3 border-t border-border pt-4">
                <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-text-muted" strokeWidth={1.5} />
                <span className="text-body text-text">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12 lg:mt-16">
          <ChallengeVisual caption="SIWOM aims to connect operational data, identify exceptions, support safer decisions, and help teams coordinate more effectively." />
        </div>
      </div>
    </section>
  );
}

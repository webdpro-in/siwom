import { Clock, FileWarning, PhoneCall, Split, Ship, Users } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ChallengeVisual } from "./ChallengeVisual";

const challenges = [
  { Icon: PhoneCall, text: "Shipment status lives in calls, chat groups and spreadsheets" },
  { Icon: Split, text: "Every handoff, from carrier to terminal to customs broker to local partner, loses information" },
  { Icon: Clock, text: "Delays come to light after the customer asks" },
  { Icon: FileWarning, text: "Missing documents hold cargo at the port" },
  { Icon: Ship, text: "Port, air, rail and road legs are tracked in different places" },
  { Icon: Users, text: "Customers and partners each get a different answer" },
];

/** Section 01: the current product, who it serves and the problem it solves. */
export function Challenge() {
  return (
    <section aria-labelledby="challenge-title" className="section-y">
      <div className="mx-auto max-w-content gutter-x">
        <div className="layout-grid gap-y-10">
          <div data-reveal className="col-span-4 md:col-span-8 lg:col-span-5">
            <SectionHeader
              id="challenge-title"
              eyebrow="01 — SIWOM Logistics"
              title="One shared record for every international shipment."
              intro="For freight forwarders, transporters and warehouse operators. A single shipment passes through a supplier, carriers, terminals, customs brokers and local partners. Each keeps its own records, so coordinators fill the gaps by phone."
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
          <ChallengeVisual caption="Illustrative example: the same shipments scattered across six tools, and in one list sorted by what needs action first." />
        </div>
      </div>
    </section>
  );
}

import { ListChecks, ShieldCheck, UserCheck, Wrench } from "lucide-react";

const items = [
  { Icon: ShieldCheck, text: "Safety first, always" },
  { Icon: UserCheck, text: "Humans stay accountable" },
  { Icon: ListChecks, text: "Honest about what's built and what's planned" },
  { Icon: Wrench, text: "Engineered in India" },
];

/** Commitments instead of a logo wall: SIWOM has no customers to show yet. */
export function Principles() {
  return (
    <section aria-label="Our commitments" className="border-y border-border bg-bg">
      <ul className="mx-auto grid max-w-wide grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icon, text }, i) => (
          <li
            key={text}
            className={[
              "flex items-center gap-3 px-4 py-6 md:px-6",
              i % 2 === 1 ? "border-l border-border" : "",
              i >= 2 ? "border-t border-border lg:border-t-0" : "",
              i === 2 ? "lg:border-l" : "",
            ].join(" ")}
          >
            <Icon aria-hidden className="size-6 shrink-0 text-accent-text" strokeWidth={1.5} />
            <span className="text-small font-medium text-text md:text-body">{text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

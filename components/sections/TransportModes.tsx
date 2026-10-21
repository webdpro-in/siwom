import Image from "next/image";
import { Check } from "lucide-react";
import { transportModes } from "@/data/transport";

/** The milestones SIWOM Logistics is designed to follow for each transport mode. */
export function TransportModes() {
  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {transportModes.map((mode) => (
          <li key={mode.id} className="flex flex-col overflow-hidden rounded-card border border-border bg-surface-1">
            <div className="relative aspect-card overflow-hidden border-b border-border bg-surface-2">
              <Image src={`/images/${mode.image}`} alt={mode.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <h3 className="text-h3 text-text">{mode.label}</h3>
              <ul className="flex flex-col gap-2">
                {mode.milestones.map((m) => (
                  <li key={m} className="flex gap-2 text-small text-text-muted">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-text" strokeWidth={1.75} />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-small text-text-muted">
        Representative photographs; SIWOM does not own or operate these assets. Carrier, terminal and rail systems are
        connected for each customer as part of onboarding.
      </p>
    </>
  );
}

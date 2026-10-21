import { Anchor, CalendarCheck, ClockAlert, FileCheck2, Navigation, Plane, Ship, TrainFront, Truck, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  modeLabels,
  places,
  statusLabels,
  type InternationalShipment,
  type Mode,
  type Place,
  type PlaceId,
  type ShipmentStatus,
} from "@/data/demo/international";

export const modeIcons: Record<Mode, LucideIcon> = { ocean: Ship, air: Plane, road: Truck, rail: TrainFront };

const statusIcons: Record<ShipmentStatus, LucideIcon> = {
  booked: CalendarCheck,
  "in-transit": Navigation,
  "at-port": Anchor,
  customs: FileCheck2,
  delayed: ClockAlert,
};

/** Status shown as icon + word, never colour alone. */
export function ShipmentStatusBadge({ status, className }: { status: ShipmentStatus; className?: string }) {
  const Icon = statusIcons[status];
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-small font-medium",
        status === "delayed" ? "border-sev-high/50 text-sev-high" : "border-border-strong text-text",
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" strokeWidth={2} />
      {statusLabels[status]}
    </span>
  );
}

export function placeLabel(id: PlaceId) {
  const p = places[id];
  return `${p.name}, ${p.country}`;
}

/** "Road → Ocean → Road", as icons with an accessible text equivalent. */
export function ModeChain({ shipment, className }: { shipment: InternationalShipment; className?: string }) {
  const modes = shipment.legs.map((l) => l.mode);
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-text-muted", className)}>
      <span className="sr-only">{modes.map((m) => modeLabels[m]).join(", then ")}</span>
      {modes.map((m, i) => {
        const Icon = modeIcons[m];
        return (
          <span key={i} aria-hidden className="inline-flex items-center gap-1.5">
            {i > 0 ? <span className="h-px w-2.5 bg-border-strong" /> : null}
            <Icon className="size-4" strokeWidth={1.75} />
          </span>
        );
      })}
    </span>
  );
}

/** Ports, airports and depots of a shipment with their role in the journey, for globe labels. */
export function labelsFor(shipment: InternationalShipment): { id: PlaceId; role: string }[] {
  const out = new Map<PlaceId, string>();
  for (const leg of shipment.legs) {
    if (leg.mode === "ocean") {
      out.set(leg.from, "Port of loading");
      out.set(leg.to, "Port of discharge");
    } else if (leg.mode === "air") {
      out.set(leg.from, "Departure airport");
      out.set(leg.to, "Arrival airport");
    } else if (leg.mode === "rail" && (places[leg.to] as Place).kind === "depot") {
      out.set(leg.to, "Inland depot");
    }
  }
  return [...out].map(([id, role]) => ({ id, role }));
}

/** Line samples for the mode legend; the same dash patterns as the globe. */
export function ModeLegend({ className }: { className?: string }) {
  const items: { mode: Mode; dash?: string }[] = [
    { mode: "ocean" },
    { mode: "air", dash: "6 5" },
    { mode: "road", dash: "1.5 4" },
    { mode: "rail", dash: "7 3 2 3" },
  ];
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-text-muted", className)} aria-label="Route line styles">
      {items.map(({ mode, dash }) => (
        <li key={mode} className="inline-flex items-center gap-2">
          <svg aria-hidden width="24" height="6" viewBox="0 0 24 6" className="text-text-muted">
            <line x1="1" y1="3" x2="23" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray={dash} />
          </svg>
          {modeLabels[mode]}
        </li>
      ))}
    </ul>
  );
}

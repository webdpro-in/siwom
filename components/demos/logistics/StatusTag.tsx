import { CircleCheck, Clock, PackageCheck, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/cn";
import { statusLabels, type ShipmentStatus } from "@/data/demo/shipments";

const styles: Record<ShipmentStatus, { cls: string; Icon: typeof Clock }> = {
  "on-time": { cls: "text-text", Icon: CircleCheck },
  "at-risk": { cls: "text-sev-medium", Icon: TriangleAlert },
  delayed: { cls: "text-sev-high", Icon: Clock },
  delivered: { cls: "text-text-muted", Icon: PackageCheck },
};

/** Shipment status: icon + word + colour, never colour alone. */
export function StatusTag({ status, className }: { status: ShipmentStatus; className?: string }) {
  const { cls, Icon } = styles[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-small", cls, className)}>
      <Icon aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
      {statusLabels[status]}
    </span>
  );
}

export const routeStroke: Record<ShipmentStatus, { cls: string; dash?: string; width: number }> = {
  "on-time": { cls: "stroke-text-muted", width: 3 },
  "at-risk": { cls: "stroke-sev-medium", dash: "12 9", width: 3.5 },
  delayed: { cls: "stroke-sev-high", dash: "0.5 9", width: 4.5 },
  delivered: { cls: "stroke-border-strong", width: 2.5 },
};

export const markerFill: Record<ShipmentStatus, string> = {
  "on-time": "fill-text",
  "at-risk": "fill-sev-medium",
  delayed: "fill-sev-high",
  delivered: "fill-border-strong",
};

import { ArrowRight, Check, Lightbulb, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { exceptions } from "@/data/demo/exceptions";
import { hubs } from "@/data/demo/hubs";
import { modeLabels, stageLabels, stageOrder, type Shipment } from "@/data/demo/shipments";
import { etaDelta } from "./model";
import { StatusTag } from "./StatusTag";

/** Drawer / bottom-sheet content for one shipment. Hook-free. */
export function ShipmentDetail({
  shipment,
  acknowledged,
  onAcknowledge,
  onClose,
  titleId,
}: {
  shipment: Shipment;
  acknowledged: string[];
  onAcknowledge?: (exceptionId: string) => void;
  onClose?: () => void;
  titleId: string;
}) {
  const exc = shipment.exceptionId ? exceptions.find((e) => e.id === shipment.exceptionId) : undefined;
  const isAck = exc ? acknowledged.includes(exc.id) : false;
  const currentIndex = stageOrder.indexOf(shipment.stage);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Shipment · demo</p>
          <h3 id={titleId} className="font-mono text-h3 font-medium text-text" tabIndex={-1}>
            {shipment.id}
          </h3>
          <StatusTag status={shipment.status} />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 -mt-1 inline-flex size-11 shrink-0 items-center justify-center rounded-control text-text-muted hover:bg-surface-3 hover:text-text"
        >
          <X aria-hidden className="size-5" />
          <span className="sr-only">Close details</span>
        </button>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-small">
        <div className="col-span-2">
          <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Route</dt>
          <dd className="mt-1 flex flex-wrap items-center gap-2 text-body text-text">
            {hubs[shipment.origin].name}
            <ArrowRight aria-hidden className="size-4 text-text-muted" />
            <span className="sr-only">to</span>
            {hubs[shipment.destination].name}
          </dd>
          <dd className="mt-1 text-text-muted">
            {modeLabels[shipment.mode]} · {shipment.distanceKm.toLocaleString("en-IN")} km · {shipment.cargo}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Vehicle</dt>
          <dd className="mt-1 font-mono text-text">{shipment.vehicleId}</dd>
        </div>
        <div>
          <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Customer</dt>
          <dd className="mt-1 text-text">{shipment.customer}</dd>
        </div>
        <div>
          <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Planned ETA</dt>
          <dd className="mt-1 font-mono text-text">{shipment.plannedEta} IST</dd>
        </div>
        <div>
          <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">
            {shipment.status === "delivered" ? "Delivered" : "Current ETA"}
          </dt>
          <dd className="mt-1 font-mono text-text">{shipment.currentEta} IST</dd>
          <dd
            className={cn(
              "font-mono text-small",
              shipment.status === "delayed" ? "text-sev-high" : shipment.status === "at-risk" ? "text-sev-medium" : "text-text-muted",
            )}
          >
            {etaDelta(shipment)}
          </dd>
        </div>
      </dl>

      <div>
        <h4 className="mb-3 font-mono text-eyebrow font-normal uppercase tracking-eyebrow text-text-muted">Status timeline</h4>
        <ol className="flex flex-col">
          {stageOrder.map((stage, i) => {
            const done = i < currentIndex || shipment.stage === "delivered";
            const current = i === currentIndex && shipment.stage !== "delivered";
            const time = shipment.timeline[stage];
            return (
              <li key={stage} className="relative flex gap-3 pb-4 last:pb-0" aria-current={current ? "step" : undefined}>
                {i < stageOrder.length - 1 ? (
                  <span aria-hidden className={cn("absolute left-2.5 top-6 bottom-0 w-px", done ? "bg-text-muted" : "bg-border")} />
                ) : null}
                <span
                  aria-hidden
                  className={cn(
                    "relative z-10 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                    done && "border-text-muted bg-text-muted text-bg",
                    current && "border-accent bg-bg",
                    !done && !current && "border-border-strong bg-bg",
                  )}
                >
                  {done ? <Check className="size-3" strokeWidth={3} /> : current ? <span className="size-2 rounded-full bg-accent" /> : null}
                </span>
                <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3">
                  <span className={cn("text-small", done || current ? "text-text" : "text-text-muted")}>
                    {stageLabels[stage]}
                    <span className="sr-only">{done ? " (complete)" : current ? " (current)" : " (pending)"}</span>
                  </span>
                  <span className="font-mono text-eyebrow text-text-muted">{time ? `${time} IST` : current ? "Now" : "Pending"}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {exc ? (
        <div className="flex flex-col gap-3 rounded-card border border-border-strong bg-surface-2 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SeverityBadge severity={exc.severity} />
            <span className="font-mono text-eyebrow text-text-muted">{exc.id}</span>
          </div>
          <p className="font-medium text-text">{exc.title}</p>
          <p className="text-small text-text-muted">{exc.reason}</p>
          <div className="mt-1 rounded-control border border-border bg-bg p-3">
            <p className="flex items-center gap-2 text-small font-medium text-text">
              <Lightbulb aria-hidden className="size-4 text-text-muted" strokeWidth={1.75} />
              Suggested next step
            </p>
            <p className="mt-1 text-small text-text">{exc.suggestedStep}</p>
            <p className="mt-2 font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Suggestion only — the operator decides</p>
          </div>
          {isAck ? (
            <p className="inline-flex items-center gap-2 text-small text-text-muted">
              <Check aria-hidden className="size-4 text-accent-text" /> Acknowledged
            </p>
          ) : (
            <button
              type="button"
              onClick={onAcknowledge ? () => onAcknowledge(exc.id) : undefined}
              className="inline-flex h-10 w-fit items-center gap-2 rounded-control border border-border-strong px-4 text-small font-medium text-text hover:border-text-muted hover:bg-surface-3"
            >
              <Check aria-hidden className="size-4" /> Acknowledge exception
            </button>
          )}
        </div>
      ) : (
        <p className="rounded-card border border-border bg-surface-2 p-4 text-small text-text-muted">
          No open exception on this shipment.
        </p>
      )}
    </div>
  );
}

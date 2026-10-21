"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { places, type InternationalShipment, type Place, type PlaceId } from "@/data/demo/international";

const codeOf = (id: PlaceId) => (places[id] as Place).code;
import { labelsFor, placeLabel } from "./parts";
import type { GlobeHandle } from "./renderer";

/**
 * Interactive dotted globe with shipment routes. The renderer and land data
 * load after hydration, so they never block first paint; a plain sphere holds
 * the space meanwhile, so nothing shifts. Drag or use the arrow keys to rotate.
 */
export function Globe({
  shipments,
  selected,
  motion,
  className,
}: {
  shipments: InternationalShipment[];
  selected: string;
  motion: boolean;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<GlobeHandle | null>(null);
  const [ready, setReady] = useState(false);
  const selectedRef = useRef(selected);
  const motionRef = useRef(motion);

  const shipment = shipments.find((s) => s.ref === selected) ?? shipments[0];
  const labels = useMemo(() => labelsFor(shipment), [shipment]);

  useEffect(() => {
    let cancelled = false;
    import("./renderer").then(({ createGlobe }) => {
      if (cancelled || !canvasRef.current || !hostRef.current || !labelsRef.current) return;
      handleRef.current = createGlobe({
        canvas: canvasRef.current,
        host: hostRef.current,
        labels: labelsRef.current,
        shipments,
        selected: selectedRef.current,
        motion: motionRef.current,
      });
      setReady(true);
    });
    // Follow theme changes (data-theme on <html>).
    const mo = new MutationObserver(() => handleRef.current?.refreshTheme());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      cancelled = true;
      mo.disconnect();
      handleRef.current?.destroy();
      handleRef.current = null;
    };
  }, [shipments]);

  useEffect(() => {
    selectedRef.current = selected;
    handleRef.current?.select(selected);
  }, [selected]);

  useEffect(() => {
    motionRef.current = motion;
    handleRef.current?.setMotion(motion);
  }, [motion]);

  function onKeyDown(e: KeyboardEvent) {
    const step: Record<string, [number, number]> = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, 10], ArrowDown: [0, -10] };
    const d = step[e.key];
    if (!d || !handleRef.current) return;
    e.preventDefault();
    handleRef.current.rotateBy(d[0], d[1]);
  }

  const summary = `Globe showing ${shipment.ref} from ${placeLabel(shipment.origin)} to ${placeLabel(shipment.destination)}. Drag, or use the arrow keys, to rotate.`;

  return (
    <div
      ref={hostRef}
      tabIndex={0}
      role="group"
      aria-roledescription="globe"
      aria-label={summary}
      onKeyDown={onKeyDown}
      className={cn("relative aspect-square w-full rounded-full", className)}
    >
      {/* Placeholder sphere until the renderer loads. */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0.5 rounded-full border border-border-strong bg-surface-1 transition-opacity duration-ui",
          ready ? "opacity-0" : "opacity-100",
        )}
      />
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full cursor-grab touch-pan-y active:cursor-grabbing" />
      <div ref={labelsRef} aria-hidden className="pointer-events-none absolute inset-0">
        {labels.map(({ id, role }) => (
          <span
            key={id}
            data-place={id}
            className="absolute left-0 top-0 flex flex-col gap-0.5 whitespace-nowrap rounded-control border border-border bg-surface-1/95 px-2 py-1 opacity-0 sm:px-2.5 sm:py-1.5"
          >
            <span className="flex items-baseline gap-2 text-small font-medium leading-tight text-text">
              {places[id].name}
              {codeOf(id) ? <span className="font-mono text-eyebrow text-text-muted">{codeOf(id)}</span> : null}
            </span>
            <span className="hidden font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted sm:block">{role}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

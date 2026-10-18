import { cn } from "@/lib/cn";
import { hubList, hubs, MAP, project, type HubId } from "@/data/demo/hubs";
import { modeLabels, statusLabels, type Mode, type Shipment } from "@/data/demo/shipments";
import { markerFill, routeStroke } from "./StatusTag";

/*
 * Schematic network map. Hubs are placed by approximate coordinates on a
 * faint graticule. National boundaries are intentionally not drawn: a
 * boundary on an Indian company's site must follow the official Survey of
 * India depiction, and a schematic needs none. Not GPS tracking.
 */

type Point = { x: number; y: number };

function geometry(origin: HubId, destination: HubId) {
  const p0 = project(hubs[origin].lat, hubs[origin].lon);
  const p1 = project(hubs[destination].lat, hubs[destination].lon);
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const len = Math.hypot(dx, dy);
  const bow = len * 0.16;
  const c = { x: (p0.x + p1.x) / 2 - (dy / len) * bow, y: (p0.y + p1.y) / 2 + (dx / len) * bow };
  const at = (t: number): Point => ({
    x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * c.x + t ** 2 * p1.x,
    y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * c.y + t ** 2 * p1.y,
  });
  return { d: `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} Q ${c.x.toFixed(1)} ${c.y.toFixed(1)} ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`, at };
}

function Marker({ mode, x, y, className, size = 1 }: { mode: Mode; x: number; y: number; className?: string; size?: number }) {
  const s = 9 * size;
  if (mode === "road") return <circle cx={x} cy={y} r={s} className={className} />;
  if (mode === "rail") return <rect x={x - s} y={y - s} width={s * 2} height={s * 2} className={className} />;
  return <polygon points={`${x},${y - s * 1.3} ${x + s * 1.3},${y} ${x},${y + s * 1.3} ${x - s * 1.3},${y}`} className={className} />;
}

export function RouteMap({
  shipments,
  selectedId,
  onSelect,
  className,
}: {
  shipments: Shipment[];
  selectedId: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const selected = shipments.find((s) => s.id === selectedId);
  // Draw the selected route last so it sits on top.
  const ordered = selected ? [...shipments.filter((s) => s.id !== selectedId), selected] : shipments;
  const summary = shipments.length
    ? `Schematic map of ${shipments.length} routes between Indian ports and hubs: ${shipments
        .map((s) => `${s.id}, ${hubs[s.origin].short} to ${hubs[s.destination].short}, ${statusLabels[s.status].toLowerCase()}`)
        .join("; ")}.`
    : "Schematic map with no routes matching the current filters.";

  return (
    <svg
      viewBox={`-110 -10 ${MAP.width + 220} ${MAP.height + 20}`}
      role="img"
      aria-label={summary}
      className={cn("h-full w-full select-none", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Graticule every 5° */}
      <g className="stroke-border" strokeWidth={1}>
        {[70, 75, 80, 85, 90].map((lon) => {
          const { x } = project(0, lon);
          return <line key={lon} x1={x} x2={x} y1={0} y2={MAP.height} strokeDasharray="2 8" />;
        })}
        {[10, 15, 20, 25, 30].map((lat) => {
          const { y } = project(lat, 0);
          return <line key={lat} x1={0} x2={MAP.width} y1={y} y2={y} strokeDasharray="2 8" />;
        })}
      </g>
      <g aria-hidden className="map-label-minor fill-text-muted font-mono max-md:hidden">
        {[70, 75, 80, 85, 90].map((lon) => (
          <text key={lon} x={project(0, lon).x + 6} y={MAP.height - 12}>
            {lon}°E
          </text>
        ))}
        {[10, 15, 20, 25, 30].map((lat) => (
          <text key={lat} x={8} y={project(lat, 0).y - 6}>
            {lat}°N
          </text>
        ))}
        <text x={project(14, 69).x} y={project(14, 69).y} letterSpacing="4">ARABIAN SEA</text>
        <text x={project(15.5, 84.5).x} y={project(15.5, 84.5).y} letterSpacing="4">BAY OF BENGAL</text>
      </g>

      {/* Routes */}
      <g fill="none" strokeLinecap="round">
        {ordered.map((s) => {
          const g = geometry(s.origin, s.destination);
          const style = routeStroke[s.status];
          const isSel = s.id === selectedId;
          return (
            <g key={s.id} className={cn(onSelect && "cursor-pointer")} onClick={onSelect ? () => onSelect(s.id) : undefined}>
              <path d={g.d} stroke="transparent" strokeWidth={22} />
              <path
                d={g.d}
                className={cn(isSel ? "stroke-accent" : style.cls, "transition-[stroke] duration-hover")}
                strokeWidth={isSel ? style.width + 2.5 : style.width}
                strokeDasharray={style.dash}
                opacity={selectedId && !isSel ? 0.55 : 1}
              />
            </g>
          );
        })}
      </g>

      {/* Hubs */}
      <g>
        {hubList.map((hub) => {
          const { x, y } = project(hub.lat, hub.lon);
          const anchor = hub.label === "left" ? "end" : hub.label === "right" ? "start" : "middle";
          const lx = hub.label === "left" ? x - 16 : hub.label === "right" ? x + 16 : x;
          const ly = hub.label === "top" ? y - 18 : hub.label === "bottom" ? y + 32 : y + 6;
          return (
            <g key={hub.id}>
              {hub.kind === "port" ? (
                <rect x={x - 7} y={y - 7} width={14} height={14} className="fill-bg stroke-text" strokeWidth={2.5} />
              ) : hub.kind === "icd" ? (
                <polygon points={`${x},${y - 9} ${x + 9},${y} ${x},${y + 9} ${x - 9},${y}`} className="fill-bg stroke-text" strokeWidth={2.5} />
              ) : (
                <circle cx={x} cy={y} r={7} className="fill-bg stroke-text" strokeWidth={2.5} />
              )}
              <text x={lx} y={ly} textAnchor={anchor} className="map-label fill-text font-sans" aria-hidden>
                {hub.short}
              </text>
            </g>
          );
        })}
      </g>

      {/* Vehicle markers at their snapshot position */}
      <g>
        {ordered
          .filter((s) => s.status !== "delivered")
          .map((s) => {
            const p = geometry(s.origin, s.destination).at(s.progress);
            const isSel = s.id === selectedId;
            return (
              <g key={s.id} className={cn(onSelect && "cursor-pointer")} onClick={onSelect ? () => onSelect(s.id) : undefined}>
                {isSel ? <Marker mode={s.mode} x={p.x} y={p.y} size={1.9} className="fill-accent/25" /> : null}
                <Marker
                  mode={s.mode}
                  x={p.x}
                  y={p.y}
                  size={isSel ? 1.2 : 1}
                  className={cn(isSel ? "fill-accent" : markerFill[s.status], "stroke-bg")}
                />
              </g>
            );
          })}
      </g>
    </svg>
  );
}

export function MapLegend({ className }: { className?: string }) {
  const lines = [
    { label: "On time", style: routeStroke["on-time"] },
    { label: "At risk", style: routeStroke["at-risk"] },
    { label: "Delayed", style: routeStroke.delayed },
    { label: "Delivered", style: routeStroke.delivered },
  ];
  const modes: Mode[] = ["road", "rail", "port"];
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 text-small text-text-muted", className)}>
      {lines.map((l) => (
        <span key={l.label} className="inline-flex items-center gap-2">
          <svg aria-hidden viewBox="0 0 32 8" className="h-2 w-8">
            <line x1="2" y1="4" x2="30" y2="4" className={l.style.cls} strokeWidth={l.style.width - 0.5} strokeDasharray={l.style.dash ? l.style.dash.split(" ").map((n) => Number(n) * 0.6).join(" ") : undefined} strokeLinecap="round" />
          </svg>
          {l.label}
        </span>
      ))}
      <span aria-hidden className="h-4 w-px bg-border" />
      {modes.map((m) => (
        <span key={m} className="inline-flex items-center gap-2">
          <svg aria-hidden viewBox="-12 -12 24 24" className="size-3.5">
            <Marker mode={m} x={0} y={0} size={0.95} className="fill-text-muted" />
          </svg>
          {modeLabels[m]}
        </span>
      ))}
    </div>
  );
}

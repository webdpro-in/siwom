import type { ReactNode } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  Gauge,
  LayoutDashboard,
  ListChecks,
  RotateCcw,
  Search,
  Siren,
  Truck,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { DemoBanner } from "@/components/ui/Callout";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { FilterChips } from "@/components/ui/FilterChips";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { EmptyState } from "@/components/ui/States";
import { Tabs } from "@/components/ui/Tabs";
import { fleet, vehicleStatusLabels, type Vehicle } from "@/data/demo/fleet";
import { hubList, hubs, type Hub } from "@/data/demo/hubs";
import { modeLabels, shipments as allShipments, SNAPSHOT, type Mode, type Shipment, type ShipmentStatus } from "@/data/demo/shipments";
import {
  availableVehicles,
  etaDelta,
  hasFilters,
  jobs,
  summary,
  visibleExceptions,
  visibleShipments,
  type DemoState,
  type LogisticsViewId,
  type MobileTab,
  type SortKey,
} from "./model";
import { MapLegend, RouteMap } from "./RouteMap";
import { StatusTag } from "./StatusTag";

export type LogisticsActions = {
  setView: (view: LogisticsViewId) => void;
  setMobileTab: (tab: MobileTab) => void;
  setQuery: (q: string) => void;
  toggleStatus: (s: ShipmentStatus) => void;
  toggleMode: (m: Mode) => void;
  clearFilters: () => void;
  select: (id: string) => void;
  acknowledge: (exceptionId: string) => void;
  choose: (jobId: string, vehicleId: string) => void;
  assign: (jobId: string) => void;
  sort: (key: SortKey) => void;
  dismissHint: () => void;
  reset: () => void;
};

const railItems: { id: LogisticsViewId; label: string; Icon: typeof Gauge }[] = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "shipments", label: "Shipments", Icon: ListChecks },
  { id: "fleet", label: "Fleet", Icon: Truck },
  { id: "dispatch", label: "Dispatch", Icon: ArrowRight },
  { id: "exceptions", label: "Exceptions", Icon: Siren },
  { id: "sites", label: "Sites", Icon: Building2 },
];

const statusOptions: { value: ShipmentStatus; label: string }[] = [
  { value: "on-time", label: "On time" },
  { value: "at-risk", label: "At risk" },
  { value: "delayed", label: "Delayed" },
  { value: "delivered", label: "Delivered" },
];
const modeOptions: { value: Mode; label: string }[] = [
  { value: "road", label: "Road" },
  { value: "rail", label: "Rail" },
  { value: "port", label: "Port" },
];

function Panel({
  id,
  title,
  meta,
  children,
  className,
  bodyClassName,
  panelProps,
}: {
  id: string;
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  panelProps?: Record<string, string | number | undefined>;
}) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className={cn("flex min-w-0 flex-col rounded-card border border-border bg-surface-1", className)}
      {...panelProps}
    >
      <header className="flex min-h-12 items-center justify-between gap-3 border-b border-border px-4">
        <h3 id={`${id}-title`} className="font-sans text-small font-medium text-text">
          {title}
        </h3>
        {meta}
      </header>
      <div className={cn("min-h-0 flex-1", bodyClassName)}>{children}</div>
    </section>
  );
}

/**
 * The whole Logistics OS demo as a pure function of state. Rendered on the
 * server (no actions) as the poster, and on the client with actions wired.
 */
export function LogisticsView({
  state,
  actions,
  idBase = "lgx",
  desktop = true,
  loadingLabel,
  overlay,
}: {
  state: DemoState;
  actions?: LogisticsActions;
  idBase?: string;
  /** Only changes ARIA roles; layout switches with CSS breakpoints. */
  desktop?: boolean;
  loadingLabel?: string;
  overlay?: ReactNode;
}) {
  const visible = visibleShipments(state);
  const exc = visibleExceptions(state, visible);
  const stats = summary(state, visible, exc);
  const { unassigned, assigned } = jobs(state);
  const vehicles = availableVehicles(state);
  const filtered = hasFilters(state);
  const view = state.view;
  const tab = state.mobileTab;

  /** Visibility per panel: mobile follows tabs; desktop follows the rail view. */
  const show = (panel: MobileTab | "summary", desktopViews: LogisticsViewId[]) =>
    cn(panel !== "summary" && tab !== panel && "max-lg:hidden", !desktopViews.includes(view) && "lg:hidden");
  const tabPanel = (panel: MobileTab) =>
    desktop ? {} : { role: "tabpanel", id: `${idBase}-panel-${panel}`, "aria-labelledby": `${idBase}-tab-${panel}`, tabIndex: 0 };

  const clearAction = (
    <button
      type="button"
      onClick={actions?.clearFilters}
      className="inline-flex h-10 items-center rounded-control border border-border-strong px-4 text-small font-medium text-text hover:bg-surface-2"
    >
      Clear filters
    </button>
  );

  const shipmentColumns: (Column<Shipment, SortKey | "route" | "mode" | "vehicle"> & { wideOnly?: boolean })[] = [
    { key: "id", header: "Shipment", cell: (s) => s.id, sortable: true, className: "whitespace-nowrap" },
    {
      key: "route",
      header: "Route",
      cell: (s) => (
        <span className="text-text">
          {hubs[s.origin].short} <span aria-hidden>→</span>
          <span className="sr-only">to</span> {hubs[s.destination].short}
        </span>
      ),
    },
    { key: "mode", header: "Mode", cell: (s) => modeLabels[s.mode], wideOnly: true },
    { key: "status", header: "Status", cell: (s) => <StatusTag status={s.status} />, sortable: true, hideOnCard: true },
    {
      key: "eta",
      header: "ETA (IST)",
      sortable: true,
      cell: (s) => (
        <span className="flex flex-col whitespace-nowrap leading-tight">
          <span className="font-mono text-text">{s.currentEta}</span>
          <span className={cn("font-mono text-eyebrow", s.status === "delayed" ? "text-sev-high" : s.status === "at-risk" ? "text-sev-medium" : "text-text-muted")}>
            {etaDelta(s)}
          </span>
        </span>
      ),
    },
    { key: "distance", header: "Distance", sortable: true, align: "right", cell: (s) => `${s.distanceKm.toLocaleString("en-IN")} km`, wideOnly: true, className: "whitespace-nowrap" },
    { key: "vehicle", header: "Vehicle", cell: (s) => <span className="font-mono">{s.vehicleId}</span>, wideOnly: true },
  ];
  // The overview table shows the essentials; the Shipments view shows every column.
  const tableColumns = view === "shipments" ? shipmentColumns : shipmentColumns.filter((c) => !(c as { wideOnly?: boolean }).wideOnly);

  const fleetColumns: Column<Vehicle, "id" | "type" | "status" | "location" | "shipment">[] = [
    { key: "id", header: "Vehicle", cell: (v) => v.id },
    { key: "type", header: "Type", cell: (v) => v.type },
    {
      key: "status",
      header: "Status",
      cell: (v) => (
        <span className={cn("inline-flex items-center gap-1.5", v.status === "available" ? "text-text" : v.status === "maintenance" ? "text-sev-medium" : "text-text-muted")}>
          {v.status === "available" ? <Check aria-hidden className="size-3.5 text-accent-text" /> : null}
          {Object.values(state.assignments).includes(v.id) ? "Assigned" : vehicleStatusLabels[v.status]}
        </span>
      ),
    },
    { key: "location", header: "Last hub", cell: (v) => hubs[v.location].short },
    { key: "shipment", header: "Shipment", cell: (v) => <span className="font-mono">{v.shipmentId ?? "—"}</span> },
  ];

  const siteColumns: Column<Hub, "name" | "kind" | "outbound" | "inbound" | "vehicles">[] = [
    { key: "name", header: "Site", cell: (h) => h.name },
    { key: "kind", header: "Type", cell: (h) => (h.kind === "port" ? "Port" : h.kind === "icd" ? "Inland container depot" : "Hub") },
    { key: "outbound", header: "Outbound", align: "right", cell: (h) => allShipments.filter((s) => s.origin === h.id && s.status !== "delivered").length },
    { key: "inbound", header: "Inbound", align: "right", cell: (h) => allShipments.filter((s) => s.destination === h.id && s.status !== "delivered").length },
    { key: "vehicles", header: "Trucks available", align: "right", cell: (h) => vehicles.filter((v) => v.location === h.id).length },
  ];

  const exceptionList =
    exc.length === 0 ? (
      <EmptyState className="m-4" title="No exceptions match these filters" description="Exceptions follow the same filters as the map and table." action={filtered ? clearAction : undefined} />
    ) : (
      <ul className="flex flex-col divide-y divide-border">
        {exc.map((e) => {
          const ack = state.acknowledged.includes(e.id);
          const s = allShipments.find((x) => x.id === e.shipmentId)!;
          const selected = state.selectedId === s.id;
          return (
            <li key={e.id} className={cn("relative flex flex-col gap-2 px-4 py-3 transition-colors duration-hover hover:bg-surface-2", selected && "bg-surface-3")}>
              {selected ? <span aria-hidden className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" /> : null}
              <div className="flex items-center justify-between gap-2">
                <SeverityBadge severity={e.severity} />
                <span className="font-mono text-eyebrow text-text-muted">{e.delay}</span>
              </div>
              <button
                type="button"
                onClick={actions ? () => actions.select(s.id) : undefined}
                aria-pressed={selected}
                className="text-left after:absolute after:inset-0 after:content-['']"
              >
                <span className="block text-small font-medium text-text">{e.title}</span>
                <span className="mt-0.5 block font-mono text-eyebrow text-text-muted">
                  {s.id} · {hubs[s.origin].short} → {hubs[s.destination].short}
                </span>
              </button>
              <div className="relative flex items-center justify-between gap-2">
                <span className="text-eyebrow font-mono text-text-muted">{e.raisedAt}</span>
                {ack ? (
                  <span className="inline-flex h-8 items-center gap-1.5 text-small text-text-muted">
                    <Check aria-hidden className="size-4 text-accent-text" /> Acknowledged
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={actions ? () => actions.acknowledge(e.id) : undefined}
                    className="relative z-10 inline-flex h-8 items-center rounded-control border border-border-strong px-3 text-small font-medium text-text hover:border-text-muted hover:bg-surface-3 after:absolute after:-inset-y-1.5 after:inset-x-0 after:content-['']"
                  >
                    Acknowledge<span className="sr-only"> {e.id}</span>
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );

  const dispatchPanel =
    unassigned.length === 0 && assigned.length === 0 ? null : (
      <div className="flex flex-col">
        <p className="px-4 pt-3 font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Unassigned · {unassigned.length}</p>
        {unassigned.length === 0 ? (
          <p className="px-4 py-3 text-small text-text-muted">All loads in the queue have a vehicle.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {unassigned.map((j) => {
              const choice = state.pending[j.id] ?? "";
              const atOrigin = vehicles.filter((v) => v.location === j.origin);
              const others = vehicles.filter((v) => v.location !== j.origin);
              return (
                <li key={j.id} className="flex flex-col gap-2 px-4 py-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-small text-text">{j.id}</span>
                    <span className="font-mono text-eyebrow text-text-muted">Pickup {j.pickup}</span>
                  </div>
                  <p className="text-small text-text-muted">
                    {hubs[j.origin].short} <span aria-hidden>→</span>
                    <span className="sr-only">to</span> {hubs[j.destination].short} · {j.load}
                  </p>
                  <div className="flex gap-2">
                    <label htmlFor={`${idBase}-assign-${j.id}`} className="sr-only">
                      Vehicle for {j.id}
                    </label>
                    <select
                      id={`${idBase}-assign-${j.id}`}
                      value={actions ? choice : undefined}
                      defaultValue={actions ? undefined : choice}
                      onChange={actions ? (e) => actions.choose(j.id, e.target.value) : undefined}
                      disabled={vehicles.length === 0}
                      className="h-10 min-w-0 flex-1 appearance-none rounded-control border border-border-control bg-surface-3 px-3 text-body text-text"
                    >
                      <option value="">{vehicles.length ? "Choose a vehicle" : "No vehicles available"}</option>
                      {atOrigin.length ? (
                        <optgroup label={`At ${hubs[j.origin].short}`}>
                          {atOrigin.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.id} · {v.type}
                            </option>
                          ))}
                        </optgroup>
                      ) : null}
                      {others.length ? (
                        <optgroup label="Other hubs">
                          {others.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.id} · at {hubs[v.location].short}
                            </option>
                          ))}
                        </optgroup>
                      ) : null}
                    </select>
                    <button
                      type="button"
                      disabled={!choice}
                      onClick={actions ? () => actions.assign(j.id) : undefined}
                      className="inline-flex h-10 shrink-0 items-center rounded-control bg-accent px-4 text-small font-medium text-accent-ink disabled:bg-surface-3 disabled:text-text-subtle"
                    >
                      Assign<span className="sr-only"> vehicle to {j.id}</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <p className="border-t border-border px-4 pt-3 font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Assigned · {assigned.length}</p>
        {assigned.length === 0 ? (
          <p className="px-4 py-3 text-small text-text-muted">Assigned loads appear here.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {assigned.map((j) => (
              <li key={j.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="flex flex-col">
                  <span className="font-mono text-small text-text">{j.id}</span>
                  <span className="text-small text-text-muted">
                    {hubs[j.origin].short} → {hubs[j.destination].short}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-small text-text">
                  <Check aria-hidden className="size-4 text-accent-text" />
                  {state.assignments[j.id]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );

  const cards = [
    { label: "Shipments in transit · demo", value: stats.inTransit, note: `of ${visible.length} shown` },
    { label: "At risk · demo", value: stats.atRisk, note: `incl. ${stats.delayed} delayed` },
    { label: "Vehicles available · demo", value: stats.vehiclesAvailable, note: "trucks ready to dispatch" },
    { label: "Open exceptions · demo", value: stats.openExceptions, note: `${state.acknowledged.length} acknowledged` },
  ];

  return (
    <div className="relative overflow-hidden rounded-panel border border-border-strong bg-bg" aria-busy={loadingLabel ? true : undefined}>
      <DemoBanner />
      <div className="flex">
        {/* Left rail (desktop) */}
        <nav aria-label="Demo views" className="hidden w-48 shrink-0 flex-col gap-1 border-r border-border bg-surface-1 p-3 lg:flex">
          <p className="px-2 pb-2 pt-1 font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Logistics OS</p>
          {railItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={actions ? () => actions.setView(id) : undefined}
              className={cn(
                "relative flex h-10 items-center gap-3 rounded-control px-2.5 text-small transition-colors duration-hover",
                view === id ? "bg-surface-3 text-text" : "text-text-muted hover:bg-surface-2 hover:text-text",
              )}
            >
              {view === id ? <span aria-hidden className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" /> : null}
              <Icon aria-hidden className="size-4.5" strokeWidth={1.5} />
              {label}
              {id === "exceptions" && stats.openExceptions > 0 ? (
                <span className="ml-auto rounded-full bg-surface-3 px-1.5 font-mono text-eyebrow tabular text-text">{stats.openExceptions}</span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          {/* Top bar */}
          <div className="flex flex-col gap-3 border-b border-border px-4 py-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <div className="relative min-w-0 basis-full lg:flex-1 lg:basis-56">
                <label htmlFor={`${idBase}-search`} className="sr-only">
                  Search shipments, customers, vehicles or hubs
                </label>
                <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                <input
                  id={`${idBase}-search`}
                  type="search"
                  value={state.query}
                  onChange={actions ? (e) => actions.setQuery(e.target.value) : undefined}
                  readOnly={!actions}
                  placeholder="Search shipments, vehicles, hubs"
                  autoComplete="off"
                  className="h-10 w-full rounded-control border border-border-control bg-surface-3 pl-9 pr-3 text-body text-text placeholder:text-text-muted"
                />
              </div>
              <span className="inline-flex h-10 items-center gap-2 rounded-control border border-border px-3 text-small text-text">
                <span className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Today</span>
                {SNAPSHOT.date}
              </span>
              <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono text-eyebrow text-text-muted">
                <span>{SNAPSHOT.label.split(", ")[1]}</span>
                <span aria-hidden>·</span>
                <span>Snapshot · demo</span>
              </span>
              <button
                type="button"
                onClick={actions?.reset}
                className="ml-auto inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-control px-3 text-small font-medium text-text-muted hover:bg-surface-2 hover:text-text"
              >
                <RotateCcw aria-hidden className="size-4" strokeWidth={1.75} />
                Reset demo
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <FilterChips label="Status" options={statusOptions} selected={state.statuses} onToggle={actions?.toggleStatus} onClear={actions ? () => state.statuses.forEach((s) => actions.toggleStatus(s)) : undefined} />
              <FilterChips label="Mode" options={modeOptions} selected={state.modes} onToggle={actions?.toggleMode} onClear={actions ? () => state.modes.forEach((m) => actions.toggleMode(m)) : undefined} />
              {loadingLabel ? (
                <span role="status" className="inline-flex items-center gap-2 text-small text-text-muted">
                  <span aria-hidden className="size-2 animate-skeleton rounded-full bg-text-muted" />
                  {loadingLabel}
                </span>
              ) : null}
            </div>
            {!state.hintDismissed ? (
              <div className="flex items-center justify-between gap-3 rounded-control border border-border bg-surface-2 py-1.5 pl-3 pr-1 text-small text-text">
                <span>
                  <span className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">Try </span>
                  Select a delayed shipment in the table, on the map or in Exceptions.
                </span>
                <button
                  type="button"
                  onClick={actions?.dismissHint}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-control text-text-muted hover:bg-surface-3 hover:text-text"
                >
                  <X aria-hidden className="size-4" />
                  <span className="sr-only">Dismiss hint</span>
                </button>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-12">
            {/* Summary cards: scroll-snap row on mobile, 4-up on desktop */}
            <div className={cn("order-1 lg:order-3 lg:col-span-12", show("summary", ["overview"]))}>
              {/* Focusable so keyboard users can scroll the row on mobile. */}
              <dl
                tabIndex={0}
                aria-label="Summary, demo data"
                className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 no-scrollbar lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0"
              >
                {cards.map((c) => (
                  <div key={c.label} className="flex shrink-0 basis-[68%] snap-start flex-col gap-1.5 rounded-card border border-border bg-surface-1 p-4 sm:basis-[40%] lg:basis-auto">
                    <dt className="font-mono text-eyebrow uppercase tracking-eyebrow text-text-muted">{c.label}</dt>
                    <dd className="font-mono text-h3 font-medium tabular text-text">{c.value}</dd>
                    <dd className="text-small text-text-muted">{c.note}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Mobile tabs */}
            <Tabs<MobileTab>
              className="order-2 lg:hidden"
              label="Demo sections"
              idBase={idBase}
              panelIdPrefix={`${idBase}-panel`}
              renderPanels={false}
              value={tab}
              onValueChange={actions?.setMobileTab}
              items={[
                { value: "map", label: "Map" },
                { value: "shipments", label: "Shipments" },
                { value: "exceptions", label: `Exceptions · ${stats.openExceptions}` },
                { value: "dispatch", label: "Dispatch" },
              ]}
            />

            <Panel
              id={`${idBase}-map`}
              title="Network map · schematic"
              meta={<span className="font-mono text-eyebrow text-text-muted">{visible.length} routes</span>}
              className={cn("order-3 lg:order-1 lg:col-span-7", show("map", ["overview"]))}
              bodyClassName="flex flex-col"
              panelProps={tabPanel("map")}
            >
              <div className="relative aspect-square max-h-120 w-full sm:aspect-auto sm:h-96 lg:h-108">
                <RouteMap shipments={visible} selectedId={state.selectedId} onSelect={actions?.select} className="absolute inset-0 p-2" />
                {visible.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <EmptyState className="bg-bg/90" title="No routes match these filters" action={clearAction} />
                  </div>
                ) : null}
              </div>
              <div className="border-t border-border px-4 py-3">
                <MapLegend />
                <p className="mt-2 text-small text-text-muted">Schematic, not to scale. Positions are snapshot values, not GPS tracking.</p>
              </div>
            </Panel>

            <Panel
              id={`${idBase}-exceptions`}
              title="Exceptions"
              meta={<span className="font-mono text-eyebrow text-text-muted">{stats.openExceptions} open · by severity</span>}
              className={cn(
                "order-3 lg:order-2",
                view === "exceptions" ? "lg:col-span-12" : "lg:col-span-5",
                show("exceptions", ["overview", "exceptions"]),
              )}
              bodyClassName={cn("overflow-y-auto", view === "exceptions" ? "lg:max-h-none" : "lg:max-h-140")}
              panelProps={tabPanel("exceptions")}
            >
              {exceptionList}
            </Panel>

            <Panel
              id={`${idBase}-shipments`}
              title="Shipments"
              meta={<span className="font-mono text-eyebrow text-text-muted">{visible.length} of {allShipments.length}</span>}
              className={cn("order-3 lg:order-4", view === "shipments" ? "lg:col-span-12" : "lg:col-span-8", show("shipments", ["overview", "shipments"]))}
              panelProps={tabPanel("shipments")}
            >
              <DataTable
                caption="Shipments, demo data"
                columns={tableColumns}
                rows={visible}
                getRowId={(s) => s.id}
                rowLabel={(s) => s.id}
                selectedId={state.selectedId}
                onSelect={actions?.select}
                sort={state.sort}
                onSortChange={actions ? (key) => (["id", "status", "eta", "distance"].includes(key) ? actions.sort(key as SortKey) : undefined) : undefined}
                cardAside={(s) => <StatusTag status={s.status} />}
                maxHeightClass={view === "shipments" ? "max-h-none" : "max-h-104"}
                className="md:p-0 max-md:p-3"
                empty={<EmptyState className="m-4" title="No shipments match these filters" description="Try removing a status or mode filter, or clearing the search." action={clearAction} />}
              />
            </Panel>

            <Panel
              id={`${idBase}-dispatch`}
              title="Dispatch queue"
              meta={<span className="font-mono text-eyebrow text-text-muted">{vehicles.length} trucks free</span>}
              className={cn("order-3 lg:order-5", view === "dispatch" ? "lg:col-span-12" : "lg:col-span-4", show("dispatch", ["overview", "dispatch"]))}
              bodyClassName={cn("overflow-y-auto", view === "dispatch" ? "" : "lg:max-h-104")}
              panelProps={tabPanel("dispatch")}
            >
              {dispatchPanel}
            </Panel>

            {view === "fleet" ? (
              <Panel id={`${idBase}-fleet`} title="Fleet" meta={<span className="font-mono text-eyebrow text-text-muted">{fleet.length} vehicles</span>} className="order-3 max-lg:hidden lg:col-span-12">
                <DataTable caption="Fleet, demo data" columns={fleetColumns} rows={fleet} getRowId={(v) => v.id} rowLabel={(v) => v.id} maxHeightClass="max-h-none" />
              </Panel>
            ) : null}
            {view === "sites" ? (
              <Panel id={`${idBase}-sites`} title="Sites" meta={<span className="font-mono text-eyebrow text-text-muted">{hubList.length} hubs</span>} className="order-3 max-lg:hidden lg:col-span-12">
                <DataTable caption="Sites, demo data" columns={siteColumns} rows={hubList} getRowId={(h) => h.id} rowLabel={(h) => h.name} maxHeightClass="max-h-none" />
              </Panel>
            ) : null}
          </div>
        </div>
      </div>
      {overlay}
    </div>
  );
}

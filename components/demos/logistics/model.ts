/*
 * Pure state model for the Logistics demo. No React here, so the same
 * initial state renders the server poster and the interactive client demo.
 */
import type { SortState } from "@/components/ui/DataTable";
import { severityMeta } from "@/components/ui/SeverityBadge";
import { exceptions, type DeliveryException } from "@/data/demo/exceptions";
import { dispatchQueue, fleet } from "@/data/demo/fleet";
import { hubs } from "@/data/demo/hubs";
import { shipments, type Mode, type Shipment, type ShipmentStatus } from "@/data/demo/shipments";

export type LogisticsViewId = "overview" | "shipments" | "fleet" | "dispatch" | "exceptions" | "sites";
export type MobileTab = "map" | "shipments" | "exceptions" | "dispatch";
export type SortKey = "id" | "status" | "eta" | "distance";

export type DemoState = {
  view: LogisticsViewId;
  mobileTab: MobileTab;
  query: string;
  statuses: ShipmentStatus[];
  modes: Mode[];
  selectedId: string | null;
  drawerOpen: boolean;
  acknowledged: string[];
  /** Dispatch job id → vehicle id once assigned. */
  assignments: Record<string, string>;
  /** Dispatch job id → vehicle chosen in the select but not yet assigned. */
  pending: Record<string, string>;
  sort: SortState<SortKey>;
  hintDismissed: boolean;
};

export const initialState: DemoState = {
  view: "overview",
  mobileTab: "map",
  query: "",
  statuses: [],
  modes: [],
  selectedId: null,
  drawerOpen: false,
  acknowledged: [],
  assignments: {},
  pending: {},
  sort: { key: "status", direction: "asc" },
  hintDismissed: false,
};

export type Action =
  | { type: "view"; view: LogisticsViewId }
  | { type: "mobileTab"; tab: MobileTab }
  | { type: "query"; query: string }
  | { type: "toggleStatus"; status: ShipmentStatus }
  | { type: "toggleMode"; mode: Mode }
  | { type: "clearFilters" }
  | { type: "select"; id: string }
  | { type: "closeDrawer" }
  | { type: "acknowledge"; exceptionId: string }
  | { type: "choose"; jobId: string; vehicleId: string }
  | { type: "assign"; jobId: string }
  | { type: "sort"; key: SortKey }
  | { type: "dismissHint" }
  | { type: "hydrate"; partial: Partial<DemoState> }
  | { type: "reset" };

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

export function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case "view":
      return { ...state, view: action.view };
    case "mobileTab":
      return { ...state, mobileTab: action.tab };
    case "query":
      return { ...state, query: action.query };
    case "toggleStatus":
      return { ...state, statuses: toggle(state.statuses, action.status) };
    case "toggleMode":
      return { ...state, modes: toggle(state.modes, action.mode) };
    case "clearFilters":
      return { ...state, statuses: [], modes: [], query: "" };
    case "select":
      return { ...state, selectedId: action.id, drawerOpen: true, hintDismissed: true };
    case "closeDrawer":
      return { ...state, drawerOpen: false };
    case "acknowledge":
      return state.acknowledged.includes(action.exceptionId)
        ? state
        : { ...state, acknowledged: [...state.acknowledged, action.exceptionId] };
    case "choose":
      return { ...state, pending: { ...state.pending, [action.jobId]: action.vehicleId } };
    case "assign": {
      const vehicleId = state.pending[action.jobId];
      if (!vehicleId) return state;
      const pending = { ...state.pending };
      delete pending[action.jobId];
      return { ...state, assignments: { ...state.assignments, [action.jobId]: vehicleId }, pending };
    }
    case "sort": {
      const same = state.sort?.key === action.key;
      return {
        ...state,
        sort: { key: action.key, direction: same && state.sort?.direction === "asc" ? "desc" : "asc" },
      };
    }
    case "dismissHint":
      return { ...state, hintDismissed: true };
    case "hydrate":
      return { ...state, ...action.partial };
    case "reset":
      return { ...initialState, hintDismissed: false };
  }
}

/* ---------- Selectors ---------- */

const statusRank: Record<ShipmentStatus, number> = { delayed: 0, "at-risk": 1, "on-time": 2, delivered: 3 };

/** "19 Oct, 02:30" → minutes since 1 Oct, for sorting. */
export function etaMinutes(eta: string) {
  const m = eta.match(/(\d+) \w+, (\d+):(\d+)/);
  if (!m) return 0;
  return Number(m[1]) * 1440 + Number(m[2]) * 60 + Number(m[3]);
}

export function etaDelta(s: Shipment) {
  const diff = etaMinutes(s.currentEta) - etaMinutes(s.plannedEta);
  if (diff === 0) return "On plan";
  const sign = diff > 0 ? "+" : "−";
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const min = abs % 60;
  return `${sign}${h ? `${h} h ` : ""}${String(min).padStart(2, "0")} min`;
}

export function matchesQuery(s: Shipment, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [s.id, s.customer, s.vehicleId, hubs[s.origin].name, hubs[s.destination].name, s.cargo]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

export function visibleShipments(state: DemoState): Shipment[] {
  const list = shipments.filter(
    (s) =>
      (state.statuses.length === 0 || state.statuses.includes(s.status)) &&
      (state.modes.length === 0 || state.modes.includes(s.mode)) &&
      matchesQuery(s, state.query),
  );
  const sort = state.sort;
  if (!sort) return list;
  const dir = sort.direction === "asc" ? 1 : -1;
  return [...list].sort((a, b) => {
    switch (sort.key) {
      case "id":
        return a.id.localeCompare(b.id) * dir;
      case "status":
        return (statusRank[a.status] - statusRank[b.status] || etaMinutes(a.currentEta) - etaMinutes(b.currentEta)) * dir;
      case "eta":
        return (etaMinutes(a.currentEta) - etaMinutes(b.currentEta)) * dir;
      case "distance":
        return (a.distanceKm - b.distanceKm) * dir;
    }
  });
}

export function visibleExceptions(state: DemoState, visible: Shipment[]): DeliveryException[] {
  const ids = new Set(visible.map((s) => s.id));
  return exceptions
    .filter((e) => ids.has(e.shipmentId))
    .sort((a, b) => severityMeta[a.severity].rank - severityMeta[b.severity].rank);
}

export function availableVehicles(state: DemoState) {
  const assigned = new Set(Object.values(state.assignments));
  return fleet.filter((v) => v.status === "available" && !assigned.has(v.id));
}

export function summary(state: DemoState, visible: Shipment[], visibleExc: DeliveryException[]) {
  const roadVisible = state.modes.length === 0 || state.modes.includes("road");
  return {
    inTransit: visible.filter((s) => s.status !== "delivered").length,
    atRisk: visible.filter((s) => s.status === "at-risk" || s.status === "delayed").length,
    delayed: visible.filter((s) => s.status === "delayed").length,
    vehiclesAvailable: roadVisible ? availableVehicles(state).length : 0,
    openExceptions: visibleExc.filter((e) => !state.acknowledged.includes(e.id)).length,
  };
}

export function jobs(state: DemoState) {
  return {
    unassigned: dispatchQueue.filter((j) => !state.assignments[j.id]),
    assigned: dispatchQueue.filter((j) => state.assignments[j.id]),
  };
}

export function hasFilters(state: DemoState) {
  return state.statuses.length > 0 || state.modes.length > 0 || state.query.trim() !== "";
}

/* ---------- URL state ---------- */

const STATUSES: ShipmentStatus[] = ["on-time", "at-risk", "delayed", "delivered"];
const MODES: Mode[] = ["road", "rail", "port"];

export function fromSearch(search: string): Partial<DemoState> {
  const params = new URLSearchParams(search);
  const statuses = (params.get("status") ?? "").split(",").filter((s): s is ShipmentStatus => STATUSES.includes(s as ShipmentStatus));
  const modes = (params.get("mode") ?? "").split(",").filter((m): m is Mode => MODES.includes(m as Mode));
  const query = params.get("q") ?? "";
  return { statuses, modes, query };
}

export function toSearch(state: DemoState, current: string) {
  const params = new URLSearchParams(current);
  const set = (key: string, value: string) => (value ? params.set(key, value) : params.delete(key));
  set("status", state.statuses.join(","));
  set("mode", state.modes.join(","));
  set("q", state.query.trim());
  const s = params.toString();
  return s ? `?${s.replace(/%2C/g, ",")}` : "";
}

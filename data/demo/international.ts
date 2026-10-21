/*
 * ILLUSTRATIVE DEMO DATA for the international shipment workspace. Port,
 * airport and city positions and UN/LOCODEs are real; every shipment,
 * reference, date and status is fictional and not connected to live
 * operations. Ocean legs follow approximate sea lanes through real straits
 * and canals (waypoints below), so no route crosses land. Dates are stored as
 * day offsets from today, so the demo never shows stale dates.
 *
 * SIWOM coordinates and shows status; the parties named by role (carrier,
 * terminal, customs broker, inland partner) perform the services.
 */
import type { Severity } from "@/components/ui/SeverityBadge";

export type LatLon = readonly [lat: number, lon: number];
export type Mode = "ocean" | "air" | "road" | "rail";
export type LegStatus = "done" | "current" | "upcoming";
export type ShipmentStatus = "booked" | "in-transit" | "at-port" | "customs" | "delayed";
export type Industry = "space" | "automotive" | "robotics" | "energy";
export type DocStatus = "ready" | "pending" | "action";

export type Place = {
  id: string;
  name: string;
  country: string;
  /** UN/LOCODE for ports, IATA code for airports. */
  code?: string;
  kind: "port" | "airport" | "city" | "depot";
  at: LatLon;
};

export const places = {
  eindhoven: { id: "eindhoven", name: "Eindhoven", country: "Netherlands", kind: "city", at: [51.44, 5.48] },
  rotterdam: { id: "rotterdam", name: "Rotterdam", country: "Netherlands", code: "NLRTM", kind: "port", at: [51.95, 4.12] },
  nhavaSheva: { id: "nhavaSheva", name: "Nhava Sheva (Mumbai)", country: "India", code: "INNSA", kind: "port", at: [18.95, 72.95] },
  pune: { id: "pune", name: "Pune", country: "India", kind: "city", at: [18.52, 73.86] },
  singaporeCity: { id: "singaporeCity", name: "Singapore", country: "Singapore", kind: "city", at: [1.35, 103.82] },
  singapore: { id: "singapore", name: "Singapore", country: "Singapore", code: "SGSIN", kind: "port", at: [1.26, 103.84] },
  chennai: { id: "chennai", name: "Chennai", country: "India", code: "INMAA", kind: "port", at: [13.1, 80.3] },
  bengaluru: { id: "bengaluru", name: "Bengaluru", country: "India", kind: "city", at: [12.97, 77.59] },
  dubai: { id: "dubai", name: "Dubai", country: "UAE", kind: "city", at: [25.2, 55.27] },
  jebelAli: { id: "jebelAli", name: "Jebel Ali (Dubai)", country: "UAE", code: "AEJEA", kind: "port", at: [25.01, 55.06] },
  mundra: { id: "mundra", name: "Mundra", country: "India", code: "INMUN", kind: "port", at: [22.74, 69.7] },
  newDelhi: { id: "newDelhi", name: "New Delhi", country: "India", kind: "depot", at: [28.51, 77.29] },
  losAngeles: { id: "losAngeles", name: "Los Angeles", country: "United States", code: "USLAX", kind: "port", at: [33.74, -118.26] },
  chicago: { id: "chicago", name: "Chicago", country: "United States", kind: "city", at: [41.88, -87.63] },
  darmstadt: { id: "darmstadt", name: "Darmstadt", country: "Germany", kind: "city", at: [49.87, 8.65] },
  frankfurt: { id: "frankfurt", name: "Frankfurt", country: "Germany", code: "FRA", kind: "airport", at: [50.03, 8.57] },
  blrAirport: { id: "blrAirport", name: "Bengaluru airport", country: "India", code: "BLR", kind: "airport", at: [13.2, 77.71] },
  shanghaiCity: { id: "shanghaiCity", name: "Shanghai", country: "China", kind: "city", at: [31.23, 121.47] },
  shanghai: { id: "shanghai", name: "Shanghai", country: "China", code: "CNSHA", kind: "port", at: [30.62, 122.07] },
  ahmedabad: { id: "ahmedabad", name: "Ahmedabad", country: "India", kind: "city", at: [23.03, 72.58] },
} as const satisfies Record<string, Place>;

export type PlaceId = keyof typeof places;

/* Sea lanes: approximate waypoints in open water, from port to port. */
const ROTTERDAM_NHAVA_SHEVA: LatLon[] = [
  [51.95, 4.12], [51.6, 2.9], [50.95, 1.45], [50.2, -1.0], [49.4, -4.2], [48.4, -6.0], [44.0, -9.7],
  [38.7, -9.9], [36.9, -9.0], [35.95, -5.75], [36.4, -2.0], [37.6, 3.5], [37.4, 10.8], [35.9, 14.8],
  [34.0, 23.0], [31.6, 32.3], [30.4, 32.4], [29.9, 32.55], [27.8, 33.7], [24.0, 36.3], [19.0, 39.5],
  [15.0, 41.9], [12.6, 43.35], [12.2, 45.5], [13.2, 51.0], [15.5, 58.5], [18.0, 68.0], [18.95, 72.95],
];
const SINGAPORE_CHENNAI: LatLon[] = [
  [1.26, 103.84], [1.9, 102.3], [2.9, 100.9], [4.3, 99.3], [5.8, 97.2], [6.1, 94.8], [8.5, 90.0], [11.5, 84.5], [13.1, 80.3],
];
const JEBEL_ALI_MUNDRA: LatLon[] = [
  [25.01, 55.06], [25.3, 55.2], [26.2, 55.9], [26.55, 56.45], [25.6, 57.3], [24.6, 59.0], [23.5, 63.0], [22.9, 67.5], [22.74, 69.7],
];
const NHAVA_SHEVA_LOS_ANGELES: LatLon[] = [
  [18.95, 72.95], [17.0, 72.3], [12.5, 74.0], [8.5, 76.2], [6.95, 79.84], [5.8, 81.0], [6.0, 90.0], [6.1, 94.8], [5.8, 97.2],
  [4.3, 99.3], [2.9, 100.9], [1.9, 102.3], [1.26, 103.84], [2.5, 105.5], [7.0, 109.5], [12.0, 113.5], [18.5, 118.5],
  [21.0, 121.5], [27.0, 131.0], [33.0, 143.0], [38.0, 160.0], [40.0, 180.0], [38.5, -160.0], [35.5, -135.0],
  [33.6, -120.0], [33.74, -118.26],
];
const SHANGHAI_MUNDRA: LatLon[] = [
  [30.62, 122.07], [29.0, 122.6], [26.5, 121.0], [24.3, 119.8], [22.0, 117.0], [17.0, 113.0], [10.0, 109.5], [5.0, 106.0],
  [2.5, 105.5], [1.26, 103.84], [1.9, 102.3], [2.9, 100.9], [4.3, 99.3], [5.8, 97.2], [6.1, 94.8], [6.0, 90.0],
  [5.8, 81.0], [7.3, 77.3], [8.5, 76.2], [12.5, 74.0], [17.0, 72.3], [20.5, 69.8], [22.74, 69.7],
];
/* Inland rail corridors, approximately. */
const MUNDRA_NEW_DELHI_RAIL: LatLon[] = [[22.74, 69.7], [23.2, 70.3], [24.17, 72.43], [26.45, 74.64], [28.2, 76.6], [28.51, 77.29]];
const LOS_ANGELES_CHICAGO_RAIL: LatLon[] = [[33.74, -118.26], [34.06, -117.65], [34.9, -117.0], [35.1, -106.6], [37.7, -97.3], [39.1, -94.6], [41.88, -87.63]];

export type Leg = {
  mode: Mode;
  from: PlaceId;
  to: PlaceId;
  /** Waypoints including both ends; defaults to a direct great-circle line. */
  path?: LatLon[];
  status: LegStatus;
  /** For the current leg: how far along it the shipment is (0–1). */
  progress?: number;
};

export type StepKind = "booking" | "pickup" | "terminal" | "transport" | "customs" | "handoff" | "delivery";

/** One row of the journey timeline: a handoff, milestone or transport leg, and who is responsible for it. */
export type Step = {
  kind: StepKind;
  label: string;
  party: string;
  status: LegStatus;
  /** Days from today: negative is past, positive is planned. */
  day: number;
  mode?: Mode;
  note?: string;
};

export type ShipmentDocument = { name: string; status: DocStatus };

export type ShipmentException = {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
  /** Suggested by SIWOM Intelligence; a person decides. */
  nextStep: string;
};

export type InternationalShipment = {
  ref: string;
  cargo: string;
  unit: string;
  industry: Industry;
  origin: PlaceId;
  destination: PlaceId;
  direction: "import" | "export";
  status: ShipmentStatus;
  statusDetail: string;
  /** Days from today to final delivery. */
  etaDay: number;
  legs: Leg[];
  steps: Step[];
  documents: ShipmentDocument[];
  exception?: ShipmentException;
};

export const statusLabels: Record<ShipmentStatus, string> = {
  booked: "Booked",
  "in-transit": "In transit",
  "at-port": "At port",
  customs: "In customs",
  delayed: "Delayed",
};

export const modeLabels: Record<Mode, string> = { ocean: "Ocean", air: "Air", road: "Road", rail: "Rail" };

export const industryLabels: Record<Industry, string> = { space: "Space", automotive: "Automotive", robotics: "Robotics", energy: "Energy" };

export const docStatusLabels: Record<DocStatus, string> = { ready: "Ready", pending: "Pending", action: "Action needed" };

export const internationalShipments: InternationalShipment[] = [
  {
    ref: "INT-24-0412",
    cargo: "Robotic arm assemblies",
    unit: "1 × 40 ft container",
    industry: "robotics",
    origin: "eindhoven",
    destination: "pune",
    direction: "import",
    status: "in-transit",
    statusDetail: "In the Red Sea, on schedule",
    etaDay: 10,
    legs: [
      { mode: "road", from: "eindhoven", to: "rotterdam", status: "done" },
      { mode: "ocean", from: "rotterdam", to: "nhavaSheva", path: ROTTERDAM_NHAVA_SHEVA, status: "current", progress: 0.68 },
      { mode: "road", from: "nhavaSheva", to: "pune", status: "upcoming" },
    ],
    steps: [
      { kind: "pickup", label: "Picked up at the supplier, Eindhoven", party: "Origin forwarder", status: "done", day: -12, mode: "road" },
      { kind: "terminal", label: "Gated in at Rotterdam", party: "Origin terminal", status: "done", day: -10 },
      { kind: "transport", label: "Ocean freight to Nhava Sheva", party: "Ocean carrier", status: "current", day: -8, mode: "ocean", note: "Via the Suez Canal" },
      { kind: "terminal", label: "Discharge at Nhava Sheva", party: "Destination terminal", status: "upcoming", day: 6 },
      { kind: "customs", label: "Import clearance", party: "Customs broker", status: "upcoming", day: 7 },
      { kind: "handoff", label: "Handoff to inland transport partner", party: "Inland transport partner", status: "upcoming", day: 8, mode: "road" },
      { kind: "delivery", label: "Delivered to the consignee, Pune", party: "Consignee", status: "upcoming", day: 10 },
    ],
    documents: [
      { name: "Commercial invoice", status: "ready" },
      { name: "Packing list", status: "ready" },
      { name: "Bill of lading", status: "ready" },
      { name: "Certificate of origin", status: "ready" },
      { name: "Import declaration", status: "pending" },
    ],
  },
  {
    ref: "INT-24-0418",
    cargo: "Satellite electronics",
    unit: "1 × 20 ft container",
    industry: "space",
    origin: "singaporeCity",
    destination: "bengaluru",
    direction: "import",
    status: "customs",
    statusDetail: "Discharged at Chennai, under import clearance",
    etaDay: 3,
    legs: [
      { mode: "road", from: "singaporeCity", to: "singapore", status: "done" },
      { mode: "ocean", from: "singapore", to: "chennai", path: SINGAPORE_CHENNAI, status: "done" },
      { mode: "road", from: "chennai", to: "bengaluru", status: "current", progress: 0 },
    ],
    steps: [
      { kind: "pickup", label: "Picked up at the supplier, Singapore", party: "Origin forwarder", status: "done", day: -9, mode: "road" },
      { kind: "terminal", label: "Loaded at Singapore", party: "Origin terminal", status: "done", day: -8 },
      { kind: "transport", label: "Ocean freight to Chennai", party: "Ocean carrier", status: "done", day: -8, mode: "ocean", note: "Via the Strait of Malacca" },
      { kind: "terminal", label: "Discharged at Chennai", party: "Destination terminal", status: "done", day: -2 },
      { kind: "customs", label: "Import clearance", party: "Customs broker", status: "current", day: -1, note: "Query on one line item" },
      { kind: "handoff", label: "Handoff to inland transport partner", party: "Inland transport partner", status: "upcoming", day: 1, mode: "road" },
      { kind: "delivery", label: "Delivered to the consignee, Bengaluru", party: "Consignee", status: "upcoming", day: 3 },
    ],
    documents: [
      { name: "Commercial invoice", status: "ready" },
      { name: "Packing list", status: "ready" },
      { name: "Bill of lading", status: "ready" },
      { name: "Product datasheet", status: "action" },
      { name: "Import declaration", status: "pending" },
    ],
    exception: {
      id: "EXC-0418",
      severity: "medium",
      title: "Customs query on classification",
      detail: "The customs broker has a query on the tariff classification of one line item.",
      nextStep: "Send the product datasheet to the customs broker today to avoid terminal storage charges.",
    },
  },
  {
    ref: "INT-24-0425",
    cargo: "Battery storage modules",
    unit: "2 × 40 ft containers · dangerous goods, class 9",
    industry: "energy",
    origin: "dubai",
    destination: "newDelhi",
    direction: "import",
    status: "delayed",
    statusDetail: "Waiting for a berth at Mundra, about one day late",
    etaDay: 7,
    legs: [
      { mode: "road", from: "dubai", to: "jebelAli", status: "done" },
      { mode: "ocean", from: "jebelAli", to: "mundra", path: JEBEL_ALI_MUNDRA, status: "current", progress: 0.92 },
      { mode: "rail", from: "mundra", to: "newDelhi", path: MUNDRA_NEW_DELHI_RAIL, status: "upcoming" },
    ],
    steps: [
      { kind: "pickup", label: "Picked up at the supplier, Dubai", party: "Origin forwarder", status: "done", day: -5, mode: "road" },
      { kind: "terminal", label: "Loaded at Jebel Ali", party: "Origin terminal", status: "done", day: -4 },
      { kind: "transport", label: "Ocean freight to Mundra", party: "Ocean carrier", status: "current", day: -3, mode: "ocean", note: "At anchorage, berth delayed" },
      { kind: "terminal", label: "Discharge at Mundra", party: "Destination terminal", status: "upcoming", day: 1 },
      { kind: "customs", label: "Import clearance", party: "Customs broker", status: "upcoming", day: 2 },
      { kind: "handoff", label: "Rail to the New Delhi inland depot", party: "Rail operator", status: "upcoming", day: 3, mode: "rail" },
      { kind: "delivery", label: "Delivered to the consignee, New Delhi", party: "Inland transport partner", status: "upcoming", day: 7 },
    ],
    documents: [
      { name: "Commercial invoice", status: "ready" },
      { name: "Packing list", status: "ready" },
      { name: "Bill of lading", status: "ready" },
      { name: "Dangerous goods declaration", status: "ready" },
      { name: "Import declaration", status: "pending" },
    ],
    exception: {
      id: "EXC-0425",
      severity: "high",
      title: "Berth delay at Mundra",
      detail: "The vessel is at anchorage and will berth about one day later than planned.",
      nextStep: "Confirm the revised rail cut-off with the rail operator and update the consignee's delivery date.",
    },
  },
  {
    ref: "INT-24-0431",
    cargo: "Electric drive units",
    unit: "1 × 40 ft container",
    industry: "automotive",
    origin: "pune",
    destination: "chicago",
    direction: "export",
    status: "booked",
    statusDetail: "Booked; pickup in 2 days",
    etaDay: 38,
    legs: [
      { mode: "road", from: "pune", to: "nhavaSheva", status: "upcoming", progress: 0 },
      { mode: "ocean", from: "nhavaSheva", to: "losAngeles", path: NHAVA_SHEVA_LOS_ANGELES, status: "upcoming" },
      { mode: "rail", from: "losAngeles", to: "chicago", path: LOS_ANGELES_CHICAGO_RAIL, status: "upcoming" },
    ],
    steps: [
      { kind: "booking", label: "Booking confirmed", party: "Origin forwarder", status: "done", day: -1 },
      { kind: "pickup", label: "Pickup at the plant, Pune", party: "Inland transport partner", status: "upcoming", day: 2, mode: "road" },
      { kind: "customs", label: "Export clearance at Nhava Sheva", party: "Customs broker", status: "upcoming", day: 3 },
      { kind: "transport", label: "Ocean freight to Los Angeles", party: "Ocean carrier", status: "upcoming", day: 5, mode: "ocean", note: "Via Colombo and Singapore" },
      { kind: "terminal", label: "Discharge at Los Angeles", party: "Destination terminal", status: "upcoming", day: 33 },
      { kind: "customs", label: "US import clearance", party: "Customs broker", status: "upcoming", day: 34 },
      { kind: "handoff", label: "Rail to Chicago", party: "Rail operator", status: "upcoming", day: 35, mode: "rail" },
      { kind: "delivery", label: "Delivered to the consignee, Chicago", party: "Consignee", status: "upcoming", day: 38 },
    ],
    documents: [
      { name: "Commercial invoice", status: "ready" },
      { name: "Packing list", status: "ready" },
      { name: "Shipping bill", status: "pending" },
      { name: "Bill of lading", status: "pending" },
      { name: "Certificate of origin", status: "action" },
    ],
    exception: {
      id: "EXC-0431",
      severity: "low",
      title: "Certificate of origin not yet issued",
      detail: "The certificate of origin is needed before export clearance.",
      nextStep: "Ask the shipper to apply for the certificate of origin before pickup.",
    },
  },
  {
    ref: "INT-24-0437",
    cargo: "Satellite test equipment",
    unit: "3 pallets · 410 kg",
    industry: "space",
    origin: "darmstadt",
    destination: "bengaluru",
    direction: "import",
    status: "in-transit",
    statusDetail: "In flight to Bengaluru",
    etaDay: 2,
    legs: [
      { mode: "road", from: "darmstadt", to: "frankfurt", status: "done" },
      { mode: "air", from: "frankfurt", to: "blrAirport", status: "current", progress: 0.55 },
      { mode: "road", from: "blrAirport", to: "bengaluru", status: "upcoming" },
    ],
    steps: [
      { kind: "pickup", label: "Picked up at the supplier, Darmstadt", party: "Origin forwarder", status: "done", day: -1, mode: "road" },
      { kind: "terminal", label: "Accepted at the Frankfurt cargo terminal", party: "Airline", status: "done", day: -1 },
      { kind: "transport", label: "Air freight to Bengaluru", party: "Airline", status: "current", day: 0, mode: "air" },
      { kind: "terminal", label: "Arrival at the Bengaluru cargo terminal", party: "Destination terminal", status: "upcoming", day: 1 },
      { kind: "customs", label: "Import clearance", party: "Customs broker", status: "upcoming", day: 1 },
      { kind: "delivery", label: "Delivered to the consignee, Bengaluru", party: "Inland transport partner", status: "upcoming", day: 2, mode: "road" },
    ],
    documents: [
      { name: "Commercial invoice", status: "ready" },
      { name: "Packing list", status: "ready" },
      { name: "Air waybill", status: "ready" },
      { name: "Import declaration", status: "ready" },
    ],
  },
  {
    ref: "INT-24-0444",
    cargo: "Solar modules",
    unit: "4 × 40 ft containers",
    industry: "energy",
    origin: "shanghaiCity",
    destination: "ahmedabad",
    direction: "import",
    status: "in-transit",
    statusDetail: "Through the Strait of Malacca, on schedule",
    etaDay: 12,
    legs: [
      { mode: "road", from: "shanghaiCity", to: "shanghai", status: "done" },
      { mode: "ocean", from: "shanghai", to: "mundra", path: SHANGHAI_MUNDRA, status: "current", progress: 0.47 },
      { mode: "road", from: "mundra", to: "ahmedabad", status: "upcoming" },
    ],
    steps: [
      { kind: "pickup", label: "Picked up at the supplier, Shanghai", party: "Origin forwarder", status: "done", day: -9, mode: "road" },
      { kind: "terminal", label: "Loaded at Shanghai", party: "Origin terminal", status: "done", day: -8 },
      { kind: "transport", label: "Ocean freight to Mundra", party: "Ocean carrier", status: "current", day: -7, mode: "ocean", note: "Via Singapore" },
      { kind: "terminal", label: "Discharge at Mundra", party: "Destination terminal", status: "upcoming", day: 8 },
      { kind: "customs", label: "Import clearance", party: "Customs broker", status: "upcoming", day: 9 },
      { kind: "handoff", label: "Handoff to inland transport partner", party: "Inland transport partner", status: "upcoming", day: 10, mode: "road" },
      { kind: "delivery", label: "Delivered to the consignee, Ahmedabad", party: "Consignee", status: "upcoming", day: 12 },
    ],
    documents: [
      { name: "Commercial invoice", status: "ready" },
      { name: "Packing list", status: "ready" },
      { name: "Bill of lading", status: "ready" },
      { name: "Certificate of origin", status: "ready" },
      { name: "Import declaration", status: "pending" },
    ],
  },
];

/** Formats a day offset from today as "21 Oct", in the visitor's calendar. */
export function dayLabel(offset: number, today = new Date()) {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

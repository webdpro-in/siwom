/*
 * ILLUSTRATIVE DEMO DATA for the international shipments globe. Port and city
 * positions and UN/LOCODEs are real; every shipment, reference, date and
 * status is fictional and not connected to live operations. Ocean legs follow
 * approximate sea lanes through real straits and canals (waypoints below), so
 * no route crosses land; air legs are drawn as great-circle arcs.
 */

export type LatLon = readonly [lat: number, lon: number];
export type Mode = "ocean" | "air" | "road" | "rail";
export type LegStatus = "done" | "current" | "upcoming";
export type ShipmentStatus = "booked" | "in-transit" | "at-port" | "delayed";

export type Place = {
  id: string;
  name: string;
  country: string;
  /** UN/LOCODE for ports, IATA code for airports. */
  code?: string;
  kind: "port" | "airport" | "city";
  at: LatLon;
};

export const places = {
  eindhoven: { id: "eindhoven", name: "Eindhoven", country: "Netherlands", kind: "city", at: [51.44, 5.48] },
  rotterdam: { id: "rotterdam", name: "Rotterdam", country: "Netherlands", code: "NLRTM", kind: "port", at: [51.95, 4.12] },
  nhavaSheva: { id: "nhavaSheva", name: "Nhava Sheva", country: "India", code: "INNSA", kind: "port", at: [18.95, 72.95] },
  pune: { id: "pune", name: "Pune", country: "India", kind: "city", at: [18.52, 73.86] },
  chakan: { id: "chakan", name: "Chakan", country: "India", kind: "city", at: [18.76, 73.86] },
  jurong: { id: "jurong", name: "Jurong", country: "Singapore", kind: "city", at: [1.33, 103.7] },
  singapore: { id: "singapore", name: "Singapore", country: "Singapore", code: "SGSIN", kind: "port", at: [1.26, 103.84] },
  chennai: { id: "chennai", name: "Chennai", country: "India", code: "INMAA", kind: "port", at: [13.1, 80.3] },
  bengaluru: { id: "bengaluru", name: "Bengaluru", country: "India", kind: "city", at: [12.97, 77.59] },
  jebelAli: { id: "jebelAli", name: "Jebel Ali", country: "UAE", code: "AEJEA", kind: "port", at: [25.01, 55.06] },
  mundra: { id: "mundra", name: "Mundra", country: "India", code: "INMUN", kind: "port", at: [22.74, 69.7] },
  tughlakabad: { id: "tughlakabad", name: "ICD Tughlakabad", country: "India", code: "INTKD", kind: "city", at: [28.51, 77.29] },
  colombo: { id: "colombo", name: "Colombo", country: "Sri Lanka", code: "LKCMB", kind: "port", at: [6.95, 79.84] },
  losAngeles: { id: "losAngeles", name: "Los Angeles", country: "United States", code: "USLAX", kind: "port", at: [33.74, -118.26] },
  ontario: { id: "ontario", name: "Ontario, California", country: "United States", kind: "city", at: [34.06, -117.65] },
  darmstadt: { id: "darmstadt", name: "Darmstadt", country: "Germany", kind: "city", at: [49.87, 8.65] },
  frankfurt: { id: "frankfurt", name: "Frankfurt", country: "Germany", code: "FRA", kind: "airport", at: [50.03, 8.57] },
  blrAirport: { id: "blrAirport", name: "Bengaluru airport", country: "India", code: "BLR", kind: "airport", at: [13.2, 77.71] },
} as const satisfies Record<string, Place>;

export type PlaceId = keyof typeof places;

/** Ports and airports labelled on the globe. */
export const labelledPlaces: PlaceId[] = ["rotterdam", "jebelAli", "nhavaSheva", "mundra", "chennai", "colombo", "singapore", "losAngeles", "frankfurt"];

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
/* Inland: the Mundra–Delhi rail corridor, approximately. */
const MUNDRA_TUGHLAKABAD_RAIL: LatLon[] = [[22.74, 69.7], [23.2, 70.3], [24.17, 72.43], [26.45, 74.64], [28.2, 76.6], [28.51, 77.29]];

export type Leg = {
  mode: Mode;
  from: PlaceId;
  to: PlaceId;
  /** Waypoints including both ends; defaults to a direct great-circle line. */
  path?: LatLon[];
  status: LegStatus;
  /** For the current leg: how far along it the snapshot puts the shipment (0–1). */
  progress?: number;
  /** Milestone text, e.g. "Departed 9 Oct" or "ETA 29 Oct". */
  when: string;
  note?: string;
};

export type InternationalShipment = {
  ref: string;
  cargo: string;
  unit: string;
  origin: PlaceId;
  destination: PlaceId;
  direction: "import" | "export";
  status: ShipmentStatus;
  statusDetail: string;
  eta: string;
  legs: Leg[];
};

export const statusLabels: Record<ShipmentStatus, string> = {
  booked: "Booked",
  "in-transit": "In transit",
  "at-port": "At port",
  delayed: "Delayed",
};

export const modeLabels: Record<Mode, string> = { ocean: "Ocean", air: "Air", road: "Road", rail: "Rail" };

/** Snapshot: 18 Oct 2026, 14:30 IST, matching the other demos. */
export const SNAPSHOT_LABEL = "Snapshot 18 Oct 2026, 14:30 IST";

export const internationalShipments: InternationalShipment[] = [
  {
    ref: "INT-24-0412",
    cargo: "Machinery parts",
    unit: "1 × 40 ft container",
    origin: "eindhoven",
    destination: "pune",
    direction: "import",
    status: "in-transit",
    statusDetail: "In the Red Sea, on schedule",
    eta: "31 Oct",
    legs: [
      { mode: "road", from: "eindhoven", to: "rotterdam", status: "done", when: "Picked up 6 Oct" },
      { mode: "ocean", from: "rotterdam", to: "nhavaSheva", path: ROTTERDAM_NHAVA_SHEVA, status: "current", progress: 0.68, when: "ETA port 27 Oct", note: "Via Suez Canal" },
      { mode: "road", from: "nhavaSheva", to: "pune", status: "upcoming", when: "ETA 31 Oct" },
    ],
  },
  {
    ref: "INT-24-0418",
    cargo: "Electronic components",
    unit: "1 × 20 ft container",
    origin: "jurong",
    destination: "bengaluru",
    direction: "import",
    status: "at-port",
    statusDetail: "Discharged at Chennai, awaiting customs clearance",
    eta: "21 Oct",
    legs: [
      { mode: "road", from: "jurong", to: "singapore", status: "done", when: "Picked up 9 Oct" },
      { mode: "ocean", from: "singapore", to: "chennai", path: SINGAPORE_CHENNAI, status: "done", when: "Arrived 17 Oct" },
      { mode: "road", from: "chennai", to: "bengaluru", status: "current", progress: 0, when: "ETA 21 Oct", note: "Pickup after clearance" },
    ],
  },
  {
    ref: "INT-24-0425",
    cargo: "Polymer granules",
    unit: "2 × 40 ft containers",
    origin: "jebelAli",
    destination: "tughlakabad",
    direction: "import",
    status: "delayed",
    statusDetail: "Waiting for a berth at Mundra, about 1 day late",
    eta: "27 Oct",
    legs: [
      { mode: "ocean", from: "jebelAli", to: "mundra", path: JEBEL_ALI_MUNDRA, status: "current", progress: 0.92, when: "ETA port 20 Oct (+1 day)" },
      { mode: "rail", from: "mundra", to: "tughlakabad", path: MUNDRA_TUGHLAKABAD_RAIL, status: "upcoming", when: "ETA 27 Oct" },
    ],
  },
  {
    ref: "INT-24-0431",
    cargo: "Auto components",
    unit: "1 × 40 ft container",
    origin: "chakan",
    destination: "ontario",
    direction: "export",
    status: "booked",
    statusDetail: "Pickup booked for 20 Oct",
    eta: "26 Nov",
    legs: [
      { mode: "road", from: "chakan", to: "nhavaSheva", status: "upcoming", progress: 0, when: "Pickup 20 Oct" },
      { mode: "ocean", from: "nhavaSheva", to: "losAngeles", path: NHAVA_SHEVA_LOS_ANGELES, status: "upcoming", when: "ETA port 22 Nov", note: "Via Colombo and Singapore" },
      { mode: "road", from: "losAngeles", to: "ontario", status: "upcoming", when: "ETA 26 Nov" },
    ],
  },
  {
    ref: "INT-24-0437",
    cargo: "Satellite test equipment",
    unit: "3 pallets, 410 kg",
    origin: "darmstadt",
    destination: "bengaluru",
    direction: "import",
    status: "in-transit",
    statusDetail: "In flight to Bengaluru",
    eta: "19 Oct",
    legs: [
      { mode: "road", from: "darmstadt", to: "frankfurt", status: "done", when: "Picked up 17 Oct" },
      { mode: "air", from: "frankfurt", to: "blrAirport", status: "current", progress: 0.55, when: "ETA 19 Oct, 04:10 IST" },
      { mode: "road", from: "blrAirport", to: "bengaluru", status: "upcoming", when: "ETA 19 Oct" },
    ],
  },
];

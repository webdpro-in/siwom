import type { HubId } from "./hubs";

/*
 * ILLUSTRATIVE DEMO DATA. Every identifier, customer and record here is
 * fictional. Snapshot: 18 Oct 2026, 14:30 IST. Not connected to live systems.
 */

export const SNAPSHOT = {
  iso: "2026-10-18T14:30:00+05:30",
  label: "18 Oct 2026, 14:30 IST",
  date: "18 Oct 2026",
} as const;

export type ShipmentStatus = "on-time" | "at-risk" | "delayed" | "delivered";
export type Mode = "road" | "rail" | "port";
export type Stage = "booked" | "picked-up" | "in-transit" | "at-hub" | "out-for-delivery" | "delivered";

export const stageOrder: Stage[] = ["booked", "picked-up", "in-transit", "at-hub", "out-for-delivery", "delivered"];
export const stageLabels: Record<Stage, string> = {
  booked: "Booked",
  "picked-up": "Picked up",
  "in-transit": "In transit",
  "at-hub": "At hub",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
};

export const statusLabels: Record<ShipmentStatus, string> = {
  "on-time": "On time",
  "at-risk": "At risk",
  delayed: "Delayed",
  delivered: "Delivered",
};

export const modeLabels: Record<Mode, string> = { road: "Road", rail: "Rail", port: "Port" };

export type Shipment = {
  id: string;
  customer: string;
  cargo: string;
  origin: HubId;
  destination: HubId;
  mode: Mode;
  status: ShipmentStatus;
  vehicleId: string;
  distanceKm: number;
  /** Position along the route, 0–1, for the map marker. */
  progress: number;
  plannedEta: string;
  currentEta: string;
  stage: Stage;
  /** Times (IST, display format) for completed stages. */
  timeline: Partial<Record<Stage, string>>;
  exceptionId?: string;
};

export const shipments: Shipment[] = [
  {
    id: "SHP-24-0933",
    customer: "Example Freight Co.",
    cargo: "2 × 40 ft containers · machinery parts",
    origin: "mundra",
    destination: "jnpt",
    mode: "port",
    status: "delayed",
    vehicleId: "FDR-03",
    distanceKm: 640,
    progress: 0.82,
    plannedEta: "18 Oct, 12:00",
    currentEta: "18 Oct, 21:00",
    stage: "in-transit",
    timeline: { booked: "16 Oct, 09:10", "picked-up": "17 Oct, 06:40", "in-transit": "17 Oct, 08:15" },
    exceptionId: "EXC-317",
  },
  {
    id: "SHP-24-0918",
    customer: "Sample Auto Components Pvt. Ltd.",
    cargo: "40 ft container · auto components",
    origin: "jnpt",
    destination: "ngp",
    mode: "road",
    status: "delayed",
    vehicleId: "TRK-0142",
    distanceKm: 820,
    progress: 0.55,
    plannedEta: "18 Oct, 20:00",
    currentEta: "19 Oct, 02:30",
    stage: "in-transit",
    timeline: { booked: "17 Oct, 07:30", "picked-up": "17 Oct, 15:05", "in-transit": "17 Oct, 15:40" },
    exceptionId: "EXC-311",
  },
  {
    id: "SHP-24-0954",
    customer: "Demo Electronics Pvt. Ltd.",
    cargo: "32 ft closed body · consumer electronics",
    origin: "blr",
    destination: "hyd",
    mode: "road",
    status: "delayed",
    vehicleId: "TRK-0198",
    distanceKm: 570,
    progress: 0.48,
    plannedEta: "18 Oct, 19:30",
    currentEta: "18 Oct, 23:45",
    stage: "in-transit",
    timeline: { booked: "17 Oct, 18:00", "picked-up": "18 Oct, 04:20", "in-transit": "18 Oct, 04:45" },
    exceptionId: "EXC-321",
  },
  {
    id: "SHP-24-0921",
    customer: "Example Steel Works",
    cargo: "Container rake · 45 × 40 ft",
    origin: "mundra",
    destination: "tkd",
    mode: "rail",
    status: "at-risk",
    vehicleId: "RAKE-07",
    distanceKm: 1250,
    progress: 0.4,
    plannedEta: "19 Oct, 06:00",
    currentEta: "19 Oct, 09:40",
    stage: "in-transit",
    timeline: { booked: "16 Oct, 11:00", "picked-up": "17 Oct, 21:30", "in-transit": "17 Oct, 23:10" },
    exceptionId: "EXC-314",
  },
  {
    id: "SHP-24-0927",
    customer: "Placeholder Pharma Ltd.",
    cargo: "20 ft reefer · temperature-controlled",
    origin: "vizag",
    destination: "hyd",
    mode: "road",
    status: "at-risk",
    vehicleId: "TRK-0203",
    distanceKm: 620,
    progress: 0.35,
    plannedEta: "19 Oct, 03:00",
    currentEta: "19 Oct, 05:10",
    stage: "in-transit",
    timeline: { booked: "18 Oct, 01:15", "picked-up": "18 Oct, 06:30", "in-transit": "18 Oct, 07:05" },
    exceptionId: "EXC-316",
  },
  {
    id: "SHP-24-0945",
    customer: "Sample Textiles Co.",
    cargo: "40 ft container · cotton yarn",
    origin: "ngp",
    destination: "kolkata",
    mode: "road",
    status: "at-risk",
    vehicleId: "TRK-0231",
    distanceKm: 1120,
    progress: 0.42,
    plannedEta: "19 Oct, 16:00",
    currentEta: "19 Oct, 18:30",
    stage: "in-transit",
    timeline: { booked: "17 Oct, 10:20", "picked-up": "18 Oct, 02:00", "in-transit": "18 Oct, 02:35" },
    exceptionId: "EXC-319",
  },
  {
    id: "SHP-24-0924",
    customer: "Demo Agro Exports",
    cargo: "20 ft container · packaged rice",
    origin: "chennai",
    destination: "blr",
    mode: "road",
    status: "on-time",
    vehicleId: "TRK-0187",
    distanceKm: 345,
    progress: 0.7,
    plannedEta: "18 Oct, 17:15",
    currentEta: "18 Oct, 17:05",
    stage: "in-transit",
    timeline: { booked: "18 Oct, 05:00", "picked-up": "18 Oct, 09:10", "in-transit": "18 Oct, 09:35" },
  },
  {
    id: "SHP-24-0930",
    customer: "Example Steel Works",
    cargo: "Container rake · 40 × 20 ft",
    origin: "kolkata",
    destination: "vizag",
    mode: "rail",
    status: "on-time",
    vehicleId: "RAKE-11",
    distanceKm: 880,
    progress: 0.62,
    plannedEta: "18 Oct, 22:30",
    currentEta: "18 Oct, 22:15",
    stage: "in-transit",
    timeline: { booked: "16 Oct, 14:00", "picked-up": "17 Oct, 19:45", "in-transit": "17 Oct, 21:00" },
  },
  {
    id: "SHP-24-0936",
    customer: "Demo Electronics Pvt. Ltd.",
    cargo: "24 ft closed body · components",
    origin: "hyd",
    destination: "ngp",
    mode: "road",
    status: "on-time",
    vehicleId: "TRK-0219",
    distanceKm: 500,
    progress: 0.22,
    plannedEta: "19 Oct, 01:00",
    currentEta: "19 Oct, 00:50",
    stage: "in-transit",
    timeline: { booked: "18 Oct, 07:40", "picked-up": "18 Oct, 11:30", "in-transit": "18 Oct, 12:00" },
  },
  {
    id: "SHP-24-0942",
    customer: "Sample Auto Components Pvt. Ltd.",
    cargo: "Container rake · export, 42 × 40 ft",
    origin: "tkd",
    destination: "jnpt",
    mode: "rail",
    status: "on-time",
    vehicleId: "RAKE-03",
    distanceKm: 1390,
    progress: 0.8,
    plannedEta: "18 Oct, 19:00",
    currentEta: "18 Oct, 18:40",
    stage: "in-transit",
    timeline: { booked: "15 Oct, 16:30", "picked-up": "17 Oct, 04:00", "in-transit": "17 Oct, 05:30" },
  },
  {
    id: "SHP-24-0948",
    customer: "Example Freight Co.",
    cargo: "Coastal feeder · 60 TEU",
    origin: "chennai",
    destination: "vizag",
    mode: "port",
    status: "on-time",
    vehicleId: "FDR-05",
    distanceKm: 800,
    progress: 0.3,
    plannedEta: "19 Oct, 22:00",
    currentEta: "19 Oct, 22:00",
    stage: "in-transit",
    timeline: { booked: "16 Oct, 08:00", "picked-up": "18 Oct, 05:30", "in-transit": "18 Oct, 07:00" },
  },
  {
    id: "SHP-24-0957",
    customer: "Demo Agro Exports",
    cargo: "Container rake · 38 × 40 ft",
    origin: "kolkata",
    destination: "tkd",
    mode: "rail",
    status: "on-time",
    vehicleId: "RAKE-14",
    distanceKm: 1450,
    progress: 0.25,
    plannedEta: "20 Oct, 08:00",
    currentEta: "20 Oct, 08:00",
    stage: "in-transit",
    timeline: { booked: "17 Oct, 09:00", "picked-up": "18 Oct, 03:15", "in-transit": "18 Oct, 04:40" },
  },
  {
    id: "SHP-24-0939",
    customer: "Placeholder Pharma Ltd.",
    cargo: "20 ft reefer · temperature-controlled",
    origin: "blr",
    destination: "chennai",
    mode: "road",
    status: "delivered",
    vehicleId: "TRK-0156",
    distanceKm: 345,
    progress: 1,
    plannedEta: "18 Oct, 11:45",
    currentEta: "18 Oct, 11:20",
    stage: "delivered",
    timeline: {
      booked: "17 Oct, 20:00",
      "picked-up": "18 Oct, 03:10",
      "in-transit": "18 Oct, 03:30",
      "at-hub": "18 Oct, 09:40",
      "out-for-delivery": "18 Oct, 10:05",
      delivered: "18 Oct, 11:20",
    },
  },
  {
    id: "SHP-24-0951",
    customer: "Sample Textiles Co.",
    cargo: "40 ft container · fabric rolls",
    origin: "jnpt",
    destination: "hyd",
    mode: "road",
    status: "delivered",
    vehicleId: "TRK-0164",
    distanceKm: 720,
    progress: 1,
    plannedEta: "18 Oct, 10:00",
    currentEta: "18 Oct, 09:35",
    stage: "delivered",
    timeline: {
      booked: "16 Oct, 18:00",
      "picked-up": "17 Oct, 06:20",
      "in-transit": "17 Oct, 06:50",
      "at-hub": "18 Oct, 07:30",
      "out-for-delivery": "18 Oct, 08:15",
      delivered: "18 Oct, 09:35",
    },
  },
];

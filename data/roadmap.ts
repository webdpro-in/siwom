import type { Status } from "./status";

export type RoadmapStage = {
  title: string;
  items: string[];
  status: Status;
};

/** Intended direction, not a schedule. No dates anywhere. */
export const roadmap: RoadmapStage[] = [
  {
    title: "Logistics software",
    items: ["Shipment visibility", "Fleet coordination", "Dispatch", "Exception management"],
    status: "in-development",
  },
  {
    title: "Global technology trade",
    items: ["Space and aerospace logistics", "Supplier discovery", "Domestic alternatives", "Export readiness"],
    status: "research",
  },
  {
    title: "Safety intelligence",
    items: ["AI-assisted inspection", "Hazard flagging", "Incident management with human oversight"],
    status: "research",
  },
  {
    title: "Industrial automation",
    items: ["Robotics integrations", "Sensor networks", "Digital twins", "Controlled pilots"],
    status: "vision",
  },
  {
    title: "Future mobility",
    items: ["EV research", "Prototyping", "Testing", "Safety validation", "Regulatory approval"],
    status: "vision",
  },
];

export const roadmapNote = "This is our intended direction, not a schedule or a promise of launch dates.";

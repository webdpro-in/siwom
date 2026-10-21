import type { Status } from "./status";

export type RoadmapStage = {
  title: string;
  /** Shown above the title: Now, Research and development, Long-term direction. */
  phase: string;
  items: string[];
  status: Status;
};

/** The product hierarchy, in order. No dates anywhere. */
export const roadmap: RoadmapStage[] = [
  {
    title: "SIWOM Logistics",
    phase: "Now",
    items: ["International shipment record", "Exceptions with SI", "Documents and handoffs", "Partner coordination"],
    status: "in-development",
  },
  {
    title: "SIWOM Global Trade",
    phase: "Research and development",
    items: ["Supplier discovery and sourcing", "Trade intelligence", "Shipment-linked compliance"],
    status: "research",
  },
  {
    title: "SIWOM Safety",
    phase: "Research and development",
    items: ["Human-reviewed computer vision", "Hazard flagging", "Incident records"],
    status: "research",
  },
  {
    title: "Space and energy",
    phase: "Long-term direction",
    items: ["Space and aerospace supply chains", "Energy and infrastructure intelligence"],
    status: "vision",
  },
  {
    title: "Robotics and autonomous mobility",
    phase: "Long-term direction",
    items: ["Robotics and automation", "Vehicle software and autonomy"],
    status: "vision",
  },
];

export const roadmapNote = "Each stage builds on the data, the platform and the trust earned by the one before it.";

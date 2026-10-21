import type { Status } from "./status";

export type DivisionId = "stream" | "trade" | "safety" | "autonomy" | "mobility" | "intelligence";

export type Division = {
  id: DivisionId;
  /** Full product name. Always "SIWOM <Name>". */
  product: string;
  /** Short name used in navigation and after first mention. */
  short: string;
  /** First-mention pair, e.g. "SIWOM Logistics". */
  firstMention: string;
  area: string;
  status: Status;
  href: string;
  summary: string;
};

export const divisions: Record<DivisionId, Division> = {
  stream: {
    id: "stream",
    product: "SIWOM Logistics",
    short: "Logistics",
    firstMention: "SIWOM Logistics",
    area: "Shipment coordination",
    status: "in-development",
    href: "/logistics",
    summary:
      "Shipment coordination software for logistics companies: shipments, vehicles, documents and delays in one shared record, from port or airport to delivery.",
  },
  trade: {
    id: "trade",
    product: "SIWOM Global Trade",
    short: "Global Trade",
    firstMention: "SIWOM Global Trade",
    area: "Global industrial technology trade",
    status: "research",
    href: "/global-trade",
    summary:
      "Connecting international suppliers with Indian manufacturers and buyers across space, aerospace, robotics, automotive and green energy, with the logistics planned from the start.",
  },
  safety: {
    id: "safety",
    product: "SIWOM Safety",
    short: "Safety",
    firstMention: "SIWOM Safety",
    area: "AI safety and inspection",
    status: "research",
    href: "/safety",
    summary:
      "Helps people spot potential hazards earlier, inspect assets more consistently and decide with better information.",
  },
  autonomy: {
    id: "autonomy",
    product: "SIWOM Autonomy",
    short: "Autonomy",
    firstMention: "SIWOM Autonomy, our robotics and autonomous systems vision",
    area: "Robotics and autonomous systems",
    status: "vision",
    href: "/vision#autonomy",
    summary: "Robotics, machine perception and automated inspection for logistics and industrial facilities.",
  },
  mobility: {
    id: "mobility",
    product: "SIWOM Mobility",
    short: "Mobility",
    firstMention: "SIWOM Mobility, our future electric mobility vision",
    area: "Future electric vehicles",
    status: "vision",
    href: "/vision#mobility",
    summary: "Electric vehicles, connected mobility, vehicle intelligence and driver assistance.",
  },
  intelligence: {
    id: "intelligence",
    product: "SIWOM Industrial Intelligence",
    short: "Industrial Intelligence",
    firstMention: "SIWOM Industrial Intelligence",
    area: "Digital twins and sensors",
    status: "research",
    href: "/vision#industrial-intelligence",
    summary: "Digital twins, simulation, sensor networks and predictive maintenance where data supports it.",
  },
};

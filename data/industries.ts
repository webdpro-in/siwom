import type { StaticImageData } from "next/image";
import type { Status } from "./status";
import portsImg from "@/public/images/water-container.webp";
import warehousingImg from "@/public/images/warehouse.webp";
import freightImg from "@/public/images/road-freight.webp";
import manufacturingImg from "@/public/images/manufacturing.webp";
import infrastructureImg from "@/public/images/pipeline-valves.webp";
import mobilityImg from "@/public/images/evtol-air-taxi.webp";
import spaceImg from "@/public/images/space-core-stage-barge.webp";
import greenEnergyImg from "@/public/images/green-energy-solar.webp";
import roboticsImg from "@/public/images/robotics.webp";

export type Industry = {
  id: "ports" | "warehousing" | "freight" | "manufacturing" | "infrastructure" | "space" | "green-energy" | "robotics" | "mobility";
  name: string;
  image: StaticImageData;
  alt: string;
  /** Required for photos that need attribution or a source note. */
  credit?: string;
  /** Highlighted emerging industries, shown in their own band on /industries. */
  featured?: boolean;
  /** What moves through this industry's supply chain. */
  moves?: string[];
  /** One practical use case for the homepage list. */
  useCase: string;
  problem: string;
  couldHelp: string[];
  product: { name: string; href: string; status: Status };
  onHomepage: boolean;
};

/*
 * No signed customers or deployments are implied. Copy uses "could" and
 * "help", never "we power".
 */
export const industries: Industry[] = [
  {
    id: "ports",
    name: "Ports and maritime",
    image: portsImg,
    alt: "Container ship moored alongside terminal cranes.",
    useCase: "Coordinated shipment and yard visibility across berths, yards and gates.",
    problem:
      "Vessel, yard, gate and inland legs often sit in separate systems. Teams chase status by phone, and a missed berth window ripples into every truck and rake waiting on it.",
    couldHelp: [
      "One view of shipments moving through berth, yard, gate and inland legs",
      "Early flags when a berth window or rail cut-off is at risk",
      "Safety AI research for lifting zones and vehicle–pedestrian conflicts",
    ],
    product: { name: "Logistics OS", href: "/logistics-os", status: "in-development" },
    onHomepage: true,
  },
  {
    id: "freight",
    name: "Road freight and fleets",
    image: freightImg,
    alt: "Freight truck and trailer on a road.",
    useCase: "Dispatch coordination and delivery-exception monitoring for truck fleets.",
    problem:
      "Dispatchers juggle calls, chat groups and spreadsheets to match loads, vehicles and drivers. Delays surface late, often after a customer asks.",
    couldHelp: [
      "Fleet availability and dispatch in one queue",
      "Exceptions such as unplanned halts, e-way bill validity and duty hours, sorted by severity",
      "Suggested next steps, with the dispatcher always deciding",
    ],
    product: { name: "Logistics OS", href: "/logistics-os", status: "in-development" },
    onHomepage: true,
  },
  {
    id: "warehousing",
    name: "Warehousing and distribution",
    image: warehousingImg,
    alt: "Storage racks and goods inside a warehouse.",
    useCase: "Inventory movement tracking between docks, storage and dispatch.",
    problem:
      "Inbound and outbound movements are often logged after the fact. Dock schedules, storage and dispatch rarely share one live picture.",
    couldHelp: [
      "Inbound and outbound movements linked to the shipments they belong to",
      "Dock and dispatch timelines in the same view as the fleet",
      "Integration with existing WMS through APIs (planned)",
    ],
    product: { name: "Logistics OS", href: "/logistics-os", status: "in-development" },
    onHomepage: true,
  },
  {
    id: "manufacturing",
    name: "Manufacturing supply chains",
    image: manufacturingImg,
    alt: "Industrial manufacturing facility and production equipment.",
    useCase: "Inbound and outbound visibility for plants and their suppliers.",
    problem:
      "A late inbound truck can stop a line, yet plant teams often learn about it from the supplier's phone call rather than a system.",
    couldHelp: [
      "Inbound supplier shipments with realistic ETAs",
      "Outbound dispatch planning against plant schedules",
      "Exception alerts routed to the people who can act",
    ],
    product: { name: "Logistics OS", href: "/logistics-os", status: "in-development" },
    onHomepage: true,
  },
  {
    id: "infrastructure",
    name: "Infrastructure and facilities",
    image: infrastructureImg,
    alt: "Industrial steel pipework, valves and infrastructure.",
    useCase: "Inspection records and hazard flagging, with people accountable for every decision.",
    problem:
      "Inspections are often on paper, inconsistent between shifts and hard to audit. Hazards noticed on camera may never reach the right person.",
    couldHelp: [
      "Consistent inspection records with photos and corrective actions",
      "AI-assisted flags for visible damage, PPE and restricted zones (research)",
      "Human review and escalation, with an audit trail",
    ],
    product: { name: "Safety AI", href: "/safety-ai", status: "research" },
    onHomepage: true,
  },
  {
    id: "space",
    name: "Space and aerospace logistics",
    image: spaceImg,
    alt: "A barge carrying a full-size rocket core stage crosses calm water at dusk.",
    credit: "NASA/Cory Huston. Representative image; no NASA endorsement or SIWOM involvement implied.",
    featured: true,
    useCase: "Planning satellite, rocket and aerospace moves where every handoff is high-stakes.",
    problem:
      "Satellites, rocket stages and aerospace parts are high-value, often one of a kind, and sensitive to shock, humidity and contamination. A single move can run from clean room to aircraft to truck to barge, with export licences, customs and insurance at every handoff.",
    couldHelp: [
      "One plan per move, with shock, humidity and cleanliness limits recorded before anyone quotes",
      "Document and licence checklists that travel with the shipment through every handoff",
      "Connecting Indian space suppliers with buyers abroad, and international suppliers with Indian makers (research)",
    ],
    moves: ["Satellites and subsystems", "Rocket stages and engines", "Space robotics", "Aircraft parts and spares"],
    product: { name: "Global Trade", href: "/global-trade#space", status: "research" },
    onHomepage: true,
  },
  {
    id: "green-energy",
    name: "Green energy",
    image: greenEnergyImg,
    alt: "Aerial view of rows of solar panels stretching across desert land.",
    credit: "Sarvajanik Puralekh, CC BY-SA 2.0. Solar plant at Bhadla, Rajasthan. Representative image; no endorsement implied.",
    featured: true,
    useCase: "Moving solar, wind, storage and hydrogen equipment to remote project sites.",
    problem:
      "India's clean-energy build-out moves huge volumes of solar modules and oversized wind components to remote sites, while battery systems travel as dangerous goods. Many components are still imported, and delays on one shipment can hold up a whole project.",
    couldHelp: [
      "Project cargo planning for oversized loads such as wind blades, nacelles and transformers",
      "Dangerous-goods requirements for battery storage kept with every shipment",
      "Finding domestic manufacturers for components imported today (research)",
    ],
    moves: ["Solar modules and inverters", "Wind blades and nacelles", "Battery storage", "Electrolysers"],
    product: { name: "Global Trade", href: "/global-trade#sectors", status: "research" },
    onHomepage: false,
  },
  {
    id: "robotics",
    name: "Robotics and automation",
    image: roboticsImg,
    alt: "Yellow industrial robot arms inside a guarded automation cell.",
    featured: true,
    useCase: "Bringing robots, automation cells and spares from supplier to installation.",
    problem:
      "Industrial robots, mobile robots and space robotics parts are precision machinery. They need careful crating, delivery ready for installation, and fast spares when a production line stops.",
    couldHelp: [
      "Machinery imports coordinated from the supplier's factory to the installation site",
      "Spares visibility, so a stopped line gets its part sooner",
      "Connecting Indian integrators and component makers with global buyers (research)",
    ],
    moves: ["Robot arms and controllers", "AMRs and conveyors", "Space robotics parts", "Spares and end effectors"],
    product: { name: "Global Trade", href: "/global-trade#sectors", status: "research" },
    onHomepage: false,
  },
  {
    id: "mobility",
    name: "Advanced mobility",
    image: mobilityImg,
    alt: "An electric air taxi hovers over an airfield, with a sensor on a tripod in the foreground.",
    credit: "NASA/Genaro Vavuris. Representative image; no NASA or manufacturer endorsement implied.",
    featured: true,
    useCase: "Supply chains for electric and autonomous vehicles, drones and future air taxis.",
    problem:
      "Electric cars, autonomous vehicles, drones and air taxis depend on battery cells, motors, sensors and electronics sourced across borders, under rules that differ by country and change often. Air taxis are still in testing and certification.",
    couldHelp: [
      "Battery and electronics shipments planned with dangerous-goods and classification needs up front",
      "Discovering Indian suppliers for imported vehicle and drone components (research)",
      "Long-term research into vehicle software and diagnostics; any vehicle needs dedicated engineering, testing and approval",
    ],
    moves: ["Battery cells and packs", "Motors and inverters", "Lidar, radar and cameras", "Drone airframes"],
    product: { name: "Global Trade", href: "/global-trade#sectors", status: "research" },
    onHomepage: false,
  },
];

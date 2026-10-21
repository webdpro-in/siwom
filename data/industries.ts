import type { StaticImageData } from "next/image";
import aiImg from "@/public/images/industrial-control.webp";
import logisticsImg from "@/public/images/water-container.webp";
import spaceImg from "@/public/images/space-satellite-cleanroom.webp";
import automotiveImg from "@/public/images/electric-mobility.webp";
import roboticsImg from "@/public/images/robotics.webp";
import energyImg from "@/public/images/green-energy-solar.webp";

export type IndustryId = "ai" | "logistics" | "space" | "automotive" | "robotics" | "energy";

export type Industry = {
  id: IndustryId;
  name: string;
  image: StaticImageData;
  alt: string;
  /** Required for photos that need attribution. */
  credit?: string;
  /** One line for the homepage card. */
  useCase: string;
  /** Who it is for, in this industry. */
  segments: string[];
  problem: string;
  howSiwomHelps: string[];
  /** Typical cargo or capabilities, shown as "In practice". */
  examples: string[];
  product: { name: string; href: string };
};

/*
 * The six industries SIWOM works across. No customers or deployments are
 * implied; copy describes the problems SIWOM is built to solve.
 */
export const industries: Industry[] = [
  {
    id: "ai",
    name: "AI & Industrial Intelligence",
    image: aiImg,
    alt: "Blue-lit rack-mounted server hardware in a data centre.",
    useCase: "SIWOM Intelligence (SI) turns operational data into suggestions people can check and act on.",
    segments: ["Operations and control-room teams", "Supply chain planners", "Safety and EHS teams"],
    problem:
      "Industrial operations generate data in dozens of systems, but decisions still depend on someone noticing the right signal in time, often too late to act.",
    howSiwomHelps: [
      "ETA prediction and exception ranking from the data that arrives",
      "Document checks before every handoff",
      "Every SI suggestion shows its reasoning; people decide, and every decision is recorded",
    ],
    examples: ["ETA prediction", "Exception ranking", "Document checks", "Computer vision"],
    product: { name: "Technology and SIWOM Intelligence", href: "/technology#intelligence" },
  },
  {
    id: "logistics",
    name: "Global Logistics & Autonomous Supply Chains",
    image: logisticsImg,
    alt: "Container ship moored alongside terminal gantry cranes, seen from above.",
    useCase: "One shared record for international shipments, from origin pickup to final delivery.",
    segments: ["Freight forwarders", "Transporters and fleet operators", "Port, CFS and terminal operators", "Warehouse and 3PL operators"],
    problem:
      "An international shipment passes through a supplier, carriers, terminals, customs brokers and local partners. Each keeps its own records, so status lives in calls and spreadsheets, and delays surface after the customer asks.",
    howSiwomHelps: [
      "Every leg and handoff in one record, with the responsible party at each step",
      "Exceptions ranked by urgency, with a suggested next step from SI",
      "Document readiness checked before cargo reaches the port",
    ],
    examples: ["Containers", "Air cargo", "Project cargo", "Palletised freight"],
    product: { name: "SIWOM Logistics", href: "/logistics" },
  },
  {
    id: "space",
    name: "Space & Aerospace",
    image: spaceImg,
    alt: "Technicians in cleanroom suits work beside a large satellite in a clean room.",
    credit: "NASA/Bill White. No endorsement implied.",
    useCase: "Satellites, rocket parts and aerospace components, moved with every handling limit recorded.",
    segments: ["Satellite and subsystem makers", "Launch vehicle suppliers", "Aerospace parts and MRO suppliers"],
    problem:
      "Space and aerospace hardware is high-value, often one of a kind, and sensitive to shock, humidity and contamination. One move can run from clean room to aircraft to truck, with export licences, customs and insurance at every handoff.",
    howSiwomHelps: [
      "Handling limits for shock, humidity and cleanliness captured before the first quote",
      "Licence and document checklists that travel with the shipment",
      "Supplier discovery and sourcing through SIWOM Global Trade",
    ],
    examples: ["Satellites and subsystems", "Rocket stages and engines", "Avionics and spares"],
    product: { name: "SIWOM Global Trade", href: "/global-trade#space" },
  },
  {
    id: "automotive",
    name: "Automotive & Autonomous Mobility",
    image: automotiveImg,
    alt: "An electric vehicle connected to a charging plug.",
    useCase: "Battery packs, drive units and autonomy sensors, imported and exported on schedule.",
    segments: ["Electric vehicle makers", "Component and tier-one suppliers", "Autonomous-vehicle and sensor developers"],
    problem:
      "Vehicle programmes depend on cells, motors, lidar and compute sourced across borders. Batteries ship as dangerous goods with their own rules, and one late container can stop an assembly line.",
    howSiwomHelps: [
      "Inbound parts tracked against production dates, with delays flagged early",
      "Dangerous-goods documents for batteries kept with every shipment",
      "Export coordination for Indian component makers selling abroad",
    ],
    examples: ["Battery cells and packs", "Electric drive units", "Lidar, radar and compute"],
    product: { name: "SIWOM Logistics", href: "/logistics" },
  },
  {
    id: "robotics",
    name: "Robotics & Autonomous Systems",
    image: roboticsImg,
    alt: "Yellow industrial robot arms inside a guarded automation cell.",
    useCase: "Robots, automation cells and their spares, delivered ready to install.",
    segments: ["Robotics and automation integrators", "Warehouse automation providers", "Drone and AMR manufacturers"],
    problem:
      "Robots and automation cells are precision machinery shipped from overseas factories. They need careful crating, delivery ready for installation, and fast spares when a line stops.",
    howSiwomHelps: [
      "Machinery imports coordinated from the supplier's factory to the installation site",
      "Spares visibility, so a stopped line gets its part sooner",
      "Finding Indian suppliers for imported components through SIWOM Global Trade",
    ],
    examples: ["Robot arms and controllers", "AMRs and conveyors", "Spares and end effectors"],
    product: { name: "SIWOM Logistics", href: "/logistics" },
  },
  {
    id: "energy",
    name: "Energy & Infrastructure",
    image: energyImg,
    alt: "Aerial view of rows of solar panels stretching across desert land.",
    credit: "Sarvajanik Puralekh, CC BY-SA 2.0. Bhadla, Rajasthan.",
    useCase: "Solar, wind, storage and grid equipment, moved to remote project sites on time.",
    segments: ["Solar and wind developers", "Battery storage integrators", "EPC and infrastructure contractors"],
    problem:
      "India's clean-energy and infrastructure build-out moves huge volumes of imported modules and oversized components to remote sites. One delayed shipment can hold up a whole project.",
    howSiwomHelps: [
      "Project cargo planning for oversized loads such as blades and transformers",
      "Battery storage shipped with its dangerous-goods documents in order",
      "Domestic alternatives for components imported today, through SIWOM Global Trade",
    ],
    examples: ["Solar modules and inverters", "Wind blades and nacelles", "Battery storage", "Transformers"],
    product: { name: "SIWOM Logistics", href: "/logistics" },
  },
];

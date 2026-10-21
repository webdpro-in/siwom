/**
 * Transport modes SIWOM Logistics is designed around, with the milestones a
 * coordinator needs from each. Live connections to carrier and terminal
 * systems are planned, not built; the demo uses sample data.
 */
export type TransportMode = {
  id: "ocean" | "air" | "road" | "rail";
  label: string;
  image: string;
  alt: string;
  milestones: string[];
};

export const transportModes: TransportMode[] = [
  {
    id: "ocean",
    label: "Ocean",
    image: "water-container.webp",
    alt: "Container ship alongside terminal gantry cranes, viewed from above.",
    milestones: ["Vessel arrival and berthing", "Container discharge and yard", "Delivery order and gate-out", "CFS or ICD transfer"],
  },
  {
    id: "air",
    label: "Air",
    image: "air-cargo.webp",
    alt: "Cargo aircraft on an airport apron at night.",
    milestones: ["Flight arrival", "Cargo terminal acceptance", "Clearance status", "Airport-to-warehouse pickup"],
  },
  {
    id: "road",
    label: "Road",
    image: "road-freight.webp",
    alt: "Freight truck and trailer on a highway.",
    milestones: ["Vehicle assignment", "Pickup and e-way bill", "Halts and delays in transit", "Proof of delivery"],
  },
  {
    id: "rail",
    label: "Rail",
    image: "rail-containers.webp",
    alt: "Freight train carrying intermodal containers.",
    milestones: ["Rake allocation", "Terminal cut-off", "Departure and arrival", "Rail-to-road transfer"],
  },
];

import type { StaticImageData } from "next/image";
import type { Status } from "./status";
import satelliteAirfreight from "@/public/images/space-satellite-airfreight.webp";
import coreStageBarge from "@/public/images/space-core-stage-barge.webp";
import rocketStageFactory from "@/public/images/space-rocket-stage-factory.webp";
import satelliteCleanroom from "@/public/images/space-satellite-cleanroom.webp";
import spaceRobotics from "@/public/images/space-robotics-canadarm.webp";
import spaceLaunch from "@/public/images/space-launch.webp";
import evtol from "@/public/images/evtol-air-taxi.webp";
import solar from "@/public/images/green-energy-solar.webp";
import robotics from "@/public/images/robotics.webp";
import electricMobility from "@/public/images/electric-mobility.webp";

/*
 * Global industrial technology trade. Describes what SIWOM Global Trade
 * covers. There is no public supplier directory,
 * marketplace, brokerage or trade volume, and nothing here implies one.
 */

export type Photo = { src: StaticImageData; alt: string; credit: string };

export const tradePhotos = {
  satelliteAirfreight: {
    src: satelliteAirfreight,
    alt: "A satellite in its shipping container is driven away from a large cargo aircraft on an airfield.",
    credit: "NASA. Sentinel-6 satellite after its airlift from Germany to California, 2020.",
  },
  coreStageBarge: {
    src: coreStageBarge,
    alt: "A barge carrying a full-size rocket core stage crosses calm water at dusk.",
    credit: "NASA/Cory Huston. Rocket core stage pathfinder leaving Kennedy Space Center by barge, 2019.",
  },
  rocketStageFactory: {
    src: rocketStageFactory,
    alt: "A rocket core stage with four engines is lifted inside a tall assembly building.",
    credit: "NASA/Michael DeMocker. Rocket core stage lifted onto its transporter, 2024.",
  },
  satelliteCleanroom: {
    src: satelliteCleanroom,
    alt: "Technicians in cleanroom suits work beside a large satellite in a clean room.",
    credit: "NASA/Bill White. Weather satellite prepared in a clean room, 2018.",
  },
  spaceRobotics: {
    src: spaceRobotics,
    alt: "A space station robotic arm holds a cylindrical cargo spacecraft above Earth's coastline.",
    credit: "NASA. Canadarm2 holding a cargo spacecraft above the Arabian Sea coast of India, 2023.",
  },
  launch: {
    src: spaceLaunch,
    alt: "A large rocket lifts off at night between lightning towers.",
    credit: "NASA/Bill Ingalls. Artemis I launch, 2022.",
  },
  evtol: {
    src: evtol,
    alt: "An electric air taxi hovers over an airfield, with a sensor on a tripod in the foreground.",
    credit: "NASA/Genaro Vavuris. Experimental air taxi during NASA research, 2025.",
  },
  solar: {
    src: solar,
    alt: "Aerial view of rows of solar panels stretching across desert land.",
    credit: "Sarvajanik Puralekh, CC BY-SA 2.0. Solar plant at Bhadla, Rajasthan, 2023.",
  },
  robotics: {
    src: robotics,
    alt: "Yellow industrial robot arms inside a guarded automation cell.",
    credit: "Representative photograph (Pexels).",
  },
  electricMobility: {
    src: electricMobility,
    alt: "An electric vehicle connected to a charging plug.",
    credit: "Representative photograph (Pexels).",
  },
} satisfies Record<string, Photo>;

/** Shared caption: none of these images show SIWOM work. */
export const photoDisclaimer =
  "Representative images. Brands, agencies and people shown do not endorse SIWOM, and no SIWOM involvement is implied.";

/* ---------- Trade flows ---------- */

export type TradeFlow = { id: string; title: string; text: string; examples: string[] };

export const tradeFlows: TradeFlow[] = [
  {
    id: "import",
    title: "Import into India",
    text: "Bring components, materials and machinery from international suppliers to Indian manufacturers and buyers.",
    examples: ["Precision bearings and actuators", "Carbon fibre and specialty alloys", "Test and production machinery"],
  },
  {
    id: "export",
    title: "Export from India",
    text: "Help Indian manufacturers ship components and finished products to buyers around the world.",
    examples: ["Machined and cast parts", "Wiring harnesses and electronics", "Satellite and drone subsystems"],
  },
  {
    id: "domestic",
    title: "Domestic alternatives",
    text: "Help buyers find Indian manufacturers who may supply what they import today.",
    examples: ["Structural parts and fixtures", "Battery packs and motors", "Ground equipment and tooling"],
  },
  {
    id: "global",
    title: "Global market access",
    text: "Help Indian companies reach international buyers, with logistics and documents planned from the start.",
    examples: ["Buyer and distributor discovery", "Landed-cost and route planning", "Export documents in one place"],
  },
];

export const productCategories = [
  { id: "components", title: "Components", text: "Sensors, actuators, avionics, battery cells, motors, bearings and electronics." },
  { id: "materials", title: "Materials", text: "Carbon fibre, composites, specialty alloys, rare-earth magnets and high-purity gases." },
  { id: "machinery", title: "Machinery", text: "Industrial robots, CNC and additive machines, test rigs, cleanroom and handling equipment." },
  { id: "finished", title: "Finished products", text: "Satellites, drones, electric vehicles, robots and the ground equipment that supports them." },
] as const;

/* ---------- Sectors ---------- */

export type SectorId =
  | "satellites"
  | "rockets"
  | "space-robotics"
  | "aerospace"
  | "industrial-robots"
  | "electric-vehicles"
  | "autonomous-vehicles"
  | "drones"
  | "flying-cars"
  | "green-energy";

export type Sector = {
  id: SectorId;
  name: string;
  group: "space" | "robotics" | "mobility" | "energy";
  status: Status;
  summary: string;
  moves: string[];
  handling: string;
};

/** Space first: it is SIWOM's lead focus for global technology trade. */
export const sectors: Sector[] = [
  {
    id: "satellites",
    name: "Satellites and space systems",
    group: "space",
    status: "research",
    summary: "Satellites, subsystems and ground-segment equipment moving between makers, test sites and launch sites.",
    moves: ["Satellite buses and payloads", "Solar arrays, antennas and reaction wheels", "Ground stations and test equipment"],
    handling: "Clean, climate-controlled containers with shock and humidity monitoring, often by dedicated air charter.",
  },
  {
    id: "rockets",
    name: "Rockets and launch vehicles",
    group: "space",
    status: "research",
    summary: "Stages, engines and structures that are too large or sensitive for ordinary freight.",
    moves: ["Rocket stages and interstages", "Engines and turbopumps", "Composite structures and tooling"],
    handling: "Oversized road, rail and barge moves; some propulsion items are classed as explosives.",
  },
  {
    id: "space-robotics",
    name: "Space robotics",
    group: "space",
    status: "research",
    summary: "Robotic arms, servicing tools and the precision parts behind them.",
    moves: ["Robotic arm joints and end effectors", "Space-rated motors and gearboxes", "Vision and sensing units"],
    handling: "Precision packing and calibration care; many items are export-controlled.",
  },
  {
    id: "aerospace",
    name: "Aerospace",
    group: "space",
    status: "research",
    summary: "Aircraft parts, materials and maintenance spares for manufacturers and repair shops.",
    moves: ["Structural and engine parts", "Avionics and harnesses", "Composites and fasteners"],
    handling: "Traceability paperwork travels with every part; urgent spares often fly as aircraft-on-ground shipments.",
  },
  {
    id: "industrial-robots",
    name: "Industrial robots",
    group: "robotics",
    status: "research",
    summary: "Robots, mobile robots and automation cells for factories and warehouses.",
    moves: ["Robot arms and controllers", "AMRs and conveyors", "Spares and end effectors"],
    handling: "Crated machinery delivered ready for installation, with fast spares when a line stops.",
  },
  {
    id: "electric-vehicles",
    name: "Electric cars",
    group: "mobility",
    status: "research",
    summary: "Cells, packs, motors and electronics for electric cars and commercial vehicles.",
    moves: ["Battery cells and packs", "Motors and inverters", "Charging equipment"],
    handling: "Lithium-ion batteries ship as dangerous goods (Class 9) with certified packaging and declarations.",
  },
  {
    id: "autonomous-vehicles",
    name: "Autonomous vehicles",
    group: "mobility",
    status: "research",
    summary: "Sensors and compute that let vehicles perceive and navigate.",
    moves: ["Lidar, radar and cameras", "Vehicle compute units", "Test vehicles and rigs"],
    handling: "High-value electronics needing anti-static packing and careful customs classification.",
  },
  {
    id: "drones",
    name: "Drones",
    group: "mobility",
    status: "research",
    summary: "Airframes, propulsion and payloads for commercial and industrial drones.",
    moves: ["Airframes and propellers", "Motors, controllers and batteries", "Cameras and sensor payloads"],
    handling: "Import, export and operating rules differ by country and change often.",
  },
  {
    id: "flying-cars",
    name: "Flying cars and air taxis",
    group: "mobility",
    status: "vision",
    summary: "Electric vertical take-off aircraft are still in testing and certification worldwide.",
    moves: ["Electric propulsion units", "Battery systems", "Composite airframe parts"],
    handling: "Prototype supply chains today; volume logistics depends on certification.",
  },
  {
    id: "green-energy",
    name: "Green energy",
    group: "energy",
    status: "research",
    summary: "Solar, wind, storage and hydrogen equipment for India's clean-energy build-out.",
    moves: ["Solar modules and inverters", "Wind turbine blades and nacelles", "Battery storage and electrolysers"],
    handling: "High-volume and oversized project cargo, often delivered to remote sites.",
  },
];

export const sectorGroups: Record<Sector["group"], string> = {
  space: "Space and aerospace",
  robotics: "Robotics",
  mobility: "Automotive and advanced mobility",
  energy: "Green energy",
};

/* ---------- Logistics companies ---------- */

export const logisticsRoles = [
  {
    id: "forwarders",
    title: "Freight forwarders",
    text: "See technology cargo demand early, with dimensions, weights and handling limits captured before you quote.",
  },
  {
    id: "brokers",
    title: "Customs brokers",
    text: "Receive complete document sets, including classification notes and licence references, at a defined handoff.",
  },
  {
    id: "carriers",
    title: "Air, ocean, rail and road carriers",
    text: "Plan oversized, dangerous-goods and time-critical moves with the next carrier's needs already known.",
  },
  {
    id: "warehouses",
    title: "Warehouses and 3PLs",
    text: "Prepare storage for climate-controlled, anti-static or bonded goods before the shipment arrives.",
  },
] as const;

/* ---------- How it is meant to work ---------- */

export const tradeSteps = [
  { title: "Discover", description: "Buyers describe what they need; suppliers in India and abroad describe what they make." },
  { title: "Qualify", description: "The buyer checks capability, certification and samples. SIWOM never certifies a supplier." },
  { title: "Plan the move", description: "Route, mode and handling limits are agreed, with landed cost estimated up front." },
  { title: "Coordinate handoffs", description: "Documents, licences and responsibilities pass cleanly between each partner." },
  { title: "Deliver and record", description: "Proof of delivery and condition data close the loop for everyone involved." },
];

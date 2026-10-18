// Registry of scenes for preview and generation.
import { portScene } from "./port.mjs";
import { warehouseScene, autonomyScene, factoryScene } from "./indoor.mjs";
import { freightScene, railScene, facilityScene, depotScene } from "./outdoor.mjs";
import { evScene, twinScene } from "./concept.mjs";
import { damageFrame, ppeFrame, zoneFrame } from "./safety.mjs";

export const port = () => portScene({});
export const warehouse = () => warehouseScene({});
export const autonomy = () => autonomyScene({});
export const factory = () => factoryScene({});
export const freight = () => freightScene({});
export const rail = () => railScene({});
export const facility = () => facilityScene({});
export const depot = () => depotScene({});
export const ev = () => evScene({});
export const twin = () => twinScene({ ox: 640, oy: 230, scale: 0.95 });
export const damage = () => damageFrame();
export const ppe = () => ppeFrame();
export const zone = () => zoneFrame();

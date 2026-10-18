/**
 * Real place names used as hubs in the illustrative demo. Records routed
 * between them are fictional. Coordinates are approximate and only used to
 * place hubs on a schematic network map (no national boundaries are drawn).
 */
export type HubId = "jnpt" | "mundra" | "chennai" | "vizag" | "kolkata" | "tkd" | "blr" | "hyd" | "ngp";

export type Hub = {
  id: HubId;
  name: string;
  short: string;
  kind: "port" | "icd" | "city";
  lat: number;
  lon: number;
  /** Label placement on the schematic map. */
  label: "left" | "right" | "top" | "bottom";
};

export const hubs: Record<HubId, Hub> = {
  jnpt: { id: "jnpt", name: "Nhava Sheva (JNPT)", short: "Nhava Sheva", kind: "port", lat: 18.95, lon: 72.95, label: "left" },
  mundra: { id: "mundra", name: "Mundra", short: "Mundra", kind: "port", lat: 22.74, lon: 69.7, label: "left" },
  chennai: { id: "chennai", name: "Chennai", short: "Chennai", kind: "port", lat: 13.08, lon: 80.27, label: "right" },
  vizag: { id: "vizag", name: "Visakhapatnam", short: "Visakhapatnam", kind: "port", lat: 17.69, lon: 83.22, label: "right" },
  kolkata: { id: "kolkata", name: "Kolkata", short: "Kolkata", kind: "port", lat: 22.57, lon: 88.36, label: "right" },
  tkd: { id: "tkd", name: "ICD Tughlakabad", short: "ICD Tughlakabad", kind: "icd", lat: 28.5, lon: 77.28, label: "top" },
  blr: { id: "blr", name: "Bengaluru", short: "Bengaluru", kind: "city", lat: 12.97, lon: 77.59, label: "left" },
  hyd: { id: "hyd", name: "Hyderabad", short: "Hyderabad", kind: "city", lat: 17.39, lon: 78.49, label: "left" },
  ngp: { id: "ngp", name: "Nagpur", short: "Nagpur", kind: "city", lat: 21.15, lon: 79.09, label: "right" },
};

export const hubList = Object.values(hubs);

/**
 * Equirectangular projection into the map's viewBox. Height is scaled by
 * cos(20°) so distances look roughly right at India's latitudes.
 */
export const MAP = { width: 1000, height: 915, lonMin: 66.5, lonMax: 91.5, latMin: 9.5, latMax: 31 } as const;

export function project(lat: number, lon: number) {
  const x = ((lon - MAP.lonMin) / (MAP.lonMax - MAP.lonMin)) * MAP.width;
  const y = ((MAP.latMax - lat) / (MAP.latMax - MAP.latMin)) * MAP.height;
  return { x, y };
}

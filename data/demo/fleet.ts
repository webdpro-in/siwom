import type { HubId } from "./hubs";

/* ILLUSTRATIVE DEMO DATA. Fictional vehicles. IDs are not registration numbers. */

export type VehicleStatus = "in-transit" | "available" | "maintenance";

export type Vehicle = {
  id: string;
  type: string;
  status: VehicleStatus;
  /** Current or last known hub. */
  location: HubId;
  shipmentId?: string;
};

export const vehicleStatusLabels: Record<VehicleStatus, string> = {
  "in-transit": "In transit",
  available: "Available",
  maintenance: "Maintenance",
};

export const fleet: Vehicle[] = [
  { id: "TRK-0142", type: "Tractor-trailer · 40 ft", status: "in-transit", location: "jnpt", shipmentId: "SHP-24-0918" },
  { id: "TRK-0156", type: "Reefer truck · 20 ft", status: "in-transit", location: "chennai", shipmentId: "SHP-24-0939" },
  { id: "TRK-0164", type: "Tractor-trailer · 40 ft", status: "in-transit", location: "hyd", shipmentId: "SHP-24-0951" },
  { id: "TRK-0175", type: "Tractor-trailer · 40 ft", status: "available", location: "jnpt" },
  { id: "TRK-0187", type: "Tractor-trailer · 20 ft", status: "in-transit", location: "chennai", shipmentId: "SHP-24-0924" },
  { id: "TRK-0188", type: "Closed body · 32 ft", status: "available", location: "chennai" },
  { id: "TRK-0198", type: "Closed body · 32 ft", status: "in-transit", location: "blr", shipmentId: "SHP-24-0954" },
  { id: "TRK-0203", type: "Reefer truck · 20 ft", status: "in-transit", location: "vizag", shipmentId: "SHP-24-0927" },
  { id: "TRK-0212", type: "Tractor-trailer · 40 ft", status: "available", location: "hyd" },
  { id: "TRK-0219", type: "Closed body · 24 ft", status: "in-transit", location: "hyd", shipmentId: "SHP-24-0936" },
  { id: "TRK-0226", type: "Tractor-trailer · 40 ft", status: "maintenance", location: "ngp" },
  { id: "TRK-0231", type: "Tractor-trailer · 40 ft", status: "in-transit", location: "ngp", shipmentId: "SHP-24-0945" },
  { id: "TRK-0240", type: "Closed body · 32 ft", status: "available", location: "ngp" },
  { id: "TRK-0251", type: "Tractor-trailer · 20 ft", status: "available", location: "blr" },
  { id: "RAKE-03", type: "Container rake", status: "in-transit", location: "tkd", shipmentId: "SHP-24-0942" },
  { id: "RAKE-07", type: "Container rake", status: "in-transit", location: "mundra", shipmentId: "SHP-24-0921" },
  { id: "RAKE-11", type: "Container rake", status: "in-transit", location: "kolkata", shipmentId: "SHP-24-0930" },
  { id: "RAKE-14", type: "Container rake", status: "in-transit", location: "kolkata", shipmentId: "SHP-24-0957" },
  { id: "FDR-03", type: "Coastal feeder vessel", status: "in-transit", location: "mundra", shipmentId: "SHP-24-0933" },
  { id: "FDR-05", type: "Coastal feeder vessel", status: "in-transit", location: "chennai", shipmentId: "SHP-24-0948" },
];

export type DispatchJob = {
  id: string;
  shipmentId: string;
  origin: HubId;
  destination: HubId;
  load: string;
  pickup: string;
};

export const dispatchQueue: DispatchJob[] = [
  { id: "DSP-1041", shipmentId: "SHP-24-0960", origin: "jnpt", destination: "ngp", load: "40 ft container", pickup: "18 Oct, 16:00" },
  { id: "DSP-1042", shipmentId: "SHP-24-0961", origin: "chennai", destination: "blr", load: "32 ft closed body", pickup: "18 Oct, 17:30" },
  { id: "DSP-1043", shipmentId: "SHP-24-0962", origin: "hyd", destination: "vizag", load: "40 ft container", pickup: "18 Oct, 19:00" },
  { id: "DSP-1044", shipmentId: "SHP-24-0963", origin: "blr", destination: "chennai", load: "20 ft container", pickup: "19 Oct, 06:00" },
  { id: "DSP-1045", shipmentId: "SHP-24-0964", origin: "ngp", destination: "hyd", load: "32 ft closed body", pickup: "19 Oct, 08:00" },
];

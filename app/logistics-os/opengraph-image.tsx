import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "SIWOM \u2014 Shipments, vehicles and delays in one workspace.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "SIWOM Stream \u00b7 Logistics OS", title: "Shipments, vehicles and delays in one workspace.", status: "In development" });
}

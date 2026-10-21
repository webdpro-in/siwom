import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "SIWOM \u2014 Coordinate every shipment, from port to delivery.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "SIWOM Stream \u00b7 Shipment coordination software", title: "Coordinate every shipment, from port to delivery.", status: "In development" });
}

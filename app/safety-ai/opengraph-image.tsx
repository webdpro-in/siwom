import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "SIWOM \u2014 Hazard flags, reviewed by people.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "SIWOM Safety \u00b7 Safety AI", title: "Hazard flags, reviewed by people.", status: "Research" });
}

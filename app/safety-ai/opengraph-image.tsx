import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "SIWOM \u2014 Safety isn't an add-on. It's the foundation.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "SIWOM Safety \u00b7 Safety AI", title: "Safety isn't an add-on. It's the foundation.", status: "Research" });
}

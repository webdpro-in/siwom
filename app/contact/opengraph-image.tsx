import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "SIWOM \u2014 Start with one lane or one hub.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Contact", title: "Start with one lane or one hub." });
}

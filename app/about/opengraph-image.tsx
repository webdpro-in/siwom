import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "SIWOM \u2014 An early-stage company, run carefully.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "About SIWOM", title: "An early-stage company, run carefully." });
}

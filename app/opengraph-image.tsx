import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "SIWOM \u2014 Intelligence for the physical world.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "SIWOM \u00b7 Industrial technology, built in India", title: "Intelligence for the physical world." });
}

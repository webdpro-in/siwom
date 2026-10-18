import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "SIWOM \u2014 Building toward more autonomous industries.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Our Vision", title: "Building toward more autonomous industries.", status: "Long-term vision" });
}

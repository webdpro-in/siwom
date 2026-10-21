import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "SIWOM \u2014 Built for the companies that move freight.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Industries", title: "Built for the companies that move freight." });
}

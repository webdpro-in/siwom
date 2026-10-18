import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "SIWOM — Global Trade for space, robotics and mobility.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "SIWOM Global Trade", title: "Global Trade for space, robotics and mobility.", status: "Research" });
}

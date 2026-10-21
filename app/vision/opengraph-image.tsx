import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "SIWOM \u2014 Intelligence for the physical world, built step by step.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Vision and roadmap", title: "Intelligence for the physical world, built step by step." });
}

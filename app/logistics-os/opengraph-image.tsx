import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "SIWOM \u2014 Every movement. One operational picture.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "SIWOM Stream \u00b7 Logistics OS", title: "Every movement. One operational picture.", status: "In development" });
}

import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "SIWOM \u2014 Logistics for space and technology cargo.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "SIWOM Global Trade \u00b7 Research and development", title: "Logistics for space and technology cargo." });
}

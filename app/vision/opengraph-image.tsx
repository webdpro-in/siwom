import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "SIWOM \u2014 Where SIWOM is headed.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: "Our Vision", title: "Where SIWOM is headed.", status: "Long-term vision" });
}

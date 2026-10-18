import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge needs to know our custom token names, otherwise it would
 * treat `text-h2` (a font size) and `text-text-muted` (a colour) as the same
 * group and silently drop one of them.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        "bg",
        "surface-1",
        "surface-2",
        "surface-3",
        "border",
        "border-strong",
        "border-control",
        "text",
        "text-muted",
        "text-subtle",
        "accent",
        "accent-ink",
        "sev-critical",
        "sev-high",
        "sev-medium",
        "sev-low",
        "grid-line",
        "scrim",
        "scrim-heavy",
      ],
      text: ["display", "h1", "h2", "h3", "body-l", "body", "small", "eyebrow", "pill"],
      font: ["display", "sans", "mono"],
      tracking: ["eyebrow", "pill", "wordmark", "normal"],
      radius: ["xs", "control", "card", "panel"],
      shadow: ["float", "glow"],
      ease: ["micro", "standard", "emphasis"],
      container: ["content", "wide", "reading", "narrow", "headline", "tooltip", "xs", "sm", "md", "xl"],
      aspect: ["video", "card", "tile", "tall", "square"],
    },
    classGroups: {
      duration: [{ duration: ["micro", "hover", "ui", "reveal"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

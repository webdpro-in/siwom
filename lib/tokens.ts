/**
 * JavaScript mirror of the motion and layout tokens in styles/globals.css,
 * for the few places that animate from script (Motion, IntersectionObserver
 * margins). Keep in sync with the CSS custom properties.
 */
export const motion = {
  micro: { duration: 0.12, ease: "easeOut" as const },
  hover: { duration: 0.2, ease: [0.2, 0, 0, 1] as const },
  ui: { duration: 0.32, ease: [0.2, 0, 0, 1] as const },
  reveal: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  hero: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  reduced: { duration: 0.15, ease: "linear" as const },
  staggerMs: 60,
  maxStagger: 6,
} as const;

export const breakpoints = {
  xs: 360,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const layout = {
  headerHeight: 72,
  headerHeightCompact: 60,
  headerCompactAfter: 24,
} as const;

/**
 * Hex mirror of the colour tokens, only for places CSS variables cannot
 * reach (metadata theme colour, Open Graph images). Keep in sync with
 * styles/globals.css.
 */
export const colors = {
  bg: "#0a0d12",
  surface1: "#121820",
  surface2: "#18202a",
  border: "#28313b",
  borderStrong: "#3a4552",
  text: "#ffffff",
  textMuted: "#a1a8b3",
  accent: "#c8f169",
  accentInk: "#0a0d12",
} as const;

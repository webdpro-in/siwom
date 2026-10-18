// Shared helpers for the procedural illustration pipeline.
import sharp from "sharp";

export function rng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    range: (min, max) => min + next() * (max - min),
    int: (min, max) => Math.floor(min + next() * (max - min + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    chance: (p) => next() < p,
  };
}

export const f = (n) => Math.round(n * 10) / 10;

export const rect = (x, y, w, h, fill, extra = "") =>
  `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" ${extra}/>`;

export const line = (x1, y1, x2, y2, stroke, width = 1, extra = "") =>
  `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;

export const circle = (cx, cy, r, fill, extra = "") =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}" ${extra}/>`;

export const poly = (pts, fill, extra = "") =>
  `<polygon points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(" ")}" fill="${fill}" ${extra}/>`;

export function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v) => Math.max(0, Math.min(255, Math.round(v + amt * (amt > 0 ? 255 - v : v))));
  const r = ch((n >> 16) & 255);
  const g = ch((n >> 8) & 255);
  const b = ch(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/** Film grain + soft vignette overlay definitions, appended to every scene. */
export function finishDefs(w, h, { grain = 0.07, vignette = 0.45 } = {}) {
  return `
  <defs>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 ${grain}"/></feComponentTransfer>
    </filter>
    <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
      <stop offset="55%" stop-color="#05070a" stop-opacity="0"/>
      <stop offset="100%" stop-color="#05070a" stop-opacity="${vignette}"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" filter="url(#grain)"/>
  <rect width="${w}" height="${h}" fill="url(#vignette)"/>`;
}

export const svgDoc = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;

/**
 * The one colour grade applied to every image (Section 3, Imagery):
 * cool, slightly desaturated, shadows pushed toward navy (#0A0D12),
 * highlights kept clean.
 */
export function grade(pipeline, { saturation = 0.82, lift = [10, 13, 20] } = {}) {
  const a = lift.map((b) => (255 - b) / 255);
  return pipeline
    .modulate({ saturation })
    .recomb([
      [0.96, 0.03, 0.01],
      [0.01, 0.97, 0.02],
      [0.0, 0.04, 1.0],
    ])
    .linear(a, lift);
}

export async function rasterise(svg, { density = 72 } = {}) {
  return sharp(Buffer.from(svg), { density, limitInputPixels: false, unlimited: true }).png().toBuffer();
}

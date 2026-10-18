#!/usr/bin/env node
/**
 * Generates every illustration used on the site into assets/images/.
 * All artwork is original and procedural (see scripts/art/*), so there are no
 * third-party licences. The colour grade is applied here, in the pipeline,
 * never with CSS filters.
 *
 *   node scripts/generate-art.mjs            # everything
 *   node scripts/generate-art.mjs safety     # only outputs whose name contains "safety"
 *
 * Sources are written as high-quality WebP; next/image produces AVIF/WebP
 * variants and blur placeholders at build time.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { grade } from "./art/lib.mjs";
import { portScene, nightLights } from "./art/port.mjs";
import { warehouseScene, autonomyScene, factoryScene } from "./art/indoor.mjs";
import { freightScene, railScene, facilityScene, depotScene } from "./art/outdoor.mjs";
import { evScene, twinScene } from "./art/concept.mjs";
import { damageFrame, ppeFrame, zoneFrame } from "./art/safety.mjs";

const OUT = path.resolve("assets/images");
const filter = process.argv[2] ?? "";
await fs.mkdir(OUT, { recursive: true });

const toPng = (svg) => sharp(Buffer.from(svg), { limitInputPixels: false }).png().toBuffer();

async function save(name, input, { width, height, extract, night } = {}) {
  let img = sharp(input, { limitInputPixels: false });
  if (extract) img = sharp(await img.extract(extract).png().toBuffer());
  img = grade(img);
  if (width && height) img = img.resize(width, height, { fit: "cover", position: "attention" });
  const file = path.join(OUT, `${name}.webp`);
  await img.webp({ quality: 90, effort: 5 }).toFile(file);
  const { size } = await fs.stat(file);
  console.log(`  ${name}.webp  ${width}x${height}  ${(size / 1024).toFixed(0)} KB${night ? "  (night)" : ""}`);
}

const want = (...names) => names.some((n) => n.includes(filter));

// ---- Port master: one render, several art-directed crops -------------------
if (want("hero-port-desktop", "hero-port-mobile", "industry-ports", "ports-wide", "cta-port-night")) {
  console.log("Rendering port master (slow, ~1–2 min)…");
  const { svg, lights } = portScene({ W: 3600, H: 2700 });
  const day = await toPng(svg);
  await save("hero-port-desktop", day, { extract: { left: 225, top: 0, width: 3375, height: 1900 }, width: 2400, height: 1350 });
  await save("hero-port-mobile", day, { extract: { left: 1350, top: 225, width: 1575, height: 1969 }, width: 1080, height: 1350 });
  await save("industry-ports", day, { extract: { left: 2025, top: 900, width: 1350, height: 1800 }, width: 900, height: 1200 });
  await save("ports-wide", day, { extract: { left: 675, top: 855, width: 2925, height: 1645 }, width: 2000, height: 1125 });
  // Night variant for the CTA band: darken, then add warm light pools
  const dark = await sharp(day).linear(0.36, 0).modulate({ saturation: 0.7 }).png().toBuffer();
  const pools = await toPng(nightLights(3600, 2700, lights));
  const night = await sharp(dark).composite([{ input: pools, blend: "screen" }]).png().toBuffer();
  await save("cta-port-night", night, { extract: { left: 0, top: 675, width: 3200, height: 1800 }, width: 2400, height: 1350, night: true });
}

const jobs = [
  ["industry-warehousing", () => warehouseScene({ W: 1200, H: 1600 }), 900, 1200],
  ["industry-freight", () => freightScene({ W: 1200, H: 1600 }), 900, 1200],
  ["freight-wide", () => freightScene({ W: 1600, H: 900, seed: 52, angle: -14 }), 1600, 900],
  ["industry-manufacturing", () => factoryScene({ W: 1200, H: 1600 }), 900, 1200],
  ["industry-infrastructure", () => facilityScene({ W: 1200, H: 1600 }), 900, 1200],
  ["industry-mobility", () => depotScene({ W: 1200, H: 1600 }), 900, 1200],
  ["concept-autonomy-tall", () => autonomyScene({ W: 1200, H: 1500 }), 1200, 1500],
  ["concept-autonomy-wide", () => autonomyScene({ W: 1600, H: 900, seed: 33 }), 1600, 900],
  ["concept-mobility-tall", () => evScene({ W: 1200, H: 1500, scale: 0.95, ox: -210, oy: 300 }), 1200, 1500],
  ["concept-mobility-wide", () => evScene({ W: 1600, H: 900 }), 1600, 900],
  ["concept-intelligence-tall", () => twinScene({ W: 1200, H: 1500, scale: 0.72, ox: 630, oy: 470 }), 1200, 1500],
  ["concept-intelligence-wide", () => twinScene({ W: 1600, H: 900, scale: 0.95, ox: 640, oy: 190 }), 1600, 900],
  ["india-rail", () => railScene({ W: 1200, H: 1500 }), 1200, 1500],
  ["rail-wide", () => railScene({ W: 1600, H: 900, seed: 62 }), 1600, 900],
  ["safety-damage", () => damageFrame(), 1600, 900],
  ["safety-ppe", () => ppeFrame(), 1600, 900],
  ["safety-zone", () => zoneFrame(), 1600, 900],
];

for (const [name, render, width, height] of jobs) {
  if (!want(name)) continue;
  const png = await toPng(render());
  await save(name, png, { width, height });
}
console.log("Done.");

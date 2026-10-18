#!/usr/bin/env node
/**
 * Generates the SIWOM logo set from the source of truth in
 * lib/brand.ts (SIWOM_SYMBOL_PATH) and Space Grotesk 600:
 *   public/brand/  symbol, mono symbols, wordmarks, lockups (SVG) + PNG logo
 *   app/icon.svg, app/favicon.ico, app/apple-icon.png
 * The wordmark is converted to outlines so it renders without the font.
 */
import fs from "node:fs/promises";
import path from "node:path";
import opentype from "opentype.js";
import sharp from "sharp";

const ACCENT = "#C8F169";
const INK = "#0A0D12";
const WHITE = "#FFFFFF";
const brandSource = await fs.readFile("lib/brand.ts", "utf8");
const SYMBOL = brandSource.match(/SIWOM_SYMBOL_PATH = "([^"]+)"/)[1];

const font = opentype.parse((await fs.readFile("assets/fonts/SpaceGrotesk-SemiBold.ttf")).buffer);

/**
 * Outline "SIWOM" with +0.04em tracking. Transforms the raw glyph outlines
 * (font units, y-up) directly; opentype.js 2.0's per-glyph getPath() emits
 * NaN for some points.
 */
function wordmarkPath(size = 100) {
  const tracking = 0.04 * size;
  const glyphs = font.stringToGlyphs("SIWOM");
  const scale = size / font.unitsPerEm;
  const baseline = size * 0.8;
  const fmt = (n) => (Math.round(n * 100) / 100).toString();
  let x0 = 0;
  let d = "";
  let x1 = Infinity;
  let x2 = -Infinity;
  let y1 = Infinity;
  let y2 = -Infinity;
  const pt = (x, y) => {
    const px = x0 + x * scale;
    const py = baseline - y * scale;
    x1 = Math.min(x1, px);
    x2 = Math.max(x2, px);
    y1 = Math.min(y1, py);
    y2 = Math.max(y2, py);
    return `${fmt(px)} ${fmt(py)}`;
  };
  glyphs.forEach((glyph, i) => {
    for (const c of glyph.path.commands) {
      if (c.type === "M" || c.type === "L") d += `${c.type}${pt(c.x, c.y)}`;
      else if (c.type === "Q") d += `Q${pt(c.x1, c.y1)} ${pt(c.x, c.y)}`;
      else if (c.type === "C") d += `C${pt(c.x1, c.y1)} ${pt(c.x2, c.y2)} ${pt(c.x, c.y)}`;
      else if (c.type === "Z") d += "Z";
    }
    x0 += glyph.advanceWidth * scale;
    if (i < glyphs.length - 1) x0 += font.getKerningValue(glyph, glyphs[i + 1]) * scale + tracking;
  });
  return { d, box: { x1, x2, y1, y2 } };
}

const { d: wordD, box } = wordmarkPath(100);
const ww = Math.ceil(box.x2 - box.x1);
const wh = Math.ceil(box.y2 - box.y1);
const wx = -box.x1;
const wy = -box.y1;

const symbol = (variant, color = WHITE) =>
  `<g transform="scale(${32 / 864})"><path d="${SYMBOL}" transform="translate(13.5 -22)" fill="none" stroke="${variant === "filled" ? ACCENT : color}" stroke-width="36" stroke-linejoin="round"/></g>`;

const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

const files = {
  "siwom-symbol.svg": svg(32, 32, symbol("filled"), "SIWOM"),
  "siwom-symbol-mono-white.svg": svg(32, 32, symbol("mono", WHITE), "SIWOM"),
  "siwom-symbol-mono-black.svg": svg(32, 32, symbol("mono", INK), "SIWOM"),
  "siwom-wordmark-white.svg": svg(ww, wh, `<path transform="translate(${wx.toFixed(2)} ${wy.toFixed(2)})" d="${wordD}" fill="${WHITE}"/>`, "SIWOM"),
  "siwom-wordmark-ink.svg": svg(ww, wh, `<path transform="translate(${wx.toFixed(2)} ${wy.toFixed(2)})" d="${wordD}" fill="${INK}"/>`, "SIWOM"),
};

// Lockup: symbol at cap height + 30% gap, wordmark vertically centred
const symSize = Math.round(wh * 1.35);
const gap = Math.round(symSize * 0.36);
const lockW = symSize + gap + ww;
const lockH = symSize;
const lockup = (color) =>
  `<g transform="scale(${(symSize / 32).toFixed(4)})">${symbol("filled")}</g>` +
  `<path transform="translate(${(symSize + gap + wx).toFixed(2)} ${((lockH - wh) / 2 + wy).toFixed(2)})" d="${wordD}" fill="${color}"/>`;
files["siwom-lockup-white.svg"] = svg(lockW, lockH, lockup(WHITE), "SIWOM");
files["siwom-lockup-ink.svg"] = svg(lockW, lockH, lockup(INK), "SIWOM");

await fs.mkdir("public/brand", { recursive: true });
for (const [name, content] of Object.entries(files)) {
  await fs.writeFile(path.join("public/brand", name), content);
  console.log("  public/brand/" + name);
}

// PNG logo for structured data, and app icons
const symbolSvg = Buffer.from(files["siwom-symbol.svg"]);
await sharp(symbolSvg, { density: 1200 }).resize(512, 512).png().toFile("public/brand/siwom-symbol.png");
await fs.writeFile("app/icon.svg", files["siwom-symbol.svg"]);
await sharp(Buffer.from(svg(32, 32, `<rect width="32" height="32" fill="${INK}"/>${symbol("filled")}`, "SIWOM")), { density: 1200 })
  .resize(180, 180)
  .png()
  .toFile("app/apple-icon.png");

// favicon.ico with 16, 32 and 48 px PNG frames
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => sharp(symbolSvg, { density: 1200 }).resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});
await fs.writeFile("app/favicon.ico", Buffer.concat([header, ...entries, ...pngs]));
console.log("  public/brand/siwom-symbol.png, app/icon.svg, app/apple-icon.png, app/favicon.ico");

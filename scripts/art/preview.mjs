// Dev helper: render one scene to a preview JPEG. Usage: node scripts/art/preview.mjs <scene> <outDir>
import sharp from "sharp";
import { grade } from "./lib.mjs";
import * as scenes from "./scenes.mjs";

const [name, outDir] = process.argv.slice(2);
const t = Date.now();
const result = await scenes[name]();
const svg = typeof result === "string" ? result : result.svg;
const png = await sharp(Buffer.from(svg), { limitInputPixels: false }).png().toBuffer();
await grade(sharp(png)).resize(1600, 1600, { fit: "inside" }).jpeg({ quality: 82 }).toFile(`${outDir}/${name}.jpg`);
console.log(name, "svg", (svg.length / 1024).toFixed(0) + "KB", Date.now() - t + "ms");

#!/usr/bin/env node
/**
 * Screenshots pages at given widths with the system Chrome (no browser
 * download). Also reports horizontal overflow per page and width.
 *   node scripts/qa/shots.mjs --base http://localhost:3100 --out ./shots --widths 390,1440 / /contact
 * Flags: --full (full page), --reduced (prefers-reduced-motion), --scroll (scroll through to trigger reveals),
 *        --dark (prefers-color-scheme: dark)
 */
import fs from "node:fs/promises";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const flag = (name) => args.includes(`--${name}`);
const base = opt("base", "http://localhost:3100");
const out = opt("out", "./qa-shots");
const widths = opt("widths", "390,1440").split(",").map(Number);
const valued = new Set(["--base", "--out", "--widths"]);
const paths = args.filter((a, i) => a.startsWith("/") && !valued.has(args[i - 1]));
await fs.mkdir(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
let overflowIssues = 0;
for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: width < 768 ? 844 : 900 },
    deviceScaleFactor: 1,
    reducedMotion: flag("reduced") ? "reduce" : "no-preference",
    colorScheme: flag("dark") ? "dark" : "light",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`);
  });
  for (const p of paths.length ? paths : ["/"]) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    if (flag("scroll") || flag("full")) {
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 400) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 900));
      });
    }
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      const offenders = [];
      if (doc.scrollWidth > doc.clientWidth) {
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.right > doc.clientWidth + 1 && getComputedStyle(el).position !== "fixed") {
            offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(r.right)}`);
            if (offenders.length > 5) break;
          }
        }
      }
      return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, offenders };
    });
    const name = `${p === "/" ? "home" : p.replace(/[/?=&]+/g, "_").replace(/^_/, "")}-${width}${flag("dark") ? "-dark" : ""}`;
    await page.screenshot({ path: `${out}/${name}.png`, fullPage: flag("full") });
    const over = overflow.scrollWidth > overflow.clientWidth;
    if (over) overflowIssues++;
    console.log(`${name}: ${over ? `OVERFLOW ${overflow.scrollWidth}>${overflow.clientWidth} ${overflow.offenders.join(" | ")}` : "ok"}`);
  }
  if (errors.length) console.log(`console @${width}:\n  ${[...new Set(errors)].join("\n  ")}`);
  await context.close();
}
await browser.close();
process.exitCode = overflowIssues ? 1 : 0;

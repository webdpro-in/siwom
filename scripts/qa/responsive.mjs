#!/usr/bin/env node
/**
 * Responsive and keyboard sweep:
 *  - no horizontal scroll at 360, 390, 768, 1024, 1280, 1440, 1920 px
 *  - H1/H2 headlines wrap to ≤ 3 lines at 360 and 390 px
 *  - Tab through each page: the focused element is always visible, has a
 *    visible focus style and is never hidden behind the sticky header
 *   node scripts/qa/responsive.mjs --base http://localhost:3100
 */
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const base = args.includes("--base") ? args[args.indexOf("--base") + 1] : "http://localhost:3100";
const pages = ["/", "/logistics", "/global-trade", "/safety", "/technology", "/industries", "/vision", "/about", "/contact", "/privacy", "/terms"];
const widths = [360, 390, 768, 1024, 1280, 1440, 1920];
let failures = 0;
const fail = (msg) => {
  failures++;
  console.log("FAIL", msg);
};

const browser = await chromium.launch({ channel: "chrome", headless: true });

for (const width of widths) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  for (const path of pages) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    // Load demos and reveal everything so the final layout is measured.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
    });
    await page.waitForTimeout(600);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over > 0) fail(`horizontal scroll ${over}px at ${width} on ${path}`);
    if (width <= 390) {
      const long = await page.evaluate(() =>
        [...document.querySelectorAll("h1, h2")]
          .filter((h) => h.getClientRects().length)
          .map((h) => {
            const lh = parseFloat(getComputedStyle(h).lineHeight);
            return { text: h.textContent.trim().slice(0, 60), lines: Math.round(h.getBoundingClientRect().height / lh) };
          })
          .filter((h) => h.lines > 3),
      );
      for (const h of long) fail(`headline ${h.lines} lines at ${width} on ${path}: "${h.text}"`);
    }
  }
  console.log(`checked ${pages.length} pages at ${width}px`);
  await ctx.close();
}

// Keyboard pass at desktop and mobile widths. Reduced motion turns off smooth
// scrolling so positions can be measured straight after each Tab.
for (const width of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const path of pages) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    let steps = 0;
    let lastIndex = -1;
    for (let i = 0; i < 250; i++) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const header = document.querySelector("header");
        const hb = header ? header.getBoundingClientRect().bottom : 0;
        const fixedAncestor = (() => {
          for (let n = el; n; n = n.parentElement) if (getComputedStyle(n).position === "fixed") return true;
          return false;
        })();
        const label = el.closest("label");
        const ring =
          (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) ||
          cs.boxShadow !== "none" ||
          // stretched-link pattern draws the ring on ::after
          getComputedStyle(el, "::after").outlineStyle !== "none" ||
          // radio cards draw the ring on their label
          (label && getComputedStyle(label).outlineStyle !== "none");
        const focusables = [...document.querySelectorAll("a[href], button, input, select, textarea, [tabindex]")].filter((n) => n.tabIndex >= 0);
        return {
          index: focusables.indexOf(el),
          id: `${el.tagName}.${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40)}`,
          visible: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight,
          underHeader: !fixedAncestor && r.bottom <= hb + 1,
          ring,
          skip: el.closest("[inert]") !== null,
        };
      });
      if (!info) continue;
      if (info.index <= lastIndex && steps > 5) break; // wrapped around
      lastIndex = info.index;
      steps++;
      if (!info.visible) fail(`focused element off-screen @${width} ${path}: ${info.id}`);
      if (info.underHeader) fail(`focus hidden under header @${width} ${path}: ${info.id}`);
      if (!info.ring) fail(`no visible focus style @${width} ${path}: ${info.id}`);
    }
    console.log(`keyboard ${path} @${width}: ${steps} stops`);
  }
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} issues` : "\nResponsive and keyboard sweep: no issues");
process.exitCode = failures ? 1 : 0;

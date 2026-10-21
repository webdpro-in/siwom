#!/usr/bin/env node
/**
 * End-to-end QA against a running production build (system Chrome, no
 * browser download). Start the server first, e.g.
 *   npm run start -- -p 3100
 * then:
 *   node scripts/qa/run-qa.mjs --base http://localhost:3100
 * Covers: axe (WCAG 2.2 AA tags) on every page at 390 and 1440 px, internal
 * link resolution, mobile menu focus trap, CTA prefill, both demos, contact
 * form validation / success / honeypot / time check / rate limit, and
 * console errors.
 */
import { chromium } from "playwright-core";
import AxeBuilder from "@axe-core/playwright";

const args = process.argv.slice(2);
const base = args[args.indexOf("--base") + 1] || "http://localhost:3100";
const pages = ["/", "/logistics", "/global-trade", "/safety", "/technology", "/industries", "/vision", "/about", "/contact", "/privacy", "/terms", "/styleguide", "/missing-page"];

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function newPage(width, opts = {}) {
  const context = await browser.newContext({
    viewport: { width, height: width < 768 ? 844 : 900 },
    reducedMotion: opts.reduced ? "reduce" : "no-preference",
    hasTouch: width < 768,
    colorScheme: "dark",
  });
  const page = await context.newPage();
  page.consoleErrors = [];
  page.on("console", (m) => {
    if (["error", "warning"].includes(m.type()) && !/status of 404/.test(m.text())) page.consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => page.consoleErrors.push(e.message));
  return { context, page };
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
}

// ---------------------------------------------------------------- axe + console
for (const width of [390, 1440]) {
  const { context, page } = await newPage(width);
  for (const path of pages) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    await scrollThrough(page);
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
      .analyze();
    const serious = axe.violations.filter((v) => ["serious", "critical"].includes(v.impact));
    const other = axe.violations.filter((v) => !["serious", "critical"].includes(v.impact));
    check(
      `axe ${path} @${width}`,
      serious.length === 0,
      [...serious, ...other].map((v) => `${v.impact}:${v.id}(${v.nodes.length}) ${v.nodes[0]?.target?.join(" ")}`).join(" | "),
    );
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    check(`no horizontal scroll ${path} @${width}`, !overflow);
    const h1 = await page.locator("h1").count();
    check(`one h1 ${path} @${width}`, h1 === 1, `found ${h1}`);
  }
  check(`no console errors @${width}`, page.consoleErrors.length === 0, [...new Set(page.consoleErrors)].slice(0, 5).join(" | "));
  await context.close();
}

// ---------------------------------------------------------------- links
{
  const { context, page } = await newPage(1440);
  const hrefs = new Set();
  for (const path of pages.filter((p) => p !== "/missing-page")) {
    await page.goto(base + path, { waitUntil: "domcontentloaded" });
    for (const href of await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")))) {
      if (href && !href.startsWith("mailto:") && !href.startsWith("http")) hrefs.add(href.split("#")[0] || path);
      if (href === "#") hrefs.add("BAD:#");
    }
  }
  const bad = [];
  for (const href of hrefs) {
    if (href.startsWith("BAD")) {
      bad.push(href);
      continue;
    }
    const res = await page.request.get(base + href);
    if (res.status() >= 400) bad.push(`${href} → ${res.status()}`);
  }
  check(`all ${hrefs.size} internal links resolve`, bad.length === 0, bad.join(", "));
  await context.close();
}

// ---------------------------------------------------------------- mobile menu + sticky CTA
{
  const { context, page } = await newPage(390);
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Site menu" });
  check("mobile menu opens", await dialog.isVisible());
  for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
  const inside = await page.evaluate(() => document.getElementById("mobile-menu")?.contains(document.activeElement));
  check("mobile menu traps focus", inside === true);
  const locked = await page.evaluate(() => document.body.style.overflow === "hidden");
  check("mobile menu locks scroll", locked);
  await page.keyboard.press("Escape");
  check("Esc closes menu", !(await dialog.isVisible()));
  const back = await page.evaluate(() => document.activeElement?.getAttribute("aria-controls"));
  check("focus returns to hamburger", back === "mobile-menu");
  // Sticky CTA appears after the hero
  const bar = page.locator('[data-track="sticky_talk"]');
  const beforeHidden = await page.evaluate(() => document.querySelector('[data-track="sticky_talk"]')?.closest("[inert]") !== null);
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
  await page.waitForTimeout(600);
  const afterVisible = await page.evaluate(() => document.querySelector('[data-track="sticky_talk"]')?.closest("[inert]") === null);
  check("sticky CTA hidden on hero, shown after", beforeHidden && afterVisible);
  await page.goto(base + "/contact", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(500);
  const hiddenOnContact = await page.evaluate(() => document.querySelector('[data-track="sticky_talk"]')?.closest("[inert]") !== null);
  check("sticky CTA hidden on the contact form", hiddenOnContact);
  void bar;
  await context.close();
}

// ---------------------------------------------------------------- CTA prefill
{
  const { context, page } = await newPage(1440);
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.locator('[data-track="hero_discuss_pilot"]').click();
  await page.waitForURL(/\/contact\?interest=logistics&pilot=1/);
  await page.waitForSelector('input[name="interest"]');
  check(
    "homepage pilot CTA pre-selects Logistics and pilot",
    (await page.locator('input[name="interest"][value="logistics"]').isChecked()) && (await page.locator("#contact-pilot").isChecked()),
  );
  await page.goto(base + "/safety", { waitUntil: "networkidle" });
  await page.locator('[data-track="hero_Discuss Safety"]').click();
  await page.waitForURL(/\/contact\?interest=safety/);
  await page.waitForSelector('input[name="interest"]');
  check("Safety CTA pre-selects Safety", await page.locator('input[name="interest"][value="safety"]').isChecked());
  await page.goto(base + "/contact?interest=logistics&pilot=1", { waitUntil: "networkidle" });
  check(
    "?interest=logistics&pilot=1 prefill",
    (await page.locator('input[name="interest"][value="logistics"]').isChecked()) && (await page.locator("#contact-pilot").isChecked()),
  );
  await context.close();
}

// ---------------------------------------------------------------- Logistics demo
for (const width of [1440, 390]) {
  const { context, page } = await newPage(width);
  await page.goto(base + "/logistics", { waitUntil: "networkidle" });
  const demo = page.locator("#demo");
  await demo.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => !document.querySelector("#demo [inert]"), null, { timeout: 15000 });
  check(`logistics demo loads @${width}`, true);
  // Filter: Delayed → URL + summary update
  await demo.getByRole("button", { name: "Delayed", exact: true }).first().click();
  await page.waitForTimeout(200);
  check(`filter reflected in URL @${width}`, page.url().includes("status=delayed"), page.url());
  const inTransit = await demo.locator("dl dd").first().innerText();
  check(`summary cards follow filters @${width}`, inTransit.trim() === "3", `in transit = ${inTransit}`);
  // Select a shipment from the table/cards → drawer opens
  if (width < 768) await demo.getByRole("tab", { name: "Shipments" }).click();
  const row = demo.getByRole("button", { name: "SHP-24-0918" }).first();
  await row.click();
  const drawer = page.getByRole("dialog");
  await drawer.waitFor({ state: "visible" });
  check(`selecting a shipment opens the drawer @${width}`, await drawer.getByText("Suggestion only — the operator decides").isVisible());
  await drawer.getByRole("button", { name: "Acknowledge exception" }).click();
  check(`acknowledge from drawer @${width}`, await drawer.getByText("Acknowledged").isVisible());
  await page.keyboard.press("Escape");
  await drawer.waitFor({ state: "hidden" });
  check(`Esc closes drawer @${width}`, true);
  // Empty state
  await demo.getByRole("button", { name: "Clear all status filters" }).click().catch(() => {});
  await demo.getByRole("searchbox").fill("no-such-shipment");
  await page.waitForTimeout(200);
  check(`empty filter state @${width}`, await demo.getByText("No shipments match these filters").first().isVisible().catch(() => false) || (await demo.getByText("No routes match these filters").first().isVisible().catch(() => false)));
  await demo.getByRole("searchbox").fill("");
  // Assign a vehicle
  if (width < 768) await demo.getByRole("tab", { name: "Dispatch" }).click();
  await demo.locator('select[id$="assign-DSP-1041"]').selectOption("TRK-0175");
  await demo.getByRole("button", { name: "Assign vehicle to DSP-1041" }).click();
  check(`assign moves row to Assigned @${width}`, await demo.getByText("Assigned · 1").isVisible());
  // Reset
  await demo.getByRole("button", { name: "Reset demo" }).click();
  // Reset returns mobile to the Map tab, so open Dispatch to check the queue.
  if (width < 768) await demo.getByRole("tab", { name: "Dispatch" }).click();
  check(`reset restores state @${width}`, await demo.getByText("Unassigned · 5").isVisible());
  check(`no console errors in logistics demo @${width}`, page.consoleErrors.length === 0, page.consoleErrors.slice(0, 3).join(" | "));
  await context.close();
}

// ---------------------------------------------------------------- Safety demo
for (const width of [1440, 390]) {
  const { context, page } = await newPage(width);
  await page.goto(base + "/safety", { waitUntil: "networkidle" });
  const demo = page.locator("#demo");
  await demo.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => !document.querySelector("#demo [inert]"), null, { timeout: 15000 });
  await demo.getByRole("tab", { name: /PPE check/ }).click();
  await demo.getByRole("button", { name: /DET-2051/ }).first().click();
  await demo.getByRole("button", { name: "Confirm hazard" }).click();
  check(`confirm updates status @${width}`, await demo.getByText("Confirmed").first().isVisible());
  if (width < 768) await demo.getByRole("button", { name: /Incident log/ }).click();
  check(`confirm appends to incident log @${width}`, await demo.locator("table").getByText("Confirmed hazard").isVisible());
  const announced = await page.locator('[aria-live="polite"]').last().innerText();
  check(`action announced via aria-live @${width}`, /Hazard confirmed, added to incident log/.test(announced), announced.slice(0, 80));
  await demo.getByRole("switch", { name: "Show detections" }).click();
  check(`show detections toggle hides boxes @${width}`, (await demo.getByRole("button", { name: /DET-2051: / }).count()) === 0);
  await demo.getByRole("button", { name: "Reset demo" }).click();
  check(`safety reset @${width}`, (await demo.getByRole("tab", { name: /Visible damage/ }).getAttribute("aria-selected")) === "true");
  check(`no console errors in safety demo @${width}`, page.consoleErrors.length === 0, page.consoleErrors.slice(0, 3).join(" | "));
  await context.close();
}

// ---------------------------------------------------------------- contact form
{
  const { context, page } = await newPage(1440);
  await page.goto(base + "/contact", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Send message" }).click();
  const summary = page.getByRole("alert").filter({ hasText: "need attention" });
  check("failed submit shows error summary", await summary.isVisible());
  check("focus moves to error summary", await page.evaluate(() => document.activeElement?.getAttribute("role") === "alert"));
  // Error clears as soon as the field becomes valid
  await page.locator("#contact-name").fill("Asha Rao");
  check("error clears when field becomes valid", (await page.locator("#contact-name-error").count()) === 0);
  await page.locator("#contact-company").fill("Example Freight Co.");
  await page.locator("#contact-email").fill("asha@example.com");
  await page.locator("#contact-industry").selectOption("ports");
  await page.locator('input[name="interest"][value="logistics"]').check();
  await page.locator("#contact-message").fill("We run a container freight station near Nhava Sheva and want to test exception alerts.");
  await page.locator("#contact-consent").check();
  await page.waitForTimeout(3100);
  await page.route("**/api/contact", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, validated: true }) }));
  await page.route("https://api.web3forms.com/submit", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: false }) }));
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByRole("alert").filter({ hasText: "could not accept" }).waitFor();
  check("provider failure preserves message", (await page.locator("#contact-message").inputValue()).includes("container freight station"));
  await page.unroute("https://api.web3forms.com/submit");
  await page.route("https://api.web3forms.com/submit", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) }));
  await page.getByRole("button", { name: "Send message" }).click();
  const thanks = page.getByRole("heading", { name: "Thanks. Your message was submitted." });
  await thanks.waitFor({ timeout: 10000 }).catch(() => {});
  check("UI success after server validation AND provider confirmation (mocked; real provider tested separately)", await thanks.isVisible());
  check("focus moves to confirmation heading", await page.evaluate(() => document.activeElement?.tagName === "H2"));
  // API-level checks: honeypot, time check, validation, rate limit
  const payload = {
    name: "Asha Rao",
    company: "Example Freight Co.",
    email: "asha@example.com",
    industry: "ports",
    interest: "logistics",
    pilot: false,
    message: "Testing the honeypot and time checks on the server.",
    consent: true,
    website: "",
    startedAt: Date.now() - 10000,
  };
  const honeypot = await page.request.post(base + "/api/contact", { data: { ...payload, website: "spam.example" }, headers: { "x-forwarded-for": "10.0.0.2" } });
  check("honeypot rejected", honeypot.status() === 422);
  const fast = await page.request.post(base + "/api/contact", { data: { ...payload, startedAt: Date.now() }, headers: { "x-forwarded-for": "10.0.0.3" } });
  check("submissions under 3 s rejected", fast.status() === 422);
  const invalid = await page.request.post(base + "/api/contact", { data: { ...payload, email: "nope" }, headers: { "x-forwarded-for": "10.0.0.4" } });
  check("server re-validates with the shared schema", invalid.status() === 400);
  let last = 0;
  for (let i = 0; i < 6; i++) {
    const r = await page.request.post(base + "/api/contact", { data: { ...payload, email: "invalid" }, headers: { "x-forwarded-for": "10.0.0.9" } });
    last = r.status();
  }
  check("rate limit: 6th message in an hour gets 429", last === 429, `status ${last}`);
  await context.close();
}

// ---------------------------------------------------------------- shipment globe (Global Trade)
for (const width of [1440, 390]) {
  const { context, page } = await newPage(width);
  await page.goto(base + "/global-trade#journeys", { waitUntil: "networkidle" });
  await page.locator("#journeys").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const globe = page.locator('[aria-roledescription="globe"]');
  const painted = await page.evaluate(() => {
    const c = document.querySelector('[aria-roledescription="globe"] canvas');
    if (!c || !c.width) return false;
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let ink = 0;
    for (let i = 3; i < d.length; i += 16) if (d[i] > 0) ink++;
    return ink > 1000;
  });
  check(`globe renders @${width}`, painted);
  check(`globe carries the demo-data banner @${width}`, await page.locator("#journeys").getByText(/Illustrative demo data/i).isVisible());
  await page.getByRole("button", { name: /INT-24-0425/ }).click();
  await page.waitForTimeout(600);
  check(`selecting a shipment updates the journey @${width}`, await page.getByRole("heading", { name: "INT-24-0425" }).isVisible());
  check(`globe label names the selected route @${width}`, (await globe.getAttribute("aria-label"))?.includes("INT-24-0425") ?? false);
  await globe.focus();
  const before = await page.evaluate(() => document.querySelector('[aria-roledescription="globe"] canvas').toDataURL().length);
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(1500);
  const after = await page.evaluate(() => document.querySelector('[aria-roledescription="globe"] canvas').toDataURL().length);
  check(`arrow keys rotate the globe @${width}`, before !== after);
  check(`no console errors on Global Trade @${width}`, page.consoleErrors.length === 0, page.consoleErrors.slice(0, 3).join(" | "));
  await context.close();
}

// ---------------------------------------------------------------- renamed routes
{
  const r1 = await fetch(base + "/logistics-os", { redirect: "manual" });
  const r2 = await fetch(base + "/safety-ai", { redirect: "manual" });
  check("old /logistics-os redirects permanently", r1.status === 308 && r1.headers.get("location")?.endsWith("/logistics"));
  check("old /safety-ai redirects permanently", r2.status === 308 && r2.headers.get("location")?.endsWith("/safety"));
}

// ---------------------------------------------------------------- reduced motion
{
  const { context, page } = await newPage(1440, { reduced: true });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const sideBySide = await page.evaluate(() => {
    const els = [...document.querySelectorAll("figure > div")];
    return els.some((e) => getComputedStyle(e).display === "grid" && e.textContent?.includes("With one view"));
  });
  check("reduced motion: challenge shows both states side by side", sideBySide);
  const heroAnim = await page.evaluate(() => getComputedStyle(document.querySelector(".hero-rise")).animationName);
  check("reduced motion: hero uses fade only", heroAnim === "fade", heroAnim);
  await context.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exitCode = failed.length ? 1 : 0;

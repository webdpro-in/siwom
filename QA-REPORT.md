# QA report

Run on 18 Oct 2026 against a production build (`next build` + `next start`) on macOS with Google Chrome 155. The automated suites are in `scripts/qa/` and can be re-run with the `npm run qa*` scripts (see README).

Legend: ✅ done and verified · ⚠️ done with a caveat · ❌ not done

## Summary

| Check | Result |
| --- | --- |
| `next build` | ✅ Exit 0; no warnings or errors in output |
| TypeScript (`tsc --noEmit`, strict) | ✅ 0 errors |
| ESLint (Next + React Compiler rules) | ✅ 0 problems |
| End-to-end suite (`npm run qa`) | ✅ 127 / 127 checks pass |
| Responsive and keyboard sweep (`npm run qa:responsive`) | ✅ No issues: 10 pages × 7 widths, tab-through at 390 and 1440 px |
| axe (WCAG 2.0/2.1/2.2 A and AA + best practice), 12 routes × 2 widths | ✅ 0 violations of any severity |
| Token check (`npm run qa:tokens`) | ✅ No hard-coded colours, sizes or durations |
| Contrast (`npm run qa:contrast`) | ✅ All text tokens ≥ 4.5:1 on every surface; see notes |
| First-load JS (`npm run qa:budget`) | ✅ 154–164 KB gzipped per route, under the 170 KB budget |

## Lighthouse (mobile)

Lighthouse 13.5, mobile form factor. Two throttling modes are reported because they disagree on LCP:

- **Simulated** (the default): models slow 4G (1.6 Mbps, 150 ms RTT) by estimating, after the fact, how requests would share bandwidth.
- **Applied** (`--throttling-method=devtools`): actually throttles the network and CPU (4× slowdown) while the page loads, so Chrome's real request priorities apply.

| Page | Mode | Perf | A11y | Best practices | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | simulated (warm, 3 runs) | 92 | 100 | 100 | 100 | 3.4 s | 0 ms | 0 |
| / | applied | 99 | 100 | 100 | 100 | 2.0 s | 10 ms | 0 |
| /logistics-os | simulated | 94 | 100 | 100 | 100 | 3.1 s | 0 ms | 0 |
| /logistics-os | applied | 99 | 100 | 100 | 100 | 1.7 s | 10 ms | 0 |
| /safety-ai | simulated | 94 | 100 | 100 | 100 | 3.1 s | 0 ms | 0 |
| /safety-ai | applied | 99 | 100 | 100 | 100 | 1.6 s | 10 ms | 0 |
| /contact | simulated (3 runs) | 90–95 | 100 | 100 | 100 | 2.9–3.6 s | 10–50 ms | 0 |
| /contact | applied | 99 | 100 | 100 | 100 | 1.7 s | 10 ms | 0 |

⚠️ **LCP target (≤ 2.5 s) in simulated mode is not met.** It is met with applied throttling (1.6–2.0 s).

- **What sets the floor.** With all JavaScript blocked, simulated LCP is exactly 2.5 s. The simulation shares bandwidth between the 35 KB hero image and the roughly 120 KB gzipped framework runtime (React 19 + Next.js), even though Chrome actually fetches the `fetchpriority=high` image first. The applied-throttling runs reflect that real ordering.
- **What was changed to get here:**
  - demos load only near the viewport or on first interaction;
  - the contact form is split into its own chunk;
  - the art-directed hero image is preloaded;
  - fonts are preloaded to avoid a late swap.
- **Further options, if the simulated number matters:**
  - convert the homepage's two remaining client sections (industries explorer, challenge visual) to CSS-only interactions;
  - drop `tailwind-merge` from client components;
  - trim the demo posters.

Measure field data (CrUX or Vercel Speed Insights) after launch.

Other performance facts:

- **Hero image:** 35 KB at 750 w (AVIF), against a ≤ 200 KB budget.
- **CLS:** 0 on all pages in both modes. An earlier 0.19 on `/safety-ai` was caused by a late JetBrains Mono swap; it was fixed by preloading the font.

## Section 11 checklist

### Visual and UX

| Item | Status | Evidence |
| --- | --- | --- |
| Tokens only | ✅ | `npm run qa:tokens`; Tailwind defaults cleared in `@theme` |
| Lime limited to CTAs, active states and key highlights | ✅ | Visual review of every page at 1440 and 390 px |
| Every product, card, demo and roadmap item has the correct status label | ✅ | Product, division, industry, capability, integration, research and roadmap items all carry one. Purely descriptive cards (principles, security practices) make no product claim and carry none. |
| Safety section visually strongest on the homepage | ✅ | Largest section, own surface-1 band with 2 px lime top border, demo + workflow + principle + limitations |
| Concept renders captioned; no image implies owned fleets, ports, factories or robots | ✅ | "Concept render" captions; figure captions say "Not a SIWOM facility" or "SIWOM does not own or operate…" |
| Every person in industrial imagery wears appropriate PPE | ✅ | All illustrated people wear helmets and hi-vis vests, except the one flagged "possible missing helmet" demo frame, which the copy explains |
| Product names match nav labels on every page | ✅ | Logistics OS / Safety AI / Technology / Industries / Our Vision / About appear identically in the nav, page eyebrows and H1s; first mention uses the "SIWOM Stream, our Logistics OS" pair |

### Responsive

| Item | Status | Evidence |
| --- | --- | --- |
| 360, 390, 768, 1024, 1280, 1440, 1920 px with no horizontal scroll | ✅ | `qa:responsive`, all 10 public pages |
| Mobile demos use tabs, cards and bottom sheets | ✅ | Logistics: tabs, stacked cards, bottom sheet, scroll-snap summary row. Safety: chip tabs, stacked actions, collapsed log |
| Headlines wrap to 3 lines or fewer on mobile | ✅ | `qa:responsive` measures every H1 and H2 at 360 and 390 px |
| Sticky mobile CTA appears after the hero and hides over the form | ✅ | `npm run qa` |

### Interaction and flows

| Item | Status | Evidence |
| --- | --- | --- |
| Every nav link, CTA and footer link resolves; no `#` placeholders | ✅ | `npm run qa` link check |
| CTAs pre-fill the contact form | ✅ | Safety CTA → `?interest=safety-ai`; `?interest=logistics-os&pilot=1` checked |
| Demo filters, selection sync, drawer, acknowledge, assign, reviewer actions and Reset | ✅ | `npm run qa` at 1440 and 390 px |
| Empty, loading and error states for every data view | ✅ | Empty: table, map, exceptions, dispatch. Loading: poster with status line, form skeleton, table skeleton (styleguide). Error: demo chunk failure with retry, `ErrorState` in styleguide |
| Contact form: success only on a real 2xx; failure keeps input and shows the fallback email; honeypot and rate limit | ✅ | Success via `CONTACT_DELIVERY=log`. Failure tested with delivery unconfigured (503): input kept, fallback email shown, focus moved to the error, no fake success. Honeypot → 422, under 3 s → 422, invalid → 400, 6th per hour → 429. Real Resend delivery not tested (no credentials). |

### Accessibility

| Item | Status | Evidence |
| --- | --- | --- |
| Keyboard-only pass through the whole site, including demos and mobile menu | ✅ | Tab-through of every page at two widths; menu focus trap, Esc and focus return; drawer trap and Esc; tabs with arrow keys |
| Visible focus everywhere; nothing hidden behind the sticky header | ✅ | `qa:responsive` checks every focus stop |
| axe: zero serious or critical issues; contrast verified | ✅ | 0 violations of any severity; `qa:contrast` |
| Screen reader pass (VoiceOver and NVDA or TalkBack) on home, a demo and contact | ❌ | **Not performed.** Needs a person with VoiceOver, NVDA or TalkBack. Automated proxies passed: landmarks, one H1 per page, ARIA tabs, dialogs, `aria-live` announcements (verified), text equivalents for map, diagram and detection overlays. |
| Reduced-motion mode | ✅ | `npm run qa`: hero uses fade only; challenge shows both states side by side; reveals become opacity-only |

### Performance and technical

| Item | Status | Evidence |
| --- | --- | --- |
| Lighthouse mobile meets Section 9 targets on home, Logistics OS, Safety AI and Contact | ⚠️ | Performance ≥ 90 and 100 for A11y, Best practices and SEO on all four. LCP ≤ 2.5 s with applied throttling, but 2.9–3.6 s in simulated mode (see above). |
| Production build with zero TypeScript errors and zero console errors or warnings | ✅ | Build and `tsc` clean; `npm run qa` checks console errors and warnings on every page and in both demos |
| No secrets in client bundles; security headers present | ✅ | Grep of `.next/static` finds no secret names or keys; CSP, nosniff, Referrer-Policy, X-Frame-Options, COOP and Permissions-Policy present (HSTS added automatically with an https site URL) |
| Metadata, OG images, sitemap and robots | ✅ | Unique title, description and canonical per page; per-route OG images (1200×630); `/sitemap.xml` excludes `/styleguide`; `/robots.txt`; Organization JSON-LD with name, URL and logo only |
| Legal pages show the "Draft — legal review required" banner | ✅ | `/privacy`, `/terms` |

## Notes and known limitations

- **Contrast:** `text-subtle` (4.2:1) fails 4.5:1 and is therefore used only for disabled states. `border-strong` (1.5–2:1) is decorative only; form controls use the added `border-control` token (3.2–4.2:1).
- **Rate limiting** is in memory, per server instance. Use a shared store on serverless hosting.
- **Map:** the optional MapLibre basemap from the brief is not built. The schematic map deliberately draws no national boundaries; a basemap must use a provider that depicts India's official boundaries.
- **`npm audit`** reports 5 high-severity advisories, all in the dev-only ESLint toolchain (`eslint-config-next` → `fast-glob` → `micromatch` → `braces`). Nothing ships to the browser. The suggested `--force` fix would downgrade `eslint-config-next` to v14, so it was not applied.

## Addendum — global technology trade update (18 October 2026)

Re-run after adding `/global-trade`, the homepage trade section, the highlighted industries and the technology sections, against a production build:

| Check | Result |
| --- | --- |
| `next build`, `tsc --noEmit`, ESLint | ✅ Clean |
| `npm run qa` (now includes `/global-trade`) | ✅ 134 / 134 checks pass, including axe at 390 and 1440 px |
| `npm run qa:responsive` | ✅ No issues: 11 pages × 7 widths; keyboard tab-through at 390 and 1440 px |
| `npm run qa:tokens` | ✅ No hard-coded colours, sizes or durations |
| First-load JS | ✅ `/` 169.3 KB, `/global-trade` 160.3 KB gzipped, under the 170 KB budget. The homepage is close to the limit. |
| Header with seven nav items | ✅ Single line at 1024 and 1280 px |
| Visual review | ✅ Dark and light themes, 1440 and 390 px: homepage, Global Trade, Industries, Technology |

## Addendum — positioning and copy update (21 October 2026)

Production build on macOS with Google Chrome 155, after the homepage, navigation, Logistics OS and copy rewrite:

| Check | Result |
| --- | --- |
| `tsc --noEmit`, ESLint, `next build` | ✅ Clean, no warnings |
| `npm run qa` | ✅ 135 / 135 checks pass. This includes axe on 12 routes at 390 and 1440 px, links, the mobile menu, the demos, contact validation, honeypot, rate limit and reduced motion. The new hero pilot CTA and the Safety AI CTA pre-fill checks pass. |
| `npm run qa:responsive` | ✅ No issues: 11 pages × 7 widths, all headlines three lines or fewer on phones, keyboard tab-through |
| `npm run qa:tokens` | ✅ No hard-coded colours, sizes or durations |
| First-load JS | ✅ `/` 164.3 KB (was 169.3), `/logistics-os` 165.8 KB, `/global-trade` 160.3 KB, `/contact` 154.4 KB gzipped, all under the 170 KB budget |
| SEO | ✅ One H1 per page; unique titles of 61 characters or fewer; descriptions of 160 or fewer; canonical on every page; 404 returns HTTP 404 |
| Preview protection | ✅ A simulated `VERCEL_ENV=preview` build serves `Disallow: /` and `noindex, nofollow`; its canonical uses the production domain |
| Lighthouse mobile (simulated / applied throttling) | `/` 91 / 99, `/logistics-os` 92 / 99, `/contact` 93 / 99 Performance. 100 for Accessibility, Best Practices and SEO everywhere; CLS 0. Simulated LCP is 3.3–3.4 s (applied 1.6–1.9 s); the cause is unchanged from the main report. |
| Visual review | ✅ Homepage at 1440 and 390 px (dark); Logistics OS (dark); Global Trade, About and footer (light) |

Not performed: a manual screen-reader pass, and verification of a live deployment (there is no hosting for SIWOM yet).

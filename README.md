# SIWOM website

Website for SIWOM, an early-stage software company in India building **SIWOM Stream**: shipment coordination software for logistics companies (freight forwarders, transporters, CFS/ICD and warehouse operators). SIWOM Stream is in development, with an interactive demo that uses sample data. Global Trade (space-first) and Safety AI are research tracks; robotics and electric mobility are long-term vision. See **Positioning** below.

Built with Next.js 16 (App Router, Cache Components), React 19, TypeScript (strict), Tailwind CSS 4, Motion, Lucide, React Hook Form and Zod.

- `FEATURES.md`: every feature marked Implemented, Mocked or Planned
- `UPGRADE-REPORT.md`: current visual/platform upgrade, file list, validation and delivery limitations
- `QA-REPORT.md`: historical baseline checks before the upgrade
- `CREDITS.md`: sources and licences for fonts, icons, images and libraries

## Quick start

```bash
npm install
cp .env.example .env.local      # optional for local work
npm run dev                     # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start                   # or: npx next start -p 3100
```

Node 20.9+ is required (developed on Node 22).

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes, in production | Canonical URLs, Open Graph, sitemap, robots. An `https://` URL also turns on HSTS and `upgrade-insecure-requests`. |
| Web3Forms access key | Included | The supplied public form key is in `lib/web3forms.ts`. The account owner must confirm its destination inbox and delivery. |
| `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Optional | Cloudflare Turnstile on the contact form, verified on the server. The CSP allows Cloudflare only when these are set. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | Cookieless Plausible analytics: CTA clicks, demo interactions and form submits. Empty means no analytics script at all. |

The Web3Forms access key is a public form identifier and is intentionally used by the browser, as recommended by Web3Forms. Optional Turnstile secrets remain server-only.

## Before launch: things to replace

These are placeholders on purpose. Nothing has been invented.

1. **Web3Forms**: confirm the supplied key’s recipient in the Web3Forms account, verify inbox delivery, and configure production domain restrictions/spam protection if the plan supports them. No placeholder email is shown.
2. **Legal pages**: `app/privacy` and `app/terms` are starter drafts with a visible "Draft — to be reviewed by qualified legal counsel" banner and `[bracketed]` gaps (legal entity, address, processors, retention, DPDP Act alignment).
3. **Social links**: `site.social` in `lib/site.ts`. Empty links do not render.
4. **Site URL**: set `NEXT_PUBLIC_SITE_URL` to the production domain. On Vercel, the project's production domain (`VERCEL_PROJECT_PRODUCTION_URL`) is used automatically when it is not set. Anywhere else, metadata falls back to `http://localhost:3000`, so set it before launch.
5. **Rate limiting**: `lib/rate-limit.ts` keeps its window in memory, which is fine on one server. On serverless hosting each instance has its own window, so move it to a shared store (for example Upstash Redis or Vercel KV).
6. **Founder or team section**: deliberately absent. Add it only with real details.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint`, `npm run typecheck` | ESLint (flat config, React Compiler rules) and `tsc --noEmit` |
| `npm run art` | Regenerates all illustrations into `assets/images/` (about 2 min; `npm run art -- safety` regenerates a subset) |
| `npm run brand` | Regenerates the logo set, favicon, apple icon and PNG logo |
| `npm run qa` | End-to-end QA against a running server on port 3100: axe on every page at 390 and 1440 px, link check, mobile menu focus trap, CTA prefill, both demos, contact form validation, success, honeypot, time check and rate limit, reduced motion, console errors |
| `npm run qa:responsive` | No horizontal scroll at 360–1920 px, headlines of three lines or fewer on phones, keyboard tab-through with visible focus never hidden under the header |
| `npm run qa:budget` | First-load JS per route against the 170 KB gzipped budget |
| `npm run qa:tokens` | Fails on hard-coded colours, font sizes or durations outside the token files |
| `npm run qa:contrast` | WCAG contrast of every text and UI token pair |

QA scripts drive the system Google Chrome through `playwright-core`, so no browser download is needed. Start the server with `npm run start -- --port 3100` before `npm run qa`.

## Project structure

```
app/                     Routes (App Router). One folder per page, each with opengraph-image.tsx
  api/contact/route.ts   Contact form endpoint: Zod validation, honeypot, 3 s check, rate limit, Turnstile, Web3Forms
  styleguide/            Every token and component with its states (noindex, excluded from sitemap)
  sitemap.ts, robots.ts, not-found.tsx, icon.svg, apple-icon.png, favicon.ico
components/
  ui/                    Button, StatusPill, SeverityBadge, Cards, DataTable, FilterChips, Tabs, Accordion,
                         Field, Toast, Callout, Stepper, Figure, Breadcrumbs/SkipLink, States
  layout/                Header (+ mobile menu), Footer, PageHero, PageSection/LongPage, OnThisPage,
                         NextBlock, StickyCta, StatusLegend, RevealController
  sections/              One file per homepage section, plus shared Safety and architecture parts
  demos/                 logistics/ and safety/ demos, LazyDemo loader and server posters
  contact/               Contact form (lazy chunk)
  brand/                 Logo components (source of truth for the SVG files)
data/                    Typed content: navigation, divisions, status labels, industries, roadmap
  demo/                  Typed illustrative demo data: hubs, shipments, fleet, exceptions, detections
lib/                     cn (Tailwind-aware), tokens (JS mirror), site config, metadata, og renderer,
                         analytics, hooks, rate limit, validation/contact.ts (shared Zod schema)
styles/globals.css       Design tokens (@theme) and base styles
scripts/                 generate-art.mjs, generate-brand.mjs, art/ (scene generators), qa/
assets/                  Generated illustrations (WebP sources) and fonts for OG images and the logo
public/brand/            Logo SVGs (symbol, mono, wordmark, lockup) and PNG logo
```

## Design system

All tokens live in `styles/globals.css` under Tailwind 4's `@theme static`, so each token is also a CSS custom property. Tailwind's default palette, type scale, radii, shadows, easings and containers are cleared on purpose, which means a stray `text-red-500` or `rounded-2xl` compiles to nothing. `npm run qa:tokens` catches hard-coded values in components.

Decisions where the brief was silent, or where meeting WCAG 2.2 AA needed a small addition:

- **`border-control` (#6E7681)**: form controls need a 3:1 boundary (WCAG 1.4.11), and `border-strong` is only about 1.5:1 against inputs. Inputs, checkboxes and radios use `border-control`; `border-strong` stays decorative.
- **`text-subtle`** is 4.2:1 on `bg`, so it is used only for disabled states, never for captions.
- **Status pills** follow Section 2 exactly, including lime text at 12 px for IN DEVELOPMENT, as the label spec requires.
- **Motion**: reveals are CSS transitions driven by one IntersectionObserver (`RevealController`), applied after hydration so nothing is hidden before JavaScript runs. Motion for React is used only inside the lazily loaded demos (drawer and bottom sheet).

## Demos

Both demos are typed, frontend-only prototypes over the data in `data/demo/`. They carry the non-dismissable "Illustrative demo data — not connected to live operations" banner and use a fixed snapshot (18 Oct 2026, 14:30 IST), with no live counters.

- **Loading**: each page server-renders a poster that is the demo's own view in its starting state. The markup is identical, so nothing shifts. The interactive chunk loads when the demo is within one viewport, or on the visitor's first keyboard, pointer or wheel input. A failed chunk load shows an error state with a retry.
- **Logistics OS**: filters (synced to `?status=&mode=&q=`), selection synced across map, table and exceptions, detail drawer (bottom sheet on mobile), acknowledge, dispatch assignment, rail views (Overview, Shipments, Fleet, Dispatch, Exceptions, Sites), empty states and reset.
- **Safety AI**: three scenarios, focusable detection boxes with a text list equivalent, a show-detections switch, and reviewer actions that change status, append to the incident log and are announced through `aria-live`.
- **Map**: a schematic network of real hub names, deliberately **without national boundaries**. Any boundary on an Indian company's site must follow the Survey of India's official depiction. The optional MapLibre basemap from the brief is therefore *Planned*, to be added with a provider that meets that requirement.

## Imagery

Every image is an **original, procedurally generated illustration** (`scripts/art/*`), rasterised and colour-graded in the pipeline with sharp, never with CSS filters. That means:

- no licensing questions;
- no implied ownership of ports, fleets or robots, which the captions also state;
- every person drawn wears correct PPE, except the single flagged "possible missing helmet" demo frame, which the copy explains.

Concept renders carry a "Concept render" caption. To swap in licensed photography later, replace the files in `assets/images/` with the same names and aspect ratios, apply the same grade, and update `CREDITS.md`.

## Deployment

Deploy to Vercel or any Node host that supports Next.js 16.

1. Set `NEXT_PUBLIC_SITE_URL` for production. Vercel preview and development deployments are automatically `noindex` and their `robots.txt` disallows everything (`isIndexable` in `lib/site.ts`).
2. Confirm the Web3Forms account recipient and inbox delivery.
3. Deploy. Pages are prerendered; `/contact` is a partial prerender, with a static shell and the prefilled form streamed in; `/api/contact` is dynamic.
4. After deploying, run `npm run qa` against the deployed URL by changing `--base`, and check Lighthouse on the real host.

Security headers (CSP, HSTS on https, nosniff, Referrer-Policy, X-Frame-Options, COOP, Permissions-Policy) are set in `next.config.ts`. The CSP is static, with no nonces, so pages stay prerendered. It allows inline scripts because Next.js requires them without nonces, and it blocks eval: Zod runs in jitless mode for this reason.

## Photography and themes (October 2026 upgrade)

Twenty-one real Pexels photographs and crops are stored in `public/images/`. Source, author, licence, location caveats and adaptations are documented in `CREDITS.md` and `public/images/image-manifest.json`. Images are representative, not SIWOM assets or endorsements. All active bitmap illustrations were replaced. Safety demo boxes now identify manually selected reference areas, without claiming actual hazards. Future research photographs are representative industry imagery.

The navigation theme button saves `siwom-theme` in localStorage. Without a saved choice the site follows `prefers-color-scheme`, including OS changes. A small head script applies the initial theme before paint; CSS tokens style every page and demo. Photography retains a dark overlay for contrast. Deleting the saved key restores system-following behaviour.

`data/transport.ts` supplies the five-mode equipment explorer. `components/sections/TransportExplorer.tsx` renders it with the existing keyboard-accessible Tabs component and a concise homepage gallery.

The contact API validates and rate-limits requests and retains honeypot/time/optional Turnstile checks. Its response means validation only. The browser then calls Web3Forms, following the provider’s recommended client-side integration. A successful HTTP response alone is insufficient: the provider must return `success: true`. Timeouts and provider failures show an error and preserve input. UI tests mock responses to avoid repeated emails; `node --experimental-strip-types --test scripts/qa/web3forms.test.mjs` tests the delivery contract. A real provider test is recorded separately in UPGRADE-REPORT.md. Inbox arrival always requires the owner’s confirmation.

## International platform and geometric logo

This homepage was replaced on 21 October 2026 (see Positioning). The international workspace, now a research section on `/logistics-os`, demonstrates fictional shipment lanes, ocean/air plus local-road options, document handoffs, quotation status, a filterable example provider directory and scripted planning recommendations. No carrier directory, quotations, routing service, customs integration or AI service is connected. The existing local logistics and safety interactions remain available.

The geometric logo supplied by the owner is centred on a square canvas, with consistent stroke weight and layout sizing. `lib/brand.ts` is the path source; `npm run brand` regenerates SVG/PNG assets, favicon and Apple icon. The UI uses theme-aware SIWOM colours, and social previews use the same path.

## Global technology trade (18 October 2026)

SIWOM is now presented as a platform connecting global supply chains across logistics, space, robotics and automotive. Space comes first. Everything new is labelled **Research** (flying cars: **Long-term vision**). No supplier directory, marketplace, quotation or brokerage is live or implied.

- **`/global-trade`** (nav: Global Trade) covers:
  - space first: satellites, rockets and launch vehicles, space robotics, aerospace;
  - the four trade flows: import into India, export from India, domestic alternatives, global market access;
  - what moves: components, materials, machinery, finished products;
  - robotics, automotive (electric and autonomous vehicles), drones, flying cars and green energy;
  - a section for logistics companies (forwarders, customs brokers, carriers, warehouses);
  - how it is meant to work, compliance, and FAQ.
- **Homepage**: superseded on 21 October 2026. Global Trade now appears in the homepage research section (see Positioning).
- **Industries**: a highlighted final band for space and aerospace logistics, green energy, robotics and automation, and advanced mobility.
- **Technology**: trade intelligence and supplier matching, trade documents and compliance, space and specialised cargo.
- **Content**: data lives in `data/trade.ts` and `data/industries.ts`; shared UI in `components/trade/TradeParts.tsx`.
- **Compliance**: copy states that many space, aerospace, drone and robotics items are export-controlled (SCOMET authorisation from the DGFT for exports from India). Lithium-ion batteries are Class 9 dangerous goods. SIWOM never grants, replaces or works around a licence, and never certifies a supplier.
- **Photos**: seven NASA images and one Wikimedia Commons image (Bhadla Solar Park, CC BY-SA 2.0) were added. Each carries a visible credit and a no-endorsement note; sources are in `CREDITS.md` and `public/images/image-manifest.json`.

## Repository

Source is on GitHub at `https://github.com/webdpro-in/siwom` (branch `main`). `.env*` files (except `.env.example`), `node_modules`, `.next` and QA output are ignored.

## Positioning (21 October 2026)

The copy across the site was rewritten around one defensible offer, because the earlier homepage pitched logistics, space, robotics and automotive as one service.

- **What SIWOM is**: an early-stage software company in India. Its one product in development is **SIWOM Stream** (nav label "Logistics OS"): shipment coordination software for logistics companies. It gives shipments, vehicles, documents and delays one shared record from port or airport to delivery.
- **Why this positioning**: it is the only product with a working prototype (the logistics demo), the original brief made logistics the starting point, and the owner identified logistics companies as the main visitors.
- **What is not offered**: Global Trade (space-first technology cargo and sourcing) and Safety AI are **Research**; robotics and electric mobility are **Long-term vision**. They stay on the site, framed as research, never as services.
- **Unverified facts, handled conservatively**: no legal entity, address, customers, partners, pilots or traffic numbers are stated. The site says SIWOM has no customers to announce yet.

**Homepage narrative** (`app/page.tsx`): hero → 01 problem → 02 what SIWOM Stream does (with the demo, `#demo`) → 03 how a pilot works (`#how-it-works`) → 04 who it is for → 05 what we are researching → 06 how we work → 07 next step. These were removed from the homepage: the global network and technology-trade sections, the homepage Safety demo, "Beyond logistics", architecture, roadmap and the principles strip. Their content remains on `/global-trade`, `/safety-ai`, `/technology` and `/vision`.

**Navigation**: Logistics OS · Industries · Global Trade · Safety AI · Technology · About, with "Talk to SIWOM". Our Vision moved to the footer, which is grouped as Product, Research, Company and Legal.

**Logistics OS page**: eight deduplicated features, each with a real status. The demo now comes right after the features. A compact ocean/air/road/rail milestones section replaced the five-mode transport encyclopaedia (pipelines removed). The international workspace is labelled Research.

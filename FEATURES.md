# Feature status

- **Implemented**: working in this codebase.
- **Mocked**: works in the browser against illustrative demo data, with no real back end.
- **Planned**: not built.

This covers the website itself. SIWOM's products are separately labelled In development, Research or Long-term vision on the site.

## Site

| Feature | Status | Notes |
| --- | --- | --- |
| Design tokens (Tailwind 4 `@theme` + CSS variables) | Implemented | `styles/globals.css`; default Tailwind scales cleared; `npm run qa:tokens` |
| Component library with every state, `/styleguide` (noindex) | Implemented | |
| Homepage, sections 6.1–6.12 | Implemented | |
| Logistics OS, Safety AI, Technology, Industries, Our Vision, About, Contact | Implemented | |
| Privacy Policy and Terms of Use | Implemented (draft text) | Visible "Draft — legal review required" banner; bracketed gaps for counsel |
| Custom 404 | Implemented | |
| Header (compacting, blur) and full-screen mobile menu | Implemented | Focus trap, Esc, focus return, scroll lock, closes on route change |
| Sticky mobile "Talk to SIWOM" bar | Implemented | Appears after the hero; hidden over the contact form |
| Sticky in-page contents (Safety AI, Technology) | Implemented | Collapsible "On this page" on mobile |
| Status-label system and legend | Implemented | Keyboard-accessible tooltips |
| Section reveals, hero intro, reduced-motion mode | Implemented | CSS + one IntersectionObserver |
| Fragmented → unified challenge visual | Implemented | Segmented control on mobile; side by side with reduced motion |
| Architecture diagram with one-time pulse | Implemented | |
| CTA prefill (`?interest=`, `?pilot=1`) | Implemented | |
| SEO: per-page metadata, canonical, OG and Twitter images, sitemap, robots, Organization JSON-LD | Implemented | Set `NEXT_PUBLIC_SITE_URL` before launch |
| Security headers (CSP, HSTS on https, etc.) | Implemented | `next.config.ts` |
| Cookieless analytics (CTA clicks, demo interactions, form submits) | Implemented, off by default | Enabled by `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` |
| Original illustration pipeline and logo set | Implemented | `npm run art`, `npm run brand` |
| Licensed photography | Implemented | 21 local photographs and crops, with source/licence records in CREDITS.md |
| Founder or team section | Planned | Only with real details |
| Social links | Planned | Render when URLs are added to `lib/site.ts` |

## Contact form

| Feature | Status | Notes |
| --- | --- | --- |
| Fields, labels, helpers, live character count | Implemented | |
| Validation on blur and submit; errors clear when valid; error summary with focus | Implemented | Shared Zod schema |
| Server validation, honeypot, 3-second minimum, 5-per-hour rate limit | Implemented | Rate limit is in memory; use a shared store on serverless |
| Contact submission through Web3Forms | Implemented, delivery verification pending | Server validation followed by browser submission; success requires provider confirmation |
| Cloudflare Turnstile | Implemented, off by default | Enabled by the Turnstile keys |
| Storing submissions in a database | Planned | Not needed: email delivery only |

## International shipment workspace (SIWOM Logistics)

| Feature | Status | Notes |
| --- | --- | --- |
| Six illustrative international shipments (import and export; ocean, air, rail legs) | Mocked | `data/demo/international.ts`; dates relative to today |
| Globe with great-circle sea lanes, ports and labels; keyboard rotation; pause | Implemented | Canvas 2D, Natural Earth land dots, lazy loaded |
| Filters: industry (space, automotive, robotics, energy), mode, needs attention | Mocked | Local state only |
| Summary: ETA, status, open exception with SI suggestion, documents | Mocked | "Suggested by SI · your team decides" |
| Journey: every handoff with the responsible party and date | Mocked | |
| Acknowledge exception, announced through aria-live | Mocked | Local state only |
| Live data, GPS tracking, TMS/WMS/telematics integrations | Planned | Described as approach, not as shipped |

The earlier domestic dispatch demo (fleet, dispatch queue, local hub names) was removed in October 2026.

## Safety AI demo

| Feature | Status | Notes |
| --- | --- | --- |
| Three scenarios, detection overlays, text list equivalent, show-detections switch | Mocked | Illustrated stills; boxes drawn by us |
| Alert panel, reviewer actions, incident log, aria-live announcements, reset | Mocked | Local state only |
| Actual computer vision | Planned | Research on the site; no model is included or claimed |

## October 2026 upgrade

- Real licensed local photography across homepage, logistics, safety, industries, about and vision (see CREDITS.md).
- Water, air, road, rail and pipeline explorer with equipment descriptions and an example multimodal journey.
- Persistent light/dark themes, first-visit system preference, and OS-change following until manually overridden.
- Web3Forms integration with provider-confirmed success, retryable failures and duplicate-submit protection.
- All live tracking, carrier integrations and pipeline monitoring remain planned, not implemented.

## Global technology trade update (18 October 2026)

| Feature | Status | Notes |
| --- | --- | --- |
| `/global-trade` page: space first, import/export flows, what moves, sectors, for logistics companies, how it works, compliance, FAQ | Implemented | Content page; every sector carries a status label |
| Homepage "Global technology trade" section, led by space logistics | Implemented | Links to `/global-trade#space` |
| Industries: highlighted band for space and aerospace logistics, green energy, robotics and automation, advanced mobility | Implemented | Final sections of `/industries`; space also leads the homepage industries list |
| Technology: trade intelligence, trade compliance, space and specialised cargo sections; architecture items | Implemented | All marked Research or planned |
| Roadmap stage "Global technology trade" | Implemented | Research |
| Contact options: Global trade, Space logistics; new industries (space, robotics, automotive, green energy) | Implemented | Pre-fill with `?interest=global-trade` or `?interest=space` |
| Supplier directory, marketplace, buyer–supplier matching, domestic-alternative search | Planned | Research only; nothing is live and no suppliers are listed |
| Trade documents, licence checklists, landed-cost estimates, condition-logger data | Planned | Research only; SIWOM does not grant or replace licences |
| Buying, selling or brokering goods | Not planned | SIWOM does not act as importer, exporter or broker |

## Positioning and copy update (21 October 2026)

| Change | Status | Notes |
| --- | --- | --- |
| Homepage rebuilt as one narrative around SIWOM Stream (problem → product and demo → pilot → who it is for → research → how we work → next step) | Implemented | Seven removed homepage sections; their content lives on subpages |
| Hero CTA "Discuss a pilot" pre-fills Logistics OS and pilot; "Try the demo" jumps to the homepage demo | Implemented | Covered by `npm run qa` |
| Logistics OS page: eight features with honest status; demo first; ocean/air/road/rail milestones; international workspace marked Research | Implemented | Pipeline and equipment encyclopaedia removed |
| Global Trade, Safety AI, Vision, Technology, About, Industries and legal pages: clearer H1s and summaries; research clearly marked | Implemented | Broken "contact form" sentences fixed on About, Privacy and Terms |
| Unique titles; meta descriptions of 160 characters or fewer; Organization and WebSite JSON-LD; OG cards rewritten | Implemented | |
| Production URL from `NEXT_PUBLIC_SITE_URL`, else Vercel's production domain; preview deployments `noindex` and disallowed in robots.txt | Implemented | Verified with a simulated `VERCEL_ENV=preview` build |
| Hosting and production domain | Planned | No SIWOM project exists on the connected Vercel account; see QA-REPORT.md |

## Naming and globe update (21 October 2026)

| Change | Status | Notes |
| --- | --- | --- |
| "Logistics OS" → "Logistics" (SIWOM Logistics); "Safety AI" → "Safety"; routes `/logistics`, `/safety` with 308 redirects from the old URLs | Implemented | Contact form also maps old `?interest=` values |
| Header contrast fix in both themes | Implemented | |
| Shipment globe on Global Trade: shipment list, routes, port labels, journey legs, pause, keyboard rotation | Mocked | Fictional shipments between real ports; snapshot positions, not live tracking |
| Live vessel, flight or container tracking | Planned | Not built; no AIS or carrier data is connected |

## Professional presentation (21 October 2026)

The status badges are hidden sitewide (`showProductStatus = false` in `data/status.ts`) and status wording was removed from the copy. This table still records the true implementation state for the team:

| Feature | Status |
| --- | --- |
| Shipment globe on the homepage (section 02) and on Global Trade | Mocked (sample shipments) |
| Integrations: APIs, webhooks, TMS/WMS, telematics, terminal and rail milestones | Planned; described on the site without a "planned" label |
| Handling profiles and shipment-logger condition data | Planned; described on the site without a "planned" label |
| Global Trade supplier matching and Safety AI detection | Planned; no model or supplier data is live |

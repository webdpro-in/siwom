# SIWOM upgrade — 18 October 2026

## Result

The existing Next.js site now leads with **Global Freight. Local Connections. One Intelligent Network.** It positions SIWOM as a platform in development connecting international freight networks with local logistics businesses. Existing routes, demos, navigation, metadata and legal draft notices remain in place.

## Visual and brand changes

- All active photographic placements now use real, locally stored WebP images. No active page imports the old generated bitmap illustrations; original source assets remain available in `assets/images/`.
- 21 photographs/crops cover the port hero, container terminal, cargo aircraft, passenger belly cargo, road freight, container train, pipelines, dry-bulk carrier, tanker, barge, warehousing, manufacturing, industrial safety, robotics, EV charging and computing infrastructure.
- Complete source URLs, author links, licences, adaptations, dimensions and reference-region coordinates are in `CREDITS.md` and `public/images/image-manifest.json`. These are representative photos, not SIWOM employees, assets or endorsements.
- The owner-supplied geometric mark replaces the chevron. The same centred square geometry and stroke weight are used in the UI, SVG/PNG exports, favicon, Apple icon and Open Graph images. Header/footer lockups share a 36px symbol size, with theme-aware colours.
- Photography has explicit aspect ratios, responsive sizes, local Next image optimisation and lazy loading below the fold. The art-directed hero uses responsive preload and high fetch priority.

## Platform experience

- Homepage: new international-to-local positioning, ocean/air/land photo cards, shipment-journey explanation, international workspace and concise five-mode gallery.
- Logistics OS: full Water / Air / Road / Rail / Pipeline explorer with keyboard arrow/Home/End navigation. Equipment includes containers, dry bulk, tankers, barges, dedicated freighters, belly cargo, semi-trucks, box trucks, flatbeds, vans, boxcars, hoppers, flatcars, well cars, pipes, valves, pumping/compressor equipment and maintenance systems.
- International workspace: select three fictional global shipment lanes, compare ocean/road and air/road combinations, inspect documents and quotation status, mark a sample handoff reviewed, and filter fictional providers by geography, mode and cargo/service. Empty states and reset work. Recommendations are explicitly scripted examples; there is no connected AI service, live directory, quotation feed or tracking integration.
- Existing local logistics filters, map/table selection, exception acknowledgement, dispatch assignments and reset are preserved.
- Safety review uses real reference photos with manually positioned review areas. PPE-equipped workers are not falsely described as violating rules. Review actions, incident log, announcements and reset are retained; no model has analysed these images.

## Themes

A head script applies a saved `siwom-theme` before paint. With no saved choice, the site uses and follows `prefers-color-scheme`. The navigation control saves the manual preference in localStorage and applies it across pages/reloads. Shared tokens cover cards, forms, tables, maps and dialogs. Photo overlays retain readable light text; accent text and severity labels use accessible light-theme variants.

## Contact flow and delivery limit

The form validates through `/api/contact` (schema, honeypot, minimum fill time, rate limit and optional Turnstile). That response means **validation only**. The browser then submits to Web3Forms using the supplied public access key. Success requires an actual successful HTTP response **and** `success: true` from Web3Forms. Failed requests preserve entered values and permit retry; concurrent duplicate submissions are prevented.

A genuine local submission was attempted. Server-side submission returned a provider failure, and a direct diagnostic request received a Cloudflare challenge page. The integration was adjusted to the [browser-side approach recommended by Web3Forms](https://docs.web3forms.com/getting-started/api-reference). The genuine browser test also ended in a network/CORS failure and correctly displayed a retryable error. **Web3Forms acceptance is not confirmed. Inbox delivery is not confirmed.** No account or inbox access was available. The owner must verify the access key’s recipient, allowed domains/localhost, spam settings and receipt in the intended inbox. No invented email address is displayed.

## Verification

Final results are recorded below after the production checks complete. Automated provider responses are mocked for repeatable UI tests; they do not prove delivery. The real-provider attempt is described separately above.

## Source files changed

- `CREDITS.md`
- `README.md`
- `app/about/page.tsx`
- `app/api/contact/route.ts`
- `app/contact/page.tsx`
- `app/icon.svg`
- `app/industries/page.tsx`
- `app/layout.tsx`
- `app/logistics-os/page.tsx`
- `app/opengraph-image.tsx`
- `app/page.tsx`
- `app/privacy/page.tsx`
- `app/safety-ai/page.tsx`
- `app/styleguide/page.tsx`
- `app/technology/page.tsx`
- `app/terms/page.tsx`
- `app/vision/page.tsx`
- `components/brand/Logo.tsx`
- `components/contact/ContactForm.tsx`
- `components/demos/logistics/InternationalWorkspace.tsx`
- `components/demos/logistics/LogisticsView.tsx`
- `components/demos/logistics/ShipmentDetail.tsx`
- `components/demos/safety/SafetyView.tsx`
- `components/layout/Footer.tsx`
- `components/layout/Header.tsx`
- `components/layout/ThemeToggle.tsx`
- `components/sections/ArchitectureDiagram.tsx`
- `components/sections/BeyondSection.tsx`
- `components/sections/CtaSection.tsx`
- `components/sections/GlobalNetwork.tsx`
- `components/sections/Hero.tsx`
- `components/sections/IndiaSection.tsx`
- `components/sections/IndustriesExplorer.tsx`
- `components/sections/LogisticsSection.tsx`
- `components/sections/Principles.tsx`
- `components/sections/SafetyParts.tsx`
- `components/sections/SafetySection.tsx`
- `components/sections/TransportExplorer.tsx`
- `components/ui/Accordion.tsx`
- `components/ui/Button.tsx`
- `components/ui/Callout.tsx`
- `components/ui/Cards.tsx`
- `components/ui/Field.tsx`
- `components/ui/FilterChips.tsx`
- `components/ui/StatusPill.tsx`
- `components/ui/Stepper.tsx`
- `components/ui/Toast.tsx`
- `data/demo/detections.ts`
- `data/divisions.ts`
- `data/industries.ts`
- `data/transport.ts`
- `lib/brand.ts`
- `lib/og.tsx`
- `lib/site.ts`
- `lib/validation/contact.ts`
- `lib/web3forms.ts`
- `next.config.ts`
- `scripts/generate-brand.mjs`
- `scripts/qa/contrast.mjs`
- `scripts/qa/run-qa.mjs`
- `scripts/qa/upgrade.mjs`
- `scripts/qa/web3forms.test.mjs`
- `styles/globals.css`

Also updated: `.env.example`, the generated `public/brand/` set, 21 local WebP photographs, image credits and manifest.

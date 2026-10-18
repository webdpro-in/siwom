# Credits and licences

## Images and illustrations

The original illustrations listed below were generated procedurally by code in this repository and are retained as unused source assets; none are referenced by active pages. The October 2026 upgrade adds separately licensed real photography, documented in the photography section at the end of this file.

| File (`assets/images/`) | Source | Licence | Notes |
| --- | --- | --- | --- |
| `hero-port-desktop.webp`, `hero-port-mobile.webp`, `industry-ports.webp`, `ports-wide.webp`, `cta-port-night.webp` | `scripts/art/port.mjs` | Original, © SIWOM | Aerial container terminal illustration; art-directed crops of one render. Night variant made in the pipeline. |
| `industry-warehousing.webp` | `scripts/art/indoor.mjs` (`warehouseScene`) | Original, © SIWOM | People shown wear helmets and hi-vis vests. |
| `industry-manufacturing.webp` | `scripts/art/indoor.mjs` (`factoryScene`) | Original, © SIWOM | Generic factory floor; does not depict SIWOM equipment. People wear PPE. |
| `concept-autonomy-tall.webp`, `concept-autonomy-wide.webp` | `scripts/art/indoor.mjs` (`autonomyScene`) | Original, © SIWOM | Concept render (captioned). People wear PPE at separated pick stations. |
| `industry-freight.webp`, `freight-wide.webp` | `scripts/art/outdoor.mjs` (`freightScene`) | Original, © SIWOM | |
| `india-rail.webp`, `rail-wide.webp` | `scripts/art/outdoor.mjs` (`railScene`) | Original, © SIWOM | Captioned "Not a SIWOM facility". |
| `industry-infrastructure.webp` | `scripts/art/outdoor.mjs` (`facilityScene`) | Original, © SIWOM | Inspection crew wears PPE. |
| `industry-mobility.webp` | `scripts/art/outdoor.mjs` (`depotScene`) | Original, © SIWOM | Captioned "Illustration". |
| `concept-mobility-tall.webp`, `concept-mobility-wide.webp` | `scripts/art/concept.mjs` (`evScene`) | Original, © SIWOM | Original EV design study, not based on any real vehicle. Concept render (captioned). |
| `concept-intelligence-tall.webp`, `concept-intelligence-wide.webp` | `scripts/art/concept.mjs` (`twinScene`) | Original, © SIWOM | Concept render (captioned). |
| `safety-damage.webp`, `safety-ppe.webp`, `safety-zone.webp` | `scripts/art/safety.mjs` | Original, © SIWOM | Illustrated demo stills. The container code `DEMO 000000 0` is fictional. The PPE frame intentionally shows one worker without a helmet to demonstrate detection, and the site copy says so. |
| Logo, symbol, favicons, Open Graph images | `components/brand/Logo.tsx`, `scripts/generate-brand.mjs`, `lib/og.tsx` | Original, © SIWOM | Wordmark outlined from Space Grotesk (OFL permits embedding in logos). |

## Fonts

| Font | Source | Licence |
| --- | --- | --- |
| Space Grotesk | Google Fonts (self-hosted by `next/font`; TTF copy in `assets/fonts/` for OG images and the logo) | SIL Open Font License 1.1 |
| Inter | Google Fonts | SIL Open Font License 1.1 |
| JetBrains Mono | Google Fonts | SIL Open Font License 1.1 |

## Icons

| Library | Licence |
| --- | --- |
| Lucide (`lucide-react`) | ISC |

## Software

| Package | Licence | Use |
| --- | --- | --- |
| Next.js, React, React DOM | MIT | Framework |
| Tailwind CSS | MIT | Styling |
| Motion (`motion`) | MIT | Demo drawer and bottom-sheet animation |
| React Hook Form, `@hookform/resolvers` | MIT | Contact form |
| Zod | MIT | Shared validation schema |
| clsx, tailwind-merge | MIT | Class composition |
| sharp (dev) | Apache-2.0 | Image generation and grading |
| opentype.js (dev) | MIT | Wordmark outlining |
| playwright-core, @axe-core/playwright (dev) | Apache-2.0, MPL-2.0 | QA scripts |

## Data

Hub names (Nhava Sheva/JNPT, Mundra, Chennai, Visakhapatnam, Kolkata, ICD Tughlakabad, Bengaluru, Hyderabad, Nagpur) are real places, used as labels only. All shipments, vehicles, customers, exceptions, detections and log entries are fictional demo data.

## Real logistics photography — October 2026 upgrade

The photographs below are licensed under the [Pexels License](https://www.pexels.com/license/) (verified 18 October 2026), which permits website use and modification. Attribution is appreciated but not required. These are representative industry images; photographed businesses, brands and people do not endorse SIWOM, and none are presented as SIWOM facilities, employees, fleets, customers or deployments. No AI-generated photography is included.

All files are in `public/images/`. The machine-readable inventory is `public/images/image-manifest.json`. Images were resized and compressed to WebP. `port-hero-mobile.webp` additionally uses a portrait crop; the photographs were otherwise not altered.

| File | Photographer | Original source | Subject / location | Size |
| --- | --- | --- | --- | --- |
| `port-hero.webp` | [Tom Fisk](https://www.pexels.com/@tomfisk/) | [Pexels 3057960](https://www.pexels.com/photo/seaport-during-golden-hour-3057960/) | Container terminal and gantry cranes at sunset in Indonesia. Indonesia. | 2200 × 1451; 442 KiB |
| `port-hero-mobile.webp` | [Tom Fisk](https://www.pexels.com/@tomfisk/) | [Pexels 3057960](https://www.pexels.com/photo/seaport-during-golden-hour-3057960/) | Portrait crop of a container terminal at sunset in Indonesia. Indonesia. | 900 × 1200; 107 KiB |
| `water-container.webp` | [Tom Fisk](https://www.pexels.com/@tomfisk/) | [Pexels 3057963](https://www.pexels.com/photo/top-view-photography-of-cargo-ship-with-intermodal-containers-3057963/) | Overhead photograph of a container ship alongside gantry cranes at a Jakarta terminal. Jakarta, Indonesia. | 1400 × 933; 299 KiB |
| `air-cargo.webp` | [Pexels User](https://www.pexels.com/@pexels-user-2158509317/) | [Pexels 35424560](https://www.pexels.com/photo/cargo-airplane-loading-at-night-at-airport-35424560/) | China Airlines Cargo Boeing 747 on a night airport apron with cargo handling equipment. Hanoi, Vietnam. | 1400 × 770; 110 KiB |
| `air-belly-cargo.webp` | [Ethan Nguyen](https://www.pexels.com/@ethan-nguyen-63327081/) | [Pexels 9749472](https://www.pexels.com/photo/boxes-being-loaded-onto-an-airplane-9749472/) | Palletized freight being loaded into the lower cargo hold of a Philippine Airlines passenger aircraft. Ho Chi Minh City, Vietnam. | 1400 × 1050; 219 KiB |
| `road-freight.webp` | [CARLOSCRUZ ARTEGRAFIA](https://www.pexels.com/@carloscruz-artegrafia-172084181/) | [Pexels 11087837](https://www.pexels.com/photo/red-truck-on-the-road-11087837/) | Red semitrailer freight truck on a mountain highway. United States. | 1400 × 933; 114 KiB |
| `road-sunset.webp` | [Ahmet Polat](https://www.pexels.com/@ibnulharezmi/) | [Pexels 5410923](https://www.pexels.com/photo/a-trailer-truck-on-the-road-5410923/) | Semitrailer freight truck on a road at sunset. Not specified by source. | 1280 × 1600; 284 KiB |
| `rail-containers.webp` | [Robert So](https://www.pexels.com/@robertkso/) | [Pexels 12196578](https://www.pexels.com/photo/train-with-cargo-containers-under-blue-sky-12196578/) | Intermodal containers carried on freight railway wagons beside a rural track. Not specified by source; do not label as India. | 1400 × 933; 178 KiB |
| `pipeline-valves.webp` | [Marina Agrelo](https://www.pexels.com/@marina-agrelo-3547441/) | [Pexels 5658852](https://www.pexels.com/photo/close-up-shot-of-pipes-5658852/) | Close view of industrial piping, flanges and a valve assembly. Guadalajara, Spain. | 1400 × 933; 69 KiB |
| `safety-team.webp` | [Sergey Sergeev](https://www.pexels.com/@sergey-sergeev-2153675005/) | [Pexels 32845683](https://www.pexels.com/photo/industrial-workers-in-safety-gear-at-steel-factory-32845683/) | Steel factory team wearing helmets, safety glasses, gloves and protective workwear. Russia. | 1400 × 931; 139 KiB |
| `manufacturing.webp` | [Sergey Sergeev](https://www.pexels.com/@sergey-sergeev-2153675005/) | [Pexels 32845681](https://www.pexels.com/photo/industrial-workers-operating-machinery-indoors-32845681/) | Industrial operators wearing helmets and safety glasses beside control equipment. Russia. | 1400 × 931; 90 KiB |
| `bulk-carrier.webp` | [Mark Stebnicki](https://www.pexels.com/@nc-farm-bureau-mark/) | [Pexels 16678062](https://www.pexels.com/photo/cargo-ship-docked-in-port-in-dusk-16678062/) | Geared bulk carrier at a quay at dusk, with large cargo holds and deck cranes. Not specified by source. | 1400 × 933; 201 KiB |
| `oil-tanker.webp` | [Rasmus Andersen](https://www.pexels.com/@rasmus-andersen-759275282/) | [Pexels 19704439](https://www.pexels.com/photo/view-of-an-oil-tanker-in-a-port-19704439/) | Tanker in an industrial port alongside dock infrastructure. Not specified by source. | 1400 × 933; 240 KiB |
| `inland-barge.webp` | [Tom Fisk](https://www.pexels.com/@tomfisk/) | [Pexels 12442355](https://www.pexels.com/photo/barge-on-river-12442355/) | Tow of covered cargo barges on the Mississippi River with a bridge in the distance. Wabasha, Minnesota, United States. | 1400 × 933; 287 KiB |
| `warehouse.webp` | [Tiger Lily](https://www.pexels.com/@tiger-lily/) | [Pexels 4483608](https://www.pexels.com/photo/shelves-on-a-warehouse-4483608/) | Warehouse aisle with pallet racks and packaged inventory. Not specified by source. | 1067 × 1600; 272 KiB |

## Additional real photography — remaining illustration replacements

These additional photographs use the [Pexels License](https://www.pexels.com/license/), verified 18 October 2026. They are representative industry references, with no implied SIWOM deployment or brand endorsement. Safety frames are cropped to 1600 × 900; overlay regions are manually selected demonstration review areas, not detections or evidence of violations. All visible workers in the PPE reference wear helmets and safety glasses.

| File (`public/images/`) | Photographer | Original source | Subject / location | Size |
| --- | --- | --- | --- | --- |
| `robotics.webp` | [Ludovic Delot](https://www.pexels.com/@delot/) | [Pexels 18471441](https://www.pexels.com/photo/robots-are-working-in-a-factory-with-a-machine-18471441/) | Yellow industrial robot arms inside a guarded automation cell with conveyors and controllers. Not specified by source. | 1600 × 1200; 263 KiB |
| `electric-mobility.webp` | [Kindel Media](https://www.pexels.com/@kindelmedia/) | [Pexels 9799996](https://www.pexels.com/photo/an-electric-car-charging-9799996/) | Close view of an electric vehicle with charging connector attached outdoors. Not specified by source. | 1350 × 1800; 112 KiB |
| `industrial-control.webp` | [panumas nikhomkhai](https://www.pexels.com/@cookiecutter/) | [Pexels 17489150](https://www.pexels.com/photo/light-on-computer-hardware-17489150/) | Blue-lit rack-mounted server hardware in a data centre. Not specified by source. | 1600 × 1065; 133 KiB |
| `safety-container-photo.webp` | [David Underland](https://www.pexels.com/@david-underland/) | [Pexels 29533762](https://www.pexels.com/photo/close-up-of-rusty-shipping-container-doors-29533762/) | Weathered orange container doors with flaking paint, metal bars and latch hardware. Not specified by source. | 1600 × 900; 214 KiB |
| `safety-ppe-photo.webp` | [Sergey Sergeev](https://www.pexels.com/@sergey-sergeev-2153675005/) | [Pexels 32845683](https://www.pexels.com/photo/industrial-workers-in-safety-gear-at-steel-factory-32845683/) | Three steel-factory workers wearing helmets, safety glasses, gloves and protective workwear. Russia. | 1600 × 900; 154 KiB |
| `safety-zone-photo.webp` | [Giant Asparagus](https://www.pexels.com/@giantasparagus/) | [Pexels 35501714](https://www.pexels.com/photo/aerial-view-of-truck-and-trailer-parking-lot-35501714/) | Overhead freight yard with numbered truck bays, yellow road markings and a semitrailer. Not specified by source. | 1600 × 900; 106 KiB |

## Owner-supplied geometric logo

The October 2026 geometric symbol was supplied by the site owner as an SVG path. It is retained in `lib/brand.ts`, centred on a square canvas and styled in the established SIWOM palette. Header and footer use the same 36px lockup size; SVGs, PNGs, favicons and Open Graph images share this geometry. The wordmark remains Space Grotesk.

## Space, aerospace and green-energy photography — global trade update

Added 18 October 2026 for the Global Trade page, the homepage and the highlighted industries. All files are in `public/images/` and listed in `public/images/image-manifest.json`. They were resized and compressed to WebP, with no other changes.

**NASA images** are generally not subject to copyright in the United States and are used here for information under the [NASA media usage guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/). NASA is credited as the source. Their use does not imply endorsement by NASA, or by any agency, company or person shown (including Antonov, Astrotech, Northrop Grumman and Joby Aviation). No NASA insignia is used as a SIWOM mark.

| File | Credit | Original source | Subject / location |
| --- | --- | --- | --- |
| `space-satellite-airfreight.webp` | NASA | [NASA PIA24104](https://images.nasa.gov/details/PIA24104) | Sentinel-6 satellite in its shipping container, trucked onward after an Antonov airlift from Germany. Vandenberg, California. |
| `space-core-stage-barge.webp` | NASA/Cory Huston | [NASA KSC-20191031-PH-CSH01_0002](https://images.nasa.gov/details/KSC-20191031-PH-CSH01_0002) | Rocket core stage pathfinder leaving Kennedy Space Center on the Pegasus barge. Florida. |
| `space-rocket-stage-factory.webp` | NASA/Michael DeMocker | [NASA MAF_20240711_CS2_MPTSlift_MD_12](https://images.nasa.gov/details/MAF_20240711_CS2_MPTSlift_MD_12) | Rocket core stage lifted onto its transporter at Michoud Assembly Facility. New Orleans. |
| `space-satellite-cleanroom.webp` | NASA/Bill White | [NASA KSC-20180205-PH_SWW01_0031](https://images.nasa.gov/details/KSC-20180205-PH_SWW01_0031) | Technicians in cleanroom suits with the GOES-S satellite. Titusville, Florida. |
| `space-robotics-canadarm.webp` | NASA | [NASA iss069e004909](https://images.nasa.gov/details/iss069e004909) | Cygnus cargo craft held by Canadarm2, above the Arabian Sea coast of India. |
| `space-launch.webp` | NASA/Bill Ingalls | [NASA NHQ202211160200](https://images.nasa.gov/details/NHQ202211160200) | Artemis I launch, Kennedy Space Center. |
| `evtol-air-taxi.webp` | NASA/Genaro Vavuris | [NASA AFRC2025-0051-52](https://images.nasa.gov/details/AFRC2025-0051-52) | Experimental electric air taxi hovering during NASA research. Edwards, California. |

**Wikimedia Commons image** (attribution and share-alike required):

| File | Credit | Original source | Licence | Subject / location |
| --- | --- | --- | --- | --- |
| `green-energy-solar.webp` | Sarvajanik Puralekh ([Flickr](https://www.flickr.com/photos/8001066@N07/53700152969/)) | [Commons: AMP Energy Bhadla Solar Power Plant](https://commons.wikimedia.org/wiki/File:AMP_Energy_Bhadla_Solar_Power_Plant.jpg) | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/); the resized file is shared under the same licence | Solar plant at Bhadla, Rajasthan, India. No endorsement by the operator is implied. |

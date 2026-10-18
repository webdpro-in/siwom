// Illustrated camera stills for the Safety AI demo (1600 x 900).
// Detection boxes are NOT drawn here: the demo draws them as SVG overlays.
import { rng, rect, line, finishDefs, svgDoc } from "./lib.mjs";

const W = 1600;
const H = 900;

function cameraFinish() {
  return `
  <defs>
    <filter id="camGrain"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.09"/></feComponentTransfer></filter>
  </defs>
  <rect width="${W}" height="${H}" filter="url(#camGrain)"/>`;
}

/** Scenario 1: container side panel with a possible dent and possible corrosion. */
export function damageFrame() {
  const R = rng(101);
  const ribs = [];
  const panelTop = 120;
  const panelBottom = 760;
  for (let x = 40; x < W - 40; x += 64) {
    ribs.push(rect(x, panelTop, 26, panelBottom - panelTop, "#4b7894"));
    ribs.push(rect(x + 26, panelTop, 6, panelBottom - panelTop, "#2f5670"));
    ribs.push(rect(x + 32, panelTop, 26, panelBottom - panelTop, "#3d6883"));
    ribs.push(rect(x + 58, panelTop, 6, panelBottom - panelTop, "#5a88a3"));
  }
  // Streaks and grime
  const grime = [];
  for (let i = 0; i < 90; i++) {
    const x = R.range(40, W - 40);
    grime.push(line(x, panelTop + R.range(0, 200), x + R.range(-4, 4), panelTop + R.range(260, 640), "#1d2f3b", R.range(1, 3), `opacity="${R.range(0.08, 0.22).toFixed(2)}"`));
  }
  const body = `
  <defs>
    <filter id="rust" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035 0.05" numOctaves="4" seed="9" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.28  0 0 0 0 0.14  0 0 0 -2.4 1.55" result="r"/>
      <feComposite in="r" in2="SourceGraphic" operator="in"/>
    </filter>
    <filter id="rustFine" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.12" numOctaves="3" seed="4" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.36  0 0 0 0 0.17  0 0 0 0 0.09  0 0 0 -2.8 1.7" result="r"/>
      <feComposite in="r" in2="SourceGraphic" operator="in"/>
    </filter>
    <radialGradient id="rustMask" cx="50%" cy="80%" r="60%">
      <stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="dentDark" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#05090d" stop-opacity="0.62"/><stop offset="0.7" stop-color="#05090d" stop-opacity="0.25"/><stop offset="1" stop-color="#05090d" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="dentLight" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#cfe4f0" stop-opacity="0.38"/><stop offset="1" stop-color="#cfe4f0" stop-opacity="0"/>
    </radialGradient>
    <mask id="rustArea"><rect x="980" y="560" width="420" height="220" fill="url(#rustMask)"/></mask>
    <filter id="blurBg"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="#1b232b"/>
  <!-- Background: out-of-focus yard above and below the container -->
  <g filter="url(#blurBg)">
    <rect x="0" y="0" width="${W}" height="110" fill="#5b6672"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => rect(i * 290 - 40, 30, 260, 80, ["#7d3a2e", "#cfc9bb", "#2f5d73", "#8a9096", "#3c6b5b", "#a56a2c"][i])).join("")}
    <rect x="0" y="780" width="${W}" height="120" fill="#2b2f33"/>
    <rect x="0" y="830" width="${W}" height="8" fill="#c7b260" opacity="0.6"/>
  </g>
  <!-- Container side wall -->
  ${ribs.join("")}
  ${grime.join("")}
  <!-- Top and bottom side rails, corner posts and castings -->
  <rect x="0" y="98" width="${W}" height="30" fill="#2c4d63"/>
  <rect x="0" y="98" width="${W}" height="4" fill="#6f9ab3" opacity="0.6"/>
  <rect x="0" y="752" width="${W}" height="38" fill="#24414f"/>
  <rect x="0" y="0" width="44" height="${H}" fill="#2c4d63"/>
  <rect x="${W - 44}" y="0" width="44" height="${H}" fill="#2c4d63"/>
  <rect x="4" y="96" width="40" height="40" fill="#3a3f45"/><ellipse cx="24" cy="116" rx="9" ry="12" fill="#111"/>
  <rect x="4" y="748" width="40" height="44" fill="#3a3f45"/><ellipse cx="24" cy="770" rx="9" ry="12" fill="#111"/>
  <rect x="${W - 44}" y="96" width="40" height="40" fill="#3a3f45"/><ellipse cx="${W - 24}" cy="116" rx="9" ry="12" fill="#111"/>
  <rect x="${W - 44}" y="748" width="40" height="44" fill="#3a3f45"/><ellipse cx="${W - 24}" cy="770" rx="9" ry="12" fill="#111"/>
  <!-- Stencilled markings (fictional) -->
  <g font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#e9eef1" opacity="0.88">
    <text x="${W - 470}" y="200" font-size="46" letter-spacing="6">DEMO 000000 0</text>
    <text x="${W - 470}" y="246" font-size="30" letter-spacing="5">22G1</text>
    <text x="90" y="200" font-size="22" letter-spacing="2" opacity="0.8">MAX GROSS  30,480 KG</text>
    <text x="90" y="232" font-size="22" letter-spacing="2" opacity="0.8">TARE        2,200 KG</text>
  </g>
  <!-- Possible dent: shading only; severity is for a qualified inspector to judge -->
  <ellipse cx="560" cy="430" rx="170" ry="128" fill="url(#dentDark)" transform="rotate(-8 560 430)"/>
  <ellipse cx="610" cy="470" rx="120" ry="82" fill="url(#dentLight)" transform="rotate(-8 610 470)"/>
  <path d="M 452 384 C 520 360 590 372 650 410" stroke="#0c1419" stroke-width="3" fill="none" opacity="0.45"/>
  <path d="M 480 500 C 540 520 620 518 690 488" stroke="#a8c7d8" stroke-width="2" fill="none" opacity="0.35"/>
  <line x1="610" y1="380" x2="690" y2="356" stroke="#d8e4ea" stroke-width="1.4" opacity="0.5"/>
  <!-- Possible corrosion along the bottom rail -->
  <g mask="url(#rustArea)">
    <rect x="980" y="560" width="420" height="220" fill="#000" filter="url(#rust)"/>
    <rect x="980" y="560" width="420" height="220" fill="#000" filter="url(#rustFine)"/>
  </g>
  <g opacity="0.75">
    <path d="M 1150 752 C 1148 700 1158 660 1152 610" stroke="#6a3519" stroke-width="5" fill="none" opacity="0.6"/>
    <path d="M 1222 752 C 1226 712 1218 690 1224 640" stroke="#6a3519" stroke-width="4" fill="none" opacity="0.5"/>
  </g>
  ${cameraFinish()}
  ${finishDefs(W, H, { grain: 0.04, vignette: 0.5 }).replace('id="grain"', 'id="grain2"').replace('url(#grain)', 'url(#grain2)').replace('id="vignette"', 'id="vig2"').replace('url(#vignette)', 'url(#vig2)')}`;
  return svgDoc(W, H, body);
}

/** Stylised standing worker, side-on, no facial features. */
function person(x, y, s, { helmet = true, helmetColor = "#f1f0ea", facing = 1, arm = "down", tablet = false } = {}) {
  const k = s / 330;
  const f = facing;
  return `<g transform="translate(${x} ${y}) scale(${k * f} ${k})">
    <ellipse cx="0" cy="330" rx="70" ry="10" fill="#05070a" opacity="0.5"/>
    <!-- Legs and boots -->
    <rect x="-26" y="190" width="24" height="128" rx="8" fill="#26303d"/>
    <rect x="4" y="190" width="24" height="128" rx="8" fill="#222b37"/>
    <rect x="-30" y="312" width="34" height="18" rx="6" fill="#151719"/>
    <rect x="2" y="312" width="34" height="18" rx="6" fill="#151719"/>
    <rect x="-26" y="262" width="24" height="6" fill="#dfe5e8" opacity="0.85"/>
    <rect x="4" y="262" width="24" height="6" fill="#dfe5e8" opacity="0.85"/>
    <!-- Torso: long-sleeve shirt under hi-vis vest with reflective tape -->
    <path d="M -36 70 Q 0 56 36 70 L 40 200 L -40 200 Z" fill="#2c3a4c"/>
    <path d="M -34 74 Q 0 62 34 74 L 37 196 L -37 196 Z" fill="#e36a2c"/>
    <path d="M -10 66 L 0 120 L 10 66" fill="#2c3a4c"/>
    <rect x="-37" y="140" width="74" height="9" fill="#dfe5e8" opacity="0.92"/>
    <rect x="-37" y="170" width="74" height="9" fill="#dfe5e8" opacity="0.92"/>
    <rect x="-22" y="74" width="8" height="64" fill="#dfe5e8" opacity="0.9"/>
    <rect x="14" y="74" width="8" height="64" fill="#dfe5e8" opacity="0.9"/>
    <!-- Arms with gloves -->
    ${
      arm === "point"
        ? `<path d="M 30 80 L 98 118 L 92 132 L 26 100 Z" fill="#2c3a4c"/><circle cx="100" cy="124" r="10" fill="#c9b27a"/>`
        : `<path d="M 30 80 L 44 188 L 30 190 L 22 96 Z" fill="#2c3a4c"/><circle cx="38" cy="196" r="10" fill="#c9b27a"/>`
    }
    <path d="M -30 80 L -44 188 L -30 190 L -22 96 Z" fill="#26323f"/>
    <circle cx="-38" cy="196" r="10" fill="#c9b27a"/>
    ${tablet ? `<rect x="22" y="150" width="34" height="46" rx="3" fill="#1b2228" transform="rotate(-12 39 173)"/><rect x="26" y="154" width="26" height="36" fill="#3f6a85" opacity="0.6" transform="rotate(-12 39 173)"/>` : ""}
    <!-- Neck and head (no facial features) -->
    <rect x="-9" y="44" width="18" height="20" fill="#7a4e33"/>
    <ellipse cx="2" cy="26" rx="26" ry="30" fill="#8a5a3b"/>
    ${
      helmet
        ? `<path d="M -30 22 Q -30 -16 2 -18 Q 34 -16 34 22 Z" fill="${helmetColor}"/><rect x="-34" y="18" width="72" height="8" rx="4" fill="${helmetColor}"/><path d="M -4 -16 L -4 20 M 8 -16 L 8 20" stroke="#c9c8c0" stroke-width="3"/>`
        : `<path d="M -26 14 Q -28 -8 2 -10 Q 30 -8 28 12 Q 18 0 2 0 Q -14 0 -26 14 Z" fill="#1b1714"/>`
    }
  </g>`;
}

function containerSide(x, y, w, h, color) {
  let s = rect(x, y, w, h, color);
  for (let px = x + 6; px < x + w - 6; px += 14) s += rect(px, y + 6, 5, h - 12, "#000", 'opacity="0.14"');
  s += rect(x, y, w, 6, "#000", 'opacity="0.25"');
  s += rect(x, y + h - 6, w, 6, "#000", 'opacity="0.3"');
  return s;
}

/** Scenario 2: two workers in a yard; the right-hand worker has no helmet. */
export function ppeFrame() {
  const stacks = [];
  const colors = ["#7d3a2e", "#2f5d73", "#cfc9bb", "#3c6b5b", "#8a9096", "#a56a2c", "#4b507b", "#2c4a5f"];
  let i = 0;
  for (let x = -40; x < W; x += 250) {
    const levels = 2 + (i % 3);
    for (let l = 0; l < levels; l++) stacks.push(containerSide(x, 470 - (l + 1) * 104, 244, 100, colors[(i * 3 + l) % colors.length]));
    i++;
  }
  const body = `
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8d9aa6"/><stop offset="1" stop-color="#b8c1c8"/></linearGradient>
    <linearGradient id="groundG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f4449"/><stop offset="1" stop-color="#2a2e32"/></linearGradient>
    <filter id="bgBlur"><feGaussianBlur stdDeviation="2.2"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <g filter="url(#bgBlur)">
    <rect x="1160" y="40" width="16" height="430" fill="#b9b4a5"/>
    <rect x="1440" y="40" width="16" height="430" fill="#b9b4a5"/>
    <rect x="1120" y="40" width="380" height="26" fill="#a65f2f"/>
    ${stacks.join("")}
  </g>
  <rect x="0" y="470" width="${W}" height="${H - 470}" fill="url(#groundG)"/>
  <polygon points="0,700 ${W},610 ${W},622 0,716" fill="#c7b260" opacity="0.75"/>
  <polygon points="0,560 ${W},520 ${W},526 0,568" fill="#d4d7d9" opacity="0.4"/>
  ${[180, 360, 540].map((cx) => `<polygon points="${cx},${600 - cx * 0.02} ${cx + 18},${640 - cx * 0.02} ${cx - 18},${640 - cx * 0.02}" fill="#e36a2c"/><rect x="${cx - 12}" y="${612 - cx * 0.02}" width="24" height="5" fill="#eceff1"/>`).join("")}
  ${person(640, 330, 380, { helmet: true, facing: 1, arm: "point" })}
  ${person(930, 340, 370, { helmet: false, facing: -1, tablet: true })}
  ${cameraFinish()}
  ${finishDefs(W, H, { grain: 0.04, vignette: 0.5 }).replace(/id="grain"/, 'id="g3"').replace(/url\(#grain\)/, "url(#g3)").replace(/id="vignette"/, 'id="v3"').replace(/url\(#vignette\)/, "url(#v3)")}`;
  return svgDoc(W, H, body);
}

/** Scenario 3: elevated view of a marked lifting zone; a person in PPE at its edge. */
export function zoneFrame() {
  const R = rng(103);
  const hatch = [];
  const zx = 470;
  const zy = 190;
  const zw = 640;
  const zh = 470;
  const body = `
  <defs>
    <pattern id="hazard" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="14" height="28" fill="#e2c13e"/><rect x="14" width="14" height="28" fill="#15171a"/>
    </pattern>
    <filter id="liftShadow"><feGaussianBlur stdDeviation="10"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="#3b4045"/>
  ${Array.from({ length: 40 }, () => `<ellipse cx="${R.range(0, W)}" cy="${R.range(0, H)}" rx="${R.range(40, 160)}" ry="${R.range(10, 40)}" fill="#33383d" opacity="0.4"/>`).join("")}
  ${Array.from({ length: 14 }, (_, k) => line(0, k * 70, W, k * 70 + 10, "#363b40", 1.5)).join("")}
  <!-- RTG legs entering frame -->
  <rect x="300" y="0" width="34" height="${H}" fill="#b9b4a5"/>
  <rect x="1290" y="0" width="34" height="${H}" fill="#b9b4a5"/>
  <rect x="330" y="0" width="16" height="${H}" fill="#04070b" opacity="0.3"/>
  <rect x="1320" y="0" width="16" height="${H}" fill="#04070b" opacity="0.3"/>
  <!-- Marked lifting zone -->
  <rect x="${zx}" y="${zy}" width="${zw}" height="${zh}" fill="none" stroke="url(#hazard)" stroke-width="26"/>
  <g font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#e2c13e" opacity="0.85">
    <text x="${zx + zw / 2}" y="${zy + zh - 34}" font-size="34" text-anchor="middle" letter-spacing="4">NO ENTRY DURING LIFT</text>
  </g>
  <!-- Suspended container (shadow offset shows it is raised) -->
  <rect x="${zx + 150 + 70}" y="${zy + 130 + 60}" width="300" height="120" fill="#04070b" opacity="0.55" filter="url(#liftShadow)"/>
  <rect x="${zx + 150}" y="${zy + 120}" width="300" height="120" fill="#2f5d73"/>
  ${Array.from({ length: 20 }, (_, k) => rect(zx + 156 + k * 14.6, zy + 126, 6, 108, "#000", 'opacity="0.16"')).join("")}
  <rect x="${zx + 140}" y="${zy + 110}" width="320" height="16" fill="#c9922c"/>
  <rect x="${zx + 140}" y="${zy + 234}" width="320" height="16" fill="#c9922c"/>
  ${[0, 1, 2, 3].map((k) => line(zx + 150 + (k % 2) * 300, zy + 120 + Math.floor(k / 2) * 120, zx + 300, 0, "#7d8288", 3)).join("")}
  <!-- Parked tractor and cones -->
  <rect x="1380" y="560" width="70" height="160" rx="6" fill="#c46b2e"/>
  <rect x="1388" y="572" width="54" height="36" fill="#1b2228"/>
  ${[[420, 700], [1140, 700], [1140, 170]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#e36a2c"/><circle cx="${x}" cy="${y}" r="8" fill="#eceff1"/>`).join("")}
  <!-- Person in full PPE at the zone boundary (top-down view) -->
  <g transform="translate(1160 470) rotate(-100) scale(2.8)">
    <ellipse cx="4" cy="5" rx="16" ry="11" fill="#04070b" opacity="0.45"/>
    <ellipse cx="0" cy="0" rx="15" ry="9.5" fill="#e36a2c"/>
    <rect x="-15" y="-1.6" width="30" height="3.2" fill="#dfe5e8"/>
    <ellipse cx="-14" cy="0" rx="4" ry="5" fill="#26303b"/>
    <ellipse cx="14" cy="0" rx="4" ry="5" fill="#26303b"/>
    <circle cx="0" cy="0" r="7.4" fill="#f1f0ea"/>
    <rect x="-1" y="-7.4" width="2" height="5" fill="#c9c8c0"/>
  </g>
  ${cameraFinish()}
  ${finishDefs(W, H, { grain: 0.04, vignette: 0.5 }).replace(/id="grain"/, 'id="g4"').replace(/url\(#grain\)/, "url(#g4)").replace(/id="vignette"/, 'id="v4"').replace(/url\(#vignette\)/, "url(#v4)")}`;
  void hatch;
  return svgDoc(W, H, body);
}

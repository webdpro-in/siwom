// Concept renders: an original EV design study and an isometric digital twin.
import { rng, line, finishDefs, svgDoc } from "./lib.mjs";

/** Original electric crossover design study in a studio. Not a real vehicle. */
export function evScene({ W = 1600, H = 900, scale = 1, ox = 0, oy = 0 } = {}) {
  const car = `
    <g transform="translate(${ox} ${oy}) scale(${scale})">
      <!-- Floor reflection -->
      <g mask="url(#reflFade)">
        <g transform="translate(0 1380) scale(1 -1)" opacity="0.22">
          <use href="#carBody"/>
        </g>
      </g>
      <ellipse cx="830" cy="688" rx="600" ry="22" fill="#020305" opacity="0.9" filter="url(#soft)"/>
      <g id="carBody">
        <path d="M 318 604 C 306 566 316 532 372 516 L 612 466 C 700 404 784 360 904 352 L 1060 352 C 1180 358 1282 410 1336 466 L 1366 498 C 1390 520 1394 566 1382 604 L 1236 612 A 116 116 0 0 0 1004 612 L 636 612 A 116 116 0 0 0 404 612 Z"
              fill="url(#paint)"/>
        <!-- Upper body highlight -->
        <path d="M 372 516 L 612 466 C 700 404 784 360 904 352 L 1060 352 C 1180 358 1282 410 1336 466 L 1366 498"
              fill="none" stroke="#d7dee4" stroke-width="2" opacity="0.55"/>
        <!-- Glasshouse -->
        <path d="M 648 470 C 726 414 796 382 904 376 L 1056 376 C 1160 382 1240 420 1290 462 L 1272 472 L 664 482 Z" fill="url(#glass)"/>
        <line x1="968" y1="377" x2="962" y2="478" stroke="#0d1117" stroke-width="10"/>
        <!-- Character line and door cuts -->
        <path d="M 380 548 C 700 530 1000 522 1372 512" fill="none" stroke="#e8edf1" stroke-width="1.6" opacity="0.32"/>
        <path d="M 676 486 L 664 600 M 962 482 L 958 604 M 1220 474 L 1236 566" stroke="#0b0f14" stroke-width="2" opacity="0.6"/>
        <rect x="900" y="508" width="34" height="5" rx="2" fill="#0b0f14" opacity="0.7"/>
        <rect x="1166" y="502" width="34" height="5" rx="2" fill="#0b0f14" opacity="0.7"/>
        <!-- Light signatures -->
        <path d="M 330 534 L 420 512" stroke="#eaf6ff" stroke-width="4" stroke-linecap="round"/>
        <path d="M 1350 488 L 1384 520" stroke="#ff5a5f" stroke-width="5" stroke-linecap="round" opacity="0.9"/>
        <!-- Lower cladding -->
        <path d="M 404 612 L 318 604 C 314 590 312 580 314 570 L 400 574 Z" fill="#14191f"/>
        <path d="M 636 612 L 1004 612 L 1000 592 L 640 592 Z" fill="#14191f"/>
        <path d="M 1236 612 L 1382 604 C 1386 592 1386 582 1386 572 L 1240 584 Z" fill="#14191f"/>
        <!-- Wheels -->
        ${[520, 1120]
          .map(
            (cx) => `
          <circle cx="${cx}" cy="600" r="90" fill="#07090c"/>
          <circle cx="${cx}" cy="600" r="64" fill="url(#rim)"/>
          <circle cx="${cx}" cy="600" r="64" fill="none" stroke="#2c343d" stroke-width="2"/>
          ${[0, 72, 144, 216, 288]
            .map((a) => {
              const r = (a * Math.PI) / 180;
              return `<line x1="${cx + Math.cos(r) * 21}" y1="${600 + Math.sin(r) * 21}" x2="${cx + Math.cos(r) * 58}" y2="${600 + Math.sin(r) * 58}" stroke="#1a2027" stroke-width="5" stroke-linecap="round" opacity="0.7"/>`;
            })
            .join("")}
          <circle cx="${cx}" cy="600" r="17" fill="#3b444d"/>
          <circle cx="${cx}" cy="600" r="6" fill="#c8f169" opacity="0.0"/>`,
          )
          .join("")}
      </g>
    </g>`;

  // Studio floor grid in perspective
  const R = rng(5);
  const grid = [];
  const horizon = oy + 690 * scale;
  for (let i = -30; i <= 30; i++) {
    const x = W / 2 + i * 70;
    grid.push(line(W / 2 + i * 8, horizon, x + i * 40, H + 200, "#9fb2c1", 1, `opacity="${0.07 + R.next() * 0.02}"`));
  }
  for (let k = 0; k < 14; k++) {
    const y = horizon + Math.pow(k / 14, 2) * (H - horizon + 40);
    grid.push(line(0, y, W, y, "#9fb2c1", 1, 'opacity="0.07"'));
  }

  const body = `
    <defs>
      <linearGradient id="studio" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#121a24"/><stop offset="0.62" stop-color="#0b1017"/><stop offset="1" stop-color="#06080b"/>
      </linearGradient>
      <radialGradient id="spot" cx="50%" cy="20%" r="60%">
        <stop offset="0" stop-color="#3a4a5a" stop-opacity="0.55"/><stop offset="1" stop-color="#3a4a5a" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="paint" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#9aa6b1"/><stop offset="0.34" stop-color="#5f6b77"/><stop offset="0.62" stop-color="#2f3741"/><stop offset="1" stop-color="#161b21"/>
      </linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2b3a48"/><stop offset="0.5" stop-color="#0e141b"/><stop offset="1" stop-color="#1b2631"/>
      </linearGradient>
      <radialGradient id="rim" cx="40%" cy="38%" r="70%">
        <stop offset="0" stop-color="#8e99a3"/><stop offset="0.6" stop-color="#4a545e"/><stop offset="1" stop-color="#262d34"/>
      </radialGradient>
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.75" stop-color="#fff" stop-opacity="1"/>
      </linearGradient>
      <linearGradient id="fadeDown" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <mask id="reflFade" maskUnits="userSpaceOnUse" x="0" y="690" width="1800" height="260"><rect x="0" y="690" width="1800" height="260" fill="url(#fadeDown)"/></mask>
      <filter id="soft" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="14"/></filter>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#studio)"/>
    <rect width="${W}" height="${H}" fill="url(#spot)"/>
    ${grid.join("")}
    ${car}
    ${finishDefs(W, H, { grain: 0.05, vignette: 0.5 })}`;
  return svgDoc(W, H, body);
}

/** Isometric wireframe digital twin of a terminal, with sensor nodes. */
export function twinScene({ W = 1600, H = 900, scale = 1, ox = 0, oy = 0, seed = 91 } = {}) {
  const R = rng(seed);
  const c30 = Math.cos(Math.PI / 6);
  const s30 = 0.5;
  const P = (x, y, z = 0) => [ox + (x - y) * c30 * scale, oy + ((x + y) * s30 - z) * scale];
  const out = [];
  const nodes = [];
  const pts = (arr) => arr.map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ");

  // Ground grid
  for (let i = -2; i <= 22; i++) {
    const [ax, ay] = P(i * 40, -80);
    const [bx, by] = P(i * 40, 880);
    out.push(`<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#7fa6bf" stroke-width="0.8" opacity="0.16"/>`);
    const [cx1, cy1] = P(-80, i * 40);
    const [dx, dy] = P(880, i * 40);
    out.push(`<line x1="${cx1}" y1="${cy1}" x2="${dx}" y2="${dy}" stroke="#7fa6bf" stroke-width="0.8" opacity="0.16"/>`);
  }

  function box(x, y, w, d, h, { fill = 0.06, stroke = "#a9c6d8", width = 1, opacity = 0.75 } = {}) {
    const t = [P(x, y, h), P(x + w, y, h), P(x + w, y + d, h), P(x, y + d, h)];
    const l = [P(x, y + d, 0), P(x + w, y + d, 0), P(x + w, y + d, h), P(x, y + d, h)];
    const r = [P(x + w, y, 0), P(x + w, y + d, 0), P(x + w, y + d, h), P(x + w, y, h)];
    out.push(`<polygon points="${pts(l)}" fill="#7fa6bf" fill-opacity="${fill * 0.6}" stroke="${stroke}" stroke-width="${width}" stroke-opacity="${opacity}"/>`);
    out.push(`<polygon points="${pts(r)}" fill="#7fa6bf" fill-opacity="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-opacity="${opacity}"/>`);
    out.push(`<polygon points="${pts(t)}" fill="#cfe3ef" fill-opacity="${fill * 1.6}" stroke="${stroke}" stroke-width="${width}" stroke-opacity="${opacity}"/>`);
  }

  // Quay edge and water line
  const q = [P(-80, 0), P(880, 0)];
  out.push(`<line x1="${q[0][0]}" y1="${q[0][1]}" x2="${q[1][0]}" y2="${q[1][1]}" stroke="#cfe3ef" stroke-width="1.6" opacity="0.6"/>`);
  for (let k = 1; k < 6; k++) {
    const a = P(-80, -k * 14);
    const b = P(880, -k * 14);
    out.push(`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#7fa6bf" stroke-width="0.8" stroke-dasharray="4 10" opacity="${0.25 - k * 0.03}"/>`);
  }
  // Ship hull alongside
  box(40, -70, 620, 56, 18, { fill: 0.05 });
  for (let i = 0; i < 12; i++) box(70 + i * 46, -64, 40, 44, 18 + 10 * R.int(1, 3), { fill: 0.04, opacity: 0.45, width: 0.8 });
  // Quay cranes
  for (const cx of [150, 330, 510]) {
    box(cx, 10, 10, 60, 120, { fill: 0.03, opacity: 0.5 });
    box(cx + 40, 10, 10, 60, 120, { fill: 0.03, opacity: 0.5 });
    box(cx, -110, 50, 190, 10, { fill: 0.08, opacity: 0.8 });
    nodes.push([...P(cx + 25, -20, 130), "high"]);
  }
  // Container stacks in the yard
  for (let bx = 0; bx < 4; bx++) {
    for (let by = 0; by < 3; by++) {
      const x = 80 + bx * 170;
      const y = 140 + by * 120;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
          box(x + i * 36, y + j * 22, 32, 18, 16 * R.int(1, 4), { fill: 0.05, opacity: 0.55, width: 0.8 });
        }
      }
      if (R.chance(0.7)) nodes.push([...P(x + 72, y + 30, 80), R.chance(0.2) ? "alert" : "ok"]);
    }
  }
  // Warehouse shed and gate
  box(80, 520, 300, 140, 60, { fill: 0.07, opacity: 0.8 });
  box(460, 540, 180, 100, 40, { fill: 0.07, opacity: 0.8 });
  nodes.push([...P(230, 590, 70), "ok"]);
  nodes.push([...P(550, 590, 50), "ok"]);
  nodes.push([...P(720, 300, 10), "ok"]);

  // Data links from nodes to an edge hub
  const hub = P(760, 640, 90);
  box(740, 620, 40, 40, 70, { fill: 0.12, stroke: "#e6f1f8", opacity: 0.9 });
  const links = nodes
    .map(([x, y]) => `<path d="M ${x} ${y} Q ${(x + hub[0]) / 2} ${Math.min(y, hub[1]) - 60} ${hub[0]} ${hub[1]}" fill="none" stroke="#7cc4ff" stroke-width="1" stroke-dasharray="3 6" opacity="0.45"/>`)
    .join("");
  const nodeMarks = nodes
    .map(([x, y, kind]) => {
      const c = kind === "alert" ? "#ff9f43" : "#e6f1f8";
      return `<circle cx="${x}" cy="${y}" r="16" fill="${c}" opacity="0.10"/><circle cx="${x}" cy="${y}" r="7" fill="none" stroke="${c}" stroke-width="1.4" opacity="0.8"/><circle cx="${x}" cy="${y}" r="3" fill="${c}"/>`;
    })
    .join("");

  const body = `
    <defs>
      <radialGradient id="bgGlow" cx="55%" cy="45%" r="70%">
        <stop offset="0" stop-color="#132131"/><stop offset="1" stop-color="#070a0f"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bgGlow)"/>
    ${out.join("")}
    ${links}
    ${nodeMarks}
    ${finishDefs(W, H, { grain: 0.05, vignette: 0.5 })}`;
  return svgDoc(W, H, body);
}

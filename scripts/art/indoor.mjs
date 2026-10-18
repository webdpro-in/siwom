// Plan-view interiors: warehouse racking, robotics concept, factory floor.
import { rng, rect, line, circle, poly, shade, finishDefs, svgDoc } from "./lib.mjs";

const SHADOW = "#04070b";

/** Top-down worker in correct PPE: helmet, hi-vis vest with reflective tape. */
export function worker(x, y, rot = 0, { helmet = "#f1f0ea", vest = "#d9672b" } = {}) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <ellipse cx="3" cy="4" rx="15" ry="10" fill="${SHADOW}" opacity="0.4"/>
    <ellipse cx="0" cy="0" rx="15" ry="9.5" fill="${vest}"/>
    <rect x="-15" y="-1.6" width="30" height="3.2" fill="#dfe5e8" opacity="0.9"/>
    <ellipse cx="-14" cy="0" rx="4" ry="5" fill="#26303b"/>
    <ellipse cx="14" cy="0" rx="4" ry="5" fill="#26303b"/>
    <circle cx="0" cy="0" r="7.4" fill="${helmet}"/>
    <path d="M -7 -1 A 7.4 7.4 0 0 1 7 -1" fill="none" stroke="#c9c8c0" stroke-width="1.2"/>
    <rect x="-1" y="-7.4" width="2" height="5" fill="#c9c8c0"/>
  </g>`;
}

function forklift(x, y, rot, R) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <rect x="-14" y="-20" width="34" height="46" rx="4" fill="${SHADOW}" opacity="0.45" transform="translate(5 6)"/>
    <rect x="-14" y="-20" width="28" height="40" rx="4" fill="#c9922c"/>
    <rect x="-10" y="-8" width="20" height="18" rx="2" fill="#2a2f35"/>
    ${worker(0, 1, 0, { helmet: "#f1f0ea", vest: "#d9672b" }).replace(/<ellipse cx="3" cy="4"[^>]*\/>/, "")}
    <rect x="-12" y="-30" width="24" height="8" fill="#3a3f45"/>
    <rect x="-10" y="-46" width="4" height="18" fill="#6b7076"/>
    <rect x="6" y="-46" width="4" height="18" fill="#6b7076"/>
    ${R.chance(0.6) ? `<rect x="-14" y="-62" width="28" height="22" fill="#9a7b52"/><rect x="-12" y="-60" width="24" height="18" fill="#b28e5f"/>` : ""}
  </g>`;
}

function pallet(x, y, w, h, R) {
  const kind = R.next();
  if (kind < 0.12) return rect(x, y, w, h, "#7a6347");
  const fill = kind < 0.55 ? "#a98455" : kind < 0.8 ? "#c8c5bd" : R.pick(["#3c5f7a", "#5d6b3c", "#7d3a2e"]);
  return (
    rect(x, y, w, h, shade(fill, -0.25)) +
    rect(x + 1.5, y + 1.5, w - 3, h - 3, fill) +
    line(x + w / 2, y + 2, x + w / 2, y + h - 2, "#000", 0.6, 'opacity="0.2"')
  );
}

export function warehouseScene({ W = 1200, H = 1600, seed = 21, angle = -12 } = {}) {
  const R = rng(seed);
  const cx = W / 2;
  const cy = H / 2;
  const parts = [];
  const X0 = -500;
  const X1 = W + 500;
  const Y0 = -500;
  const Y1 = H + 500;
  parts.push(rect(X0, Y0, X1 - X0, Y1 - Y0, "#5e6469"));
  // Floor slab joints and scuffs
  for (let x = X0; x < X1; x += 120) parts.push(line(x, Y0, x, Y1, "#565c61", 1));
  for (let y = Y0; y < Y1; y += 120) parts.push(line(X0, y, X1, y, "#565c61", 1));
  for (let i = 0; i < 120; i++) {
    parts.push(`<ellipse cx="${R.range(X0, X1)}" cy="${R.range(Y0, Y1)}" rx="${R.range(30, 140)}" ry="${R.range(6, 30)}" fill="#4f555a" opacity="0.25"/>`);
  }
  // Racking rows (vertical in local coords) with aisles
  const rackW = 46;
  const aisle = 120;
  const rowPitch = rackW * 2 + 6 + aisle;
  const shadows = [];
  const tops = [];
  for (let x = X0 + 40; x < X1; x += rowPitch) {
    for (const off of [0, rackW + 6]) {
      const rx = x + off;
      shadows.push(rect(rx + 10, Y0 + 14, rackW, Y1 - Y0, SHADOW, 'opacity="0.35"'));
      tops.push(rect(rx, Y0, rackW, Y1 - Y0, "#2d4b66"));
      for (let y = Y0; y < Y1; y += 52) {
        tops.push(rect(rx - 1, y, rackW + 2, 4, "#c9922c"));
        if (R.chance(0.9)) tops.push(pallet(rx + 3, y + 6, rackW - 6, 42, R));
      }
    }
    // Aisle markings
    const ax = x + rackW * 2 + 6;
    tops.push(line(ax + 8, Y0, ax + 8, Y1, "#d8c25a", 2.4, 'opacity="0.85"'));
    tops.push(line(ax + aisle - 8, Y0, ax + aisle - 8, Y1, "#d8c25a", 2.4, 'opacity="0.85"'));
  }
  // Cross aisle with pedestrian walkway
  const crossY = H * 0.62;
  tops.push(rect(X0, crossY, X1 - X0, 170, "#5e6469"));
  tops.push(rect(X0, crossY + 18, X1 - X0, 40, "#3f6b4f", 'opacity="0.85"'));
  for (let x = X0; x < X1; x += 22) tops.push(line(x, crossY + 18, x + 16, crossY + 58, "#e9ece9", 2, 'opacity="0.6"'));
  tops.push(line(X0, crossY + 76, X1, crossY + 76, "#d8c25a", 2.4));
  tops.push(line(X0, crossY + 160, X1, crossY + 160, "#d8c25a", 2.4));
  // Forklifts in aisles and people on the walkway
  const items = [];
  for (let x = X0 + 40 + rackW * 2 + 6; x < X1; x += rowPitch) {
    if (R.chance(0.6)) items.push(forklift(x + aisle / 2, R.range(Y0 + 200, crossY - 100), R.pick([0, 180]), R));
  }
  for (let i = 0; i < 6; i++) items.push(worker(R.range(100, W - 100), crossY + 38, R.pick([90, -90])));
  for (let i = 0; i < 2; i++) items.push(forklift(R.range(0, W), crossY + 118, R.pick([90, -90]), R));

  const body = `<rect width="${W}" height="${H}" fill="#5e6469"/>
    <g transform="rotate(${angle} ${cx} ${cy})">${parts.join("")}${shadows.join("")}${tops.join("")}${items.join("")}</g>
    ${finishDefs(W, H, { grain: 0.06, vignette: 0.4 })}`;
  return svgDoc(W, H, body);
}

/** Concept: AMRs moving shelf pods; people in PPE at separated pick stations. */
export function autonomyScene({ W = 1200, H = 1500, seed = 31, angle = -8 } = {}) {
  const R = rng(seed);
  const cx = W / 2;
  const cy = H / 2;
  const g = [];
  const X0 = -400;
  const X1 = W + 400;
  const Y0 = -400;
  const Y1 = H + 400;
  g.push(rect(X0, Y0, X1 - X0, Y1 - Y0, "#4b5157"));
  const cell = 64;
  for (let x = X0; x < X1; x += cell) g.push(line(x, Y0, x, Y1, "#565d63", 1.2));
  for (let y = Y0; y < Y1; y += cell) g.push(line(X0, y, X1, y, "#565d63", 1.2));
  // Fiducial markers at grid intersections
  for (let x = X0; x < X1; x += cell)
    for (let y = Y0; y < Y1; y += cell) g.push(rect(x - 3, y - 3, 6, 6, "#7b838a", 'opacity="0.7"'));

  // Pod storage field (upper region), robots with pods, travel lanes
  const pods = [];
  const robots = [];
  const stationY = H * 0.74;
  for (let gx = 0; gx < 22; gx++) {
    for (let gy = 0; gy < 24; gy++) {
      const x = X0 + 64 + gx * cell;
      const y = Y0 + 64 + gy * cell;
      if (y > stationY - 160) continue;
      if (gx % 4 === 3 || gy % 5 === 4) continue; // lanes
      if (R.chance(0.12)) continue;
      pods.push(podAt(x, y, R));
    }
  }
  // Robots travelling the lanes (empty, so the robot itself is visible) with faint path trails
  const trails = [];
  for (let i = 0; i < 26; i++) {
    const vertical = R.chance(0.5);
    let x;
    let y;
    if (vertical) {
      x = X0 + 64 + (R.int(1, 5) * 4 + 3) * cell;
      y = Y0 + 64 + R.int(7, 20) * cell;
      trails.push(line(x, y + 26, x, y + R.range(140, 320), "#9fd0ff", 2, 'opacity="0.35" stroke-dasharray="2 8" stroke-linecap="round"'));
    } else {
      x = X0 + 64 + R.int(6, 20) * cell;
      y = Y0 + 64 + (R.int(2, 4) * 5 - 1) * cell;
      trails.push(line(x - 26, y, x - R.range(140, 320), y, "#9fd0ff", 2, 'opacity="0.35" stroke-dasharray="2 8" stroke-linecap="round"'));
    }
    if (y > stationY - 130) continue;
    robots.push(robotAt(x, y, R.chance(0.35), R));
  }
  g.push(trails.join(""));
  // Pick stations: physically separated, people in PPE, robots queue at the window
  const st = [];
  st.push(rect(X0, stationY - 40, X1 - X0, 8, "#d8c25a"));
  for (let x = X0; x < X1; x += 18) st.push(rect(x, stationY - 40, 9, 8, "#1c2026"));
  st.push(rect(X0, stationY, X1 - X0, Y1 - stationY, "#5c6369"));
  for (let k = 0; k < 6; k++) {
    const sx = 40 + k * 230;
    st.push(rect(sx, stationY + 30, 170, 120, "#3a4148"));
    st.push(rect(sx + 10, stationY + 40, 150, 40, "#a98455"));
    st.push(rect(sx + 10, stationY + 40, 150, 6, "#c9c8c0"));
    st.push(worker(sx + 85, stationY + 110, 180));
    robots.push(robotAt(sx + 85, stationY - 92, true, R));
    st.push(rect(sx + 60, stationY - 10, 50, 6, "#7cc4ff", 'opacity="0.9"'));
  }
  // Walkway along the bottom
  st.push(rect(X0, stationY + 190, X1 - X0, 44, "#3f6b4f", 'opacity="0.9"'));
  for (let x = X0; x < X1; x += 22) st.push(line(x, stationY + 190, x + 18, stationY + 234, "#e9ece9", 2, 'opacity="0.55"'));
  st.push(worker(W * 0.32, stationY + 212, 90));
  st.push(worker(W * 0.7, stationY + 212, -90, { helmet: "#e8c54a" }));

  const body = `<rect width="${W}" height="${H}" fill="#4b5157"/>
    <g transform="rotate(${angle} ${cx} ${cy})">${g.join("")}${pods.join("")}${robots.join("")}${st.join("")}</g>
    ${finishDefs(W, H, { grain: 0.05, vignette: 0.45 })}`;
  return svgDoc(W, H, body);

  function podAt(x, y, R) {
    const s = 50;
    let out = rect(x - s / 2 + 8, y - s / 2 + 10, s, s, SHADOW, 'opacity="0.4"');
    out += rect(x - s / 2, y - s / 2, s, s, "#2b3138");
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) {
        out += rect(x - s / 2 + 3 + i * 15.3, y - s / 2 + 3 + j * 15.3, 13.5, 13.5, R.pick(["#3c5f7a", "#a98455", "#c8c5bd", "#5d6b3c", "#7d3a2e", "#a98455"]));
      }
    return out;
  }

  function robotAt(x, y, loaded, R) {
    const s = 40;
    let out = `<rect x="${x - s / 2 + 5}" y="${y - s / 2 + 7}" width="${s}" height="${s}" rx="9" fill="${SHADOW}" opacity="0.45"/>`;
    out += `<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" rx="9" fill="#d9dcdf"/>`;
    out += `<rect x="${x - s / 2 + 4}" y="${y - s / 2 + 4}" width="${s - 8}" height="${s - 8}" rx="6" fill="#b7bcc1"/>`;
    out += circle(x + s / 2 - 8, y - s / 2 + 8, 3.2, "#7cc4ff");
    out += circle(x, y, 9, "none", 'stroke="#8f969c" stroke-width="2"');
    if (loaded) out += podAt(x, y - 2, R).replace(/opacity="0.4"/, 'opacity="0.25"');
    return out;
  }
}

export function factoryScene({ W = 1200, H = 1600, seed = 41, angle = 10 } = {}) {
  const R = rng(seed);
  const cx = W / 2;
  const cy = H / 2;
  const g = [];
  const X0 = -500;
  const X1 = W + 500;
  const Y0 = -500;
  const Y1 = H + 500;
  g.push(rect(X0, Y0, X1 - X0, Y1 - Y0, "#5a6064"));
  for (let x = X0; x < X1; x += 100) g.push(line(x, Y0, x, Y1, "#52585c", 1));
  for (let y = Y0; y < Y1; y += 100) g.push(line(X0, y, X1, y, "#52585c", 1));
  const shadows = [];
  const tops = [];
  // Conveyor lines running vertically
  for (let k = 0; k < 4; k++) {
    const x = X0 + 260 + k * 440;
    shadows.push(rect(x + 8, Y0 + 10, 56, Y1 - Y0, SHADOW, 'opacity="0.35"'));
    tops.push(rect(x, Y0, 56, Y1 - Y0, "#3b4249"));
    tops.push(rect(x + 6, Y0, 44, Y1 - Y0, "#6b7379"));
    for (let y = Y0; y < Y1; y += 8) tops.push(line(x + 6, y, x + 50, y, "#585f65", 1.4));
    // Products on conveyor
    for (let y = Y0 + R.range(0, 80); y < Y1; y += R.range(90, 150)) {
      tops.push(rect(x + 10, y, 36, 36, shade("#a98455", R.range(-0.1, 0.1))));
      tops.push(line(x + 10, y + 18, x + 46, y + 18, "#c8b089", 2));
    }
    // Fenced machine cells beside the conveyor
    for (let y = Y0 + 120; y < Y1 - 200; y += 360) {
      if (Math.round((y - Y0 - 120) / 360) % 2 === 1 && R.chance(0.35)) continue;
      const side = R.chance(0.5) ? -1 : 1;
      const mx = side < 0 ? x - 240 : x + 80;
      const cellW = 200;
      const cellH = 240;
      tops.push(rect(mx, y, cellW, cellH, "#4f565b"));
      tops.push(`<rect x="${mx}" y="${y}" width="${cellW}" height="${cellH}" fill="none" stroke="#d8c25a" stroke-width="4" stroke-dasharray="14 8"/>`);
      shadows.push(rect(mx + 50 + 10, y + 40 + 12, 100, 80, SHADOW, 'opacity="0.4"'));
      tops.push(rect(mx + 50, y + 40, 100, 80, "#8d969c"));
      tops.push(rect(mx + 60, y + 50, 80, 30, "#2f5d73"));
      // Arm base and links (top view)
      const ax = mx + cellW / 2;
      const ay = y + cellH - 60;
      tops.push(circle(ax, ay, 22, "#c9922c"));
      const a1 = R.range(-2.4, -0.7);
      const ex = ax + Math.cos(a1) * 60;
      const ey = ay + Math.sin(a1) * 60;
      tops.push(line(ax, ay, ex, ey, "#d6a33a", 16, 'stroke-linecap="round"'));
      tops.push(line(ex, ey, ex + 40, ey - 10, "#d6a33a", 11, 'stroke-linecap="round"'));
      tops.push(circle(ex, ey, 9, "#9c7428"));
    }
  }
  // Walkways and people in PPE
  for (let k = 0; k < 4; k++) {
    const y = Y0 + 120 + 240 + 35 + k * 720;
    tops.push(rect(X0, y, X1 - X0, 50, "#3f6b4f", 'opacity="0.9"'));
    tops.push(line(X0, y - 4, X1, y - 4, "#d8c25a", 2.6));
    tops.push(line(X0, y + 54, X1, y + 54, "#d8c25a", 2.6));
    for (let i = 0; i < 4; i++) tops.push(worker(R.range(0, W), y + 25, R.pick([90, -90]), { helmet: R.pick(["#f1f0ea", "#e8c54a", "#5e9bd1"]) }));
  }
  const body = `<rect width="${W}" height="${H}" fill="#5a6064"/>
    <g transform="rotate(${angle} ${cx} ${cy})">${g.join("")}${shadows.join("")}${tops.join("")}</g>
    ${finishDefs(W, H, { grain: 0.06, vignette: 0.42 })}`;
  return svgDoc(W, H, body);
}

export { poly };

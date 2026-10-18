// Plan-view landscapes: highway freight, rail freight corridor, tank farm, EV depot.
import { rng, rect, line, circle, poly, shade, finishDefs, svgDoc } from "./lib.mjs";
import { worker } from "./indoor.mjs";

const SHADOW = "#04070b";
const FIELD = ["#3e4934", "#46502f", "#57573a", "#3b4535", "#4d4a33", "#5f5a3e", "#384232", "#525a3a"];

function fields(R, X0, Y0, X1, Y1, out) {
  out.push(rect(X0, Y0, X1 - X0, Y1 - Y0, "#43493a"));
  for (let y = Y0; y < Y1; y += R.range(90, 180)) {
    const h = R.range(90, 180);
    for (let x = X0; x < X1; ) {
      const w = R.range(120, 340);
      const c = R.pick(FIELD);
      out.push(rect(x + 2, y + 2, w - 4, h - 4, c));
      const vertical = R.chance(0.5);
      const step = R.range(6, 10);
      if (vertical) for (let fx = x + 6; fx < x + w - 6; fx += step) out.push(line(fx, y + 6, fx, y + h - 6, shade(c, -0.12), 1, 'opacity="0.7"'));
      else for (let fy = y + 6; fy < y + h - 6; fy += step) out.push(line(x + 6, fy, x + w - 6, fy, shade(c, -0.12), 1, 'opacity="0.7"'));
      out.push(`<rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" fill="none" stroke="#5b5845" stroke-width="2" opacity="0.6"/>`);
      x += w;
    }
  }
}

function trees(R, n, X0, Y0, X1, Y1, out, avoid = () => false) {
  for (let i = 0; i < n; i++) {
    const x = R.range(X0, X1);
    const y = R.range(Y0, Y1);
    if (avoid(x, y)) continue;
    const r = R.range(8, 18);
    out.push(circle(x + r * 0.6, y + r * 0.8, r, SHADOW, 'opacity="0.45"'));
    out.push(circle(x, y, r, R.pick(["#2a3a2b", "#304332", "#374b35", "#2d3d2c"])));
    out.push(circle(x - r * 0.3, y - r * 0.3, r * 0.45, "#41583f", 'opacity="0.6"'));
  }
}

function lorry(x, y, R, dir = 1) {
  // Indian-style goods truck: painted cab, open or tarpaulin-covered body
  const len = 64;
  const w = 15;
  const cabLen = 14;
  const cabX = dir > 0 ? x + len - cabLen : x;
  const bodyX = dir > 0 ? x : x + cabLen + 2;
  const body = R.pick(["tarp", "tarp", "container", "open"]);
  let out = rect(x + 4, y + 5, len, w, SHADOW, 'opacity="0.5"');
  out += rect(cabX, y, cabLen, w, R.pick(["#c4682e", "#d0a23a", "#2f5d73", "#9a3b32", "#e1ddd2"]));
  out += rect(cabX + (dir > 0 ? 8 : 2), y + 2, 4, w - 4, "#1b2228");
  if (body === "tarp") out += rect(bodyX, y, len - cabLen - 2, w, R.pick(["#3a5a8a", "#2f4f7a", "#c9a14c", "#3c6b5b"]));
  else if (body === "container") out += rect(bodyX, y, len - cabLen - 2, w, R.pick(["#7d3a2e", "#2f5d73", "#cfc9bb"]));
  else {
    out += rect(bodyX, y, len - cabLen - 2, w, "#6b4f36");
    out += rect(bodyX + 2, y + 2, len - cabLen - 6, w - 4, R.pick(["#8a8f94", "#a98455", "#4a4f55"]));
  }
  out += line(bodyX + 4, y + w / 2, bodyX + len - cabLen - 6, y + w / 2, "#000", 0.8, 'opacity="0.2"');
  return out;
}

export function freightScene({ W = 1200, H = 1600, seed = 51, angle = -28 } = {}) {
  const R = rng(seed);
  const cx = W / 2;
  const cy = H / 2;
  const X0 = -900;
  const X1 = W + 900;
  const Y0 = -900;
  const Y1 = H + 900;
  const g = [];
  fields(R, X0, Y0, X1, Y1, g);
  const midY = cy;
  // Divided highway: two carriageways of three lanes with paved shoulders
  const laneW = 26;
  const cw = laneW * 3;
  const median = 30;
  const topY = midY - median / 2 - cw - 14;
  g.push(rect(X0, topY - 20, X1 - X0, cw * 2 + median + 68, "#5b5544"));
  g.push(rect(X0, topY, X1 - X0, cw + 10, "#2c3035"));
  g.push(rect(X0, midY + median / 2, X1 - X0, cw + 10, "#2c3035"));
  g.push(rect(X0, midY - median / 2, X1 - X0, median, "#4a5a3c"));
  for (let x = X0; x < X1; x += 26) g.push(circle(x, midY, R.range(5, 9), "#3a5236"));
  for (const base of [topY + 5, midY + median / 2 + 5]) {
    g.push(line(X0, base, X1, base, "#d9dcdd", 1.6, 'opacity="0.7"'));
    g.push(line(X0, base + cw, X1, base + cw, "#d9dcdd", 1.6, 'opacity="0.7"'));
    for (let l = 1; l < 3; l++)
      for (let x = X0; x < X1; x += 54) g.push(line(x, base + l * laneW, x + 26, base + l * laneW, "#d9dcdd", 1.6, 'opacity="0.55"'));
  }
  // Service road and a logistics park
  const svcY = midY + median / 2 + cw + 120;
  g.push(rect(X0, svcY, X1 - X0, 30, "#34383c"));
  for (let x = X0 + 200; x < X1; x += R.range(700, 1000)) {
    const w = R.range(360, 520);
    g.push(rect(x, svcY + 70, w, 30, "#34383c"));
    g.push(rect(x + 20, svcY + 110, w - 40, 220, "#8e959b"));
    for (let px = x + 20; px < x + w - 20; px += 14) g.push(line(px, svcY + 110, px, svcY + 330, "#7c8389", 1.2, 'opacity="0.7"'));
    for (let k = 0; k < 6; k++) g.push(lorry(x + 30 + k * ((w - 80) / 6), svcY + 74, R, 1).replace(/width="64"/, 'width="64"'));
  }
  // Traffic: lorries dominate
  const traffic = [];
  for (let i = 0; i < 90; i++) {
    const dirDown = R.chance(0.5);
    const lane = R.int(0, 2);
    const y = dirDown ? midY + median / 2 + 10 + lane * laneW + 4 : topY + 9 + lane * laneW + 4;
    const x = R.range(X0, X1);
    if (R.chance(0.78)) traffic.push(lorry(x, y, R, dirDown ? -1 : 1));
    else {
      traffic.push(rect(x + 3, y + 5, 24, 13, SHADOW, 'opacity="0.5"'));
      traffic.push(`<rect x="${x}" y="${y + 1}" width="24" height="13" rx="3" fill="${R.pick(["#d9dcdf", "#8a9096", "#2f5d73", "#9a3b32"])}"/>`);
      traffic.push(rect(x + 7, y + 3, 9, 9, "#1b2228"));
    }
  }
  const tr = [];
  trees(R, 900, X0, Y0, X1, Y1, tr, (x, y) => y > topY - 30 && y < svcY + 360);
  const body = `<rect width="${W}" height="${H}" fill="#43493a"/>
    <g transform="rotate(${angle} ${cx} ${cy})">${g.join("")}${traffic.join("")}${tr.join("")}</g>
    ${finishDefs(W, H, { grain: 0.06, vignette: 0.4 })}`;
  return svgDoc(W, H, body);
}

export function railScene({ W = 1200, H = 1500, seed = 61, angle = -22 } = {}) {
  const R = rng(seed);
  const cx = W / 2;
  const cy = H / 2;
  const X0 = -900;
  const X1 = W + 900;
  const Y0 = -900;
  const Y1 = H + 900;
  const g = [];
  fields(R, X0, Y0, X1, Y1, g);
  // Canal crossing diagonally under the corridor
  g.push(`<path d="M ${X0} ${Y1 - 300} C ${cx - 200} ${cy + 260}, ${cx + 200} ${cy - 200}, ${X1} ${Y0 + 200}" stroke="#5c5a48" stroke-width="96" fill="none"/>`);
  g.push(`<path d="M ${X0} ${Y1 - 300} C ${cx - 200} ${cy + 260}, ${cx + 200} ${cy - 200}, ${X1} ${Y0 + 200}" stroke="#244a5a" stroke-width="64" fill="none"/>`);
  g.push(`<path d="M ${X0} ${Y1 - 300} C ${cx - 200} ${cy + 260}, ${cx + 200} ${cy - 200}, ${X1} ${Y0 + 200}" stroke="#3f6f80" stroke-width="2" stroke-dasharray="30 40" fill="none" opacity="0.5"/>`);
  // Corridor embankment
  const tracks = [cy - 66, cy - 22, cy + 34, cy + 78];
  g.push(rect(X0, cy - 110, X1 - X0, 230, "#6a6352"));
  g.push(rect(X0, cy - 92, X1 - X0, 194, "#5a554b"));
  for (const ty of tracks) {
    g.push(rect(X0, ty - 9, X1 - X0, 18, "#4a463f"));
    for (let x = X0; x < X1; x += 7) g.push(line(x, ty - 7, x, ty + 7, "#35312c", 2.4));
    g.push(line(X0, ty - 4, X1, ty - 4, "#9da2a6", 1.4));
    g.push(line(X0, ty + 4, X1, ty + 4, "#9da2a6", 1.4));
  }
  // Overhead line masts and portals
  for (let x = X0; x < X1; x += 120) {
    g.push(rect(x, cy - 104, 6, 6, "#9da2a6"));
    g.push(rect(x, cy + 108, 6, 6, "#9da2a6"));
    g.push(line(x + 3, cy - 100, x + 3, cy + 110, "#b8bcc0", 1.2, 'opacity="0.55"'));
    g.push(line(x + 3 + 18, cy - 92, x + 3 + 68, cy - 22, "#04070b", 1.2, 'opacity="0.35"'));
  }
  for (const ty of tracks) g.push(line(X0, ty, X1, ty, "#c9cdd0", 0.8, 'opacity="0.5"'));
  // Double-stack container train on the first freight track
  const trains = [];
  let x = X0 + 120;
  trains.push(rect(x + 6, tracks[0] - 7, 80, 18, SHADOW, 'opacity="0.5"'));
  trains.push(rect(x, tracks[0] - 9, 80, 18, "#9a3b32"));
  trains.push(rect(x + 8, tracks[0] - 6, 20, 12, "#2a2f35"));
  trains.push(rect(x + 86, tracks[0] - 9, 80, 18, "#9a3b32"));
  x += 172;
  while (x < X1 - 100) {
    trains.push(rect(x + 10, tracks[0] - 5, 54, 20, SHADOW, 'opacity="0.55"'));
    trains.push(rect(x, tracks[0] - 9, 56, 18, "#3d3a36"));
    trains.push(rect(x + 2, tracks[0] - 8, 52, 16, R.pick(["#7d3a2e", "#2f5d73", "#cfc9bb", "#3c6b5b", "#c9a14c", "#4b507b", "#8a9096"])));
    trains.push(line(x + 28, tracks[0] - 7, x + 28, tracks[0] + 7, "#000", 0.8, 'opacity="0.25"'));
    x += 60;
  }
  // Open wagon rake (coal) on the conventional track
  x = X0 + R.range(300, 700);
  for (let i = 0; i < 46; i++) {
    trains.push(rect(x + 5, tracks[2] - 6, 40, 16, SHADOW, 'opacity="0.45"'));
    trains.push(rect(x, tracks[2] - 8, 40, 16, "#5b3a2c"));
    trains.push(rect(x + 3, tracks[2] - 5, 34, 10, "#1b1d20"));
    x += 44;
  }
  // Road over-bridge across the corridor
  const bx = cx + 160;
  g.push(rect(bx - 6, Y0, 64, Y1 - Y0, "#5b5544"));
  const bridge = [];
  bridge.push(rect(bx + 12, cy - 160, 52, 340, SHADOW, 'opacity="0.5"'));
  bridge.push(rect(bx, cy - 170, 52, 340, "#3a3e43"));
  bridge.push(line(bx + 26, cy - 170, bx + 26, cy + 170, "#d9dcdd", 1.4, 'stroke-dasharray="14 12" opacity="0.6"'));
  bridge.push(rect(bx - 3, cy - 170, 3, 340, "#a3a8ac"));
  bridge.push(rect(bx + 52, cy - 170, 3, 340, "#a3a8ac"));
  g.push(rect(bx, Y0, 52, Y1 - Y0, "#3a3e43"));
  for (let i = 0; i < 6; i++) bridge.push(lorry(bx + 18, R.range(Y0, Y1), R, 1).replace(/x="([\d.-]+)" y="([\d.-]+)" width="64"/, 'x="$1" y="$2" width="64"'));
  const tr = [];
  trees(R, 700, X0, Y0, X1, Y1, tr, (tx, ty) => (ty > cy - 140 && ty < cy + 150) || (tx > bx - 30 && tx < bx + 80));
  const body = `<rect width="${W}" height="${H}" fill="#43493a"/>
    <g transform="rotate(${angle} ${cx} ${cy})">${g.join("")}${trains.join("")}${tr.join("")}${bridge.join("")}</g>
    ${finishDefs(W, H, { grain: 0.06, vignette: 0.4 })}`;
  return svgDoc(W, H, body);
}

export function facilityScene({ W = 1200, H = 1600, seed = 71, angle = 14 } = {}) {
  const R = rng(seed);
  const cx = W / 2;
  const cy = H / 2;
  const X0 = -700;
  const X1 = W + 700;
  const Y0 = -700;
  const Y1 = H + 700;
  const g = [];
  g.push(rect(X0, Y0, X1 - X0, Y1 - Y0, "#4c4b44"));
  for (let i = 0; i < 200; i++) g.push(`<ellipse cx="${R.range(X0, X1)}" cy="${R.range(Y0, Y1)}" rx="${R.range(40, 160)}" ry="${R.range(20, 80)}" fill="#55534a" opacity="0.35"/>`);
  const tops = [];
  const shadows = [];
  // Roads grid
  for (let x = X0 + 100; x < X1; x += 520) g.push(rect(x, Y0, 36, Y1 - Y0, "#33373b"));
  for (let y = Y0 + 80; y < Y1; y += 560) g.push(rect(X0, y, X1 - X0, 36, "#33373b"));
  // Tank compounds with bund walls
  for (let x = X0 + 170; x < X1 - 300; x += 520) {
    for (let y = Y0 + 150; y < Y1 - 300; y += 560) {
      const w = 420;
      const h = 450;
      g.push(rect(x, y, w, h, "#5a5850"));
      g.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#7d7b70" stroke-width="8"/>`);
      const n = R.chance(0.5) ? 2 : 1;
      for (let i = 0; i < n * 2; i++) {
        const r = n === 2 ? 82 : 150;
        const tx = n === 2 ? x + 110 + (i % 2) * 200 : x + w / 2;
        const ty = n === 2 ? y + 115 + Math.floor(i / 2) * 220 : y + h / 2;
        if (n === 1 && i > 0) break;
        shadows.push(circle(tx + r * 0.25, ty + r * 0.3, r, SHADOW, 'opacity="0.55"'));
        tops.push(`<circle cx="${tx}" cy="${ty}" r="${r}" fill="url(#tank)"/>`);
        tops.push(`<circle cx="${tx}" cy="${ty}" r="${r * 0.82}" fill="none" stroke="#aeb3b5" stroke-width="1.4" opacity="0.6"/>`);
        tops.push(`<circle cx="${tx}" cy="${ty}" r="${r * 0.5}" fill="none" stroke="#aeb3b5" stroke-width="1.2" opacity="0.5"/>`);
        tops.push(line(tx - r, ty, tx + r, ty, "#9fa4a7", 1, 'opacity="0.35"'));
        tops.push(line(tx, ty - r, tx, ty + r, "#9fa4a7", 1, 'opacity="0.35"'));
        tops.push(circle(tx + r * 0.45, ty - r * 0.3, 7, "#5f6468"));
        tops.push(rect(tx + r - 6, ty - 4, 20, 8, "#d8c25a"));
      }
    }
  }
  // Pipe racks
  for (let y = Y0 + 98; y < Y1; y += 560) {
    for (let p = 0; p < 6; p++) tops.push(line(X0, y + 4 + p * 5, X1, y + 4 + p * 5, R.pick(["#9da2a6", "#b7bcc0", "#8d6f4a", "#6f8fa6"]), 3.2));
  }
  for (let x = X0 + 118; x < X1; x += 520) {
    for (let p = 0; p < 4; p++) tops.push(line(x + 4 + p * 6, Y0, x + 4 + p * 6, Y1, R.pick(["#9da2a6", "#b7bcc0", "#6f8fa6"]), 3.2));
  }
  // Inspection crew in PPE beside a tank, and a utility vehicle
  const people = [];
  people.push(worker(cx - 40, cy + 40, 30));
  people.push(worker(cx + 2, cy + 60, -20, { helmet: "#e8c54a" }));
  people.push(`<rect x="${cx + 60}" y="${cy + 120}" width="44" height="22" rx="4" fill="#d9dcdf"/><rect x="${cx + 64}" y="${cy + 124}" width="14" height="14" fill="#1b2228"/>`);
  const tr = [];
  trees(R, 220, X0, Y0, X1, Y1, tr, (x, y) => {
    const lx = ((x - X0 - 170) % 520 + 520) % 520;
    const ly = ((y - Y0 - 150) % 560 + 560) % 560;
    return lx < 440 && ly < 470;
  });
  const body = `<defs><radialGradient id="tank" cx="38%" cy="35%" r="70%"><stop offset="0%" stop-color="#e3e5e4"/><stop offset="70%" stop-color="#b9bebf"/><stop offset="100%" stop-color="#8f9597"/></radialGradient></defs>
    <rect width="${W}" height="${H}" fill="#4c4b44"/>
    <g transform="rotate(${angle} ${cx} ${cy})">${g.join("")}${tr.join("")}${shadows.join("")}${tops.join("")}${people.join("")}</g>
    ${finishDefs(W, H, { grain: 0.06, vignette: 0.42 })}`;
  return svgDoc(W, H, body);
}

export function depotScene({ W = 1200, H = 1600, seed = 81, angle = -16 } = {}) {
  const R = rng(seed);
  const cx = W / 2;
  const cy = H / 2;
  const X0 = -600;
  const X1 = W + 600;
  const Y0 = -600;
  const Y1 = H + 600;
  const g = [];
  g.push(rect(X0, Y0, X1 - X0, Y1 - Y0, "#3a3e43"));
  const shadows = [];
  const tops = [];
  // Canopy rows over charging bays (solar roofs)
  for (let y = Y0 + 120; y < Y1; y += 300) {
    for (let x = X0; x < X1; x += 52) {
      g.push(line(x, y, x, y + 220, "#d9dcdd", 1.4, 'opacity="0.55"'));
    }
    // Vehicles: electric buses and light commercial EVs nose-in to chargers
    for (let x = X0 + 6; x < X1; x += 52) {
      if (R.chance(0.18)) continue;
      const bus = R.chance(0.45);
      const len = bus ? 200 : 96;
      const top = y + 110 - (bus ? 90 : 0);
      shadows.push(`<rect x="${x + 7}" y="${top + 8}" width="38" height="${len}" rx="6" fill="${SHADOW}" opacity="0.5"/>`);
      tops.push(`<rect x="${x + 2}" y="${top}" width="38" height="${len}" rx="6" fill="${bus ? R.pick(["#d9dcdf", "#2f5d73", "#3c6b5b"]) : R.pick(["#e1ddd2", "#cfd3d6", "#8a9096"])}"/>`);
      tops.push(`<rect x="${x + 8}" y="${top + 8}" width="26" height="${bus ? 14 : 20}" rx="3" fill="#1b2228"/>`);
      if (bus) for (let k = 0; k < 4; k++) tops.push(rect(x + 10, top + 40 + k * 38, 22, 24, "#b7bcc1", 'opacity="0.8"'));
      tops.push(rect(x + 14, y + 224, 14, 10, "#2a2f35"));
      tops.push(rect(x + 18, y + 226, 6, 6, "#7cc4ff"));
    }
    // Canopy structure with solar panels (partially covers bays)
    const canopy = [];
    canopy.push(rect(X0 + 10, y + 228, X1 - X0, 22, "#22303d"));
    for (let x = X0; x < X1; x += 26) canopy.push(line(x, y + 228, x, y + 250, "#3a5068", 1));
    tops.push(canopy.join(""));
    g.push(rect(X0, y + 250, X1 - X0, 50, "#2d3135"));
    for (let x = X0; x < X1; x += 40) g.push(line(x, y + 275, x + 20, y + 275, "#d9dcdd", 1.6, 'opacity="0.6"'));
  }
  // Technicians in PPE
  const aisleY = Y0 + 120 + 300 * Math.round((cy - Y0 - 120) / 300) + 275;
  tops.push(worker(cx - 120, aisleY - 2, 90));
  tops.push(worker(cx + 60, aisleY + 4, -90, { helmet: "#e8c54a" }));
  const body = `<rect width="${W}" height="${H}" fill="#3a3e43"/>
    <g transform="rotate(${angle} ${cx} ${cy})">${g.join("")}${shadows.join("")}${tops.join("")}</g>
    ${finishDefs(W, H, { grain: 0.06, vignette: 0.42 })}`;
  return svgDoc(W, H, body);
}

export { poly };

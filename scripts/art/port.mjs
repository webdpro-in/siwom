// Aerial container terminal, plan view. Original procedural illustration.
import { rng, rect, line, circle, poly, shade, finishDefs, svgDoc } from "./lib.mjs";

const PALETTE = [
  "#7d3a2e", // rust red
  "#2f5d73", // steel blue
  "#8a9096", // grey
  "#cfc9bb", // off white
  "#3c6b5b", // green
  "#a56a2c", // ochre
  "#4b507b", // indigo
  "#6e2f3b", // maroon
  "#c9a14c", // mustard
  "#2c4a5f", // dark blue
  "#9a4a2f", // orange-brown
];
const WEIGHTS = [10, 9, 6, 7, 4, 4, 3, 3, 2, 6, 4];

function pickColor(R) {
  const total = WEIGHTS.reduce((a, b) => a + b, 0);
  let t = R.next() * total;
  for (let i = 0; i < PALETTE.length; i++) {
    t -= WEIGHTS[i];
    if (t <= 0) return PALETTE[i];
  }
  return PALETTE[0];
}

const SHADOW = "#04070b";
const SUN = { dx: 1.4, dy: 1.9 }; // shadow offset per stack level

export function portScene({ W = 3600, H = 2700, seed = 11, angle = -16, quayY = 820 } = {}) {
  const R = rng(seed);
  const cx = W / 2;
  const cy = H / 2;
  const rad = (angle * Math.PI) / 180;
  const toScreen = (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    return [cx + dx * Math.cos(rad) - dy * Math.sin(rad), cy + dx * Math.sin(rad) + dy * Math.cos(rad)];
  };
  const visible = (x, y, m = 260) => {
    const [sx, sy] = toScreen(x, y);
    return sx > -m && sx < W + m && sy > -m && sy < H + m;
  };

  const X0 = -1100;
  const X1 = W + 1100;
  const Y0 = -1100;
  const Y1 = H + 1100;

  const ground = [];
  const shadows = [];
  const objects = [];
  const tops = [];
  const lights = [];

  // ---- Water ---------------------------------------------------------------
  ground.push(rect(X0, Y0, X1 - X0, quayY - Y0, "#0d1c27"));
  for (let i = 0; i < 70; i++) {
    const x = R.range(X0, X1);
    const y = R.range(Y0, quayY - 40);
    ground.push(
      `<ellipse cx="${x}" cy="${y}" rx="${R.range(160, 520)}" ry="${R.range(30, 90)}" fill="#163042" opacity="${R.range(0.15, 0.35).toFixed(2)}"/>`,
    );
  }
  for (let i = 0; i < 2600; i++) {
    const x = R.range(X0, X1);
    const y = R.range(Y0, quayY - 12);
    if (!visible(x, y, 80)) continue;
    const len = R.range(14, 70);
    ground.push(
      line(x, y, x + len, y + R.range(-1.5, 1.5), "#3b6378", R.range(0.8, 1.8), `opacity="${R.range(0.12, 0.4).toFixed(2)}" stroke-linecap="round"`),
    );
  }

  // ---- Land base -------------------------------------------------------------
  ground.push(rect(X0, quayY, X1 - X0, Y1 - quayY, "#343a40"));

  // Apron (quayside concrete) with joints
  const apronH = 210;
  ground.push(rect(X0, quayY, X1 - X0, apronH, "#555b61"));
  for (let x = X0; x < X1; x += 64) ground.push(line(x, quayY, x, quayY + apronH, "#4b5056", 1, 'opacity="0.6"'));
  for (let y = quayY; y < quayY + apronH; y += 64) ground.push(line(X0, y, X1, y, "#4b5056", 1, 'opacity="0.6"'));
  // Quay edge, bollards and crane rails
  ground.push(rect(X0, quayY - 4, X1 - X0, 10, "#99a0a5"));
  for (let x = X0; x < X1; x += 58) ground.push(circle(x, quayY + 1, 2.6, "#262a2f"));
  ground.push(line(X0, quayY + 22, X1, quayY + 22, "#6c7177", 2.2));
  ground.push(line(X0, quayY + 112, X1, quayY + 112, "#6c7177", 2.2));
  // Lane markings on the apron
  for (let x = X0; x < X1; x += 40) {
    ground.push(line(x, quayY + 150, x + 22, quayY + 150, "#c7b260", 2, 'opacity="0.8"'));
    ground.push(line(x, quayY + 182, x + 22, quayY + 182, "#d4d7d9", 1.6, 'opacity="0.55"'));
  }

  // Road band behind the apron
  const roadY = quayY + apronH;
  ground.push(rect(X0, roadY, X1 - X0, 64, "#2a2f35"));
  for (let x = X0; x < X1; x += 46) ground.push(line(x, roadY + 32, x + 24, roadY + 32, "#d4d7d9", 2, 'opacity="0.6"'));
  ground.push(line(X0, roadY + 2, X1, roadY + 2, "#cfd3d6", 1.4, 'opacity="0.5"'));
  ground.push(line(X0, roadY + 62, X1, roadY + 62, "#cfd3d6", 1.4, 'opacity="0.5"'));

  // ---- Ships -----------------------------------------------------------------
  const beam = 150;
  const craneXs = [];
  let sx = X0 + R.range(80, 300);
  while (sx < X1 - 400) {
    const len = R.range(900, 1150);
    const bowRight = R.chance(0.5);
    drawShip(sx, quayY - beam - 8, len, beam, bowRight);
    sx += len + R.range(150, 320);
  }

  function drawShip(x, y, len, b, bowRight) {
    if (!visible(x + len / 2, y + b / 2, len)) return;
    const bowLen = 110;
    const hull = bowRight
      ? [
          [x, y + 8],
          [x + len - bowLen, y],
          [x + len - 30, y + b * 0.18],
          [x + len, y + b / 2],
          [x + len - 30, y + b * 0.82],
          [x + len - bowLen, y + b],
          [x, y + b - 8],
        ]
      : [
          [x + len, y + 8],
          [x + bowLen, y],
          [x + 30, y + b * 0.18],
          [x, y + b / 2],
          [x + 30, y + b * 0.82],
          [x + bowLen, y + b],
          [x + len, y + b - 8],
        ];
    shadows.push(poly(hull.map(([px, py]) => [px + 10, py + 14]), SHADOW, 'opacity="0.45"'));
    // Wake/foam line along the hull
    objects.push(poly(hull, "#24313b"));
    objects.push(poly(hull.map(([px, py]) => [px + (px < x + len / 2 ? 4 : -4), py + (py < y + b / 2 ? 4 : -4)]), "#3a434c"));

    const sternEnd = bowRight ? x : x + len;
    const dir = bowRight ? 1 : -1;
    // Superstructure near the stern
    const supX = bowRight ? x + 70 : x + len - 70 - 46;
    shadows.push(rect(supX + 14, y + 12 + 20, 46, b - 24, SHADOW, 'opacity="0.55"'));
    objects.push(rect(supX, y + 12, 46, b - 24, "#e2e1da"));
    objects.push(rect(supX + 8, y + 22, 30, b - 44, "#c9c8c0"));
    objects.push(rect(supX + (bowRight ? -18 : 46), y + b / 2 - 10, 18, 20, "#8b2f2b"));
    // Container bays
    const startX = bowRight ? supX + 60 : x + bowLen + 20;
    const endX = bowRight ? x + len - bowLen - 20 : supX - 14;
    const nCranes = R.int(3, 5);
    for (let k = 0; k < nCranes; k++) {
      craneXs.push(startX + ((endX - startX) * (k + 0.5)) / nCranes + R.range(-30, 30));
    }
    const rows = 17;
    const cw = 36;
    const ch = (b - 22) / rows;
    for (let bx = startX; bx + cw <= endX; bx += cw + 4) {
      const openHold = R.chance(0.08);
      if (openHold) {
        objects.push(rect(bx, y + 11, cw, b - 22, "#141a20"));
        continue;
      }
      const bayHeight = R.int(2, 6);
      shadows.push(rect(bx + bayHeight * SUN.dx * 2, y + 11 + bayHeight * SUN.dy * 2, cw, b - 22, SHADOW, 'opacity="0.35"'));
      for (let r = 0; r < rows; r++) {
        if (R.chance(0.06)) continue;
        const c = shade(pickColor(R), R.range(-0.08, 0.08));
        tops.push(rect(bx, y + 11 + r * ch, cw, ch - 0.6, c));
      }
      tops.push(line(bx, y + 11, bx + cw, y + 11, "#ffffff", 0.8, 'opacity="0.18"'));
    }
    void sternEnd;
    void dir;
  }

  // ---- Quay cranes (STS) ------------------------------------------------------
  for (const x of craneXs) {
    if (!visible(x, quayY, 400)) continue;
    const boomTop = quayY - 250;
    const boomBottom = quayY + 140;
    // Shadows (long: cranes are tall)
    shadows.push(rect(x + 34, boomTop + 46, 18, boomBottom - boomTop, SHADOW, 'opacity="0.5"'));
    shadows.push(rect(x - 24 + 30, quayY + 12 + 40, 72, 104, SHADOW, 'opacity="0.35"'));
    // Portal legs and sill beams
    objects.push(rect(x - 26, quayY + 14, 10, 104, "#c9c6bb"));
    objects.push(rect(x + 34, quayY + 14, 10, 104, "#c9c6bb"));
    objects.push(rect(x - 26, quayY + 14, 70, 8, "#b8b5aa"));
    objects.push(rect(x - 26, quayY + 110, 70, 8, "#b8b5aa"));
    // Boom
    tops.push(rect(x, boomTop, 18, boomBottom - boomTop, "#e0ddd2"));
    tops.push(line(x + 9, boomTop + 4, x + 9, boomBottom - 4, "#a6a397", 1.2));
    tops.push(rect(x, boomTop, 18, 12, "#2f5d73"));
    // Machinery house and trolley
    tops.push(rect(x - 8, quayY + 96, 34, 44, "#cbc7ba"));
    tops.push(rect(x - 4, quayY + 100, 26, 16, "#2f5d73"));
    const ty = R.range(quayY - 300, quayY - 30);
    tops.push(rect(x - 4, ty, 26, 18, "#7d8288"));
    if (R.chance(0.6)) tops.push(rect(x - 9, ty + 22, 36, 8, pickColor(R)));
    lights.push([x + 9, quayY + 60, 0.9]);
  }

  // Terminal tractors on the apron
  for (let i = 0; i < 70; i++) {
    const x = R.range(X0, X1);
    if (!visible(x, quayY + 150, 60)) continue;
    const y = R.pick([quayY + 132, quayY + 160, quayY + 190, roadY + 10, roadY + 38]);
    truck(x, y, R.chance(0.75), R.chance(0.5));
  }

  function truck(x, y, loaded, right = true) {
    const cab = 11;
    const len = 40;
    shadows.push(rect(x + 3, y + 4, len + cab, 9, SHADOW, 'opacity="0.5"'));
    const cabX = right ? x + len : x;
    const bedX = right ? x : x + cab;
    objects.push(rect(cabX, y, cab, 9, R.pick(["#d9d6cc", "#c46b2e", "#2f5d73", "#b7b2a3"])));
    objects.push(rect(bedX, y + 1, len, 7, "#2b2f33"));
    if (loaded) objects.push(rect(bedX + 2, y, 36, 9, pickColor(R)));
  }

  // ---- Container yard ---------------------------------------------------------
  const yardY0 = roadY + 90;
  const yardY1 = yardY0 + 1420;
  const bays = 10;
  const rowsPerBlock = 6;
  const cw = 36;
  const chh = 8;
  const blockW = bays * (cw + 3);
  const blockH = rowsPerBlock * chh;
  const laneH = 12;
  const pitchY = blockH + laneH + 22;
  const crossRoad = 56;

  for (let bx = X0 + 40; bx < X1; bx += blockW + crossRoad) {
    // Cross road markings
    ground.push(rect(bx - crossRoad + 6, yardY0 - 20, crossRoad - 12, yardY1 - yardY0 + 40, "#2c3136"));
    for (let y = yardY0; y < yardY1; y += 36) {
      ground.push(line(bx - crossRoad / 2, y, bx - crossRoad / 2, y + 18, "#d4d7d9", 1.4, 'opacity="0.45"'));
    }
    for (let by = yardY0; by + blockH < yardY1; by += pitchY) {
      if (!visible(bx + blockW / 2, by + blockH / 2, 300)) continue;
      // Block ground and RTG running lanes
      ground.push(rect(bx - 6, by - 8, blockW + 12, blockH + laneH + 16, "#3d4349"));
      ground.push(line(bx - 6, by - 6, bx + blockW + 6, by - 6, "#c7b260", 1.4, 'opacity="0.55"'));
      ground.push(line(bx - 6, by + blockH + laneH + 6, bx + blockW + 6, by + blockH + laneH + 6, "#c7b260", 1.4, 'opacity="0.55"'));
      const emptyBlock = R.chance(0.05);
      for (let b = 0; b < bays; b++) {
        for (let r = 0; r < rowsPerBlock; r++) {
          const x = bx + b * (cw + 3);
          const y = by + r * chh;
          if (emptyBlock || R.chance(0.07)) continue;
          const h = R.int(1, 5);
          shadows.push(rect(x + h * SUN.dx, y + h * SUN.dy, cw, chh - 0.8, SHADOW, `opacity="${(0.25 + h * 0.06).toFixed(2)}"`));
          const color = shade(pickColor(R), (h - 3) * 0.035 + R.range(-0.05, 0.05));
          if (R.chance(0.18)) {
            tops.push(rect(x, y, cw / 2 - 1, chh - 0.8, color));
            tops.push(rect(x + cw / 2 + 0.5, y, cw / 2 - 0.5, chh - 0.8, shade(pickColor(R), R.range(-0.05, 0.05))));
          } else {
            tops.push(rect(x, y, cw, chh - 0.8, color));
            tops.push(line(x + cw / 2, y + 1, x + cw / 2, y + chh - 2, "#000000", 0.6, 'opacity="0.18"'));
          }
          tops.push(line(x, y + 0.4, x + cw, y + 0.4, "#ffffff", 0.6, 'opacity="0.14"'));
        }
      }
      // Truck lane traffic
      if (R.chance(0.5)) truck(bx + R.range(0, blockW - 60), by + blockH + 2, R.chance(0.6), R.chance(0.5));
      // RTG cranes spanning the block
      const rtgs = R.chance(0.55) ? 1 : 0;
      for (let k = 0; k < rtgs; k++) {
        const x = bx + R.range(20, blockW - 40);
        const top = by - 12;
        const bottom = by + blockH + laneH + 10;
        shadows.push(rect(x + 18, top + 22, 34, bottom - top, SHADOW, 'opacity="0.35"'));
        tops.push(rect(x, top, 5, bottom - top, "#b9b4a5"));
        tops.push(rect(x + 26, top, 5, bottom - top, "#b9b4a5"));
        tops.push(rect(x, top, 31, 5, "#a65f2f"));
        tops.push(rect(x, bottom - 5, 31, 5, "#a65f2f"));
        tops.push(rect(x + 6, top + R.range(10, blockH - 10), 20, 7, "#7d8288"));
      }
    }
    // High-mast lights at road ends
    for (let y = yardY0 + 120; y < yardY1; y += 380) {
      const mx = bx - crossRoad / 2;
      if (!visible(mx, y, 100)) continue;
      shadows.push(line(mx, y, mx + 70, y + 95, SHADOW, 3, 'opacity="0.35" stroke-linecap="round"'));
      tops.push(circle(mx, y, 5, "#d6d9db"));
      lights.push([mx, y, 1]);
    }
  }

  // ---- Back of terminal: rail sidings and sheds -------------------------------
  const railY = yardY1 + 60;
  ground.push(rect(X0, railY - 20, X1 - X0, 200, "#3a3631"));
  for (let t = 0; t < 7; t++) {
    const y = railY + t * 24;
    for (let x = X0; x < X1; x += 7) {
      if (x % 21 === 0) continue;
      ground.push(line(x, y - 4, x, y + 6, "#2a2622", 2));
    }
    ground.push(line(X0, y - 2, X1, y - 2, "#8b8f93", 1.2));
    ground.push(line(X0, y + 4, X1, y + 4, "#8b8f93", 1.2));
    if (t % 2 === 0) {
      let x = X0 + R.range(0, 400);
      while (x < X1) {
        if (R.chance(0.15)) {
          x += R.range(200, 600);
          continue;
        }
        const run = R.int(8, 26);
        for (let i = 0; i < run && x < X1; i++) {
          if (visible(x, y, 60)) {
            shadows.push(rect(x + 4, y - 3, 42, 9, SHADOW, 'opacity="0.4"'));
            objects.push(rect(x, y - 5, 44, 10, "#4a3f37"));
            if (R.chance(0.85)) tops.push(rect(x + 3, y - 5, 38, 9, pickColor(R)));
          }
          x += 47;
        }
        x += R.range(160, 500);
      }
    }
  }

  const shedY = railY + 220;
  for (let x = X0 + 60; x < X1; x += R.range(700, 900)) {
    const w = R.range(520, 680);
    const h = R.range(220, 300);
    if (!visible(x + w / 2, shedY + h / 2, 600)) continue;
    shadows.push(rect(x + 22, shedY + 30, w, h, SHADOW, 'opacity="0.5"'));
    objects.push(rect(x, shedY, w, h, "#8e959b"));
    for (let px = x; px < x + w; px += 14) {
      objects.push(line(px, shedY, px, shedY + h, "#7c8389", 1.2, 'opacity="0.7"'));
    }
    objects.push(line(x, shedY + h / 2, x + w, shedY + h / 2, "#a7adb2", 3));
    for (let k = 0; k < 6; k++) {
      objects.push(rect(x + 40 + k * ((w - 80) / 6), shedY + 24, 22, h / 2 - 40, "#b5bcc1", 'opacity="0.65"'));
    }
    // Loading docks with trucks
    for (let k = 0; k < 8; k++) {
      truck(x + 20 + k * ((w - 40) / 8), shedY + h + 18, R.chance(0.6), false);
    }
  }
  // Trees
  for (let i = 0; i < 260; i++) {
    const x = R.range(X0, X1);
    const y = R.range(shedY + 380, Y1);
    if (!visible(x, y, 60)) continue;
    const r = R.range(7, 16);
    shadows.push(circle(x + r * 0.6, y + r * 0.8, r, SHADOW, 'opacity="0.45"'));
    tops.push(circle(x, y, r, R.pick(["#28382c", "#2f4232", "#354a37"])));
  }

  const lightPoints = lights.map(([x, y, s]) => [...toScreen(x, y), s]);

  const body = `
    <rect width="${W}" height="${H}" fill="#0d1c27"/>
    <g transform="rotate(${angle} ${cx} ${cy})">
      ${ground.join("")}
      <g>${shadows.join("")}</g>
      ${objects.join("")}
      ${tops.join("")}
    </g>
    ${finishDefs(W, H, { grain: 0.06, vignette: 0.35 })}`;
  return { svg: svgDoc(W, H, body), lights: lightPoints };
}

/** Warm light pools for the night variant, composited with "screen". */
export function nightLights(W, H, points) {
  const pools = points
    .filter(([x, y]) => x > -200 && x < W + 200 && y > -200 && y < H + 200)
    .map(
      ([x, y, s]) =>
        `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(220 * s).toFixed(0)}" fill="url(#pool)"/>` +
        `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="#fff4dc"/>`,
    )
    .join("");
  return svgDoc(
    W,
    H,
    `<defs><radialGradient id="pool"><stop offset="0%" stop-color="#ffe7bf" stop-opacity="0.55"/><stop offset="45%" stop-color="#f3d4a0" stop-opacity="0.16"/><stop offset="100%" stop-color="#f3d4a0" stop-opacity="0"/></radialGradient></defs><rect width="${W}" height="${H}" fill="#000"/>${pools}`,
  );
}

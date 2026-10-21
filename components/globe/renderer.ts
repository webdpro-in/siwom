/*
 * Canvas 2D orthographic globe. Loaded lazily (with the land data) by Globe.tsx.
 * No WebGL or 3D library: about 2,400 visible dots and a few routes per frame.
 * Frames are drawn only while something moves (rotation, drag, route flow) and
 * the globe is on screen; otherwise it redraws on demand.
 */
import { LAND_DOTS } from "@/data/globe/land-dots";
import { places, type InternationalShipment, type LatLon, type Mode, type PlaceId } from "@/data/demo/international";
import { legPoints, shipmentFocus, shipmentPosition } from "./geo";

const RAD = Math.PI / 180;

type Theme = {
  sphere: string;
  sphereEdge: string;
  rim: string;
  land: string;
  route: string;
  routeMuted: string;
  active: string;
  markerFill: string;
};

type Projected = { x: number; y: number; z: number; visible: boolean };

type Route = {
  ref: string;
  legs: { mode: Mode; status: string; lat: Float64Array; lon: Float64Array; alt: Float64Array }[];
  position: LatLon;
  places: PlaceId[];
};

const DASH: Record<Mode, number[]> = { ocean: [], air: [6, 5], road: [1.5, 4], rail: [7, 3, 2, 3] };

export type GlobeOptions = {
  canvas: HTMLCanvasElement;
  host: HTMLElement;
  labels: HTMLElement;
  shipments: InternationalShipment[];
  selected: string;
  motion: boolean;
};

export type GlobeHandle = {
  select: (ref: string, focus?: boolean) => void;
  setMotion: (on: boolean) => void;
  rotateBy: (dLon: number, dLat: number) => void;
  refreshTheme: () => void;
  destroy: () => void;
};

export function createGlobe(opts: GlobeOptions): GlobeHandle {
  const { canvas, host, labels } = opts;
  const ctx = canvas.getContext("2d")!;
  let selected = opts.selected;
  let motion = opts.motion;
  let theme = readTheme(host);

  // View: centre longitude/latitude in degrees, eased towards a target.
  const firstFocus = shipmentFocus(opts.shipments.find((s) => s.ref === selected) ?? opts.shipments[0]);
  let lon0 = firstFocus[1];
  let lat0 = clampLat(firstFocus[0]);
  let target: { lon: number; lat: number } | null = null;
  let dragging = false;
  let phase = 0;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;
  let onScreen = true;
  let lastTime = 0;
  let lastDraw = 0;

  // Land dots, precomputed.
  const n = LAND_DOTS.length / 2;
  const dotLon = new Float64Array(n);
  const dotSin = new Float64Array(n);
  const dotCos = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const lat = (LAND_DOTS[i * 2] / 10) * RAD;
    dotLon[i] = (LAND_DOTS[i * 2 + 1] / 10) * RAD;
    dotSin[i] = Math.sin(lat);
    dotCos[i] = Math.cos(lat);
  }

  // Routes, densified once.
  const routes: Route[] = opts.shipments.map((s) => ({
    ref: s.ref,
    position: shipmentPosition(s),
    places: [...new Set(s.legs.flatMap((l) => [l.from, l.to]))],
    legs: s.legs.map((leg) => {
      const pts = legPoints(leg, 1);
      const lat = new Float64Array(pts.length);
      const lon = new Float64Array(pts.length);
      const alt = new Float64Array(pts.length);
      pts.forEach(([a, b], i) => {
        lat[i] = a * RAD;
        lon[i] = b * RAD;
        // Air legs arc above the surface.
        alt[i] = leg.mode === "air" ? 0.1 * Math.sin((Math.PI * i) / Math.max(1, pts.length - 1)) : 0;
      });
      return { mode: leg.mode, status: leg.status, lat, lon, alt };
    }),
  }));

  const p: Projected = { x: 0, y: 0, z: 0, visible: false };
  function project(sinLat: number, cosLat: number, lon: number, alt: number, R: number, cx: number, cy: number) {
    const sl0 = Math.sin(lat0 * RAD);
    const cl0 = Math.cos(lat0 * RAD);
    const dl = lon - lon0 * RAD;
    const cosDl = Math.cos(dl);
    const x = cosLat * Math.sin(dl);
    const y = cl0 * sinLat - sl0 * cosLat * cosDl;
    const z = sl0 * sinLat + cl0 * cosLat * cosDl;
    const k = 1 + alt;
    p.x = cx + R * x * k;
    p.y = cy - R * y * k;
    p.z = z;
    // A raised point stays visible past the limb until the sphere hides it.
    p.visible = z > 0 || (alt > 0 && (x * x + y * y) * k * k > 1);
    return p;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    draw();
  }

  function draw() {
    if (!width) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const R = Math.min(width, height) / 2 - 2;
    const cx = width / 2;
    const cy = height / 2;

    // Sphere with soft shading for depth.
    const g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    g.addColorStop(0, theme.sphere);
    g.addColorStop(0.7, theme.sphere);
    g.addColorStop(1, theme.sphereEdge);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = theme.rim;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Land dots, bucketed by depth so each bucket is one fill.
    const dot = Math.max(0.9, R * 0.0072);
    const buckets: number[][] = [[], [], [], []];
    for (let i = 0; i < n; i++) {
      const q = project(dotSin[i], dotCos[i], dotLon[i], 0, R, cx, cy);
      if (q.z <= 0.02) continue;
      buckets[Math.min(3, Math.floor(q.z * 4))].push(q.x, q.y);
    }
    ctx.fillStyle = theme.land;
    buckets.forEach((pts, b) => {
      ctx.globalAlpha = 0.18 + b * 0.2;
      const r = dot * (0.65 + b * 0.12);
      ctx.beginPath();
      for (let i = 0; i < pts.length; i += 2) {
        ctx.moveTo(pts[i] + r, pts[i + 1]);
        ctx.arc(pts[i], pts[i + 1], r, 0, Math.PI * 2);
      }
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Routes: others muted first, the selected shipment on top.
    const ordered = [...routes].sort((a, b) => Number(a.ref === selected) - Number(b.ref === selected));
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const route of ordered) {
      const isSel = route.ref === selected;
      for (const leg of route.legs) {
        ctx.setLineDash(DASH[leg.mode]);
        ctx.lineDashOffset = 0;
        if (isSel) {
          ctx.strokeStyle = leg.status === "upcoming" ? theme.routeMuted : theme.route;
          ctx.globalAlpha = leg.status === "upcoming" ? 0.9 : 1;
          ctx.lineWidth = leg.status === "current" ? 2.4 : 1.8;
        } else {
          ctx.strokeStyle = theme.routeMuted;
          ctx.globalAlpha = 0.35;
          ctx.lineWidth = 1.1;
        }
        strokeLeg(leg, R, cx, cy);
        // Moving gaps show the direction of travel on the selected shipment's current leg.
        if (isSel && leg.status === "current") {
          ctx.setLineDash([3, 13]);
          ctx.lineDashOffset = -phase;
          ctx.strokeStyle = theme.markerFill;
          ctx.lineWidth = 1.2;
          strokeLeg(leg, R, cx, cy);
        }
      }
    }
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // Port and airport markers.
    const sel = routes.find((r) => r.ref === selected);
    const selPlaces = new Set(sel?.places ?? []);
    for (const id of Object.keys(places) as PlaceId[]) {
      const place = places[id];
      if (place.kind === "city" && !selPlaces.has(id)) continue;
      const [la, lo] = place.at;
      const q = project(Math.sin(la * RAD), Math.cos(la * RAD), lo * RAD, 0, R, cx, cy);
      if (!q.visible) continue;
      const on = selPlaces.has(id);
      ctx.beginPath();
      ctx.arc(q.x, q.y, on ? 4 : 2.6, 0, Math.PI * 2);
      ctx.fillStyle = theme.markerFill;
      ctx.fill();
      ctx.lineWidth = on ? 2 : 1.2;
      ctx.strokeStyle = on ? theme.route : theme.routeMuted;
      ctx.globalAlpha = on ? 1 : 0.7;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Snapshot positions: a marked point for the selected shipment, small dots for the rest.
    for (const route of ordered) {
      const [la, lo] = route.position;
      const q = project(Math.sin(la * RAD), Math.cos(la * RAD), lo * RAD, 0, R, cx, cy);
      if (!q.visible) continue;
      const isSel = route.ref === selected;
      ctx.beginPath();
      ctx.arc(q.x, q.y, isSel ? 6 : 3, 0, Math.PI * 2);
      ctx.fillStyle = isSel ? theme.active : theme.routeMuted;
      ctx.globalAlpha = isSel ? 1 : 0.6;
      ctx.fill();
      if (isSel) {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = theme.markerFill;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Points labels should not cover: the selected route, its markers and its position.
    const obstacles: number[] = [];
    if (sel) {
      for (const leg of sel.legs) {
        for (let i = 0; i < leg.lat.length; i += 2) {
          const q = project(Math.sin(leg.lat[i]), Math.cos(leg.lat[i]), leg.lon[i], leg.alt[i], R, cx, cy);
          if (q.visible) obstacles.push(q.x, q.y);
        }
      }
      for (const id of sel.places) {
        const [la, lo] = places[id].at;
        const q = project(Math.sin(la * RAD), Math.cos(la * RAD), lo * RAD, 0, R, cx, cy);
        // Markers weigh more than route points.
        if (q.visible) for (let k = 0; k < 6; k++) obstacles.push(q.x, q.y);
      }
    }
    positionLabels(obstacles);
  }

  function strokeLeg(leg: Route["legs"][number], R: number, cx: number, cy: number) {
    ctx.beginPath();
    let pen = false;
    for (let i = 0; i < leg.lat.length; i++) {
      const q = project(Math.sin(leg.lat[i]), Math.cos(leg.lat[i]), leg.lon[i], leg.alt[i], R, cx, cy);
      if (!q.visible) {
        pen = false;
        continue;
      }
      if (pen) ctx.lineTo(q.x, q.y);
      else ctx.moveTo(q.x, q.y);
      pen = true;
    }
    ctx.stroke();
  }

  /**
   * Places each label beside its marker, trying both sides, above and below.
   * Positions that overlap a placed label are ruled out; of the rest, the one
   * covering the fewest route points and markers wins (ties keep the side
   * with more room). A label is hidden only when every position is ruled out.
   */
  function positionLabels(obstacles: number[]) {
    const R = Math.min(width, height) / 2 - 2;
    const cx = width / 2;
    const cy = height / 2;
    const placed: { x: number; y: number; w: number; h: number }[] = [];
    labels.querySelectorAll<HTMLElement>("[data-place]").forEach((el) => {
      const place = places[el.dataset.place as PlaceId];
      const [la, lo] = place.at;
      const q = project(Math.sin(la * RAD), Math.cos(la * RAD), lo * RAD, 0, R, cx, cy);
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const leftFirst = q.x > cx;
      const sideX = (left: boolean) => (left ? q.x - 12 - w : q.x + 12);
      const candidates = [
        [sideX(leftFirst), q.y - h / 2],
        [sideX(!leftFirst), q.y - h / 2],
        [q.x - w / 2, q.y - h - 10],
        [q.x - w / 2, q.y + 10],
        [sideX(leftFirst), q.y + 8],
        [sideX(!leftFirst), q.y + 8],
        [sideX(leftFirst), q.y - h - 8],
        [sideX(!leftFirst), q.y - h - 8],
      ].map(([x, y]) => [Math.max(0, Math.min(width - w, x)), Math.max(0, Math.min(height - h, y))]);
      let free: number[] | undefined;
      let best = Infinity;
      for (const [x, y] of candidates) {
        if (placed.some((r) => x < r.x + r.w && x + w > r.x && y < r.y + r.h && y + h > r.y)) continue;
        let covered = 0;
        for (let i = 0; i < obstacles.length; i += 2) {
          if (obstacles[i] > x - 4 && obstacles[i] < x + w + 4 && obstacles[i + 1] > y - 4 && obstacles[i + 1] < y + h + 4) covered++;
        }
        if (covered < best) {
          best = covered;
          free = [x, y];
        }
      }
      const [x, y] = free ?? candidates[0];
      const show = q.z > 0.25 && Boolean(free);
      if (show) placed.push({ x, y, w, h });
      el.style.opacity = show ? String(Math.min(1, (q.z - 0.25) * 4)) : "0";
      el.style.visibility = show ? "visible" : "hidden";
      el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    });
  }

  function tick(time: number) {
    frame = 0;
    const dt = lastTime ? Math.min(64, time - lastTime) : 16;
    lastTime = time;
    let moving = false;
    if (target) {
      const dLon = wrap(target.lon - lon0);
      const dLat = target.lat - lat0;
      const k = motion ? 1 - Math.pow(0.0025, dt / 1000) : 1;
      lon0 += dLon * k;
      lat0 += dLat * k;
      if (Math.abs(dLon) < 0.05 && Math.abs(dLat) < 0.05) target = null;
      else moving = true;
    }
    if (motion && !dragging) {
      phase = (phase + dt * 0.018) % 160;
    }
    // Rotation and dragging draw every frame; the route flow alone is capped near 30 fps.
    if (moving || dragging || time - lastDraw > 32) {
      draw();
      lastDraw = time;
    }
    if (motion && !dragging) moving = true;
    if ((moving || dragging) && onScreen && !document.hidden) frame = requestAnimationFrame(tick);
    else lastTime = 0;
  }

  function kick() {
    if (!frame && onScreen && !document.hidden) frame = requestAnimationFrame(tick);
  }

  // Dragging: horizontal rotates; vertical tilts (touch keeps vertical page scroll via CSS touch-action).
  let lastX = 0;
  let lastY = 0;
  function onDown(e: PointerEvent) {
    dragging = true;
    target = null;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    kick();
  }
  function onMove(e: PointerEvent) {
    if (!dragging) return;
    const scale = 180 / Math.max(200, width);
    lon0 = wrap(lon0 - (e.clientX - lastX) * scale);
    if (e.pointerType === "mouse") lat0 = clampLat(lat0 + (e.clientY - lastY) * scale);
    lastX = e.clientX;
    lastY = e.clientY;
    draw();
  }
  function onUp(e: PointerEvent) {
    dragging = false;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    kick();
  }
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) kick();
  });
  io.observe(canvas);
  const onVisibility = () => !document.hidden && kick();
  document.addEventListener("visibilitychange", onVisibility);

  resize();
  kick();

  return {
    select(ref, focus = true) {
      selected = ref;
      const s = opts.shipments.find((x) => x.ref === ref);
      if (s && focus) {
        const [lat, lon] = shipmentFocus(s);
        target = { lon, lat: clampLat(lat) };
      }
      draw();
      kick();
    },
    setMotion(on) {
      motion = on;
      draw();
      kick();
    },
    rotateBy(dLon, dLat) {
      target = { lon: wrap(lon0 + dLon), lat: clampLat(lat0 + dLat) };
      kick();
    },
    refreshTheme() {
      theme = readTheme(host);
      draw();
    },
    destroy() {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    },
  };
}

function wrap(deg: number) {
  return ((((deg + 180) % 360) + 360) % 360) - 180;
}

function clampLat(lat: number) {
  return Math.max(-35, Math.min(50, lat));
}

/** Colours come from the design tokens, so the globe follows the theme. */
function readTheme(el: HTMLElement): Theme {
  const css = getComputedStyle(el);
  const v = (name: string) => css.getPropertyValue(name).trim();
  return {
    sphere: v("--color-surface-1"),
    sphereEdge: v("--color-surface-3"),
    rim: v("--color-border-strong"),
    land: v("--color-text"),
    route: v("--color-accent-text"),
    routeMuted: v("--color-text-muted"),
    active: v("--color-accent-text"),
    markerFill: v("--color-surface-1"),
  };
}

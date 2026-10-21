import { places, type InternationalShipment, type LatLon, type Leg } from "@/data/demo/international";

const RAD = Math.PI / 180;

type Vec = [number, number, number];

export function toVec([lat, lon]: LatLon): Vec {
  const p = lat * RAD;
  const l = lon * RAD;
  return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)];
}

export function toLatLon([x, y, z]: Vec): LatLon {
  return [Math.atan2(z, Math.hypot(x, y)) / RAD, Math.atan2(y, x) / RAD];
}

/** Points along the great circle from a to b, roughly every `stepDeg` degrees. */
function slerp(a: LatLon, b: LatLon, stepDeg: number): LatLon[] {
  const va = toVec(a);
  const vb = toVec(b);
  const dot = Math.min(1, Math.max(-1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]));
  const omega = Math.acos(dot);
  const n = Math.max(1, Math.ceil(omega / RAD / stepDeg));
  if (omega < 1e-6) return [a, b];
  const out: LatLon[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const s1 = Math.sin((1 - t) * omega) / Math.sin(omega);
    const s2 = Math.sin(t * omega) / Math.sin(omega);
    out.push(toLatLon([s1 * va[0] + s2 * vb[0], s1 * va[1] + s2 * vb[1], s1 * va[2] + s2 * vb[2]]));
  }
  return out;
}

/** A leg's route as a dense list of points, following its waypoints along great circles. */
export function legPoints(leg: Leg, stepDeg = 1): LatLon[] {
  const waypoints = leg.path ?? [places[leg.from].at, places[leg.to].at];
  const out: LatLon[] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const seg = slerp(waypoints[i], waypoints[i + 1], stepDeg);
    out.push(...(i === 0 ? seg : seg.slice(1)));
  }
  return out;
}

function angle(a: Vec, b: Vec) {
  return Math.acos(Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
}

/** The point a fraction `f` of the way from a to b along the great circle. */
function between(a: Vec, b: Vec, f: number): LatLon {
  const omega = angle(a, b);
  if (omega < 1e-9) return toLatLon(a);
  const s1 = Math.sin((1 - f) * omega) / Math.sin(omega);
  const s2 = Math.sin(f * omega) / Math.sin(omega);
  return toLatLon([s1 * a[0] + s2 * b[0], s1 * a[1] + s2 * b[1], s1 * a[2] + s2 * b[2]]);
}

/** The point `t` (0–1) of the way along a polyline, by arc length. */
export function pointAlong(points: LatLon[], t: number): LatLon {
  if (points.length < 2 || t <= 0) return points[0];
  const vecs = points.map(toVec);
  const lengths = vecs.slice(1).map((v, i) => angle(vecs[i], v));
  const total = lengths.reduce((a, b) => a + b, 0);
  let target = Math.min(1, t) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (target <= lengths[i]) return between(vecs[i], vecs[i + 1], lengths[i] ? target / lengths[i] : 0);
    target -= lengths[i];
  }
  return points[points.length - 1];
}

/** Where the snapshot puts a shipment: along its current leg, or at the start of the first upcoming one. */
export function shipmentPosition(s: InternationalShipment): LatLon {
  const current = s.legs.find((l) => l.status === "current");
  if (current) return pointAlong(legPoints(current), current.progress ?? 0);
  const next = s.legs.find((l) => l.status === "upcoming");
  if (next) return places[next.from].at;
  return places[s.destination].at;
}

/** A view centre that frames the whole shipment: the mean of its route, or its position for very long routes. */
export function shipmentFocus(s: InternationalShipment): LatLon {
  const pts = s.legs.flatMap((l) => legPoints(l, 3)).map(toVec);
  const sum: Vec = [0, 0, 0];
  for (const v of pts) {
    sum[0] += v[0];
    sum[1] += v[1];
    sum[2] += v[2];
  }
  const norm = Math.hypot(...sum) / pts.length;
  if (norm < 0.6) return shipmentPosition(s);
  return toLatLon(sum);
}

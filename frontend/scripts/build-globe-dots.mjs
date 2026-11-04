#!/usr/bin/env node
// One-off: samples an even dot grid (Fibonacci sphere) over the land polygons
// of a Natural Earth GeoJSON and writes public/geo/land-dots.bin, Int16 pairs of
// lat/lng * 100, for MaCoGlobe. Re-run only if the density below changes:
//   node scripts/build-globe-dots.mjs <countries.geojson>
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SAMPLES = 34000;
const source = process.argv[2];
if (!source) throw new Error("Pass the countries GeoJSON path");

const features = JSON.parse(readFileSync(source, "utf8")).features;
const polygons = features.flatMap((f) =>
  f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates,
);

const boxes = polygons.map((rings) => {
  const xs = rings[0].map((p) => p[0]);
  const ys = rings[0].map((p) => p[1]);
  return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
});

const inRing = (ring, x, y) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

const onLand = (lng, lat) =>
  polygons.some((rings, p) => {
    const [x0, x1, y0, y1] = boxes[p];
    if (lng < x0 || lng > x1 || lat < y0 || lat > y1) return false;
    return inRing(rings[0], lng, lat) && !rings.slice(1).some((hole) => inRing(hole, lng, lat));
  });

const golden = Math.PI * (3 - Math.sqrt(5));
const out = [];
for (let i = 0; i < SAMPLES; i++) {
  const y = 1 - (2 * (i + 0.5)) / SAMPLES;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lng = ((((golden * i * 180) / Math.PI) % 360) + 360) % 360;
  const wrapped = lng > 180 ? lng - 360 : lng;
  if (onLand(wrapped, lat)) out.push(Math.round(lat * 100), Math.round(wrapped * 100));
}

const target = fileURLToPath(new URL("../public/geo/land-dots.bin", import.meta.url));
writeFileSync(target, Buffer.from(new Int16Array(out).buffer));
console.log(`land-dots.bin: ${out.length / 2} dots, ${out.length * 2} bytes`);

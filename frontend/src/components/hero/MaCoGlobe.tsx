import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { MeshPhongMaterial } from "three";

const COUNTRIES_GEO_URL = "/geo/countries-110m.geojson";

type Theme = "obsidian" | "cobalt";

type CountryFeature = {
  type: "Feature";
  properties: { ISO_A2?: string; NAME?: string };
  geometry: object;
};

type NetworkNode = { lat: number; lng: number; id: number };

type NetworkArc = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  id: number;
  dashTime: number;
};

/** Conceptual network nodes — visual only, not office/customer claims. */
const NODES: NetworkNode[] = [
  { lat: 10.8231, lng: 76.2711, id: 0 }, // South Asia
  { lat: 25.3176, lng: 51.1887, id: 1 }, // Middle East
  { lat: 35.6895, lng: 139.6917, id: 2 }, // East Asia
  { lat: 51.5074, lng: -0.1278, id: 3 }, // Europe
  { lat: 37.7749, lng: -122.4194, id: 4 }, // US West
  { lat: 31.2304, lng: 121.4737, id: 5 }, // China coast
  { lat: -33.8688, lng: 151.2093, id: 6 }, // Oceania
  { lat: -23.5505, lng: -46.6333, id: 7 }, // South America
  { lat: 6.5244, lng: 3.3792, id: 8 }, // West Africa
  { lat: 1.3521, lng: 103.8198, id: 9 }, // Southeast Asia
  { lat: 52.52, lng: 13.405, id: 10 }, // Central Europe
  { lat: 43.6532, lng: -79.3832, id: 11 }, // North America east
];

/** Cross-regional links — pairs of node indices. */
const ARC_PAIRS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 9],
  [1, 3],
  [1, 8],
  [1, 10],
  [2, 5],
  [2, 9],
  [2, 4],
  [3, 10],
  [3, 11],
  [4, 11],
  [4, 7],
  [5, 9],
  [6, 9],
  [6, 2],
  [7, 3],
  [8, 1],
  [10, 3],
  [11, 4],
];

function buildArcs(nodes: NetworkNode[]): NetworkArc[] {
  return ARC_PAIRS.map(([a, b], i) => {
    const from = nodes[a];
    const to = nodes[b];
    if (!from || !to) {
      return {
        startLat: 0,
        startLng: 0,
        endLat: 0,
        endLng: 0,
        id: i,
        dashTime: 2000,
      };
    }
    return {
      startLat: from.lat,
      startLng: from.lng,
      endLat: to.lat,
      endLng: to.lng,
      id: i,
      dashTime: 1600 + (i % 5) * 380 + Math.floor(i / 5) * 120,
    };
  });
}

const ARCS = buildArcs(NODES);

function themeTokens(theme: Theme) {
  if (theme === "cobalt") {
    return {
      globeColor: 0xe4ecf8,
      emissive: 0xc8daf0,
      emissiveIntensity: 0.08,
      landCap: "rgba(60, 110, 200, 0.28)",
      landSide: "rgba(40, 85, 170, 0.38)",
      landStroke: "rgba(50, 100, 190, 0.22)",
      point: "rgba(40, 90, 190, 0.78)",
      arc: ["rgba(50, 100, 190, 0.14)", "rgba(60, 120, 210, 0.62)"] as [string, string],
      arcStroke: 0.58,
      pointRadius: 0.3,
      atmosphere: "rgba(70, 120, 210, 0.14)",
      atmosphereAlt: 0.12,
      autoRotateSpeed: 0.35,
    };
  }
  return {
    globeColor: 0xededf0,
    emissive: 0xd8d8dc,
    emissiveIntensity: 0.06,
    landCap: "rgba(40, 40, 48, 0.22)",
    landSide: "rgba(30, 30, 36, 0.32)",
    landStroke: "rgba(20, 20, 24, 0.14)",
    point: "rgba(20, 20, 24, 0.72)",
    arc: ["rgba(20, 20, 24, 0.1)", "rgba(40, 40, 48, 0.48)"] as [string, string],
    arcStroke: 0.5,
    pointRadius: 0.26,
    atmosphere: "rgba(40, 40, 48, 0.08)",
    atmosphereAlt: 0.08,
    autoRotateSpeed: 0.18,
  };
}

/**
 * MaCo Globe — abstract global network visualization.
 * Light-canvas or section context; dark/gray globe (Obsidian) or blue globe (Cobalt).
 */
export function MaCoGlobe({
  className = "",
  theme = "obsidian",
  reducedMotion = false,
  scrollProgress = 0,
  variant = "hero",
}: {
  className?: string;
  theme?: Theme;
  reducedMotion?: boolean;
  scrollProgress?: number;
  variant?: "hero" | "section";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const [dims, setDims] = useState({ width: 320, height: 320 });
  const [countries, setCountries] = useState<CountryFeature[]>([]);

  const tokens = useMemo(() => themeTokens(theme), [theme]);
  const globeMaterial = useMemo(
    () =>
      new MeshPhongMaterial({
        color: tokens.globeColor,
        emissive: tokens.emissive,
        emissiveIntensity: tokens.emissiveIntensity,
        shininess: 8,
      }),
    [tokens],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(COUNTRIES_GEO_URL)
      .then((res) => res.json())
      .then((data: { features: CountryFeature[] }) => {
        if (cancelled) return;
        setCountries(data.features.filter((f) => f.properties.ISO_A2 !== "AQ"));
      })
      .catch(() => {
        /* countries optional — globe still renders */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      const size = Math.max(180, Math.min(width, height));
      setDims({ width: size, height: size });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const configureGlobe = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const controls = globe.controls();
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = tokens.autoRotateSpeed;

    globe.pointOfView({ lat: 18, lng: 68, altitude: 2.1 }, 0);

    const renderer = globe.renderer();
    renderer.setClearColor(0x000000, 0);
  }, [reducedMotion, tokens.autoRotateSpeed]);

  useEffect(() => {
    configureGlobe();
  }, [configureGlobe, theme, reducedMotion]);

  const scale = variant === "section" ? 1 : 1 - scrollProgress * 0.06;
  const driftY = variant === "section" ? 0 : scrollProgress * -12;
  const shellClass =
    variant === "section" ? "maco-globe-shell maco-globe-shell--section" : "maco-globe-shell";

  if (!mounted) {
    return (
      <div
        ref={containerRef}
        className={`${shellClass} ${className}`}
        aria-hidden="true"
        style={{ minHeight: variant === "section" ? "12rem" : "14rem" }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${shellClass} ${className}`}
      aria-hidden="true"
      style={{
        transform: reducedMotion ? undefined : `translate3d(0, ${driftY}px, 0) scale(${scale})`,
      }}
    >
      <Globe
        ref={globeRef}
        width={dims.width}
        height={dims.height}
        backgroundColor="rgba(0,0,0,0)"
        globeMaterial={globeMaterial}
        showGlobe
        showGraticules={false}
        showAtmosphere
        atmosphereColor={tokens.atmosphere}
        atmosphereAltitude={tokens.atmosphereAlt}
        globeOffset={[0, dims.height * 0.04]}
        polygonsData={countries}
        polygonGeoJsonGeometry={(d: object) => (d as CountryFeature).geometry}
        polygonCapColor={() => tokens.landCap}
        polygonSideColor={() => tokens.landSide}
        polygonStrokeColor={() => tokens.landStroke}
        polygonAltitude={0.004}
        polygonsTransitionDuration={300}
        pointsData={NODES}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => tokens.point}
        pointAltitude={0.014}
        pointRadius={tokens.pointRadius}
        pointsMerge={false}
        arcsData={ARCS}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor={() => tokens.arc}
        arcAltitude={0.28}
        arcStroke={tokens.arcStroke}
        arcDashLength={0.55}
        arcDashGap={0.12}
        arcDashAnimateTime={reducedMotion ? 0 : (d: object) => (d as NetworkArc).dashTime}
        ringsData={reducedMotion ? [] : NODES.slice(0, 6)}
        ringLat="lat"
        ringLng="lng"
        ringColor={() =>
          theme === "cobalt" ? "rgba(50, 100, 190, 0.16)" : "rgba(20, 20, 24, 0.1)"
        }
        ringMaxRadius={2.8}
        ringPropagationSpeed={1.2}
        ringRepeatPeriod={2400}
        enablePointerInteraction={!reducedMotion}
        onGlobeReady={configureGlobe}
      />
    </div>
  );
}

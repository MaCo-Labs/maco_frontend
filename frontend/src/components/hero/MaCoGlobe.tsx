import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { MeshPhongMaterial } from "three";

const COUNTRIES_GEO_URL = "/geo/countries-110m.geojson";

type Theme = "obsidian" | "cobalt";

type CountryFeature = {
  type: "Feature";
  properties: { ISO_A2?: string; NAME?: string };
  geometry: { type: string; coordinates: unknown };
};

/** `primary` nodes are real MaCo operational hubs (labelled, brighter,
 *  larger); the rest stay unlabelled ambient network points. */
type NetworkNode = { lat: number; lng: number; id: number; primary?: boolean; label?: string };

type NetworkArc = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  id: number;
  dashTime: number;
};

/** 0-4 are MaCo's real operational hubs — labelled, primary. 5+ are
 *  ambient network points (visual only, not office/customer claims). */
const NODES: NetworkNode[] = [
  { lat: 9.9312, lng: 76.2673, id: 0, primary: true, label: "Kochi" },
  { lat: 12.9716, lng: 77.5946, id: 1, primary: true, label: "Bangalore" },
  { lat: 13.0827, lng: 80.2707, id: 2, primary: true, label: "Chennai" },
  { lat: 25.3176, lng: 51.1887, id: 3, primary: true, label: "Qatar" },
  { lat: 25.2048, lng: 55.2708, id: 4, primary: true, label: "Dubai" },
  { lat: 35.6895, lng: 139.6917, id: 5 }, // East Asia
  { lat: 51.5074, lng: -0.1278, id: 6 }, // Europe
  { lat: 37.7749, lng: -122.4194, id: 7 }, // US West
  { lat: 31.2304, lng: 121.4737, id: 8 }, // China coast
  { lat: -33.8688, lng: 151.2093, id: 9 }, // Oceania
  { lat: -23.5505, lng: -46.6333, id: 10 }, // South America
  { lat: 6.5244, lng: 3.3792, id: 11 }, // West Africa
  { lat: 1.3521, lng: 103.8198, id: 12 }, // Southeast Asia
  { lat: 52.52, lng: 13.405, id: 13 }, // Central Europe
  { lat: 43.6532, lng: -79.3832, id: 14 }, // North America east
];

/** Module-scope, not recomputed per render — passed straight to
 *  `labelsData`/`ringsData` so those layers keep a stable array identity
 *  and three-globe doesn't rebuild them on every parent re-render. */
const PRIMARY_NODES = NODES.filter((n) => n.primary);
/** Stable empty-array identity for the reduced-motion `ringsData` branch —
 *  `[]` inline would mint a new identity every render. */
const EMPTY_RINGS: NetworkNode[] = [];

/** Cross-regional links — pairs of node indices (0-4 are the real hubs;
 *  the first five pairs below connect them to each other). */
const ARC_PAIRS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [3, 4],
  [0, 6],
  [0, 7],
  [0, 12],
  [3, 8],
  [3, 11],
  [3, 13],
  [1, 8],
  [1, 12],
  [1, 7],
  [4, 13],
  [4, 14],
  [7, 14],
  [7, 10],
  [8, 12],
  [9, 12],
  [9, 8],
  [10, 6],
  [13, 6],
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
      pointDim: "rgba(40, 90, 190, 0.32)",
      label: "rgba(40, 90, 190, 0.92)",
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
    pointDim: "rgba(20, 20, 24, 0.28)",
    label: "rgba(20, 20, 24, 0.88)",
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
 *
 * Hover (or tap, via `onPointClick`) a hub to highlight it, stop
 * auto-rotation, and surface its name via three-globe's built-in
 * `pointLabel` tooltip. The internal render loop pauses via
 * `pauseAnimation()`/`resumeAnimation()` when scrolled off-screen or the
 * tab is hidden, and the renderer + material are fully disposed on
 * unmount and on every theme change — see the effects below.
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
  const [hoveredId, setHoveredId] = useState<number | null>(null);

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
  // Real three.js resource — every theme flip allocates a new one via the
  // useMemo above, so the previous instance must be disposed or it leaks
  // GPU buffers. Effect cleanup fires both on the next `tokens` change
  // (before the new material mounts) and on unmount.
  useEffect(() => {
    return () => globeMaterial.dispose();
  }, [globeMaterial]);

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
    controls.autoRotate = !reducedMotion && hoveredId === null;
    controls.autoRotateSpeed = tokens.autoRotateSpeed;

    globe.pointOfView({ lat: 18, lng: 68, altitude: 2.1 }, 0);

    const renderer = globe.renderer();
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  }, [reducedMotion, hoveredId, tokens.autoRotateSpeed]);

  useEffect(() => {
    configureGlobe();
  }, [configureGlobe, theme, reducedMotion]);

  // Pause the internal rAF loop (react-globe.gl / three.js keeps rendering
  // on its own, independent of the shared gsap.ticker) whenever the globe
  // scrolls off-screen or the tab is hidden — matches the discipline
  // morph-slider.tsx already applies to its own WebGL surface.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || reducedMotion) return;

    const setPaused = (paused: boolean) => {
      const globe = globeRef.current;
      if (!globe) return;
      if (paused) globe.pauseAnimation();
      else globe.resumeAnimation();
    };

    const io = new IntersectionObserver(([entry]) => setPaused(!entry?.isIntersecting), {
      rootMargin: "200px 0px",
    });
    io.observe(el);

    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion]);

  // Full GL teardown on unmount — dispose the renderer's own resources and
  // force the WebGL context to release, so navigating away from /about
  // doesn't leave a live context and rAF loop behind. Captured at effect
  // setup (after `<Globe ref={globeRef}>` has already committed), not
  // re-read in cleanup, so the lint rule can't warn about a stale ref.
  useEffect(() => {
    const globe = globeRef.current;
    return () => {
      if (!globe) return;
      globe.pauseAnimation();
      const renderer = globe.renderer();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

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
        polygonCapColor={() => tokens.landCap}
        polygonSideColor={() => tokens.landSide}
        polygonStrokeColor={() => tokens.landStroke}
        polygonAltitude={0.004}
        polygonsTransitionDuration={300}
        pointsData={NODES}
        pointLat="lat"
        pointLng="lng"
        pointColor={(d: object) => {
          const n = d as NetworkNode;
          if (n.id === hoveredId) return tokens.label;
          return n.primary ? tokens.point : tokens.pointDim;
        }}
        pointAltitude={0.014}
        pointRadius={(d: object) => {
          const n = d as NetworkNode;
          const base = n.primary ? tokens.pointRadius * 1.6 : tokens.pointRadius * 0.7;
          return n.id === hoveredId ? base * 1.5 : base;
        }}
        pointsMerge={false}
        pointLabel={(d: object) => (d as NetworkNode).label ?? ""}
        onPointHover={(d) => setHoveredId(d ? (d as NetworkNode).id : null)}
        onPointClick={(d) =>
          setHoveredId((prev) => (prev === (d as NetworkNode).id ? null : (d as NetworkNode).id))
        }
        labelsData={PRIMARY_NODES}
        labelLat="lat"
        labelLng="lng"
        labelText="label"
        labelSize={1.1}
        labelColor={() => tokens.label}
        labelDotRadius={0}
        labelAltitude={0.02}
        labelResolution={2}
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
        ringsData={reducedMotion ? EMPTY_RINGS : PRIMARY_NODES}
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

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useTheme } from "@/components/theme";
import { lerp } from "@/lib/motion";

type BlindsConfig = {
  gradientColors: readonly [string, string, string, string];
  angle: number;
  noise: number;
  blindCount: number;
  blindMinWidth: number;
  spotlightRadius: number;
  spotlightSoftness: number;
  spotlightOpacity: number;
  mouseDampening: number;
  distortAmount: number;
  mixBlendMode: string;
};

const COBALT: BlindsConfig = {
  gradientColors: ["#000B29", "#001D6E", "#1D4ED8", "#3B82F6"],
  angle: 15,
  noise: 0.15,
  blindCount: 14,
  blindMinWidth: 60,
  spotlightRadius: 0.65,
  spotlightSoftness: 1.2,
  spotlightOpacity: 0.85,
  mouseDampening: 0.12,
  distortAmount: 0.04,
  mixBlendMode: "lighten",
};

const OBSIDIAN: BlindsConfig = {
  gradientColors: ["#030712", "#0F172A", "#1E293B", "#38BDF8"],
  angle: 15,
  noise: 0.2,
  blindCount: 16,
  blindMinWidth: 60,
  spotlightRadius: 0.55,
  spotlightSoftness: 1.0,
  spotlightOpacity: 0.65,
  mouseDampening: 0.15,
  distortAmount: 0.02,
  mixBlendMode: "lighten",
};

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform vec3 uColor0;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uAngle;
  uniform float uNoise;
  uniform float uBlindCount;
  uniform float uSpotlightRadius;
  uniform float uSpotlightSoftness;
  uniform float uSpotlightOpacity;
  uniform float uDistortAmount;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    return vec2(v.x * c - v.y * s, v.x * s + v.y * c);
  }

  vec3 gradient(float t) {
    t = clamp(t, 0.0, 1.0);
    if (t < 0.3333) return mix(uColor0, uColor1, t / 0.3333);
    if (t < 0.6667) return mix(uColor1, uColor2, (t - 0.3333) / 0.3333);
    return mix(uColor2, uColor3, (t - 0.6667) / 0.3333);
  }

  void main() {
    float aspect = uResolution.x / uResolution.y;
    vec2 uv = vUv - 0.5;
    uv.x *= aspect;

    vec2 mouseUv = uMouse - 0.5;
    mouseUv.x *= aspect;

    float distToMouse = length(uv - mouseUv);
    uv += normalize(uv - mouseUv + 0.0001) * uDistortAmount * exp(-distToMouse * 3.0);

    vec2 ruv = rotate(uv, uAngle);

    float t = clamp(ruv.x / 1.4 + 0.5, 0.0, 1.0);
    vec3 color = gradient(t);

    float stripePos = fract(ruv.x * uBlindCount);
    float slat = smoothstep(0.0, 0.15, stripePos) * smoothstep(1.0, 0.85, stripePos);
    color *= mix(0.72, 1.05, slat);

    float sweep = fract(ruv.x - uTime * 0.05);
    float shine = smoothstep(0.15, 0.0, abs(sweep - 0.5)) * 0.25;
    color += shine;

    float n = (hash(vUv * uResolution.xy + uTime) - 0.5) * uNoise;
    color += n;

    float d = length(uv - mouseUv);
    float spot = smoothstep(uSpotlightRadius, uSpotlightRadius - (0.4 / uSpotlightSoftness), d);
    color += spot * uSpotlightOpacity * 0.6;

    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Reimplemented from scratch on `three` (already a dependency, used
 * elsewhere by MaCoGlobe) rather than importing React Bits' GradientBlinds
 * verbatim on a second WebGL runtime (`ogl`) — same house precedent as
 * `<SplitReveal>` and `evidence-expand.tsx`'s ScrollExpand: reimplement the
 * concept on the runtime already in the tree, never copy React Bits code.
 *
 * Client-only, mounted via a dynamic `import("three")` inside the effect
 * so it never renders a `<canvas>` in the SSR HTML — same guarantee the
 * previous (reverted) WebGL hero verified. Mouse position is read via
 * `getComputedStyle` off `--px`/`--py` — set once by `open-logo.tsx`'s
 * own `usePointerField` on the whole `<section>` (an ancestor of this
 * div) and inherited down, rather than a second competing listener here
 * — and smoothed toward the target using each theme's `mouseDampening`.
 * Colors are re-read from `configRef` every frame, so a theme switch
 * updates the shader live with no WebGL restart — the radial wipe
 * (`theme.tsx`) already sells the transition visually.
 */
export function BlindsField() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { theme } = useTheme();
  const configRef = useRef<BlindsConfig>(theme === "cobalt" ? COBALT : OBSIDIAN);

  useEffect(() => {
    configRef.current = theme === "cobalt" ? COBALT : OBSIDIAN;
  }, [theme]);

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    let cancelled = false;
    let raf = 0;
    let dispose: (() => void) | undefined;

    import("three").then((THREE) => {
      if (cancelled || !wrap) return;

      const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.domElement.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;display:block;";
      wrap.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const geometry = new THREE.PlaneGeometry(2, 2);

      const c = configRef.current;
      const uniforms = {
        uResolution: { value: new THREE.Vector2(1, 1) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 },
        uColor0: { value: new THREE.Color(c.gradientColors[0]) },
        uColor1: { value: new THREE.Color(c.gradientColors[1]) },
        uColor2: { value: new THREE.Color(c.gradientColors[2]) },
        uColor3: { value: new THREE.Color(c.gradientColors[3]) },
        uAngle: { value: (c.angle * Math.PI) / 180 },
        uNoise: { value: c.noise },
        uBlindCount: { value: c.blindCount },
        uSpotlightRadius: { value: c.spotlightRadius },
        uSpotlightSoftness: { value: c.spotlightSoftness },
        uSpotlightOpacity: { value: c.spotlightOpacity },
        uDistortAmount: { value: c.distortAmount },
      };

      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        uniforms,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      let widthPx = 1;

      const applySize = () => {
        const rect = wrap.getBoundingClientRect();
        widthPx = Math.max(1, rect.width);
        renderer.setSize(rect.width, rect.height, false);
        uniforms.uResolution.value.set(rect.width, rect.height);
      };
      applySize();

      const ro = new ResizeObserver(applySize);
      ro.observe(wrap);

      let smoothedX = 0.5;
      let smoothedY = 0.5;

      const tick = (t: number) => {
        const cfg = configRef.current;
        const cs = getComputedStyle(wrap);
        const px = parseFloat(cs.getPropertyValue("--px")) || 0.5;
        const py = parseFloat(cs.getPropertyValue("--py")) || 0.5;
        const follow = 1 - cfg.mouseDampening;
        smoothedX = lerp(smoothedX, px, follow);
        smoothedY = lerp(smoothedY, py, follow);
        uniforms.uMouse.value.set(smoothedX, 1 - smoothedY);
        uniforms.uTime.value = t * 0.001;
        uniforms.uColor0.value.set(cfg.gradientColors[0]);
        uniforms.uColor1.value.set(cfg.gradientColors[1]);
        uniforms.uColor2.value.set(cfg.gradientColors[2]);
        uniforms.uColor3.value.set(cfg.gradientColors[3]);
        uniforms.uAngle.value = (cfg.angle * Math.PI) / 180;
        uniforms.uNoise.value = cfg.noise;
        uniforms.uBlindCount.value = Math.max(
          1,
          Math.min(cfg.blindCount, widthPx / cfg.blindMinWidth),
        );
        uniforms.uSpotlightRadius.value = cfg.spotlightRadius;
        uniforms.uSpotlightSoftness.value = cfg.spotlightSoftness;
        uniforms.uSpotlightOpacity.value = cfg.spotlightOpacity;
        uniforms.uDistortAmount.value = cfg.distortAmount;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      dispose = () => {
        ro.disconnect();
        cancelAnimationFrame(raf);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === wrap) wrap.removeChild(renderer.domElement);
      };
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      dispose?.();
    };
  }, [reduced]);

  if (reduced) {
    const c = configRef.current;
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(${c.angle + 90}deg, ${c.gradientColors.join(", ")})`,
        }}
      />
    );
  }

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="absolute inset-0"
      style={{ mixBlendMode: configRef.current.mixBlendMode as never }}
    />
  );
}

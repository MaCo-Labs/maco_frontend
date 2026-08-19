import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useTheme } from "@/components/theme";
import { lerp } from "@/lib/motion";

type PrismConfig = {
  fallbackColors: readonly [string, string, string];
};

// Both themes share one shader look for now (hueShift 0, same glow/noise) —
// deliberately not guessing at "the right" per-theme hue-rotation radians
// without visual tuning. Only the reduced-motion CSS fallback gradient
// varies per theme, since that one just needs to read as "on-brand", not
// match the shader's exact output.
const COBALT: PrismConfig = {
  fallbackColors: ["#000B29", "#1D4ED8", "#38BDF8"],
};

const OBSIDIAN: PrismConfig = {
  fallbackColors: ["#030712", "#1E293B", "#38BDF8"],
};

const VERTEX = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Raymarched octahedron/pyramid SDF, ported verbatim from the reference
// Prism shader (React Bits, ogl-based) — the GLSL itself is runtime-agnostic,
// only the JS host below changes from ogl to three.js.
const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform vec2  iResolution;
  uniform float iTime;

  uniform float uHeight;
  uniform float uBaseHalf;
  uniform mat3  uRot;
  uniform int   uUseBaseWobble;
  uniform float uGlow;
  uniform vec2  uOffsetPx;
  uniform float uNoise;
  uniform float uSaturation;
  uniform float uHueShift;
  uniform float uColorFreq;
  uniform float uBloom;
  uniform float uCenterShift;
  uniform float uInvBaseHalf;
  uniform float uInvHeight;
  uniform float uMinAxis;
  uniform float uPxScale;
  uniform float uTimeScale;

  vec4 tanh4(vec4 x){
    vec4 e2x = exp(2.0*x);
    return (e2x - 1.0) / (e2x + 1.0);
  }

  float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float sdOctaAnisoInv(vec3 p){
    vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
    float m = q.x + q.y + q.z - 1.0;
    return m * uMinAxis * 0.5773502691896258;
  }

  float sdPyramidUpInv(vec3 p){
    float oct = sdOctaAnisoInv(p);
    float halfSpace = -p.y;
    return max(oct, halfSpace);
  }

  mat3 hueRotation(float a){
    float c = cos(a), s = sin(a);
    mat3 W = mat3(
      0.299, 0.587, 0.114,
      0.299, 0.587, 0.114,
      0.299, 0.587, 0.114
    );
    mat3 U = mat3(
       0.701, -0.587, -0.114,
      -0.299,  0.413, -0.114,
      -0.300, -0.588,  0.886
    );
    mat3 V = mat3(
       0.168, -0.331,  0.500,
       0.328,  0.035, -0.500,
      -0.497,  0.296,  0.201
    );
    return W + U * c + V * s;
  }

  void main(){
    vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;

    float z = 5.0;
    float d = 0.0;

    vec3 p;
    vec4 o = vec4(0.0);

    float centerShift = uCenterShift;
    float cf = uColorFreq;

    mat2 wob = mat2(1.0);
    if (uUseBaseWobble == 1) {
      float t = iTime * uTimeScale;
      float c0 = cos(t + 0.0);
      float c1 = cos(t + 33.0);
      float c2 = cos(t + 11.0);
      wob = mat2(c0, c1, c2, c0);
    }

    const int STEPS = 100;
    for (int i = 0; i < STEPS; i++) {
      p = vec3(f, z);
      p.xz = p.xz * wob;
      p = uRot * p;
      vec3 q = p;
      q.y += centerShift;
      d = 0.1 + 0.2 * abs(sdPyramidUpInv(q));
      z -= d;
      o += (sin((p.y + z) * cf + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
    }

    o = tanh4(o * o * uGlow * uBloom / 1e5);

    vec3 col = o.rgb;
    float n = rand(gl_FragCoord.xy + vec2(iTime));
    col += (n - 0.5) * uNoise;
    col = clamp(col, 0.0, 1.0);

    float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
    col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);

    if (abs(uHueShift) > 0.0001) {
      col = clamp(hueRotation(uHueShift) * col, 0.0, 1.0);
    }

    gl_FragColor = vec4(col, o.a);
  }
`;

/**
 * OPEN's WebGL background — the "Prism" effect (React Bits reference,
 * `ogl`-based) reimplemented on `three` rather than pulled in verbatim on a
 * second WebGL runtime. Same house precedent `blinds-field.tsx` documents
 * (which this file replaces as OPEN's background) and the same shape:
 * client-only dynamic `import("three")`, orthographic camera + a
 * screen-filling `PlaneGeometry(2, 2)`, `--px`/`--py` read via
 * `getComputedStyle` off the ancestor `<section>`'s own `usePointerField`
 * (open-logo.tsx) rather than a second competing pointer listener, and a
 * static CSS gradient with zero WebGL under reduced motion.
 *
 * Only the reference's "hover" animation mode is ported — "rotate" and
 * "3drotate" are autonomous (no pointer input), and the brief specifically
 * asked for a cursor-reactive effect, so they're dropped rather than kept
 * as unused dead branches.
 */
export function PrismField() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { theme } = useTheme();
  const configRef = useRef<PrismConfig>(theme === "cobalt" ? COBALT : OBSIDIAN);

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

      const HEIGHT = 3.5;
      const BASE_WIDTH = 5.5;
      const BASE_HALF = BASE_WIDTH * 0.5;
      const SCALE = 3.6;
      const GLOW = 1;
      const NOISE = 0.5;
      const HUE_SHIFT = 0;
      const COLOR_FREQ = 1;
      const BLOOM = 1;
      const TIME_SCALE = 0.5;
      const HOVER_STRENGTH = 2;
      const INERTIA = 0.05;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.domElement.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;display:block;";
      wrap.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const geometry = new THREE.PlaneGeometry(2, 2);

      const uniforms = {
        iResolution: { value: new THREE.Vector2(1, 1) },
        iTime: { value: 0 },
        uHeight: { value: HEIGHT },
        uBaseHalf: { value: BASE_HALF },
        uRot: { value: new THREE.Matrix3() },
        uUseBaseWobble: { value: 0 },
        uGlow: { value: GLOW },
        uOffsetPx: { value: new THREE.Vector2(0, 0) },
        uNoise: { value: NOISE },
        uSaturation: { value: 1.5 },
        uHueShift: { value: HUE_SHIFT },
        uColorFreq: { value: COLOR_FREQ },
        uBloom: { value: BLOOM },
        uCenterShift: { value: HEIGHT * 0.25 },
        uInvBaseHalf: { value: 1 / BASE_HALF },
        uInvHeight: { value: 1 / HEIGHT },
        uMinAxis: { value: Math.min(BASE_HALF, HEIGHT) },
        uPxScale: { value: 1 },
        uTimeScale: { value: TIME_SCALE },
      };

      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        uniforms,
        transparent: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const applySize = () => {
        const rect = wrap.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height, false);
        uniforms.iResolution.value.set(renderer.domElement.width, renderer.domElement.height);
        uniforms.uPxScale.value = 1 / ((renderer.domElement.height || 1) * 0.1 * SCALE);
      };
      applySize();

      const ro = new ResizeObserver(applySize);
      ro.observe(wrap);

      let smoothedPx = 0.5;
      let smoothedPy = 0.5;
      let yaw = 0;
      let pitch = 0;
      let roll = 0;
      const t0 = performance.now();

      const tick = (t: number) => {
        const cs = getComputedStyle(wrap);
        const px = parseFloat(cs.getPropertyValue("--px")) || 0.5;
        const py = parseFloat(cs.getPropertyValue("--py")) || 0.5;
        smoothedPx = lerp(smoothedPx, px, 0.12);
        smoothedPy = lerp(smoothedPy, py, 0.12);

        // Normalized -1..1 pointer offset from centre, same convention the
        // reference's window-level pointermove handler used.
        const nx = (smoothedPx - 0.5) * 2;
        const ny = (smoothedPy - 0.5) * 2;
        const maxTilt = 0.6 * HOVER_STRENGTH;
        const targetYaw = -nx * maxTilt;
        const targetPitch = ny * maxTilt;
        yaw = lerp(yaw, targetYaw, INERTIA);
        pitch = lerp(pitch, targetPitch, INERTIA);
        roll = lerp(roll, 0, 0.1);

        const cy = Math.cos(yaw);
        const sy = Math.sin(yaw);
        const cx = Math.cos(pitch);
        const sx = Math.sin(pitch);
        const cz = Math.cos(roll);
        const sz = Math.sin(roll);
        uniforms.uRot.value.set(
          cy * cz + sy * sx * sz,
          -cy * sz + sy * sx * cz,
          sy * cx,
          cx * sz,
          cx * cz,
          -sx,
          -sy * cz + cy * sx * sz,
          sy * sz + cy * sx * cz,
          cy * cx,
        );

        uniforms.iTime.value = (t - t0) * 0.001;
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
    const [a, b, c] = configRef.current.fallbackColors;
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${a}, ${b}, ${c})` }}
      />
    );
  }

  return <div ref={wrapRef} aria-hidden="true" className="absolute inset-0" />;
}

import { useCallback, useEffect, useRef, useState } from "react";
import { Renderer, Triangle, Program, Mesh, Texture } from "ogl";
import type { OGLRenderingContext } from "ogl";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface MorphSliderItem {
  image: string;
  caption?: string;
}

type Transition = "melt" | "ripple" | "shear" | "swirl";

interface Props {
  items: MorphSliderItem[];
  startIndex?: number;
  transition?: Transition;
  duration?: number;
  ease?: string;
  intensity?: number;
  scale?: number;
  aberration?: number;
  drift?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  radius?: number;
  overlayColor?: string;
  showCaptions?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}

const TRANSITIONS: Record<Transition, number> = { melt: 0, ripple: 1, shear: 2, swirl: 3 };

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D tCurrent;
uniform sampler2D tNext;
uniform vec2 uResolution;
uniform vec2 uCurrentSize;
uniform vec2 uNextSize;
uniform float uProgress;
uniform float uDir;
uniform int uMode;
uniform float uIntensity;
uniform float uScale;
uniform float uAberration;
uniform float uDrift;
uniform float uTime;
uniform float uReduce;
uniform vec2 uPointer;
uniform vec3 uOverlay;

varying vec2 vUv;

const float PI = 3.14159265359;

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

vec2 coverUV(vec2 uv, vec2 res, vec2 img) {
  float rA = res.x / max(res.y, 1.0);
  float iA = img.x / max(img.y, 1.0);
  vec2 s = vec2(1.0);
  float ratio = rA / max(iA, 0.0001);
  if (ratio > 1.0) {
    s.y = 1.0 / ratio;
  } else {
    s.x = ratio;
  }
  return (uv - 0.5) * s + 0.5;
}

void main() {
  float p = clamp(uProgress, 0.0, 1.0);
  float env = sin(p * PI);

  vec2 uv = vUv;

  uv += vec2(sin(uTime * 0.25 + uv.y * 4.0), cos(uTime * 0.22 + uv.x * 4.0)) * uDrift * 0.008;
  uv = (uv - 0.5) * (1.0 - uDrift * 0.02 * sin(uTime * 0.4)) + 0.5;

  vec2 uvC = uv;
  vec2 uvN = uv;
  float m = smoothstep(0.0, 1.0, p);

  if (uReduce < 0.5) {
    if (uMode == 3) {
      vec2 c = uv - 0.5;
      float r = length(c);
      float ang = env * uIntensity * 3.5 * (1.0 - r);
      uvC = rot(ang) * c + 0.5;
      uvN = rot(-ang) * c + 0.5;
      m = smoothstep(0.0, 1.0, p);
    } else if (uMode == 1) {
      float d = distance(uv, uPointer);
      float ring = p * 1.6;
      float wave = sin((d - ring) * 30.0) * env;
      vec2 dir = normalize(uv - uPointer + 1e-4);
      vec2 disp = dir * wave * uIntensity * 0.25;
      uvC = uv + disp;
      uvN = uv + disp * 0.6;
      m = 1.0 - smoothstep(ring - 0.03, ring + 0.03, d);
    } else if (uMode == 2) {
      float slices = 14.0;
      float row = floor(uv.y * slices);
      float rnd = hash11(row);
      vec2 disp = vec2((rnd - 0.5) * env * uIntensity * 0.6, 0.0);
      uvC = uv + disp;
      uvN = uv + disp;
      float localX = uDir > 0.0 ? uv.x : 1.0 - uv.x;
      float th = p * 1.5 - 0.25 + (rnd - 0.5) * 0.25;
      m = 1.0 - smoothstep(th - 0.06, th + 0.06, localX);
    } else {
      float nn = fbm(uv * uScale + uTime * 0.03);
      float warp = fbm(uv * uScale * 1.7 - uTime * 0.02);
      vec2 g = vec2(nn, warp) - 0.5;
      uvC = uv + g * uIntensity * 0.5 * p;
      uvN = uv - g * uIntensity * 0.5 * (1.0 - p);
      m = smoothstep(nn - 0.15, nn + 0.15, p);
    }
  }

  vec2 sC = coverUV(uvC, uResolution, uCurrentSize);
  vec2 sN = coverUV(uvN, uResolution, uNextSize);

  float ca = uReduce < 0.5 ? uAberration * env * 0.03 : 0.0;

  vec3 colC = vec3(
    texture2D(tCurrent, sC + vec2(ca, 0.0)).r,
    texture2D(tCurrent, sC).g,
    texture2D(tCurrent, sC - vec2(ca, 0.0)).b
  );
  vec3 colN = vec3(
    texture2D(tNext, sN + vec2(ca, 0.0)).r,
    texture2D(tNext, sN).g,
    texture2D(tNext, sN - vec2(ca, 0.0)).b
  );

  vec3 col = mix(colC, colN, m);

  float vig = smoothstep(1.25, 0.25, length(uv - 0.5));
  col = mix(col, uOverlay, (1.0 - vig) * 0.28);

  gl_FragColor = vec4(col, 1.0);
}
`;

function makeFallbackTexture(gl: OGLRenderingContext) {
  const size = 4;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    data[i * 4] = 24;
    data[i * 4 + 1] = 24;
    data[i * 4 + 2] = 28;
    data[i * 4 + 3] = 255;
  }
  return new Texture(gl, { image: data, width: size, height: size, generateMipmaps: false });
}

function hexToRgb(hex: string): [number, number, number] {
  let h = (hex || "#000000").replace("#", "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

interface EngineOptions {
  transition: Transition;
  duration: number;
  ease: string;
  intensity: number;
  scale: number;
  aberration: number;
  drift: number;
  overlayColor: string;
  loop: boolean;
}

// Program.uniforms is typed as `Record<string, any>` by ogl — named here so
// each uniform gets dot access instead of bracket access everywhere below.
interface Uniforms {
  tCurrent: { value: Texture };
  tNext: { value: Texture };
  uResolution: { value: number[] };
  uCurrentSize: { value: number[] };
  uNextSize: { value: number[] };
  uProgress: { value: number };
  uDir: { value: number };
  uMode: { value: number };
  uIntensity: { value: number };
  uScale: { value: number };
  uAberration: { value: number };
  uDrift: { value: number };
  uTime: { value: number };
  uReduce: { value: number };
  uPointer: { value: number[] };
  uOverlay: { value: number[] };
}

class MorphEngine {
  container: HTMLElement;
  items: MorphSliderItem[];
  getOptions: () => EngineOptions;
  onIndexChange?: ((i: number) => void) | undefined;
  reducedMotion: boolean;

  current: number;
  animating = false;
  dragging = false;
  dragDir = 0;
  shownIndex: number;
  tween: gsap.core.Tween | null = null;

  renderer: Renderer;
  gl: OGLRenderingContext;
  canvas: HTMLCanvasElement;
  geometry: Triangle;
  textures: Texture[];
  sizes: [number, number][];
  program: Program;
  u: Uniforms;
  mesh: Mesh;

  resizeObserver: ResizeObserver;
  running = false;
  boundLoop: (time: number) => void;
  boundContextLost: (e: Event) => void;

  constructor(
    container: HTMLElement,
    opts: {
      items: MorphSliderItem[];
      startIndex: number;
      reducedMotion: boolean;
      getOptions: () => EngineOptions;
      onIndexChange?: ((i: number) => void) | undefined;
      dprCap: number;
    },
  ) {
    this.container = container;
    this.items = opts.items;
    this.getOptions = opts.getOptions;
    this.onIndexChange = opts.onIndexChange;
    this.reducedMotion = opts.reducedMotion;

    this.current = opts.startIndex;
    this.shownIndex = opts.startIndex;

    this.renderer = new Renderer({
      alpha: false,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, opts.dprCap),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0.05, 0.05, 0.06, 1);

    this.canvas = this.gl.canvas as HTMLCanvasElement;
    this.canvas.className = "morph-slider-canvas";
    container.appendChild(this.canvas);

    this.geometry = new Triangle(this.gl);

    this.textures = this.items.map(() => makeFallbackTexture(this.gl));
    this.sizes = this.items.map(() => [1, 1]);

    const cfg = this.getOptions();
    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        tCurrent: { value: this.textures[this.current] },
        tNext: { value: this.textures[this.current] },
        uResolution: { value: [1, 1] },
        uCurrentSize: { value: this.sizes[this.current] },
        uNextSize: { value: this.sizes[this.current] },
        uProgress: { value: 0 },
        uDir: { value: 1 },
        uMode: { value: TRANSITIONS[cfg.transition] ?? 0 },
        uIntensity: { value: cfg.intensity },
        uScale: { value: cfg.scale },
        uAberration: { value: cfg.aberration },
        uDrift: { value: cfg.drift },
        uTime: { value: 0 },
        uReduce: { value: this.reducedMotion ? 1 : 0 },
        uPointer: { value: [0.5, 0.5] },
        uOverlay: { value: hexToRgb(cfg.overlayColor) },
      },
    });
    this.u = this.program.uniforms as unknown as Uniforms;

    this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program });

    this.boundContextLost = this.onContextLost.bind(this);
    this.canvas.addEventListener("webglcontextlost", this.boundContextLost, false);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();

    this.loadTextures();

    // Ticks off the SAME gsap.ticker Lenis drives (lib/scroll-runtime.ts) —
    // gsap is a singleton module, so this file's own static `import { gsap }
    // from "gsap"` above (already used for the transition tweens below) IS
    // that shared ticker, no async runtime lookup needed. Previously this
    // ran its own requestAnimationFrame loop: a card grid holding several
    // MorphSliders meant that many full-rate loops competing with Lenis's
    // for the browser's frame budget, off the ticker's own lagSmoothing(0)
    // and deltaRatio accounting.
    this.boundLoop = this.tick.bind(this);
    gsap.ticker.add(this.boundLoop);
    this.running = true;
  }

  loadTextures() {
    this.items.forEach((item, index) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = item.image;
      img.onload = () => {
        const texture = new Texture(this.gl, { generateMipmaps: false });
        texture.image = img;
        this.textures[index] = texture;
        this.sizes[index] = [img.naturalWidth || 1, img.naturalHeight || 1];
        if (index === this.current) {
          this.u.tCurrent.value = texture;
          this.u.uCurrentSize.value = this.sizes[index];
        }
      };
      img.onerror = () => {};
    });
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const w = Math.max(rect.width, 1);
    const h = Math.max(rect.height, 1);
    this.renderer.setSize(w, h);
    this.u.uResolution.value = [this.gl.canvas.width, this.gl.canvas.height];
  }

  syncOptions() {
    const cfg = this.getOptions();
    this.u.uMode.value = TRANSITIONS[cfg.transition] ?? 0;
    this.u.uIntensity.value = cfg.intensity;
    this.u.uScale.value = cfg.scale;
    this.u.uAberration.value = cfg.aberration;
    this.u.uDrift.value = cfg.drift;
    this.u.uOverlay.value = hexToRgb(cfg.overlayColor);
  }

  // `time` arrives in seconds already (gsap.ticker's own elapsed clock —
  // see scroll-runtime.ts's `raf` callback, which multiplies by 1000 to
  // feed Lenis ms), so unlike the old rAF-timestamp loop this needs no
  // unit conversion. The ticker itself re-invokes this every frame; no
  // self-scheduling call here.
  tick(time: number) {
    this.u.uTime.value = time;
    if (!this.dragging && !this.animating) this.syncOptions();
    this.renderer.render({ scene: this.mesh });
  }

  wrap(i: number) {
    const n = this.items.length;
    return ((i % n) + n) % n;
  }

  prepareNext(dir: number) {
    const target = this.wrap(this.current + dir);
    // Both indices are always in-bounds — wrap() clamps into [0, items.length) —
    // the `!` just tells noUncheckedIndexedAccess what wrap() already guarantees.
    this.u.tCurrent.value = this.textures[this.current]!;
    this.u.uCurrentSize.value = this.sizes[this.current]!;
    this.u.tNext.value = this.textures[target]!;
    this.u.uNextSize.value = this.sizes[target]!;
    this.u.uDir.value = dir;
    return target;
  }

  goTo(dir: number) {
    if (this.animating || this.dragging || this.items.length < 2) return;
    const cfg = this.getOptions();
    if (!cfg.loop) {
      const raw = this.current + dir;
      if (raw < 0 || raw > this.items.length - 1) return;
    }
    this.syncOptions();
    const target = this.prepareNext(dir);
    this.animating = true;
    this.announce(target);
    const duration = this.reducedMotion ? Math.min(cfg.duration, 0.4) : cfg.duration;
    this.tween = gsap.fromTo(
      this.u.uProgress,
      { value: 0 },
      {
        value: 1,
        duration,
        ease: cfg.ease,
        onComplete: () => this.commit(target),
      },
    );
  }

  announce(index: number) {
    if (index === this.shownIndex) return;
    this.shownIndex = index;
    this.onIndexChange?.(index);
  }

  commit(target: number) {
    this.current = target;
    this.u.tCurrent.value = this.textures[target]!;
    this.u.uCurrentSize.value = this.sizes[target]!;
    this.u.uProgress.value = 0;
    this.animating = false;
    this.tween = null;
    this.announce(target);
  }

  next() {
    this.goTo(1);
  }

  prev() {
    this.goTo(-1);
  }

  setPointer(x: number, y: number) {
    this.u.uPointer.value = [x, y];
  }

  beginDrag() {
    if (this.animating || this.items.length < 2) return false;
    this.dragging = true;
    this.dragDir = 0;
    this.syncOptions();
    return true;
  }

  drag(ndx: number) {
    if (!this.dragging) return;
    const cfg = this.getOptions();
    const dir = ndx < 0 ? 1 : -1;
    if (!cfg.loop) {
      const raw = this.current + dir;
      if (raw < 0 || raw > this.items.length - 1) {
        this.u.uProgress.value = 0;
        return;
      }
    }
    if (dir !== this.dragDir) {
      this.dragDir = dir;
      this.prepareNext(dir);
    }
    const progress = Math.min(Math.abs(ndx), 1);
    this.u.uProgress.value = progress;
    this.announce(progress > 0.5 ? this.wrap(this.current + dir) : this.current);
  }

  endDrag() {
    if (!this.dragging) return;
    this.dragging = false;
    const p = this.u.uProgress.value as number;
    if (this.dragDir === 0) return;
    const target = this.wrap(this.current + this.dragDir);
    const duration = this.reducedMotion ? 0.3 : 0.5;
    this.animating = true;
    if (p > 0.4) {
      this.announce(target);
      this.tween = gsap.to(this.u.uProgress, {
        value: 1,
        duration,
        ease: "power2.out",
        onComplete: () => this.commit(target),
      });
    } else {
      this.announce(this.current);
      this.tween = gsap.to(this.u.uProgress, {
        value: 0,
        duration,
        ease: "power2.out",
        onComplete: () => {
          this.animating = false;
          this.tween = null;
        },
      });
    }
  }

  onContextLost(e: Event) {
    e.preventDefault();
    gsap.ticker.remove(this.boundLoop);
    this.running = false;
  }

  /** Stops the render loop without tearing down GL state — for a card
   *  that scrolled out of the lazy-mount margin, not for unmount. Cheap
   *  to call repeatedly as the card crosses in and out of view. */
  pause() {
    if (!this.running) return;
    gsap.ticker.remove(this.boundLoop);
    this.running = false;
  }

  /** Restarts the loop `pause()` stopped. A no-op if it's already running
   *  (guards the double-fire IntersectionObserver can produce). */
  resume() {
    if (this.running) return;
    gsap.ticker.add(this.boundLoop);
    this.running = true;
  }

  destroy() {
    gsap.ticker.remove(this.boundLoop);
    this.running = false;
    this.tween?.kill();
    this.resizeObserver.disconnect();
    this.canvas.removeEventListener("webglcontextlost", this.boundContextLost);
    this.textures.forEach((tex) => {
      const t = tex as unknown as { texture?: WebGLTexture };
      if (t.texture) this.gl.deleteTexture(t.texture);
    });
    const prog = this.program as unknown as { program?: WebGLProgram };
    if (prog.program) this.gl.deleteProgram(prog.program);
    const ext = this.gl.getExtension("WEBGL_lose_context");
    ext?.loseContext();
    this.canvas.parentNode?.removeChild(this.canvas);
  }
}

/**
 * React Bits' MorphSlider, ported to TS: shader/engine logic untouched
 * (verbatim GLSL + ogl/gsap wiring), only three changes from upstream —
 * driven by this project's `useReducedMotion` instead of a one-shot
 * matchMedia read, chrome (buttons/dots/captions) uses this file's theme
 * tokens instead of hardcoded dark rgba so it reads in both grounds, and a
 * root click guard (card hosts nest this inside a nav `<Link>`, and a
 * slide/drag/tap must browse, not navigate).
 */
export function MorphSlider({
  items,
  startIndex = 0,
  transition = "melt",
  duration = 0.85,
  ease = "power3.out",
  intensity = 0.55,
  scale = 2.4,
  aberration = 0.35,
  drift = 0.4,
  autoplay = false,
  autoplayDelay = 5.5,
  loop = true,
  radius = 16,
  overlayColor = "#000000",
  showCaptions = true,
  showControls = true,
  showIndicators = true,
  className = "",
}: Props) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<MorphEngine | null>(null);
  const [index, setIndex] = useState(startIndex);
  const [hovering, setHovering] = useState(false);

  const optsRef = useRef<EngineOptions>({
    transition,
    duration,
    ease,
    intensity,
    scale,
    aberration,
    drift,
    overlayColor,
    loop,
  });
  optsRef.current = {
    transition,
    duration,
    ease,
    intensity,
    scale,
    aberration,
    drift,
    overlayColor,
    loop,
  };

  // Lazy mount + visibility-gated render loop: a card grid can hold several
  // of these, each running its own WebGL context and rAF loop
  // (loop() above) outside Lenis's ticker — construct the GL context only
  // once the card is near the viewport, matching ProductVideo's own
  // rootMargin (product-video.tsx), and pause/resume the loop (not
  // destroy/recreate) as it crosses in and out after that. `everNear` is a
  // one-way latch: construction runs once per items/startIndex change, not
  // once per scroll toggle. `nearRef` is a live mirror the IO callback
  // reads/writes directly, so pause/resume after mount costs no re-render.
  const [everNear, setEverNear] = useState(false);
  const nearRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        nearRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          setEverNear(true);
          engineRef.current?.resume();
        } else {
          engineRef.current?.pause();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!everNear || !containerRef.current) return undefined;

    const engine = new MorphEngine(containerRef.current, {
      items,
      startIndex,
      reducedMotion: reduced,
      dprCap: 1.75,
      getOptions: () => optsRef.current,
      onIndexChange: setIndex,
    });
    engineRef.current = engine;
    setIndex(startIndex);
    // The 300px margin makes this unlikely, but if visibility already
    // flipped back off between the IO firing and this effect running, don't
    // start the loop just to have the very next tick pause it.
    if (!nearRef.current) engine.pause();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, startIndex, everNear]);

  const handleNext = useCallback(() => engineRef.current?.next(), []);
  const handlePrev = useCallback(() => engineRef.current?.prev(), []);

  useEffect(() => {
    if (!autoplay || hovering || reduced) return undefined;
    const id = setTimeout(() => engineRef.current?.next(), Math.max(autoplayDelay, 1) * 1000);
    return () => clearTimeout(id);
  }, [autoplay, autoplayDelay, hovering, reduced, index]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    let startX = 0;
    let width = 1;
    let active = false;

    const onDown = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      width = rect.width || 1;
      startX = e.clientX;
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      engineRef.current?.setPointer(px, 1 - py);
      active = engineRef.current?.beginDrag() ?? false;
      if (active) {
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          /* pointer capture is a nice-to-have, not required for drag to work */
        }
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!active) return;
      const ndx = (e.clientX - startX) / width;
      engineRef.current?.drag(ndx);
    };
    const onUp = () => {
      if (!active) return;
      active = false;
      engineRef.current?.endDrag();
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    },
    [handleNext, handlePrev],
  );

  const hasCaptions = showCaptions && items.some((item) => item.caption);

  return (
    <div
      className={`morph-slider ${className}`.trim()}
      style={
        {
          borderRadius: `${radius}px`,
          "--ms-swap": `${(duration * 0.66).toFixed(3)}s`,
          "--ms-dot": `${(duration * 0.45).toFixed(3)}s`,
        } as React.CSSProperties
      }
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={(e) => {
        // Card hosts frequently nest this inside a nav <Link> (the WORK
        // grid does) — a tap/drag/arrow/dot here browses the slider, it
        // must never also bubble into an ancestor's navigation.
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div
        ref={containerRef}
        className="morph-slider-stage"
        role="group"
        aria-roledescription="carousel"
        aria-label="Screenshots"
        tabIndex={0}
        onKeyDown={onKeyDown}
      />

      {hasCaptions && (
        <div className="morph-slider-caption" aria-live="polite">
          {items.map((item, i) =>
            item.caption ? (
              <span
                key={item.image}
                aria-hidden={i === index ? undefined : true}
                className={`morph-slider-caption-text ${i === index ? "is-active" : ""}`}
              >
                {item.caption}
              </span>
            ) : null,
          )}
        </div>
      )}

      {showControls && items.length > 1 && (
        <div className="morph-slider-controls">
          <button
            type="button"
            className="morph-slider-btn"
            aria-label="Previous slide"
            onClick={handlePrev}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M15 5l-7 7 7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="morph-slider-btn"
            aria-label="Next slide"
            onClick={handleNext}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M9 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {showIndicators && items.length > 1 && (
        <div className="morph-slider-indicators" role="tablist" aria-label="Slides">
          {items.map((item, i) => (
            <button
              key={item.image}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              className={`morph-slider-dot ${i === index ? "is-active" : ""}`}
              onClick={() => {
                const engine = engineRef.current;
                if (!engine || i === index) return;
                engine.goTo(i > index ? 1 : -1);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

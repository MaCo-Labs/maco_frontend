import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Group,
  Mesh,
  PerspectiveCamera,
  Points,
  QuadraticBezierCurve3,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { getLiveScrollRuntime } from "@/lib/scroll-runtime";

export type Hub = { name: string; lat: number; lng: number };

/** Arcs run between real hubs only, by index into `hubs`. */
const ROUTES: readonly [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [3, 4],
];

const FAR = 4.7;
const NEAR = 4.3;
const TAU = Math.PI * 2;

const toVector = (lat: number, lng: number, radius = 1) => {
  const a = (lat * Math.PI) / 180;
  const o = (lng * Math.PI) / 180;
  return new Vector3(
    Math.cos(a) * Math.sin(o) * radius,
    Math.sin(a) * radius,
    Math.cos(a) * Math.cos(o) * radius,
  );
};

/** Shortest signed path between two angles. */
const shortest = (from: number, to: number) => {
  const d = (to - from) % TAU;
  return d > Math.PI ? d - TAU : d < -Math.PI ? d + TAU : d;
};

/** Resolves any CSS colour (the tokens are oklch/color-mix) to raw 0..1 RGB. */
function readColor(ctx: CanvasRenderingContext2D, css: string): Vector3 {
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return new Vector3(d[0]! / 255, d[1]! / 255, d[2]! / 255);
}

const DOT_VERTEX = /* glsl */ `
  uniform float uPx, uReveal, uRipple;
  uniform vec3 uFocus;
  varying float vAlpha, vHot;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float d = acos(clamp(dot(position, uFocus), -1.0, 1.0));
    float ring = exp(-pow((d - uRipple) / 0.14, 2.0)) * smoothstep(3.2, 0.3, uRipple);
    float near = exp(-pow(d / 0.2, 2.0));
    float shown = smoothstep(uReveal * 3.6, uReveal * 3.6 - 0.4, d);
    float facing = clamp(dot(normalize(normalMatrix * position), normalize(-mv.xyz)), 0.0, 1.0);
    vAlpha = shown * (0.45 + 0.55 * facing);
    vHot = clamp(ring + near * 0.55, 0.0, 1.0);
    gl_PointSize = uPx * (0.6 + 0.4 * facing) * (1.0 + ring * 1.2 + near * 0.5) * shown;
    gl_Position = projectionMatrix * mv;
  }
`;
const DOT_FRAGMENT = /* glsl */ `
  uniform vec3 uDot, uHot;
  varying float vAlpha, vHot;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    gl_FragColor = vec4(mix(uDot, uHot, vHot), smoothstep(0.5, 0.32, r) * vAlpha);
  }
`;

const SHELL_VERTEX = /* glsl */ `
  varying vec3 vN, vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const SHELL_FRAGMENT = /* glsl */ `
  uniform vec3 uBase, uRim;
  varying vec3 vN, vV;
  void main() {
    float f = pow(1.0 - clamp(dot(vN, vV), 0.0, 1.0), 3.2);
    gl_FragColor = vec4(mix(uBase, uRim, f * 0.22), 1.0);
  }
`;
const GLOW_FRAGMENT = /* glsl */ `
  uniform vec3 uRim;
  varying vec3 vN, vV;
  void main() {
    float f = pow(clamp(-dot(vN, vV), 0.0, 1.0), 2.6);
    gl_FragColor = vec4(uRim, f * 0.2);
  }
`;

const ARC_VERTEX = /* glsl */ `
  varying float vT;
  void main() {
    vT = uv.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const ARC_FRAGMENT = /* glsl */ `
  uniform float uTime, uOffset, uLit, uReveal;
  uniform vec3 uColor;
  varying float vT;
  void main() {
    float head = fract(uTime * 0.28 + uOffset) * 1.5;
    float tail = smoothstep(head - 0.45, head, vT) * step(vT, head);
    float a = (0.1 + 0.14 * uLit + tail * (0.5 + 0.5 * uLit)) * step(vT, uReveal * 1.4);
    gl_FragColor = vec4(uColor, a);
  }
`;

const HUB_VERTEX = /* glsl */ `
  attribute float aIndex;
  uniform float uPx, uActive;
  varying float vOn;
  void main() {
    vOn = 1.0 - step(0.5, abs(aIndex - uActive));
    gl_PointSize = uPx * (vOn > 0.5 ? 44.0 : 20.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const HUB_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying float vOn;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float core = smoothstep(vOn > 0.5 ? 0.2 : 0.4, vOn > 0.5 ? 0.14 : 0.28, r);
    float p = fract(uTime * 0.55);
    float ring = vOn * (1.0 - p) * smoothstep(0.05, 0.0, abs(r - (0.2 + p * 0.78)));
    float a = max(core, ring);
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

/**
 * The dotted globe: real land dots, real hubs, arcs that flow between them. A
 * new hub flies into view and sends a ripple through the dot field. Drag spins
 * it with inertia, a tap picks the nearest hub, and scrolling nudges it. Raw
 * `three`, one draw per frame, stopped entirely while offscreen.
 */
export function MaCoGlobe({
  hubs,
  active,
  reducedMotion,
  onPick,
  onInteract,
  onFail,
}: {
  hubs: readonly Hub[];
  active: number;
  reducedMotion: boolean;
  onPick: (index: number) => void;
  onInteract: () => void;
  onFail: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<(index: number) => void>(() => {});
  const callbacks = useRef({ onPick, onInteract });
  callbacks.current = { onPick, onInteract };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      onFail();
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.domElement.className = "hub-globe-canvas";
    host.prepend(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(30, 1, 0.1, 20);
    camera.position.z = FAR;
    const globe = new Group();
    scene.add(globe);

    const color = { value: new Vector3(1, 1, 1) };
    const hot = { value: new Vector3(1, 1, 1) };
    const base = { value: new Vector3(0, 0, 0) };
    const rim = { value: new Vector3(1, 1, 1) };
    const time = { value: 0 };
    const reveal = { value: reducedMotion ? 1 : 0 };
    const ripple = { value: 4 };
    const focus = { value: toVector(hubs[0]!.lat, hubs[0]!.lng) };
    const dotPx = { value: 2 };
    const hubPx = { value: dpr };
    const activeHub = { value: active };

    const shell = new Mesh(
      new SphereGeometry(0.992, 64, 48),
      new ShaderMaterial({
        vertexShader: SHELL_VERTEX,
        fragmentShader: SHELL_FRAGMENT,
        uniforms: { uBase: base, uRim: rim },
      }),
    );
    globe.add(shell);
    const glow = new Mesh(
      new SphereGeometry(1.1, 48, 32),
      new ShaderMaterial({
        vertexShader: SHELL_VERTEX,
        fragmentShader: GLOW_FRAGMENT,
        uniforms: { uRim: rim },
        side: BackSide,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    );
    scene.add(glow);

    let dotGeometry: BufferGeometry | null = null;
    const dotMaterial = new ShaderMaterial({
      vertexShader: DOT_VERTEX,
      fragmentShader: DOT_FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uPx: dotPx,
        uReveal: reveal,
        uRipple: ripple,
        uFocus: focus,
        uDot: color,
        uHot: hot,
      },
    });
    const abort = new AbortController();
    fetch("/geo/land-dots.bin", { signal: abort.signal })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.arrayBuffer();
      })
      .then((buffer) => {
        const raw = new Int16Array(buffer);
        const positions = new Float32Array((raw.length / 2) * 3);
        for (let i = 0; i < raw.length / 2; i++) {
          const v = toVector(raw[i * 2]! / 100, raw[i * 2 + 1]! / 100);
          positions.set([v.x, v.y, v.z], i * 3);
        }
        dotGeometry = new BufferGeometry();
        dotGeometry.setAttribute("position", new BufferAttribute(positions, 3));
        globe.add(new Points(dotGeometry, dotMaterial));
        dirty = true;
      })
      .catch(() => {
        // Aborted on unmount, or offline: the hub list beside it still works.
      });

    const arcMaterials = ROUTES.map(([a, b], i) => {
      const from = toVector(hubs[a]!.lat, hubs[a]!.lng);
      const to = toVector(hubs[b]!.lat, hubs[b]!.lng);
      const lift = 1 + from.angleTo(to) * 1.05 + 0.04;
      const mid = from.clone().add(to).normalize().multiplyScalar(lift);
      const material = new ShaderMaterial({
        vertexShader: ARC_VERTEX,
        fragmentShader: ARC_FRAGMENT,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: time,
          uOffset: { value: i * 0.23 },
          uLit: { value: 0 },
          uReveal: reveal,
          uColor: hot,
        },
      });
      globe.add(
        new Mesh(
          new TubeGeometry(new QuadraticBezierCurve3(from, mid, to), 64, 0.0026, 5),
          material,
        ),
      );
      return material;
    });

    const hubVectors = hubs.map((h) => toVector(h.lat, h.lng, 1.004));
    const hubGeometry = new BufferGeometry();
    hubGeometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(hubVectors.flatMap((v) => [v.x, v.y, v.z])), 3),
    );
    hubGeometry.setAttribute(
      "aIndex",
      new BufferAttribute(new Float32Array(hubs.map((_, i) => i)), 1),
    );
    globe.add(
      new Points(
        hubGeometry,
        new ShaderMaterial({
          vertexShader: HUB_VERTEX,
          fragmentShader: HUB_FRAGMENT,
          transparent: true,
          depthWrite: false,
          uniforms: { uPx: hubPx, uActive: activeHub, uTime: time, uColor: hot },
        }),
      ),
    );

    // Rotation state: `free` after a drag, otherwise easing toward a hub.
    let rx = (hubs[active]!.lat * Math.PI) / 180;
    let ry = -(hubs[active]!.lng * Math.PI) / 180;
    let targetX = rx;
    let targetY = ry;
    let free = false;
    let vx = 0;
    let vy = 0;
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    let kick = 0;
    let revealing = !reducedMotion;
    let dirty = true;
    let inView = true;
    let width = 1;
    let height = 1;

    function applyTheme() {
      const styles = getComputedStyle(host!);
      const probe = document.createElement("canvas").getContext("2d", {
        willReadFrequently: true,
      });
      if (!probe) return;
      probe.canvas.width = probe.canvas.height = 1;
      color.value = readColor(probe, styles.getPropertyValue("--muted"));
      hot.value = readColor(probe, styles.getPropertyValue("--text"));
      base.value = readColor(probe, styles.getPropertyValue("--bg"));
      rim.value = readColor(probe, styles.getPropertyValue("--text"));
      dirty = true;
    }
    applyTheme();

    function resize() {
      width = host!.clientWidth || 1;
      height = host!.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      dotPx.value = Math.max(1.6, (width / 300) * dpr);
      dirty = true;
    }
    resize();

    focusRef.current = (index) => {
      activeHub.value = index;
      focus.value = toVector(hubs[index]!.lat, hubs[index]!.lng);
      ripple.value = reducedMotion ? 4 : 0;
      targetX = (hubs[index]!.lat * Math.PI) / 180;
      targetY = -(hubs[index]!.lng * Math.PI) / 180;
      free = false;
      vx = vy = 0;
      ROUTES.forEach(([a, b], i) => {
        arcMaterials[i]!.uniforms["uLit"]!.value = a === index || b === index ? 1 : 0;
      });
      if (reducedMotion) {
        rx = targetX;
        ry = targetY;
      }
      dirty = true;
    };
    focusRef.current(active);

    const projected = new Vector3();
    function placeTag() {
      const tag = tagRef.current;
      if (!tag) return;
      projected.copy(hubVectors[activeHub.value]!).applyMatrix4(globe.matrixWorld);
      const visible = projected.dot(camera.position) > 1;
      projected.project(camera);
      tag.style.opacity = visible ? "1" : "0";
      tag.style.transform = `translate(${((projected.x + 1) / 2) * width}px, ${((1 - projected.y) / 2) * height}px)`;
    }

    function hubAt(x: number, y: number) {
      let best = -1;
      let bestDistance = 34;
      hubVectors.forEach((v, i) => {
        projected.copy(v).applyMatrix4(globe.matrixWorld);
        if (projected.dot(camera.position) <= 1) return;
        projected.project(camera);
        const d = Math.hypot(
          ((projected.x + 1) / 2) * width - x,
          ((1 - projected.y) / 2) * height - y,
        );
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      });
      return best;
    }

    const onDown = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      vx = vy = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved < 6) return;
      if (!free) {
        free = true;
        callbacks.current.onInteract();
      }
      const speed = 0.006 * (340 / width);
      vy = dx * speed;
      vx = dy * speed;
      ry += vy;
      rx = Math.max(-1.2, Math.min(1.2, rx + vx));
      dirty = true;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (moved < 6) {
        const r = host.getBoundingClientRect();
        const hit = hubAt(e.clientX - r.left, e.clientY - r.top);
        if (hit >= 0) callbacks.current.onPick(hit);
      }
    };
    const canvas = renderer.domElement;
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    const resizer = new ResizeObserver(resize);
    resizer.observe(host);
    const viewer = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      if (inView) schedule();
    });
    viewer.observe(host);
    const themer = new MutationObserver(applyTheme);
    themer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const onVisibility = () => schedule();
    document.addEventListener("visibilitychange", onVisibility);

    let frame = 0;
    let last = performance.now();
    function schedule() {
      if (!frame && inView && !document.hidden) frame = requestAnimationFrame(tick);
    }
    function tick(now: number) {
      frame = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reducedMotion) {
        time.value += dt;
        ripple.value = Math.min(4, ripple.value + dt * 1.25);
        if (revealing) {
          reveal.value = Math.min(1, reveal.value + dt * 0.62);
          revealing = reveal.value < 1;
        }
        const velocity = getLiveScrollRuntime()?.lenis.velocity ?? 0;
        kick += (velocity * 0.0016 - kick) * 0.06;
        if (!dragging) {
          if (free) {
            ry += vy + dt * 0.05;
            rx = Math.max(-1.2, Math.min(1.2, rx + vx));
            vx *= 0.94;
            vy *= 0.94;
          } else {
            const k = 1 - Math.exp(-dt * 2.6);
            rx += shortest(rx, targetX) * k;
            ry += shortest(ry, targetY) * k;
          }
        }
        camera.position.z += ((free ? FAR : NEAR) - camera.position.z) * (1 - Math.exp(-dt * 2));
        dirty = true;
      }
      if (dirty) {
        globe.rotation.set(rx, ry + kick, 0);
        globe.updateMatrixWorld();
        camera.updateMatrixWorld();
        renderer.render(scene, camera);
        placeTag();
        dirty = false;
      }
      schedule();
    }
    schedule();

    return () => {
      abort.abort();
      cancelAnimationFrame(frame);
      focusRef.current = () => {};
      resizer.disconnect();
      viewer.disconnect();
      themer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      scene.traverse((o) => {
        const mesh = o as Mesh;
        mesh.geometry?.dispose();
        (mesh.material as ShaderMaterial | undefined)?.dispose();
      });
      renderer.dispose();
      canvas.remove();
    };
    // Rebuilding the scene would drop the view; `active` flows in through the
    // effect below instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hubs, reducedMotion]);

  useEffect(() => {
    focusRef.current(active);
  }, [active]);

  return (
    <div ref={hostRef} className="hub-globe-stage">
      <div ref={tagRef} className="hub-globe-tag" aria-hidden="true">
        <span>{hubs[active]!.name}</span>
      </div>
    </div>
  );
}

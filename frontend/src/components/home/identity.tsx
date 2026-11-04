import { useCallback, useEffect, useRef, useState } from "react";
import { nameScripts } from "@/content/maco";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScriptFontsWhenVisible } from "@/hooks/use-script-fonts";
import { useScrollScene } from "@/hooks/use-scroll-scene";
import type { ScrollRuntime } from "@/lib/scroll-runtime";
import { clamp01, smootherstep } from "@/lib/motion";

const SCRIPTS = nameScripts;
const N = SCRIPTS.length;
const REACH = 90;
/** Phones have no pin to scroll through, so the dial runs on its own in view. */
const AUTO_HOLD_MS = 2400;
const HOLD_AFTER_TAP_MS = 7000;

type Word = { x: Float32Array; y: Float32Array };

/** Dot positions for one word, ordered left to right so morphs flow, not tangle. */
function sampleWord(
  script: (typeof SCRIPTS)[number],
  font: string,
  W: number,
  H: number,
  step: number,
): [number, number][] {
  const off = document.createElement("canvas");
  off.width = W;
  off.height = H;
  const cx = off.getContext("2d", { willReadFrequently: true })!;
  cx.textAlign = "center";
  cx.textBaseline = "middle";
  cx.direction = script.dir ?? "ltr";
  // Every script is fitted to the same box, so none reads smaller than another.
  cx.font = `600 200px ${font}`;
  const m = cx.measureText(script.text);
  const inkH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent || 200;
  const size = Math.min(200 * ((W * 0.92) / m.width), 200 * ((H * 0.86) / inkH));
  cx.font = `600 ${size}px ${font}`;
  const ink = cx.measureText(script.text);
  const mid = (ink.actualBoundingBoxAscent - ink.actualBoundingBoxDescent) / 2;
  cx.fillText(script.text, W / 2, H / 2 + mid);
  const { data } = cx.getImageData(0, 0, W, H);
  const points: [number, number][] = [];
  for (let x = 0; x < W; x += step)
    for (let y = 0; y < H; y += step) if (data[(y * W + x) * 4 + 3]! > 110) points.push([x, y]);
  return points;
}

/** Every word resampled to the same dot count, so any two can morph. */
function toWord(points: [number, number][], count: number): Word {
  const x = new Float32Array(count);
  const y = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const p = points[Math.floor((i * points.length) / count)] ?? [0, 0];
    x[i] = p[0];
    y[i] = p[1];
  }
  return { x, y };
}

/**
 * IDENTITY — "One name. Many scripts." MaCo's name drawn in dots, the same
 * language as the logo mark and the hub globe, flowing from one script into the
 * next. Each frame is a pure function of the dial position, so scrolling back
 * retraces it exactly and nothing simulates while it's still.
 *
 * Desktop pins and scroll is the dial. Phones don't pin: the dial advances by
 * itself while the section is on screen, and the rail below jumps to any script.
 * Under reduced motion it's a still word that the rail switches instantly. The
 * real text sits underneath until the dots are ready, for SSR and no-JS.
 */
export function Identity() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scriptFontsRef = useScriptFontsWhenVisible<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const dial = useRef({ t: 0, target: 0, wake: () => {}, holdUntil: 0 });
  const triggerRef = useRef<{ start: number; end: number } | null>(null);
  const runtimeRef = useRef<ScrollRuntime | null>(null);

  useScrollScene((rt) => {
    const section = sectionRef.current;
    if (!section) return;
    runtimeRef.current = rt;
    const mm = rt.gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const trigger = rt.ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=200%",
        pin: true,
        anticipatePin: 1,
        scrub: 0.25,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          dial.current.target = self.progress * (N - 1);
          dial.current.t = dial.current.target;
          dial.current.wake();
        },
      });
      triggerRef.current = trigger;
      return () => {
        trigger.kill();
        triggerRef.current = null;
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const cx = canvas?.getContext("2d");
    if (!canvas || !stage || !cx) return;

    let words: Word[] = [];
    let count = 0;
    let lift = new Float32Array(0);
    let lag = new Float32Array(0);
    let W = 0;
    let H = 0;
    let dot = 1.5;
    let frame = 0;
    let inView = false;
    let last = performance.now();
    let lastAuto = last;
    let pointerX = -9999;
    let pointerY = -9999;
    let smoothX = -9999;
    let smoothY = -9999;
    let shownIndex = -1;
    let built = false;
    let colorText = "";
    let colorMuted = "";
    const state = dial.current;

    const readColors = () => {
      const s = getComputedStyle(stage);
      colorText = s.getPropertyValue("--text");
      colorMuted = s.getPropertyValue("--muted");
    };

    const fontStack = () => {
      const s = getComputedStyle(stage);
      return `${s.getPropertyValue("--maco-font-display")}, ${s.getPropertyValue("--font-script-fallback")}`;
    };

    function build() {
      W = stage!.clientWidth;
      H = stage!.clientHeight;
      if (!W || !H) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      cx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const font = fontStack();
      const cap = W < 640 ? 2600 : 5200;
      let step = W < 640 ? 3 : 4;
      let sampled = SCRIPTS.map((s) => sampleWord(s, font, W, H, step));
      const densest = Math.max(...sampled.map((p) => p.length));
      // Widen the grid rather than thin the dots: skipping points out of a
      // regular grid shows up as banding across the letters.
      if (densest > cap) {
        step = Math.ceil(step * Math.sqrt(densest / cap));
        sampled = SCRIPTS.map((s) => sampleWord(s, font, W, H, step));
      }
      dot = step * 0.4;
      count = Math.max(...sampled.map((p) => p.length));
      words = sampled.map((p) => toWord(p, count));
      lift = new Float32Array(count);
      lag = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        lift[i] = (Math.random() - 0.5) * H * 0.55;
        lag[i] = Math.random() * 0.25 + (i / count) * 0.75;
      }
      built = true;
      readColors();
      setReady(true);
      wake();
    }

    function draw() {
      cx!.clearRect(0, 0, W, H);
      const t = state.t;
      const whole = Math.floor(t);
      const from = words[whole % N];
      const to = words[(whole + 1) % N];
      if (!from || !to) return;
      // Each word rests through part of its slot, so it can actually be read.
      const local = smootherstep(clamp01((t - whole - 0.22) / 0.56));
      const moving = local > 0 && local < 1;
      cx!.fillStyle = colorText;
      cx!.beginPath();
      const travelling: number[] = [];
      for (let i = 0; i < count; i++) {
        const p = moving ? clamp01(local * 1.6 - lag[i]! * 0.6) : local;
        const e = p * p * (3 - 2 * p);
        let x = from.x[i]! + (to.x[i]! - from.x[i]!) * e;
        let y = from.y[i]! + (to.y[i]! - from.y[i]!) * e + Math.sin(e * Math.PI) * lift[i]!;
        const dx = x - smoothX;
        const dy = y - smoothY;
        const d2 = dx * dx + dy * dy;
        if (d2 < REACH * REACH) {
          const d = Math.sqrt(d2) || 1;
          const push = (1 - d / REACH) * (1 - d / REACH) * 46;
          x += (dx / d) * push;
          y += (dy / d) * push;
        }
        if (p > 0.04 && p < 0.96) {
          travelling.push(x, y);
          continue;
        }
        cx!.moveTo(x + dot, y);
        cx!.arc(x, y, dot, 0, Math.PI * 2);
      }
      cx!.fill();
      if (travelling.length) {
        cx!.fillStyle = colorMuted;
        cx!.beginPath();
        for (let i = 0; i < travelling.length; i += 2) {
          const x = travelling[i]!;
          const y = travelling[i + 1]!;
          cx!.moveTo(x + dot * 0.8, y);
          cx!.arc(x, y, dot * 0.8, 0, Math.PI * 2);
        }
        cx!.fill();
      }
    }

    function tick(now: number) {
      frame = 0;
      if (!inView || !built) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const pinned = triggerRef.current !== null;
      let busy = false;

      if (!pinned && !reduced && now > state.holdUntil && now - lastAuto > AUTO_HOLD_MS) {
        lastAuto = now;
        state.target = Math.round(state.target) + 1;
      }
      if (!pinned) {
        const gap = state.target - state.t;
        if (reduced || Math.abs(gap) < 0.002) state.t = state.target;
        else {
          state.t += gap * (1 - Math.exp(-dt * 2.2));
          busy = true;
        }
      }
      const hasPointer = pointerX > -9000;
      if (hasPointer || smoothX > -9000) {
        smoothX = smoothX < -9000 ? pointerX : smoothX + (pointerX - smoothX) * 0.18;
        smoothY = smoothY < -9000 ? pointerY : smoothY + (pointerY - smoothY) * 0.18;
        busy = hasPointer;
        if (!hasPointer) smoothX = smoothY = -9999;
      }

      draw();
      const index = ((Math.round(state.t) % N) + N) % N;
      if (index !== shownIndex) {
        shownIndex = index;
        setActive(index);
      }
      // Phones keep ticking for the next auto step; a still pinned dial sleeps.
      if (busy || (!pinned && !reduced)) frame = requestAnimationFrame(tick);
    }

    function wake() {
      if (!frame && inView && !document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }
    state.wake = wake;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = stage.getBoundingClientRect();
      pointerX = e.clientX - r.left;
      pointerY = e.clientY - r.top;
      wake();
    };
    const onLeave = () => {
      pointerX = pointerY = -9999;
      wake();
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);

    // Noto faces arrive late, per script: resample when they do, or the first
    // sample's fallback glyphs stay forever.
    let rebuild = 0;
    const scheduleBuild = () => {
      cancelAnimationFrame(rebuild);
      rebuild = requestAnimationFrame(build);
    };
    const loadFonts = () => {
      const font = fontStack();
      void Promise.allSettled(
        SCRIPTS.map((s) => document.fonts.load(`600 40px ${font}`, s.text)),
      ).then(scheduleBuild);
    };
    document.fonts.addEventListener("loadingdone", scheduleBuild);
    const resize = new ResizeObserver(scheduleBuild);
    const view = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        if (inView) {
          if (!built) {
            build();
            loadFonts();
            resize.observe(stage);
          }
          lastAuto = performance.now();
          wake();
        }
      },
      { rootMargin: "200px 0px" },
    );
    view.observe(stage);
    const theme = new MutationObserver(() => {
      scheduleBuild();
      loadFonts();
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("visibilitychange", wake);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(rebuild);
      state.wake = () => {};
      view.disconnect();
      resize.disconnect();
      theme.disconnect();
      document.fonts.removeEventListener("loadingdone", scheduleBuild);
      document.removeEventListener("visibilitychange", wake);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  const jump = useCallback((index: number) => {
    const state = dial.current;
    const trigger = triggerRef.current;
    if (trigger && runtimeRef.current) {
      runtimeRef.current.lenis.scrollTo(
        trigger.start + (trigger.end - trigger.start) * (index / (N - 1)),
        { duration: 1 },
      );
      return;
    }
    // Forward from wherever the free-running dial has got to.
    const current = Math.round(state.target);
    state.target = current + ((((index - current) % N) + N) % N);
    state.holdUntil = performance.now() + HOLD_AFTER_TAP_MS;
    state.wake();
  }, []);

  const current = SCRIPTS[active]!;

  return (
    <section
      ref={sectionRef}
      data-ground="paper"
      className="identity relative z-[41] overflow-hidden"
      aria-label="MaCo, in one name and many scripts"
    >
      <div aria-hidden="true" className="ambient-field" />
      <div className="shell identity-inner">
        <div className="identity-head">
          <p className="label">One name. Many scripts.</p>
          <p className="identity-now" aria-hidden="true">
            <span className="identity-now-index">
              {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
            <span key={current.code} className="identity-now-lang">
              {current.lang}
            </span>
          </p>
        </div>

        <div
          ref={(el) => {
            stageRef.current = el;
            scriptFontsRef.current = el;
          }}
          className="identity-stage"
          data-ready={ready || undefined}
          aria-hidden="true"
        >
          <span className="identity-static">MaCo</span>
          <canvas ref={canvasRef} className="identity-canvas" />
        </div>

        <div className="identity-foot">
          <p className="lead identity-lead">
            MaCo works with clients across India and the Middle East.
          </p>
          <ul className="identity-rail">
            {SCRIPTS.map((s, i) => (
              <li key={s.code}>
                <button
                  type="button"
                  aria-label={`Show MaCo in ${s.lang}`}
                  aria-current={active === i || undefined}
                  className="identity-rail-item"
                  onClick={() => jump(i)}
                >
                  <span className="identity-rail-bar" />
                  <span className="identity-rail-name" aria-hidden="true">
                    {s.lang}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* The one accessible representation of the name itself. Per-item lang
            so a screen reader switches voice per script. */}
        <div className="sr-only">
          <p>MaCo, written in {N} scripts:</p>
          <ul>
            {SCRIPTS.map((s) => (
              <li key={s.code}>
                <span lang={s.code} dir={s.dir}>
                  {s.text}
                </span>
                {` — ${s.lang}`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

import type Lenis from "lenis";
import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type { SplitText as SplitTextType } from "gsap/SplitText";
import { resolveMotionPreference } from "./motion";

/**
 * Single scroll substrate for the whole homepage: Lenis owns real scroll
 * position, GSAP ScrollTrigger owns anything pinned/scrubbed, and both run
 * off ONE rAF loop (Lenis drives gsap.ticker; ScrollTrigger listens to
 * Lenis's scroll event). `motion` keeps animating discrete UI state (tabs,
 * the IDENTITY reel, hover springs) and never touches scroll — see the
 * ownership table in the immersive-rebuild plan.
 *
 * Deliberately a lazy singleton behind one async getter rather than a React
 * context of instances: every consumer (WebGL field, pinned scenes, cursor,
 * magnetic buttons) needs the exact same bail-out (SSR / reduced-motion /
 * construction failure -> null) and this makes that ONE branch instead of
 * one per component.
 */
export interface ScrollRuntime {
  lenis: Lenis;
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
  SplitText: typeof SplitTextType;
  /** Subscribe to Lenis scroll progress (0..1 of full document height). Returns an unsubscribe fn. */
  onScroll: (cb: (progress: number) => void) => () => void;
  /**
   * Coalesces any number of callers into ONE `ScrollTrigger.refresh()` on the
   * next animation frame. Every scene calls this right after creating its own
   * trigger. Without it, trigger creation order matters: ScrollTrigger only
   * measures the trigger it is currently creating, not ones that already
   * exist, so a scene created before a sibling with a large pin-spacer (e.g.
   * METHOD mounting before WORK's `<WorkRail>` resolves past
   * `useMediaQuery`'s SSR-safe `false` default) gets measured against a
   * document that doesn't have that spacer's height yet — its pin then fires
   * early, against stale start/end values. Scheduling one shared refresh
   * after every trigger in the tree has had a chance to register makes
   * mount order irrelevant.
   */
  scheduleRefresh: () => void;
  /**
   * Tears down Lenis, the ticker binding, and the module-level singleton so
   * the NEXT `getScrollRuntime()` call constructs a fresh runtime instead of
   * handing every scene the same destroyed Lenis instance. Previously the
   * provider called `lenis.destroy()` directly and left `runtimePromise` /
   * `liveRuntime` populated — after any remount (a route change back through
   * `__root.tsx`, or dev HMR) every scene got a Lenis with no listeners and
   * smooth scroll stayed dead until a hard refresh. Call this instead of
   * `lenis.destroy()` directly.
   */
  destroy: () => void;
}

let runtimePromise: Promise<ScrollRuntime | null> | null = null;
let liveRuntime: ScrollRuntime | null = null;

/**
 * Returns the shared runtime, constructing it on first call. Resolves to
 * `null` on the server, under the resolved motion preference (OS setting or
 * `?motion=` override — see `lib/motion.ts`), or if construction throws
 * (e.g. a blocked dynamic import) — every caller must treat `null` as "run
 * the static/reduced-motion fallback", never as "retry".
 */
export function getScrollRuntime(): Promise<ScrollRuntime | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (resolveMotionPreference() === "reduced") return Promise.resolve(null);
  if (runtimePromise) return runtimePromise;

  runtimePromise = (async () => {
    try {
      const [{ default: LenisCtor }, gsapMod, scrollTriggerMod, splitTextMod] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/SplitText"),
      ]);

      const gsap = gsapMod.gsap;
      const { ScrollTrigger } = scrollTriggerMod;
      const { SplitText } = splitTextMod;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      // A resize triggered only by the mobile URL bar hiding/showing must not
      // thrash a refresh cascade — the layout hasn't actually changed.
      ScrollTrigger.config({ ignoreMobileResize: true });

      const lenis = new LenisCtor({
        autoRaf: false,
        smoothWheel: true,
        syncTouch: false,
        // Stock defaults (lerp 0.1, wheelMultiplier 1) read as barely
        // smoothed — a touch heavier and a touch less eager per wheel
        // notch is what gives Lenis an actual felt character. Lowered
        // again (0.085 -> 0.07) for the sitewide restructure: with the
        // ground regroup's larger chapters, a noticeably heavier glide
        // reads as more premium/continuous than the previous value,
        // which felt closer to instant catch-up than real momentum.
        lerp: 0.07,
        wheelMultiplier: 0.9,
      });

      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("lenis");

      const listeners = new Set<(progress: number) => void>();
      lenis.on("scroll", ({ progress }: { progress: number }) => {
        for (const cb of listeners) cb(progress);
      });

      let refreshRaf = 0;
      const scheduleRefresh = () => {
        if (refreshRaf) return;
        refreshRaf = window.requestAnimationFrame(() => {
          refreshRaf = 0;
          ScrollTrigger.refresh();
        });
      };

      const runtime: ScrollRuntime = {
        lenis,
        gsap,
        ScrollTrigger,
        SplitText,
        onScroll(cb) {
          listeners.add(cb);
          return () => listeners.delete(cb);
        },
        scheduleRefresh,
        destroy() {
          gsap.ticker.remove(raf);
          lenis.destroy();
          document.documentElement.classList.remove("lenis");
          listeners.clear();
          resetScrollRuntime();
        },
      };
      liveRuntime = runtime;
      return runtime;
    } catch {
      // A blocked dynamic import (offline, extension, CSP) must degrade to
      // the static/reduced-motion presentation, not break the page.
      return null;
    }
  })();

  return runtimePromise;
}

/** Synchronous accessor for code that only wants to act if the runtime already exists (e.g. cleanup on unmount). */
export function getLiveScrollRuntime(): ScrollRuntime | null {
  return liveRuntime;
}

/** Forces the next `getScrollRuntime()` call to reconstruct. Called by
 *  `ScrollRuntime.destroy()`; also exported directly for test/HMR use. */
export function resetScrollRuntime(): void {
  runtimePromise = null;
  liveRuntime = null;
}

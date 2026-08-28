import { useEffect, useLayoutEffect, type DependencyList } from "react";
import { getScrollRuntime, type ScrollRuntime } from "@/lib/scroll-runtime";

type GsapContext = ReturnType<ScrollRuntime["gsap"]["context"]>;

// useLayoutEffect warns if called during SSR; this file's effect is
// browser-only work anyway, so fall back to useEffect on the server.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Shared substrate for every scroll-linked scene. Resolves the lazy
 * Lenis/GSAP singleton and runs `setup` inside a `gsap.context()` so every
 * tween and ScrollTrigger created inside it — however deeply nested — is
 * reverted automatically on cleanup via `ctx.revert()`, then schedules the
 * shared refresh every scene needs after registering its trigger(s).
 *
 * `ctx.revert()` matters over the old per-scene `trigger?.kill()` pattern:
 * `kill()` leaves behind whatever inline style the last `onUpdate` wrote,
 * so a user who navigates away or flips the motion override mid-pin
 * stranded elements at their last scrubbed value. `revert()` restores them.
 *
 * Bails silently to nothing on SSR, reduced motion, or a blocked dynamic
 * import — `getScrollRuntime()` resolves `null` in all three cases, and
 * every scene's JSX must already render its correct static composition
 * (the motion primitives' `initial-value` convention — see styles.css).
 *
 * Deliberately not `@gsap/react`'s `useGSAP()`: that hook requires a
 * static `import { gsap } from "gsap"` in every call site, which would
 * pull GSAP core + ScrollTrigger + SplitText into the eager bundle that
 * `scroll-runtime.ts` otherwise keeps behind a dynamic import fetched
 * after first paint. `gsap.context()` is already in GSAP core and reached
 * only through the already-lazy `getScrollRuntime()`, so this gets the
 * same auto-cleanup for zero new bytes and zero new dependencies.
 *
 * Layout effect, not a passive one, specifically because of `pin: true`:
 * ScrollTrigger pins by reparenting the pinned element into a generated
 * `.pin-spacer` div, which React's fiber tree knows nothing about. A
 * passive (`useEffect`) cleanup runs AFTER React's mutation phase, so on
 * route change React reached `parent.removeChild(section)` while the
 * section still lived inside the spacer and threw `NotFoundError: The node
 * to be removed is not a child of this node`. Running `ctx.revert()` in
 * the layout phase un-nests the spacer synchronously, before React removes
 * anything. Same reason `@gsap/react`'s `useGSAP()` is layout-phase too.
 */
export function useScrollScene(
  setup: (rt: ScrollRuntime) => void,
  deps: DependencyList = [],
): void {
  useIsomorphicLayoutEffect(() => {
    let cancelled = false;
    let ctx: GsapContext | null = null;

    getScrollRuntime().then((rt) => {
      if (cancelled || !rt) return;
      ctx = rt.gsap.context(() => setup(rt));
      rt.scheduleRefresh();
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // `setup` is an inline closure at every call site; callers list their
    // own dependencies explicitly, same convention as a bare useEffect.
  }, deps);
}

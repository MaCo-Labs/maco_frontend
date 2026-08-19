import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { getScrollRuntime, type ScrollRuntime } from "@/lib/scroll-runtime";

/**
 * Lifecycle owner for the Lenis + ScrollTrigger substrate. Mounted once in
 * `__root.tsx`. Renders nothing — every visual piece (WebGL field, pinned
 * scenes, cursor, magnetic buttons) fetches the same singleton via
 * `getScrollRuntime()` and wires its own GSAP timeline/ScrollTrigger.
 *
 * Route changes are the one thing that must be handled centrally: TanStack
 * Router does a client-side navigation without a full reload, so without
 * this a scrolled-down inner page would land already mid-scroll, and stale
 * ScrollTrigger start/end values (measured against the previous route's DOM)
 * would misfire on the new page.
 */
export function ScrollRuntimeProvider() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const runtimeRef = useRef<ScrollRuntime | null>(null);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    let cancelled = false;
    // Set inside the .then() below; declared here so the effect's own
    // cleanup can remove it. A cleanup function returned FROM a
    // `.then()` callback is never called — promises don't support that —
    // so the listener has to be torn down from the outer return instead.
    let onHeroVideoReady: (() => void) | null = null;

    getScrollRuntime().then((rt) => {
      if (cancelled || !rt) return;
      runtimeRef.current = rt;

      // Layout height changes after first paint (web fonts swapping in,
      // the hero video's real dimensions arriving) are the classic cause
      // of a pin's start/end drifting out from under the scrub.
      document.fonts?.ready?.then(() => rt.ScrollTrigger.refresh());
      onHeroVideoReady = () => rt.ScrollTrigger.refresh();
      document.addEventListener("maco:media-ready", onHeroVideoReady);
    });

    return () => {
      cancelled = true;
      if (onHeroVideoReady) document.removeEventListener("maco:media-ready", onHeroVideoReady);
      const rt = runtimeRef.current;
      if (!rt) return;
      rt.ScrollTrigger.getAll().forEach((st) => st.kill());
      rt.destroy();
      runtimeRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;
    const rt = runtimeRef.current;
    if (!rt) return;
    rt.lenis.scrollTo(0, { immediate: true });
    // Let the new route's DOM commit before ScrollTrigger re-measures it.
    requestAnimationFrame(() => rt.ScrollTrigger.refresh());
  }, [pathname]);

  return null;
}

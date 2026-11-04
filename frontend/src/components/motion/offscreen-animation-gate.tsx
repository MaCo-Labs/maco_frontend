import { useEffect } from "react";

const LOOPS = ".ambient-field, .cb-reel";

/**
 * Pauses the site's endless CSS loops while they're off screen, via
 * `[data-offscreen]` (styles.css). Watches #main because the loops live inside
 * route content and come and go with navigation. Renders nothing.
 */
export function OffscreenAnimationGate() {
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        (entry.target as HTMLElement).toggleAttribute("data-offscreen", !entry.isIntersecting);
      }
    });
    const seen = new Set<Element>();
    const scan = () => {
      for (const el of main.querySelectorAll(LOOPS)) {
        if (!seen.has(el)) {
          seen.add(el);
          io.observe(el);
        }
      }
      for (const el of seen) {
        if (!el.isConnected) {
          seen.delete(el);
          io.unobserve(el);
        }
      }
    };
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(main, { childList: true, subtree: true });
    return () => {
      mutations.disconnect();
      io.disconnect();
    };
  }, []);
  return null;
}

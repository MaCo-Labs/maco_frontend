import type { MouseEvent } from "react";
import { getScrollRuntime } from "@/lib/scroll-runtime";

/**
 * Skip-link handler: intercepts the "#main" anchor so Lenis's scroll
 * position and native focus agree. Without this, Lenis still owns the
 * scrollbar and a plain anchor jump either fights it or leaves focus on an
 * element that isn't where the page visually landed — a real keyboard-nav
 * regression, not a nicety.
 */
export function skipToMain(e: MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById("main");
  if (!target) return;
  e.preventDefault();
  getScrollRuntime().then((runtime) => {
    if (runtime) {
      runtime.lenis.scrollTo(target, { immediate: true });
    } else {
      target.scrollIntoView();
    }
    target.setAttribute("tabindex", "-1");
    target.focus();
  });
}

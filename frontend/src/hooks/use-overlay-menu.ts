import { useEffect, type RefObject } from "react";
import { useRouterState } from "@tanstack/react-router";
import { getLiveScrollRuntime } from "@/lib/scroll-runtime";

/**
 * Shared overlay-menu machinery: auto-close on route change, a Tab/Shift+Tab
 * focus trap, Escape-to-close (returning focus to the trigger), a Lenis +
 * body-overflow scroll lock, and focus-first-link on open. Extracted from
 * the original MobilePillNav so a second full-screen menu (the layout-mode
 * 2 desktop nav) doesn't need its own copy of a focus trap — one
 * implementation, every caller.
 */
export function useOverlayMenu({
  open,
  setOpen,
  panelRef,
  triggerRef,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  panelRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const focusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), video[controls], summary, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const rt = getLiveScrollRuntime();
    rt?.lenis.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => focusable()[0]?.focus());
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKey);
      rt?.lenis.start();
      document.body.style.overflow = prev;
      trigger?.focus({ preventScroll: true });
    };
  }, [open, panelRef, setOpen, triggerRef]);
}

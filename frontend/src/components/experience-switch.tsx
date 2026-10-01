import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme, type Theme } from "./theme";
import { useLayout, type LayoutMode } from "./layout-mode";
import { Magnetic } from "@/components/motion/magnetic";

const LAYOUT_MODES: readonly LayoutMode[] = ["1", "2", "3"];
const THEMES: readonly { value: Theme; label: string }[] = [
  { value: "obsidian", label: "Obsidian" },
  { value: "cobalt", label: "Cobalt" },
];

/**
 * Consolidates the old separate LayoutSwitch + ThemeSwitch controls behind
 * one "Experience" trigger, per the brief's ask to group Layout 1/2/3 +
 * Obsidian/Cobalt under a single, clearly-named, user-facing control
 * instead of two internal-looking switches. Same border-line button
 * language those two already used — no new visual language.
 *
 * Drop-in replacement at every call site (header, mode-2 overlay, mobile
 * menu panel) — the surrounding container classes (`.header-controls-primary`
 * etc., styles.css) are untouched, so each layout mode's existing
 * display/position rules for that container keep working unchanged.
 *
 * The panel is portaled to `document.body` and positioned from the
 * trigger's own `getBoundingClientRect()` rather than a plain CSS
 * `position: absolute` — the mobile-menu call site (MobilePillNav) nests
 * this inside a `overflow-hidden` rounded panel that would otherwise clip
 * it. A portal breaks natural DOM tab order (the panel renders at the end
 * of `<body>`, not right after the trigger), so open/close manages focus
 * explicitly and traps Tab inside the panel while open instead of relying
 * on document order.
 *
 * Not `useOverlayMenu` (MobilePillNav's hook) — that scroll-locks the page,
 * built for a full navigation panel. Toggling dark/light shouldn't lock
 * scroll.
 */
export function ExperienceSwitch() {
  const { theme, setTheme } = useTheme();
  const { layout, setLayout } = useLayout();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Viewport-aware, not a fixed "open downward, right-aligned" — the
  // header call sites put the trigger near the top-right (downward/
  // right-aligned is correct there), but layout 3's desktop copy of
  // this same container sits fixed bottom-left (styles.css), where that
  // fixed offset used to push the panel mostly below the viewport and
  // off the left edge at once. Flip up when there's no room below;
  // clamp left/right so it can never run off either side.
  const place = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Each layout mode renders its own `ExperienceSwitch` copy
    // (`.header-controls-primary` for 1/3, `.layout-nav-overlay-controls`
    // for 2 — chrome.tsx) and hides the others via `display: none`
    // (styles.css). Switching layout while THIS copy's panel is open
    // doesn't unmount it, so its now-hidden trigger reports an all-zero
    // rect here — close instead of placing the panel at that meaningless
    // (0, 0) corner.
    if (rect.width === 0 && rect.height === 0) {
      setOpen(false);
      return;
    }
    const panelWidth = panelRef.current?.offsetWidth ?? 240;
    const panelHeight = panelRef.current?.offsetHeight ?? 220;
    const margin = 12;

    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < panelHeight + margin && rect.top >= panelHeight + margin;
    const top = openUp
      ? Math.max(margin, rect.top - panelHeight - 8)
      : Math.min(rect.bottom + 8, window.innerHeight - panelHeight - margin);

    let left = rect.right - panelWidth;
    left = Math.max(margin, Math.min(left, window.innerWidth - panelWidth - margin));

    setCoords({ top, left });
  }, [setOpen]);

  // Separate from the listeners effect below and keyed on `layout` too:
  // layout 3's trigger is `position: fixed` bottom-left
  // (`html[data-layout="3"] .header-control-cluster`, styles.css) — picking
  // it from the panel while already open moves the trigger without
  // changing `open`, so a `[open]`-only effect never recalculates and the
  // panel stays stuck at its old coordinates until the next resize/scroll/
  // reopen. Kept out of the listeners effect so switching layout doesn't
  // also re-steal focus or re-bind the pointerdown/keydown handlers below.
  useEffect(() => {
    if (!open) return;
    place();
  }, [open, layout, place]);

  useEffect(() => {
    if (!open) return;

    const focusable = () =>
      Array.from(panelRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])") ?? []);
    requestAnimationFrame(() => focusable()[0]?.focus());

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, place]);

  return (
    <>
      <Magnetic>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="experience-trigger label flex min-h-11 items-center gap-2 border border-line px-3 py-2 transition-colors hover:border-text hover:text-text"
        >
          <span
            className="experience-swatch block h-2.5 w-2.5 border border-current"
            style={{ background: "var(--accent)" }}
            aria-hidden="true"
          />
          Experience
        </button>
      </Magnetic>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            id={panelId}
            className="fixed z-[90] w-60 border border-line p-4"
            style={{
              top: coords.top,
              left: coords.left,
              background: "var(--surface)",
              borderRadius: "var(--radius-card)",
              boxShadow: "0 12px 40px color-mix(in oklab, var(--bg) 55%, transparent)",
            }}
          >
            <p className="label" style={{ color: "var(--muted)" }}>
              Appearance
            </p>
            <div role="group" aria-label="Appearance" className="mt-2 flex border border-line">
              {THEMES.map(({ value, label }) => {
                const active = theme === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTheme(value, {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                      });
                    }}
                    aria-pressed={active}
                    className="min-h-11 flex-1 px-2 text-xs transition-colors"
                    style={{
                      background: active ? "var(--text)" : "transparent",
                      color: active ? "var(--bg)" : "var(--muted)",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <p className="label mt-4" style={{ color: "var(--muted)" }}>
              Layout
            </p>
            <div role="group" aria-label="Layout" className="mt-2 flex border border-line">
              {LAYOUT_MODES.map((mode) => {
                const active = layout === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setLayout(mode)}
                    aria-pressed={active}
                    aria-label={`Layout ${mode}`}
                    className="min-h-11 flex-1 border-r border-line transition-colors last:border-r-0"
                    style={{
                      background: active ? "var(--text)" : "transparent",
                      color: active ? "var(--bg)" : "var(--muted)",
                    }}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

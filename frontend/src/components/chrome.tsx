import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { nameScripts, site } from "@/content/maco";
import { Mark, Wordmark } from "./mark";
import { useTheme } from "./theme";
import { useLayout, type LayoutMode } from "./layout-mode";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScriptFontsWhenVisible } from "@/hooks/use-script-fonts";
import { usePointerField } from "@/hooks/use-pointer-field";
import { useOverlayMenu } from "@/hooks/use-overlay-menu";
import { Magnetic } from "@/components/motion/magnetic";
import { getScrollRuntime } from "@/lib/scroll-runtime";
import { useScrollScene } from "@/hooks/use-scroll-scene";

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <Magnetic>
      <button
        ref={btnRef}
        type="button"
        onClick={() => {
          const rect = btnRef.current?.getBoundingClientRect();
          const origin = rect
            ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
            : undefined;
          setTheme(theme === "obsidian" ? "cobalt" : "obsidian", origin);
        }}
        aria-label={`Switch to ${theme === "obsidian" ? "Cobalt (blue on white)" : "Obsidian (black on white)"} theme`}
        className="label group flex items-center gap-2 border border-line px-3 py-2 transition-colors hover:border-text hover:text-text"
      >
        <span
          className="block h-2.5 w-2.5 border border-current transition-transform duration-300 group-hover:rotate-90"
          style={{ background: "var(--accent)" }}
        />
        {theme === "obsidian" ? "Obsidian" : "Cobalt"}
      </button>
    </Magnetic>
  );
}

const LAYOUT_MODES: readonly LayoutMode[] = ["1", "2", "3"];

/**
 * Small numbered layout switcher, studied from by-kin.com's own LAYOUT 1/2
 * toggle — MaCo's own type/tokens throughout, three modes instead of two.
 * Always visible (every mode, every viewport) since it's the only way back
 * out of modes 2/3 once chosen. Persists via `setLayout` (localStorage +
 * the pre-paint script in __root.tsx), same anti-FOUC shape as ThemeSwitch.
 */
function LayoutSwitch() {
  const { layout, setLayout } = useLayout();
  return (
    <div role="group" aria-label="Layout" className="label flex items-center border border-line">
      {LAYOUT_MODES.map((mode) => {
        const active = layout === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => setLayout(mode)}
            aria-pressed={active}
            aria-label={`Layout ${mode}`}
            className="flex h-8 w-8 items-center justify-center border-r border-line transition-colors last:border-r-0 hover:text-text"
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
  );
}

/**
 * Mobile floating pill — MaCo-native (React Bits Pill Nav evaluated;
 * custom kept for brand fit, with focus + escape + safe-area).
 */
function MobilePillNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  useOverlayMenu({ open, setOpen, panelRef, triggerRef: buttonRef });
  // Mirrors --ease-emphasis (styles.css) — the sheet used to enter via the
  // `maco-rise` keyframe but had no exit, snapping out of existence
  // (motion audit, PHASE-2-MOTION-PLAN.md item 1). AnimatePresence needs
  // the values as JS so exit gets the same easing as enter.
  const easeEmphasis = [0.16, 1, 0.3, 1] as const;
  const enterTransition = reduced ? { duration: 0 } : { duration: 0.45, ease: easeEmphasis };
  const exitTransition = reduced ? { duration: 0 } : { duration: 0.3, ease: easeEmphasis };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.button
            key="mobile-nav-scrim"
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[45] max-lg:block hidden cursor-default"
            style={{ background: "color-mix(in oklab, var(--bg) 55%, transparent)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: enterTransition }}
            exit={{ opacity: 0, transition: exitTransition }}
          />
        )}
      </AnimatePresence>
      <div
        data-mobile-pill-nav
        data-over="paper"
        className="chrome-adaptive fixed inset-x-0 bottom-0 z-50 hidden max-lg:flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <div className="w-full max-w-sm">
          <AnimatePresence>
            {open && (
              <motion.div
                key="mobile-nav-panel"
                ref={panelRef}
                id={menuId}
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
                className="mb-3 overflow-hidden rounded-[1.75rem] border border-line shadow-[0_-8px_40px_color-mix(in_oklab,var(--bg)_55%,transparent)]"
                style={{ background: "var(--surface)" }}
                initial={{ opacity: 0, y: "1.4rem" }}
                animate={{ opacity: 1, y: 0, transition: enterTransition }}
                exit={{ opacity: 0, y: "1.4rem", transition: exitTransition }}
              >
                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                  <span className="label flex items-center gap-2">
                    <Mark size={18} />
                    MaCo
                  </span>
                  <ThemeSwitch />
                </div>
                <nav aria-label="Mobile">
                  <Link
                    to="/"
                    className="flex items-center justify-between px-6 py-3.5 font-display text-xl"
                    style={{
                      color: pathname === "/" ? "var(--text)" : "var(--muted)",
                    }}
                  >
                    Home
                  </Link>
                  {site.nav.map((item) => {
                    const active = pathname === item.to || pathname.startsWith(item.to + "/");
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex min-h-12 items-center border-t border-line px-6 py-3.5 font-display text-xl"
                        style={{ color: active ? "var(--text)" : "var(--muted)" }}
                      >
                        <span className="flex items-center gap-3">
                          {active && (
                            <span
                              className="block h-1.5 w-1.5 rounded-full"
                              style={{ background: "var(--accent)" }}
                              aria-hidden="true"
                            />
                          )}
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
                <div className="border-t border-line p-3">
                  <Link to="/contact" className="btn-solid w-full justify-center !py-3">
                    Start a project
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={open ? menuId : undefined}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className="flex min-h-12 w-full items-center justify-between rounded-full border border-line px-5 py-3.5 backdrop-blur-xl transition-[border-color,background] duration-300"
            style={{
              background: "color-mix(in oklab, var(--surface) 92%, transparent)",
              borderColor: open ? "var(--text)" : "var(--line)",
            }}
          >
            <span className="flex items-center gap-2.5">
              <Mark size={20} />
              <span className="label">{open ? "Menu" : "MaCo"}</span>
            </span>
            <span className="relative block h-3 w-4" aria-hidden="true">
              <span
                className="absolute inset-x-0 top-0 h-px bg-text transition-transform duration-300"
                style={{ transform: open ? "translateY(6px) rotate(45deg)" : "none" }}
              />
              <span
                className="absolute inset-x-0 bottom-0 h-px bg-text transition-transform duration-300"
                style={{ transform: open ? "translateY(-6px) rotate(-45deg)" : "none" }}
              />
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

const LAYOUT_NAV_CLOSED = "polygon(0% 0%, 0% 0%, -30% 100%, -30% 100%)";
const LAYOUT_NAV_OPEN = "polygon(0% 0%, 130% 0%, 100% 100%, -30% 100%)";

/**
 * Layout modes 2 and 3's shared full-screen menu state — trigger and panel
 * are two separate pieces (below) because they need to sit in two different
 * places in the DOM: the trigger inside the header's flex row (for
 * positioning), the panel as a SIBLING of `<header>`, never a descendant.
 * Nesting the panel inside `<header>` was tried first and broke live: the
 * header carries `.chrome-adaptive[data-over]`, which remaps `--accent`
 * locally to whatever ground the header is currently tracking (deep, on
 * this homepage) — so `background: var(--accent)` resolved to
 * `--accent-inverted` (near-white in both themes) instead of each theme's
 * real accent, inverting the whole panel. Rendering the panel as a header
 * sibling keeps it at true :root scope, where `--accent` is what it's
 * actually supposed to be.
 */
function useLayoutNavState() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  useOverlayMenu({ open, setOpen, panelRef, triggerRef });

  return {
    open,
    setOpen,
    menuId,
    panelRef,
    triggerRef,
    enterTransition: reduced
      ? { duration: 0 }
      : ({ duration: 0.6, ease: [0.16, 1, 0.3, 1] } as const),
    exitTransition: reduced
      ? { duration: 0 }
      : ({ duration: 0.4, ease: [0.4, 0, 0.2, 1] } as const),
  };
}

type LayoutNavState = ReturnType<typeof useLayoutNavState>;

/**
 * Renders once per header-side placement (`layout-hamburger-left` for mode
 * 2's top-left position, `layout-hamburger-right` for mode 3's top-right
 * one) — CSS shows exactly one instance per mode, but BOTH are always in
 * the DOM, since mode 2's slot lives in a different flex container than
 * mode 3's (grouped with Wordmark vs. grouped with ThemeSwitch), and CSS
 * `order` can only reorder within one shared parent, not move an element
 * between two. `triggerRef` is written imperatively on click rather than
 * attached via the `ref` prop, since two DOM buttons can share readable
 * state but not one `ref` attachment — this way Escape always returns
 * focus to whichever instance was actually clicked.
 */
function LayoutNavTrigger({ nav, className }: { nav: LayoutNavState; className: string }) {
  const { open, setOpen, menuId, triggerRef } = nav;
  return (
    <button
      type="button"
      onClick={(e) => {
        triggerRef.current = e.currentTarget;
        setOpen(!open);
      }}
      aria-expanded={open}
      aria-controls={open ? menuId : undefined}
      aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      className={`layout-hamburger flex h-10 w-10 flex-col items-center justify-center gap-[5px] ${className}`}
    >
      <span
        aria-hidden="true"
        className="block h-px w-5 transition-transform duration-300"
        style={{
          background: "var(--text)",
          transform: open ? "translateY(3px) rotate(45deg)" : "none",
        }}
      />
      <span
        aria-hidden="true"
        className="block h-px w-5 transition-transform duration-300"
        style={{
          background: "var(--text)",
          transform: open ? "translateY(-3px) rotate(-45deg)" : "none",
        }}
      />
    </button>
  );
}

/**
 * `polygon()` interpolation needs matching point counts on both ends, which
 * is why LAYOUT_NAV_CLOSED/OPEN above are both 4-point quads — a
 * circle-to-quad or 3-to-4-point mismatch is undefined behavior for the
 * browser's own clip-path interpolation, not just Motion's.
 *
 * Panel color reads `var(--accent)`/`var(--accent-ink)` directly (each
 * theme's own accent — Obsidian near-black, Cobalt blue), never Iventions'
 * yellow-green — see the doc comment on useLayoutNavState for why this
 * component MUST render outside `<header>`'s DOM subtree for that to
 * actually hold.
 */
function LayoutNavPanel({ nav }: { nav: LayoutNavState }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { open, menuId, panelRef, enterTransition, exitTransition } = nav;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="fullscreen-nav"
          id={menuId}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-[46] flex flex-col justify-center"
          style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
          initial={{ clipPath: LAYOUT_NAV_CLOSED }}
          animate={{ clipPath: LAYOUT_NAV_OPEN, transition: enterTransition }}
          exit={{ clipPath: LAYOUT_NAV_CLOSED, transition: exitTransition }}
        >
          <nav
            aria-label="Primary"
            data-lenis-prevent
            className="shell flex max-h-full flex-col overflow-y-auto"
          >
            <Link
              to="/"
              className="py-3 font-display text-4xl md:text-6xl"
              style={{ opacity: pathname === "/" ? 1 : 0.6 }}
            >
              Home
            </Link>
            {site.nav.map((item) => {
              const active = pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="border-t py-3 font-display text-4xl md:text-6xl"
                  style={{
                    opacity: active ? 1 : 0.6,
                    borderColor: "color-mix(in oklab, var(--accent-ink) 20%, transparent)",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/contact"
              className="btn-solid mt-8 w-fit"
              style={{ background: "var(--accent-ink)", color: "var(--accent)" }}
            >
              Start a project
            </Link>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Transparent-over-the-hero, solid-once-scrolled-past, AND ground-adaptive
 * header — three independent ScrollTrigger-driven properties, never React
 * state tied to a scroll listener. `--header-solid` (opacity/blur, via
 * `.header-scroll` in styles.css) scrubs across the Introduction section's
 * own transit; `data-over` (`.chrome-adaptive` in styles.css) snaps to
 * whichever `[data-ground]` section is currently behind the fixed header
 * and mobile pill nav — both mount in `__root.tsx`, above and independent
 * of the homepage's own section tree, so neither ever naturally inherits
 * a ground remap the way an in-flow descendant would. Selects the hero
 * the same way `ground-handoff.tsx` selects every cross-section pair: an
 * exact `aria-label` match, not a ref prop threaded down from the route.
 */
export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const headerRef = useRef<HTMLElement>(null);
  const layoutNav = useLayoutNavState();

  useScrollScene((rt) => {
    const header = headerRef.current;
    const hero = document.querySelector<HTMLElement>('[aria-label="Introduction"]');
    if (header && hero) {
      rt.gsap.fromTo(
        header,
        { "--header-solid": 0 },
        {
          "--header-solid": 1,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        },
      );
    }
  }, []);

  // Adaptive ground: the header and mobile pill nav are both `position:
  // fixed`, mounted in __root.tsx outside every section's DOM subtree, so
  // neither naturally inherits a [data-ground] remap the way an in-flow
  // descendant would. This reads `data-over` on both to match whichever
  // [data-ground] section is currently behind them — CSS half is
  // `.chrome-adaptive[data-over]` in styles.css. No-op on every non-home
  // route (empty `grounds`): both elements keep their default
  // `data-over="paper"` from the JSX.
  //
  // Two earlier approaches here both went stale mid-scroll: a ScrollTrigger
  // (one per section, then a single whole-document one) reads the WRONG
  // section the moment it crosses one that ALSO hosts its own pinning
  // ScrollTrigger (EvidenceExpand, Identity — same hazard ground-
  // handoff.tsx's doc comment describes for transforms, but for trigger
  // geometry) or at a narrower viewport specifically (confirmed live:
  // correct at 1440, wrong past the same section at 390); `rt.onScroll`
  // (Lenis's scroll-progress subscription) skips the trigger/pin geometry
  // but still lags — Lenis only fires "scroll" WHILE position is changing,
  // so the geometry read on the LAST event before rest can be a frame or
  // two behind the settled position, and nothing fires again once
  // scrolling stops to correct it. `gsap.ticker` (the same rAF loop
  // driving Lenis itself — scroll-runtime.ts) re-derives it every frame
  // instead, so it's never more than one frame stale and self-corrects
  // even with no further scroll input.
  useEffect(() => {
    let cancelled = false;
    let rt_: Awaited<ReturnType<typeof getScrollRuntime>> = null;
    let applyGround: (() => void) | null = null;

    getScrollRuntime().then((rt) => {
      if (cancelled || !rt) return;
      const mobileNav = document.querySelector<HTMLElement>("[data-mobile-pill-nav]");
      const grounds = [...document.querySelectorAll<HTMLElement>("[data-ground]")];
      if (grounds.length === 0) return;

      rt_ = rt;
      applyGround = () => {
        const y = 48;
        const current = grounds.find((el) => {
          const rect = el.getBoundingClientRect();
          return rect.top <= y && rect.bottom >= y;
        });
        const ground = current?.dataset["ground"] ?? "paper";
        const header = headerRef.current;
        if (header) header.dataset["over"] = ground;
        if (mobileNav) mobileNav.dataset["over"] = ground;
        // Same sample reused for `<body>`'s own backdrop
        // (html[data-ground-now] in styles.css) — a coarse safety net, not
        // pixel-precise, for anything that ever exposes body's background:
        // margin between two dark sections (the footer gap this was added
        // for) or GroundHandoff's recede scaling a full-bleed section down
        // a couple percent at its edges. Without this, either one shows
        // body's un-grounded default (paper) through the gap.
        document.documentElement.dataset["groundNow"] = ground;
      };
      rt.gsap.ticker.add(applyGround);
    });

    return () => {
      cancelled = true;
      if (rt_ && applyGround) rt_.gsap.ticker.remove(applyGround);
      delete document.documentElement.dataset["groundNow"];
    };
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        data-over="paper"
        className="header-scroll chrome-adaptive fixed inset-x-0 top-0 z-[42] rule-b"
      >
        <div className="shell flex h-20 items-center justify-between gap-6 md:h-24">
          <div className="flex items-center gap-4">
            <LayoutNavTrigger nav={layoutNav} className="layout-hamburger-left" />
            <Link to="/" className="transition-opacity hover:opacity-70" aria-label="MaCo — home">
              <Wordmark />
            </Link>
          </div>

          <nav className="header-nav-row hidden items-center gap-7 lg:flex" aria-label="Primary">
            {site.nav.map((item) => {
              const active = pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="label link-draw transition-colors"
                  style={{ color: active ? "var(--text)" : "var(--muted)" }}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <LayoutSwitch />
            <ThemeSwitch />
            <LayoutNavTrigger nav={layoutNav} className="layout-hamburger-right" />
            <Magnetic className="header-cta hidden lg:inline-flex">
              <Link to="/contact" className="btn-solid !px-4 !py-2.5">
                Start a project
              </Link>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Sibling of <header>, not a descendant — see useLayoutNavState's
          doc comment for why that placement is load-bearing. */}
      <LayoutNavPanel nav={layoutNav} />

      <MobilePillNav />
    </>
  );
}

export function Footer() {
  const scriptRef = useScriptFontsWhenVisible<HTMLSpanElement>();
  const giantMarkRef = usePointerField<HTMLDivElement>();

  return (
    <footer className="section-inverted rule-t pb-28 lg:pb-12">
      <div className="shell">
        {/* pt-24, not the previous mt-32-on-<footer>: margin sits OUTSIDE
            both this section's background and whatever section precedes
            it, so it exposed body's own (paper) background as a white gap
            whenever the section above was also deep — padding can't. */}
        <div className="pt-24">
          <Wordmark size={44} />
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="label">Index</p>
            <ul className="mt-5 space-y-2.5">
              {site.nav.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="link-draw text-sm text-muted hover:opacity-100">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="label">Contact</p>
            <ul className="mt-5 space-y-2.5 text-sm text-muted">
              <li>
                <a href={`mailto:${site.contact_email}`} className="link-draw hover:opacity-100">
                  {site.contact_email}
                </a>
              </li>
              <li>{site.location}</li>
            </ul>
          </div>
        </div>

        <div className="label rule-t flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} MaCo — {site.category}
          </span>
          <span
            ref={scriptRef}
            className="normal-case tracking-normal opacity-70"
            style={{ fontFamily: "var(--font-script-fallback)" }}
            aria-hidden="true"
          >
            {nameScripts.map((s) => s.text).join(" · ")}
          </span>
          <span>Obsidian / Cobalt</span>
        </div>
      </div>

      {/* The giant name moment — technique studied from iventions.com's
          footer wordmark (scale + cursor-following gradient), never their
          literal crop-off-the-edge composition: MaCo is a 4-letter word,
          so it's sized to fill the shell width on its own without needing
          to bleed past it to read as large. */}
      <div className="shell overflow-hidden">
        <div ref={giantMarkRef} className="footer-giant-mark wordmark-trace" aria-hidden="true">
          MaCo
        </div>
      </div>
    </footer>
  );
}

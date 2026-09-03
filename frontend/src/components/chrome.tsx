import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { nameScripts, site } from "@/content/maco";
import { Mark, Wordmark } from "./mark";
import { useTheme } from "./theme";
import { useLayout, type LayoutMode } from "./layout-mode";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useScriptFontsWhenVisible } from "@/hooks/use-script-fonts";
import { usePointerField } from "@/hooks/use-pointer-field";
import { useOverlayMenu } from "@/hooks/use-overlay-menu";
import { Magnetic } from "@/components/motion/magnetic";
import { getScrollRuntime } from "@/lib/scroll-runtime";
import { useScrollScene } from "@/hooks/use-scroll-scene";
import { DUR, EASE_EMPHASIS, EASE_EXIT } from "@/lib/motion";
import { groundAt, SECTION_SELECTOR, type Ground } from "@/lib/ground";

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
        {/* Classed (not a bare text node) so layout 3's mobile control
            cluster (styles.css) can hide it — measured live: the cluster's
            full "1 2 3 [swatch] Obsidian" footprint (~195px) genuinely
            overlapped the centered brand chip's hit area on a 390px
            viewport (elementFromPoint confirmed the brand's own higher
            z-index was swallowing clicks meant for this button). Text
            hides, swatch stays — same pattern as `maco-wordmark-text`. */}
        <span className="theme-switch-text">{theme === "obsidian" ? "Obsidian" : "Cobalt"}</span>
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
  const enterTransition = reduced ? { duration: 0 } : { duration: 0.45, ease: EASE_EMPHASIS };
  const exitTransition = reduced ? { duration: 0 } : { duration: 0.3, ease: EASE_EMPHASIS };

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

// 2026-09-02: two variants, not one, and the desktop one re-measured off
// the owner's own frame-by-frame capture of iventions.com's real open
// state (`docs/references/iventions/NOTES.md`'s menu section): its
// diagonal runs from the top-left corner down to ~93% of the BOTTOM edge
// — a big, dramatic uncovered bottom-left triangle, not the shallow tilt
// an earlier reading of a single static screenshot suggested (that pass
// set 14%, far too little, and the owner flagged the result as still not
// matching). 72% here rather than the reference's own ~93%: our panel's
// nav column is right-aligned inside `.shell` (max-width 88rem, centred),
// so its longest label starts around 70% of a 1920px viewport — at 93%
// the diagonal would cut straight through the lower links. 70% keeps the
// reference's dramatic read with the diagonal still clearing the text at
// every link's own height.
//
// Mobile keeps its own much smaller wedge for the opposite reason: those
// links are LEFT-aligned (matching the reference's own mobile panel), so
// there the wedge and the text compete for the same edge.
//
// 2026-09-02 (second pass): the top edge is a DIAGONAL now, not the full
// width — the owner's own target mockup (and iventions.com's real open
// state behind it) leaves the top-right corner uncovered, so the shard
// reads as a tilted shard rather than a header band with one angled
// bottom. Second point moves from `130% 0%` to `100% 20%`; the panel's
// own persistent top-right controls sit in that uncovered corner and
// keep their chip backgrounds while open for that reason (styles.css).
const LAYOUT_NAV_CLOSED_DESKTOP = "polygon(0% 0%, 0% 0%, -60% 100%, -60% 100%)";
const LAYOUT_NAV_OPEN_DESKTOP = "polygon(0% 0%, 100% 20%, 100% 100%, 70% 100%)";
// Mobile is its own shape entirely, not a narrowed desktop one: the
// uncovered region sits at the TOP-left (page headline still showing
// through above the shard, exactly as the reference's own mobile panel
// does), and the shard owns the whole bottom — which is where the
// left-aligned links live. The previous mobile wedge grew downward from
// the top-left corner into the very corner those links occupy, and only
// a 6rem left-padding hack kept them apart; with the wedge inverted that
// hack is gone (styles.css) and the links sit flush at `.shell`'s own
// gutter like the reference's do. Enters as a downward drop (closed =
// the same quad translated a full viewport up) rather than the desktop's
// sideways sweep — a near-horizontal diagonal wiping in from the left
// reads as a shutter, not a shard.
const LAYOUT_NAV_CLOSED_MOBILE = "polygon(0% -70%, 100% -100%, 100% 0%, 0% 0%)";
const LAYOUT_NAV_OPEN_MOBILE = "polygon(0% 30%, 100% 0%, 100% 100%, 0% 100%)";

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
  // Inverse of whatever `[data-ground]` section sits at viewport centre the
  // moment the panel opens — this panel used to be hardcoded to `"paper"`
  // (tuned against the dark hero, the only place it was opened during that
  // pass); over the homepage's six `paper` sections that reads as a white
  // panel on a white section. Sampled once on open, not tracked live: the
  // panel locks scroll while open (`useOverlayMenu`), so the section behind
  // it can't change mid-open, and a single sample avoids the per-frame
  // ticker `Header` already runs for its own adaptive chrome.
  const [panelGround, setPanelGround] = useState<"paper" | "deep">("paper");
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  useOverlayMenu({ open, setOpen, panelRef, triggerRef });

  // `EdgeNav` (edge-nav.tsx) is a sibling of `<Header>`, not a descendant
  // — this attribute on `<html>` is the cross-component signal it reads
  // (styles.css's `html[data-nav-open]` rule) to quiet its own dots while
  // this panel is open, same shape as `data-cursor-active`/`data-layout`/
  // `data-theme` already use for signalling across components that don't
  // share a parent. Two navigation systems at equal visual weight at once
  // is exactly what the motion/nav pass's menu-vs-dots distinction warns
  // against.
  //
  // `data-nav-ground` rides the same effect: sampled at open (not close, so
  // it stays put through the exit transition instead of snapping back to
  // "paper" mid-wipe), read by styles.css to flip the trigger row/overlay
  // controls to match whichever tone the panel actually took.
  useEffect(() => {
    if (open) {
      const grounds = [...document.querySelectorAll<HTMLElement>(SECTION_SELECTOR)];
      const sectionGround = groundAt(grounds, window.innerHeight / 2);
      const nextPanelGround = sectionGround === "deep" ? "paper" : "deep";
      setPanelGround(nextPanelGround);
      document.documentElement.dataset["navOpen"] = "true";
      document.documentElement.dataset["navGround"] = nextPanelGround;
    } else {
      delete document.documentElement.dataset["navOpen"];
      delete document.documentElement.dataset["navGround"];
    }
    return () => {
      delete document.documentElement.dataset["navOpen"];
      delete document.documentElement.dataset["navGround"];
    };
  }, [open]);

  return {
    open,
    setOpen,
    panelGround,
    menuId,
    panelRef,
    triggerRef,
    reduced,
    enterTransition: reduced ? { duration: 0 } : ({ duration: 0.6, ease: EASE_EMPHASIS } as const),
    exitTransition: reduced ? { duration: 0 } : ({ duration: DUR.ui, ease: EASE_EXIT } as const),
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
/**
 * §11 — a custom MENU/CLOSE treatment beside the two-line mark, not a bare
 * icon: `AnimatePresence` crossfades the word itself (small opacity + rise,
 * `EASE_EMPHASIS`) rather than a generic hamburger-to-X animation carrying
 * the whole message alone. `aria-hidden`: the real accessible name is
 * still the button's own `aria-label` below, this is a sighted-only label.
 */
function LayoutNavTrigger({ nav, className }: { nav: LayoutNavState; className: string }) {
  const { open, setOpen, menuId, triggerRef, reduced } = nav;
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
      className={`layout-hamburger flex h-10 items-center gap-3 ${className}`}
    >
      <span className="relative flex h-10 w-5 flex-col items-center justify-center gap-[5px]">
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
      </span>
      <span className="label relative overflow-hidden" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={open ? "close" : "menu"}
            className="block"
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: reduced ? { duration: 0 } : { duration: DUR.micro, ease: EASE_EMPHASIS },
            }}
            exit={{ opacity: 0, y: -8, transition: { duration: reduced ? 0 : DUR.micro } }}
          >
            {open ? "Close" : "Menu"}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}

/**
 * `polygon()` interpolation needs matching point counts on both ends, which
 * is why LAYOUT_NAV_CLOSED/OPEN above are both 4-point quads — a
 * circle-to-quad or 3-to-4-point mismatch is undefined behavior for the
 * browser's own clip-path interpolation, not just Motion's.
 *
 * 2026-09-02: panel recolored to `data-ground`'s own light/dark token remap
 * instead of each theme's `--accent`/`--accent-ink` — the owner's own direct
 * comparison against iventions.com found the dark Obsidian panel read as a
 * heavy, wrong-feeling wedge next to the reference's pale one. Reusing the
 * existing ground remap (rather than hand-rolling colors) means every
 * descendant — the nav links, the divider borders, the in-panel CTA's
 * `.btn-solid` — resolves correctly through the normal cascade with no
 * per-element override, and still isn't a literal copy of Iventions' own
 * yellow-green: it's MaCo's own paper/deep tone, just applied here instead
 * of Obsidian/Cobalt's near-black/blue accent. `[data-ground]`'s remap only
 * affects DESCENDANTS via custom-property cascade — this element being a
 * `<div>` (not a `<section>`/`<footer>`) means it's excluded from
 * `SECTION_SELECTOR` (`lib/ground.ts`), so it can't pollute the
 * header/EdgeNav/cursor's own ground sampling the way an actual mis-scoped
 * section would.
 *
 * 2026-09-02 (second pass): `data-ground` is no longer hardcoded to
 * `"paper"` — it's `nav.panelGround`, the inverse of whichever ground sits
 * at viewport centre when the panel opens (`useLayoutNavState` above). The
 * literal-paper version was only ever correct while every open click in
 * testing happened over the `deep` hero; scrolled to any of the homepage's
 * six `paper` sections first, it rendered a white panel on a white section.
 *
 * A staggered link entrance, layered on top of the wipe above — the wipe
 * itself is the base mechanism, this is polish on top of it. (The leading
 * light beam that used to run here is gone — same live comparison: it
 * read as a random streak cutting across the shape, not present in the
 * reference at all.)
 *
 * Background is 97% opaque, not solid — the owner's own screen recording
 * of the reference mechanic (§0.6) shows the page content staying dimly
 * visible through/around the wipe, not disappearing behind an opaque
 * block. `backdrop-filter: blur` keeps whatever shows through soft rather
 * than legible, so it reads as depth/atmosphere behind the panel rather
 * than a competing layer of text. (92% first, then raised to 97% the same
 * pass: measured live at 92% the panel's own color was mathematically
 * correct near-white — `oklab(0.992 0 0 / 0.92)`, confirmed via computed
 * style — but the remaining 8% was enough of a window onto a blurred,
 * near-black Obsidian hero to read as a light grey, not the white the
 * owner asked for. This is a paper-ground panel now, considerably paler
 * than the accent-colored one 92% was originally tuned against.)
 */
function LayoutNavPanel({ nav }: { nav: LayoutNavState }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { open, panelGround, menuId, panelRef, enterTransition, exitTransition, reduced } = nav;
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const closedClip = isDesktop ? LAYOUT_NAV_CLOSED_DESKTOP : LAYOUT_NAV_CLOSED_MOBILE;
  const openClip = isDesktop ? LAYOUT_NAV_OPEN_DESKTOP : LAYOUT_NAV_OPEN_MOBILE;

  const navVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduced ? 0 : 0.06, delayChildren: reduced ? 0 : 0.22 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduced ? { duration: 0 } : { duration: DUR.ui, ease: EASE_EMPHASIS },
    },
  };

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
          data-ground={panelGround}
          className="fixed inset-0 z-[46] flex flex-col justify-center overflow-hidden backdrop-blur-xl"
          style={{
            background: "color-mix(in oklab, var(--bg) 97%, transparent)",
            color: "var(--text)",
          }}
          initial={{ clipPath: closedClip }}
          animate={{ clipPath: openClip, transition: enterTransition }}
          exit={{ clipPath: closedClip, transition: exitTransition }}
        >
          <motion.nav
            aria-label="Primary"
            data-lenis-prevent
            className="shell layout-nav-links relative flex max-h-full flex-col overflow-y-auto"
            variants={navVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Link
                to="/"
                className="layout-nav-link block py-3 font-display text-4xl md:text-6xl"
                data-active={pathname === "/"}
              >
                Home
                <span aria-hidden="true" className="layout-nav-link-arrow">
                  →
                </span>
              </Link>
            </motion.div>
            {site.nav.map((item) => {
              const active = pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <motion.div
                  key={item.to}
                  variants={itemVariants}
                  className="border-t"
                  style={{ borderColor: "color-mix(in oklab, var(--text) 20%, transparent)" }}
                >
                  <Link
                    to={item.to}
                    className="layout-nav-link block py-3 font-display text-4xl md:text-6xl"
                    data-active={active}
                  >
                    {item.label}
                    <span aria-hidden="true" className="layout-nav-link-arrow">
                      →
                    </span>
                  </Link>
                </motion.div>
              );
            })}
            <motion.div variants={itemVariants} className="mt-8 w-fit">
              {/* No inline color override needed — `.btn-solid` already
                  reads `--accent`/`--accent-ink`, which this panel's own
                  `data-ground="paper"` above already remapped correctly. */}
              <Link to="/contact" className="btn-solid">
                Start a project
              </Link>
            </motion.div>
          </motion.nav>
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
  // Invalidates a still-pending retry (below) from a PREVIOUS pathname once
  // a newer one starts — requestAnimationFrame isn't tracked by
  // useScrollScene's own gsap.context()-based cleanup, so a stale retry
  // from an earlier run could otherwise still fire and build a duplicate
  // trigger after a second, faster navigation superseded it.
  const runTokenRef = useRef(0);

  useScrollScene(
    (rt) => {
      const header = headerRef.current;
      if (!header) return;
      const myToken = ++runTokenRef.current;

      // `[aria-label="Introduction"]` alone is ambiguous across routes —
      // `/about`, `/clients`, `/contact`, `/products`, `/products/$slug`,
      // `/services`, `/services/$slug`, and `/work` each have their OWN
      // section with this exact aria-label (all `data-ground="paper"`).
      // TOPHEAD (the homepage hero this trigger actually wants) is the
      // only one that's `data-ground="deep"` — a real bug, caught live:
      // on a fast client-nav FROM one of those routes TO `/`, the OUTGOING
      // route's own "Introduction" section is still momentarily in the DOM
      // (confirmed via frame-by-frame probing — present at frame 0,
      // replaced by TOPHEAD around frame 13) when this query's first,
      // synchronous check ran, so it grabbed THAT stale section instead.
      // GSAP then measured a node that was detached moments later, giving
      // a permanently degenerate near-zero scroll range (start ≈ end) —
      // `--header-solid` never moves again because the geometry it's
      // scrubbing across doesn't exist, not because progress isn't
      // updating. Scoping to `[data-ground="deep"]` too resolves the
      // collision using data the two sections already disagree on.
      //
      // `pathname` alone also isn't a reliable "the DOM is ready" signal
      // on its own: TanStack Router updates location.pathname as soon as
      // navigation is committed, which can land BEFORE the target route's
      // own (code-split) chunk has actually rendered its sections into the
      // DOM — confirmed live, the same race `applyGround` above hit. That
      // one fixed itself by re-deriving every tick; a ScrollTrigger can't
      // be "re-derived" the same way (it's a discrete object, not a
      // per-frame read), so this instead retries across frames — the same
      // "re-aim, don't just nudge once" bounded-retry shape
      // scripts/shoot.mjs already uses for this exact class of
      // route-transition timing flake — until the hero exists or a route
      // genuinely has none (e.g. /about), where it gives up after ~1.5s
      // rather than polling forever.
      let attempts = 0;
      const MAX_ATTEMPTS = 90;
      const tryBuild = () => {
        if (runTokenRef.current !== myToken) return;
        const hero = document.querySelector<HTMLElement>(
          'section[aria-label="Introduction"][data-ground="deep"]',
        );
        if (!hero) {
          if (++attempts < MAX_ATTEMPTS) requestAnimationFrame(tryBuild);
          return;
        }
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
      };
      tryBuild();
    },
    [pathname],
  );

  // Adaptive ground: the header, mobile pill nav, and layout-nav trigger
  // overlay are all `position: fixed`, mounted in __root.tsx (or, for the
  // trigger overlay, as a header sibling — see item 10's fix above) outside
  // every section's DOM subtree, so none of them naturally inherit a
  // [data-ground] remap the way an in-flow descendant would. This reads
  // `data-over` on all three to match whichever [data-ground] section is
  // currently behind them — CSS half is `.chrome-adaptive[data-over]` in
  // styles.css. No-op on every non-home route (empty `grounds`): all three
  // elements keep their default `data-over="paper"` from the JSX.
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
    // header/mobileNav/triggerOverlay/edgeNav are all mounted once at
    // __root.tsx's root level, above <Outlet> — they never unmount or
    // change identity across a route change, so querying them once here
    // is safe. `[data-ground]` sections are different: they live INSIDE
    // each route's own content, so a snapshot of them taken once at effect
    // setup goes stale on navigation.
    const mobileNav = document.querySelector<HTMLElement>("[data-mobile-pill-nav]");
    const triggerOverlay = document.querySelector<HTMLElement>("[data-nav-trigger-overlay]");
    const edgeNav = document.querySelector<HTMLElement>("[data-edge-nav]");
    // Carried across ticks as `groundAt`'s fallback (lib/ground.ts) — a
    // continuous tracker holding its own last value on a momentary
    // no-match gap (GroundHandoff's recede transforms are the main
    // source, see that fn's own doc comment) reads as "no change" instead
    // of a flash to paper. Plain closure vars, not React state: this is a
    // per-frame ticker callback, not a render.
    let lastTop: Ground = "paper";
    let lastEdge: Ground = "paper";

    getScrollRuntime().then((rt) => {
      if (cancelled || !rt) return;
      rt_ = rt;
      applyGround = () => {
        // Queried fresh every tick, not cached — first tried as a
        // `[pathname]`-keyed effect dep instead (re-running this whole
        // setup per route), but that raced TanStack Router's own code
        // splitting: `pathname` updates before the target route's lazy
        // chunk has actually rendered its sections into the DOM, so the
        // dep-triggered re-run still captured the OUTGOING route's
        // section list. Re-deriving on every frame, the same "never more
        // than one frame stale, self-corrects with no further input"
        // property the ticker already gives scroll position, removes the
        // staleness question entirely — confirmed live: /about ->
        // client-nav to `/` previously left the deep-ground hero under a
        // paper-toned header until a hard reload; now it resolves within
        // one frame of the new route's sections actually existing.
        const grounds = [...document.querySelectorAll<HTMLElement>(SECTION_SELECTOR)];
        // Header/pill-nav/trigger-overlay all sample near the top — that's
        // where they actually render. EdgeNav's dots are vertically
        // centered (edge-nav.tsx), so sampling y=48 for them picked
        // whatever section happened to be at the TOP of the viewport, not
        // behind the dots themselves — wrong section any time the two
        // differ, which is most of the page.
        const topGround = groundAt(grounds, 48, lastTop);
        const edgeGround = groundAt(grounds, window.innerHeight / 2, lastEdge);
        lastTop = topGround;
        lastEdge = edgeGround;
        const header = headerRef.current;
        if (header) header.dataset["over"] = topGround;
        if (mobileNav) mobileNav.dataset["over"] = topGround;
        if (triggerOverlay) triggerOverlay.dataset["over"] = topGround;
        if (edgeNav) edgeNav.dataset["over"] = edgeGround;
        // `<body>`'s own backdrop (html[data-ground-now] in styles.css)
        // takes the CENTRE sample, not the top one: body shows through
        // wherever a section doesn't fully paint — a margin between two
        // sections, or GroundHandoff's outgoing opacity fade, which is
        // literally a section going part-transparent while it's still the
        // main thing on screen. So body has to match the section that OWNS
        // the viewport, not the sliver behind the header. Sampled at y=48
        // it lagged by most of a viewport at METHOD (deep, arriving under a
        // still-paper top sliver): the fading deep section composited
        // against a near-white body as mid-grey, then snapped to black the
        // moment the top sample finally flipped — reported live as "it
        // doesn't transition, it just becomes black". On a route with no
        // [data-ground] sections at all, `grounds` is empty and `groundAt`
        // falls back to "paper" — no separate no-op branch needed.
        document.documentElement.dataset["groundNow"] = edgeGround;
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
          <div className="header-brand-group flex items-center gap-4">
            {/* Reserves the trigger's old flex slot so the wordmark doesn't
                shift left into where the real (now sibling-rendered, see
                below) trigger visually sits. */}
            <span aria-hidden="true" className="layout-hamburger-left h-10 w-10 shrink-0" />
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

          <div className="header-control-cluster flex items-center gap-3">
            {/* Mode 2 hides this specific pair (styles.css) — the trigger
                overlay below paints an opaque backdrop across the WHOLE top
                strip at z-[47], above this cluster's z-[42], so leaving
                these visible here would just mean a covered, invisible-but-
                technically-present duplicate of the overlay's own working
                copy. Everywhere else (modes 1 and 3, which have no such
                backdrop) this is the only copy and stays visible. */}
            <div className="header-controls-primary flex items-center gap-3">
              <LayoutSwitch />
              <ThemeSwitch />
            </div>
            {/* Same reservation as the brand-group spacer above, for the
                mode-3 (top-right) trigger placement. */}
            <span aria-hidden="true" className="layout-hamburger-right h-10 w-10 shrink-0" />
            <Magnetic className="header-cta hidden lg:inline-flex">
              <Link to="/contact" className="btn-solid !px-4 !py-2.5">
                Start a project
              </Link>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* Item 10 fix: the trigger used to render inside `<header>`, whose
          `position:fixed` + `z-[42]` makes it a stacking context of its
          own — a descendant's z-index can only win against its *siblings*
          inside that context, it can never out-rank a context that sits
          higher at the root (the panel below, z-[46], is a root-level
          `<header>` sibling). So once the panel opened, its own content
          painted over the entire header layer regardless of the button's
          local z-index, and clicks landed on the panel's first link
          instead of the button underneath it. Fix: render the trigger as
          a root-level sibling too (same move `LayoutNavPanel` already
          made, for the same reason), at `z-[47]` — above the panel,
          always clickable. `pointer-events-none` on this wrapper keeps it
          from stealing clicks meant for the header's own wordmark/theme
          switch/CTA in the space where no button actually is; the two
          buttons opt back in with `pointer-events-auto`. Reuses `.shell`
          so it lines up with the header's own padding without repeating
          the breakpoint math. `chrome-adaptive` + `data-over` mirrors the
          same ground-adaptive text-color remap `<header>` gets — without
          it the icon reads `--text` from :root instead of the current
          ground, and goes invisible over a dark hero (confirmed live: it
          rendered pitch black on Obsidian). `data-nav-trigger-overlay` is
          the hook the ground-tracking effect above uses to keep it synced,
          same way it already syncs `[data-mobile-pill-nav]`. */}
      <div
        data-nav-trigger-overlay
        data-over="paper"
        className="chrome-adaptive pointer-events-none fixed inset-x-0 top-0 z-[47]"
      >
        <div className="shell flex h-20 items-center gap-3 md:h-24">
          <LayoutNavTrigger nav={layoutNav} className="layout-hamburger-left pointer-events-auto" />
          <LayoutNavTrigger
            nav={layoutNav}
            className="layout-hamburger-right pointer-events-auto ml-auto"
          />
          {/* Mode 2 only (styles.css) — the wipe covers everything BEHIND
              this overlay, but this overlay itself is the layer that must
              stay visible throughout, per the reference: CLOSE (left,
              LayoutNavTrigger above) / wordmark (center) / layout switch +
              theme toggle + CTA (right) never disappear under the panel.
              LayoutSwitch/ThemeSwitch's real copy lives in the header below
              (`.header-controls-primary`) for modes 1/3, which have no
              backdrop here to hide behind — this is the working copy for
              mode 2 specifically, not a second independent instance
              visible at the same time as that one (CSS shows exactly one
              per mode). `ml-auto` here (not on the CTA) is what pushes the
              whole right-hand group away from centre; harmless in mode 3,
              where this stays `display:none` (as does the right trigger,
              which also carries an `ml-auto` for that mode). */}
          <div className="layout-nav-overlay-controls pointer-events-auto ml-auto hidden items-center gap-3">
            <LayoutSwitch />
            <ThemeSwitch />
          </div>
          <Magnetic className="layout-nav-overlay-cta pointer-events-auto hidden">
            <Link to="/contact" className="btn-solid !px-4 !py-2.5">
              Start a project
            </Link>
          </Magnetic>
        </div>
        {/* Centered independently of the row's flex children — this fixed
            div is itself a containing block for `position: absolute`, so
            centering against IT (not the `.shell`'s padded content box)
            keeps the wordmark on the true viewport center regardless of
            how wide the left/right slots are. */}
        <Link
          to="/"
          className="layout-nav-overlay-brand pointer-events-auto absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
          aria-label="MaCo — home"
        >
          <Wordmark />
        </Link>
      </div>

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
    <footer
      data-ground="deep"
      aria-label="Site footer"
      className="section-inverted rule-t pb-28 lg:pb-12"
    >
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
          to bleed past it to read as large. `data-cursor="torch"` turns
          the custom cursor into the light source while hovering here —
          see cursor.tsx's CURSOR_SELECTOR and styles.css's
          `[data-state="torch"]` rule. */}
      <div className="shell overflow-hidden">
        <div
          ref={giantMarkRef}
          data-cursor="torch"
          className="footer-giant-mark wordmark-trace"
          aria-hidden="true"
        >
          MaCo
        </div>
      </div>
    </footer>
  );
}

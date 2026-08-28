import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/content/maco";
import { Mark, Wordmark } from "./mark";
import { useTheme } from "./theme";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScriptFontsWhenVisible } from "@/hooks/use-script-fonts";
import { Magnetic } from "@/components/motion/magnetic";
import { getLiveScrollRuntime } from "@/lib/scroll-runtime";
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
  // Mirrors --ease-emphasis (styles.css) — the sheet used to enter via the
  // `maco-rise` keyframe but had no exit, snapping out of existence
  // (motion audit, PHASE-2-MOTION-PLAN.md item 1). AnimatePresence needs
  // the values as JS so exit gets the same easing as enter.
  const easeEmphasis = [0.16, 1, 0.3, 1] as const;
  const enterTransition = reduced ? { duration: 0 } : { duration: 0.45, ease: easeEmphasis };
  const exitTransition = reduced ? { duration: 0 } : { duration: 0.3, ease: easeEmphasis };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const focusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;
      // Keep focus inside the panel — wrap at either end instead of letting
      // Tab escape into the page behind the scrim.
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    // Lenis intercepts wheel/touch directly rather than relying on native
    // overflow, so `body { overflow: hidden }` alone doesn't reliably stop
    // it — the page can keep smooth-scrolling under an open panel. Stop
    // Lenis explicitly, and keep the overflow lock too as the fallback for
    // when Lenis isn't running (reduced motion, blocked dynamic import).
    const rt = getLiveScrollRuntime();
    rt?.lenis.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus first link
    requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>("a");
      first?.focus();
    });
    return () => {
      document.removeEventListener("keydown", onKey);
      rt?.lenis.start();
      document.body.style.overflow = prev;
    };
  }, [open]);

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
      <div className="fixed inset-x-0 bottom-0 z-50 hidden max-lg:flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
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

/**
 * Transparent-over-the-hero, solid-once-scrolled-past header. Driven by
 * one ScrollTrigger scrubbing OPEN's own transit (never React state tied
 * to a scroll listener) — see `--header-solid`'s registration and the
 * `.header-scroll` utility in styles.css for the property/CSS half of
 * this device. Selects OPEN the same way `ground-handoff.tsx` selects
 * every cross-section pair: an exact `aria-label` match, not a ref prop
 * threaded down from the route — `<Header>` mounts in `__root.tsx`, above
 * and independent of the homepage's own section tree.
 */
export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const headerRef = useRef<HTMLElement>(null);

  useScrollScene((rt) => {
    const header = headerRef.current;
    const hero = document.querySelector<HTMLElement>('[aria-label="Introduction"]');
    if (!header || !hero) return;
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
  }, []);

  return (
    <>
      <header ref={headerRef} className="header-scroll fixed inset-x-0 top-0 z-[42] rule-b">
        <div className="shell flex h-20 items-center justify-between gap-6 md:h-24">
          <Link to="/" className="transition-opacity hover:opacity-70" aria-label="MaCo — home">
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
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
            <ThemeSwitch />
            <Magnetic className="hidden lg:inline-flex">
              <Link to="/contact" className="btn-solid !px-4 !py-2.5">
                Start a project
              </Link>
            </Magnetic>
          </div>
        </div>
      </header>

      <MobilePillNav />
    </>
  );
}

export function Footer() {
  const scriptRef = useScriptFontsWhenVisible<HTMLSpanElement>();

  return (
    <footer className="section-inverted rule-t mt-32 pb-28 lg:pb-12">
      <div className="shell">
        <div className="pt-16">
          <Wordmark size={44} />
        </div>

        <div className="grid gap-12 py-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="display-md max-w-sm">Tell us what has to work.</p>
            <Magnetic className="mt-8 inline-block">
              <Link to="/contact" className="btn-solid">
                Start a project
                <span aria-hidden="true">→</span>
              </Link>
            </Magnetic>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
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
            MaCo · മാകോ · माको · ماكو · Мако · マコ · 마코
          </span>
          <span>Obsidian / Cobalt</span>
        </div>
      </div>
    </footer>
  );
}

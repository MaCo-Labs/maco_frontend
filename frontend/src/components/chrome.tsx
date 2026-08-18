import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/content/maco";
import { Mark, Wordmark } from "./mark";
import { useTheme } from "./theme";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScriptFontsWhenVisible } from "@/hooks/use-script-fonts";

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "obsidian" ? "cobalt" : "obsidian")}
      aria-label={`Switch to ${theme === "obsidian" ? "Cobalt (blue on white)" : "Obsidian (black on white)"} theme`}
      className="group flex items-center gap-2 border border-line px-3 py-2 font-mono text-[0.625rem] tracking-[0.2em] uppercase text-muted transition-colors hover:border-text hover:text-text"
    >
      <span
        className="block h-2.5 w-2.5 border border-current transition-transform duration-500 group-hover:rotate-90"
        style={{ background: "var(--accent)" }}
      />
      {theme === "obsidian" ? "Obsidian" : "Cobalt"}
    </button>
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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus first link
    requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>("a");
      first?.focus();
    });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 hidden max-lg:flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="w-full max-w-sm">
        {open && (
          <div
            ref={panelRef}
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="mb-3 overflow-hidden rounded-[1.75rem] border border-line shadow-[0_-8px_40px_color-mix(in_oklab,var(--bg)_55%,transparent)]"
            style={{
              background: "var(--surface)",
              animation: reduced ? undefined : "maco-rise 0.45s var(--ease-emphasis) both",
            }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.22em] uppercase text-muted">
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
                <span className="font-mono text-[0.625rem] text-muted">00</span>
              </Link>
              {site.nav.map((item, i) => {
                const active = pathname === item.to || pathname.startsWith(item.to + "/");
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex min-h-12 items-center justify-between border-t border-line px-6 py-3.5 font-display text-xl"
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
                    <span className="font-mono text-[0.625rem] text-muted">
                      {String(i + 1).padStart(2, "0")}
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
          </div>
        )}
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
            <span className="font-mono text-[0.625rem] tracking-[0.22em] uppercase text-muted">
              {open ? "Menu" : "MaCo"}
            </span>
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
  );
}

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <header
        className="sticky top-0 z-40 rule-b backdrop-blur-md"
        style={{ background: "color-mix(in oklab, var(--bg) 88%, transparent)" }}
      >
        <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
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
                  className="link-draw font-mono text-[0.6875rem] tracking-[0.2em] uppercase transition-colors"
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
            <Link to="/contact" className="hidden btn-solid !px-4 !py-2.5 lg:inline-flex">
              Start a project
            </Link>
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
        <div className="grid gap-12 py-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="display-md max-w-sm">Tell us what has to work.</p>
            <Link to="/contact" className="btn-solid mt-8">
              Start a project
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <p className="label">Index</p>
            <ul className="mt-5 space-y-2.5">
              {site.nav.map((n) => (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    className="link-draw text-sm hover:opacity-100"
                    style={{ color: "var(--muted-inverted)" }}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="label">Contact</p>
            <ul className="mt-5 space-y-2.5 text-sm" style={{ color: "var(--muted-inverted)" }}>
              <li>
                <a href={`mailto:${site.contact_email}`} className="link-draw hover:opacity-100">
                  {site.contact_email}
                </a>
              </li>
              <li>{site.location}</li>
            </ul>
          </div>
        </div>

        <div
          className="rule-t flex flex-col gap-3 py-6 font-mono text-[0.625rem] tracking-[0.18em] uppercase sm:flex-row sm:items-center sm:justify-between"
          style={{ color: "var(--muted-inverted)", borderColor: "var(--line-inverted)" }}
        >
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

import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { products, projects, services, site } from "@/content/maco";
import { Mark } from "./mark";
import { useTheme } from "./theme";
import { useOverlayMenu } from "@/hooks/use-overlay-menu";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE_EMPHASIS } from "@/lib/motion";

const OPEN_EVENT = "maco:command-menu";

type Entry = { group: string; title: string; hint: string; to?: string };

/** Built from the content model, so it can only list things that exist. */
const ENTRIES: Entry[] = [
  { group: "Pages", title: "Home", hint: "Page", to: "/" },
  ...site.nav.map((n) => ({ group: "Pages", title: n.label, hint: "Page", to: n.to })),
  ...projects.map((p) => ({
    group: "Work",
    title: p.title,
    hint: p.sector,
    to: `/work/${p.slug}`,
  })),
  ...products.map((p) => ({
    group: "Products",
    title: p.title,
    hint: p.short_description,
    to: `/products/${p.slug}`,
  })),
  ...services.flatMap((s) => [
    { group: "Services", title: s.title, hint: "Service line", to: `/services/${s.slug}` },
    ...s.capabilities.map((c) => ({
      group: "Services",
      title: c.title,
      hint: s.title,
      to: `/services/${s.slug}`,
    })),
  ]),
  { group: "Actions", title: "Start a project", hint: "Contact form", to: "/contact" },
  { group: "Actions", title: "Switch theme", hint: "Obsidian / Cobalt" },
];

function search(query: string): Entry[] {
  const q = query.trim().toLowerCase();
  if (!q) return ENTRIES;
  // Hints only from 3 letters up: "so" should not list every capability of
  // Business Software.
  return ENTRIES.filter(
    (e) => e.title.toLowerCase().includes(q) || (q.length > 2 && e.hint.toLowerCase().includes(q)),
  );
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase();
  const at = q ? text.toLowerCase().indexOf(q) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + q.length)}</mark>
      {text.slice(at + q.length)}
    </>
  );
}

/** Ctrl/⌘ K, on every route. Same focus trap and scroll lock as the nav overlays. */
export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const reduced = useReducedMotion();
  const shown = search(query);
  useOverlayMenu({ open, setOpen, panelRef, triggerRef });

  useEffect(() => {
    const toggle = () => {
      triggerRef.current = document.activeElement as HTMLElement | null;
      setQuery("");
      setActive(0);
      setOpen((was) => !was);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, toggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, toggle);
    };
  }, []);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [active, query]);

  function run(entry: Entry | undefined) {
    if (!entry) return;
    setOpen(false);
    if (entry.to) void navigate({ to: entry.to });
    else setTheme(theme === "obsidian" ? "cobalt" : "obsidian");
  }

  const transition = reduced ? { duration: 0 } : { duration: 0.28, ease: EASE_EMPHASIS };
  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="command-menu"
          className="command-menu-scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Jump to a page, project, product or service"
            data-ground="paper"
            className="command-menu"
            initial={reduced ? false : { y: 12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={reduced ? {} : { y: 8, scale: 0.985 }}
            transition={transition}
          >
            <div className="command-menu-input">
              <Mark size={22} style={{ color: "var(--text)" }} />
              <input
                role="combobox"
                aria-expanded="true"
                aria-controls={`${uid}-list`}
                aria-activedescendant={shown[active] ? `${uid}-${active}` : undefined}
                aria-label="Search MaCo"
                placeholder="Jump to…"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => Math.min(a + 1, shown.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) => Math.max(a - 1, 0));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    run(shown[active]);
                  }
                }}
              />
              <kbd>Esc</kbd>
            </div>
            <div
              id={`${uid}-list`}
              role="listbox"
              aria-label="Results"
              data-lenis-prevent
              className="command-menu-list"
            >
              {shown.length === 0 && <p className="command-menu-empty">Nothing by that name.</p>}
              {shown.map((entry, i) => {
                const heading = entry.group !== lastGroup;
                lastGroup = entry.group;
                return (
                  <div key={entry.group + entry.title} role="presentation">
                    {heading && (
                      <p className="label command-menu-group" role="presentation">
                        {entry.group}
                      </p>
                    )}
                    <div
                      ref={i === active ? activeRef : undefined}
                      id={`${uid}-${i}`}
                      role="option"
                      aria-selected={i === active}
                      className="command-menu-item"
                      onMouseMove={() => setActive(i)}
                      onClick={() => run(entry)}
                    >
                      <span>
                        <b>
                          <Highlighted text={entry.title} query={query} />
                        </b>
                        <small>{entry.hint}</small>
                      </span>
                      <kbd aria-hidden="true">↵</kbd>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="command-menu-foot" aria-hidden="true">
              <span>
                <kbd>↑</kbd> <kbd>↓</kbd> move
              </span>
              <span>
                <kbd>↵</kbd> open
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Visible way in for people who don't know the shortcut. Desktop only. */
export function CommandHint() {
  const [mac, setMac] = useState(false);
  useEffect(() => setMac(/mac/i.test(navigator.platform)), []);
  return (
    <button
      type="button"
      className="command-hint"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
    >
      <kbd>{mac ? "⌘" : "Ctrl"}</kbd> <kbd>K</kbd> jump anywhere
    </button>
  );
}

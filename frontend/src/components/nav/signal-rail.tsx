import { Link, useRouterState } from "@tanstack/react-router";
import { SIGNAL_RAIL_STOPS, getActiveSignalStop } from "@/lib/signal-rail";

/**
 * Item 6 — a consistent MaCo wayfinding system across Scope (home) / Model
 * (services) / Build (work, clients, products) / Hand over (contact). The
 * desktop half: a single quiet right-edge column reusing EdgeNav's own
 * column/dot markup verbatim — `.edge-nav-col`, `.edge-nav-dot`,
 * `-dot-mark`, `-dot-label` (all styles.css) — with a shorter, four-stop
 * list instead of the six-item `site.nav`. No new visual vocabulary at all,
 * not even a new class for the column itself.
 *
 * Mode 1 (the default experience) only — mode 3 already has EdgeNav's full
 * six-item column pair doing this exact job; a second dot rail alongside it
 * would compete rather than layer. Mode 2's full-screen panel has no edge
 * chrome of its own either way. See the CSS gate in styles.css.
 *
 * Ground/theme sync piggybacks on chrome.tsx's existing `applyGround`
 * ticker (the same one already keeping the header, mobile pill nav, trigger
 * overlay and EdgeNav painted correctly against whatever section sits
 * behind them) via `data-signal-rail`, a fifth query target added there —
 * no second scroll-tracking loop.
 */
export function SignalRail() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = getActiveSignalStop(pathname);

  return (
    <nav
      data-signal-rail
      data-over="paper"
      suppressHydrationWarning
      aria-label="Page section"
      className="signal-rail chrome-adaptive pointer-events-none fixed inset-0 z-[43]"
    >
      <ul
        data-side="right"
        className="edge-nav-col pointer-events-auto absolute top-1/2 flex -translate-y-1/2 flex-col gap-5"
      >
        {SIGNAL_RAIL_STOPS.map((stop) => {
          const isActive = active === stop.id;
          return (
            <li key={stop.id}>
              <Link
                to={stop.to}
                data-active={isActive}
                aria-current={isActive ? "page" : undefined}
                className="edge-nav-dot flex-row-reverse"
              >
                <span aria-hidden="true" className="edge-nav-dot-mark" />
                <span aria-hidden="true" className="edge-nav-dot-label">
                  {stop.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

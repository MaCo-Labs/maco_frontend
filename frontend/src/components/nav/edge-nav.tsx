import { Link, useRouterState } from "@tanstack/react-router";
import { site } from "@/content/maco";

const LEFT = site.nav.slice(0, 3); // Services, Work, Products
const RIGHT = site.nav.slice(3); // Clients, About, Contact
// The bar (below `lg`) wants the full six-item list in document order, not
// the LEFT/RIGHT split above — that split exists only to feed two columns.

/**
 * Quiet page-indicator dots at both viewport edges — layout modes 2/3
 * only (styles.css gates visibility and hides this below `lg`, where
 * mode 1's mobile pill nav owns navigation instead). Replaces the boxed
 * rail links from the previous pass: no container, no border, no
 * backdrop-blur — two independent fixed columns of real `<Link>`s
 * positioned directly against the viewport, so the centre of the page
 * stays the page's own content (motion/nav pass §2).
 *
 * Each dot IS the six-item `site.nav` (the same list the header row,
 * mobile pill nav, and layout-nav panel all already render) split at its
 * midpoint — first half to the left edge, second half to the right, not
 * a per-item authored side. Active state is the current ROUTE, the same
 * `pathname === item.to || pathname.startsWith(item.to + "/")` check
 * every other nav surface on the site already uses — these are page
 * links, not in-page section markers, so a plain `<Link>` is the whole
 * mechanism: real href, native keyboard/middle-click/right-click
 * behaviour, no scroll-tracking or click handler required.
 *
 * Ground/theme awareness is `chrome.tsx`'s existing sync: this root's
 * `data-edge-nav` is a fourth target in the same `applyGround` effect
 * that already keeps the header, mobile pill nav, and trigger overlay
 * painted correctly against whatever section currently sits behind them
 * — the dots and labels resolve `var(--text)`/`var(--muted)` through
 * that same `.chrome-adaptive[data-over]` remap, so they read correctly
 * (and transition smoothly) over every section's own ground and theme.
 * Sampled at viewport CENTER (`lib/ground.ts`'s `groundAt`), not the
 * header's y=48 — these dots sit vertically centered, not at the top, so
 * sampling the top would (and did) resolve the wrong section's ground.
 *
 * `z-[43]`: one above the header's `z-[42]` — PREVIEW and IDENTITY
 * (`evidence-expand.tsx`, `identity.tsx`) are both `relative z-[41]` with
 * opaque grounds, which painted over these dots at `z-40` (the original
 * value only ever reasoned about staying below the header, not about
 * those two sections). Still below the layout-nav panel's `z-[46]`.
 *
 * 2026-09-02: added `EdgeBar`, a third list rendered alongside the two
 * columns — CSS swaps between them at `64rem` (styles.css), columns above,
 * bar below. Not a mobile shrink of the same dots: `.edge-nav-dot-label`
 * is `opacity: 0` at rest, revealed on `:hover`/`:focus-visible`/
 * `[data-active]` (styles.css), which is correct for a desktop rail a
 * pointer can hover but leaves a touch device with five of six unlabelled
 * 6px targets and no way to see what they are before tapping. The bar's
 * own label sits visible at rest instead of reusing that hover-revealed
 * one.
 */
export function EdgeNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      data-edge-nav
      data-over="paper"
      aria-label="Site"
      className="edge-nav chrome-adaptive pointer-events-none fixed inset-0 z-[43]"
    >
      <EdgeColumn side="left" items={LEFT} pathname={pathname} />
      <EdgeColumn side="right" items={RIGHT} pathname={pathname} />
      <EdgeBar pathname={pathname} />
    </nav>
  );
}

function EdgeColumn({
  side,
  items,
  pathname,
}: {
  side: "left" | "right";
  items: typeof LEFT;
  pathname: string;
}) {
  return (
    <ul
      data-side={side}
      className="edge-nav-col pointer-events-auto absolute top-1/2 flex -translate-y-1/2 flex-col gap-5"
    >
      {items.map((item) => {
        const active = pathname === item.to || pathname.startsWith(item.to + "/");
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              data-active={active}
              aria-current={active ? "page" : undefined}
              className={`edge-nav-dot ${side === "right" ? "flex-row-reverse" : ""}`}
            >
              <span aria-hidden="true" className="edge-nav-dot-mark" />
              <span aria-hidden="true" className="edge-nav-dot-label">
                {item.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function EdgeBar({ pathname }: { pathname: string }) {
  return (
    <ul className="edge-nav-bar pointer-events-auto fixed inset-x-0 bottom-0 flex items-stretch justify-between">
      {site.nav.map((item) => {
        const active = pathname === item.to || pathname.startsWith(item.to + "/");
        return (
          <li key={item.to} className="flex-1">
            <Link
              to={item.to}
              data-active={active}
              aria-current={active ? "page" : undefined}
              className="edge-nav-bar-link flex flex-col items-center justify-center gap-1.5"
            >
              <span aria-hidden="true" className="edge-nav-dot-mark" />
              <span className="edge-nav-bar-label label">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

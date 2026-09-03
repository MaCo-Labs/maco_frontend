import { useScrollScene } from "@/hooks/use-scroll-scene";

/**
 * Cross-section continuity: as the page moves from one section to the
 * next, the OUTGOING section fades during the natural crossing window
 * instead of just scrolling off — the incoming section then reads as
 * arriving over it, rather than merely following it. Mounted once in
 * routes/index.tsx.
 *
 * 2026-09-03 rebuild (previous version: `yPercent`/`scale` recede +
 * clip-path-flattens-to-square sheet). Two changes, both fixing real,
 * reported problems:
 *
 * 1. **Recede is opacity-only now — no transform.** The old recede
 *    (`yPercent -2/-4, scale 0.985/0.965, transformOrigin "50% 0%"`)
 *    shrank the outgoing section from its own bottom edge upward, which
 *    could expose a real, if brief, dip at the seam — reported live as
 *    an "empty gap" scrolling from Overview into Feature (both `paper`,
 *    so it wasn't a color mismatch; it was the visible shrink cue itself
 *    drawing the eye to a moment neither section's own content had fully
 *    arrived yet). Dropping the transform removes the mechanism, not just
 *    the symptom — every non-ground-flip boundary is now a plain
 *    cross-fade, nothing moves or scales.
 * 2. **The two ground-flip boundaries are a real rounded overlap now, not
 *    a clip-path that ends flat.** The old sheet animated a clip-path's
 *    corner radius FROM 48px round TO 0 (square) — i.e. away from
 *    rounded, so the rounded state was barely on screen. The incoming
 *    section (`.ground-sheet` in styles.css — Overview, Faq) now has a
 *    PERMANENT `border-radius`/negative-`margin-top` overlap as its CSS
 *    rest state; this file only grows the radius FROM 0 INTO that 48px
 *    rest value as the section arrives, via a real `border-radius` tween
 *    (not `clip-path`, which also clips its own `box-shadow` — the
 *    shadow paints outside the border box, which a clip region excludes,
 *    so the old mechanism could never have shown one; `border-radius`
 *    doesn't have that problem). Reduced motion / no-JS renders the CSS
 *    rest state directly — already the settled, correct composition,
 *    since `useScrollScene` no-ops whenever `getScrollRuntime()` returns
 *    null (SSR, reduced motion, blocked import), so this file needs no
 *    explicit reduced-motion branch of its own.
 *
 * Same pin hazard as before: a `transform` on an ancestor of a
 * `position: fixed` element repositions that fixed element relative to
 * the TRANSFORMED ancestor instead of the viewport, so a section that
 * HOSTS a pin must never be the OUTGOING side of an animated transform.
 * Only two of the ten sections pin at all: EvidenceExpand
 * (`aria-label="Bridge in motion"`) and Identity (`aria-label="MaCo, in
 * one name and many scripts"`), both pinning their own `<section>`
 * directly — moot for the recede now that it's opacity-only (opacity
 * never had this hazard), but still the reason both ground flips use
 * `"sheet-only"` (sheet on the incoming side, no recede at all on the
 * pinned outgoing side) rather than `"sheet"` (recede + sheet, for a
 * ground-change boundary whose outgoing side is pin-free — none
 * currently, kept for the next ground change that doesn't land on a pin).
 *
 * `"emphasis"` vs default (no `mode`, i.e. `"interior"`): a fade-opacity
 * weight, not a transform weight — `"emphasis"` marks the boundaries
 * into/out of a set-piece or an act break (the hero's exit, the run-up to
 * IDENTITY's pinned dial, and the closing stretch into the footer);
 * `"interior"` is the same fade, lighter, for the flat run of paper-
 * ground card sections in between (Capabilities/Clients/Selected
 * work/Products) — so the page's real structural beats read as more
 * deliberate than its interior ones.
 *
 * 2026-09-03: down to 10 pairs (was 11) — Record ("About MaCo") merged
 * into Overview and was deleted; the ground-flip pair that used to target
 * it (Identity -> About MaCo) now targets What follows Identity directly
 * (Identity -> How MaCo works), preserving the same ground flip
 * (paper -> deep) one section earlier.
 */
const RECEDE_WEIGHTS = {
  emphasis: { opacity: 0.55 },
  interior: { opacity: 0.7 },
} as const;

const PAIRS: readonly [
  outgoing: string,
  incoming: string,
  mode?: "sheet" | "sheet-only" | "emphasis",
][] = [
  ["Introduction", "Bridge in motion", "emphasis"],
  ["Bridge in motion", "What MaCo does", "sheet-only"],
  ["What MaCo does", "Capabilities"],
  ["Capabilities", "Who we work with"],
  ["Who we work with", "Selected client work"],
  ["Selected client work", "Products"],
  ["Products", "MaCo, in one name and many scripts", "emphasis"],
  ["MaCo, in one name and many scripts", "How MaCo works", "sheet-only"],
  ["How MaCo works", "Start a project", "emphasis"],
  ["Start a project", "Site footer", "emphasis"],
];

export function GroundHandoff() {
  useScrollScene((rt) => {
    for (const [outLabel, inLabel, mode] of PAIRS) {
      const outgoing = document.querySelector<HTMLElement>(`[aria-label="${outLabel}"]`);
      const incoming = document.querySelector<HTMLElement>(`[aria-label="${inLabel}"]`);
      if (!outgoing || !incoming) continue;

      const scrollTrigger = {
        trigger: incoming,
        start: "top bottom",
        end: "top 25%",
        scrub: 0.4,
        invalidateOnRefresh: true,
      };

      // "sheet-only" boundaries sit on a PINNED outgoing section — kept
      // excluded from the fade too, matching the previous version's own
      // discipline (only the incoming side ever animates there).
      if (mode !== "sheet-only") {
        const weight =
          RECEDE_WEIGHTS[mode === "sheet" || mode === "emphasis" ? "emphasis" : "interior"];
        rt.gsap.fromTo(outgoing, { opacity: 1 }, { ...weight, ease: "none", scrollTrigger });
      }

      // Rounded overlap grows in: FROM square (0) TO the incoming
      // section's own permanent CSS rest state (48px, `.ground-sheet` in
      // styles.css — applied directly on Overview's and Faq's <section>).
      // `immediateRender` (gsap's default for a `fromTo`) sets the FROM
      // value on mount, which is why JS-enabled visitors see 0 initially
      // regardless of the CSS class — only reduced-motion/no-JS ever see
      // the class's own 48px directly, per this file's doc comment above.
      if (mode === "sheet" || mode === "sheet-only") {
        rt.gsap.fromTo(
          incoming,
          { borderRadius: "0px 0px 0px 0px" },
          { borderRadius: "48px 48px 0px 0px", ease: "none", scrollTrigger },
        );
      }
    }
  }, []);

  return null;
}

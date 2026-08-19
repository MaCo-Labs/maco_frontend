import { useScrollScene } from "@/hooks/use-scroll-scene";

/**
 * Cross-section continuity: as the page moves from one section to the
 * next, the OUTGOING section recedes (scale down, dim, drift up) during
 * the natural crossing window instead of just scrolling off — the
 * incoming section then reads as physically overtaking it, rather than
 * merely following it. Mounted once in routes/index.tsx.
 *
 * Deliberately a hand-picked list of pairs, NOT a generic loop over every
 * `[data-ground]` boundary: a `transform` on an ancestor of a
 * `position: fixed` element repositions that fixed element relative to
 * the TRANSFORMED ancestor instead of the viewport — applying this to a
 * section that HOSTS a pin would silently break it. Four of the ten
 * homepage sections host one (directly or, on a `gsap.matchMedia`-gated
 * desktop-only descendant): EVIDENCE, CAPABILITY, IDENTITY, METHOD. WORK
 * (`work-reveal.tsx`) and PRODUCTS (`product-showcase.tsx`) are pin-free —
 * PRODUCTS uses `position: sticky` for its expand/reel stage, never a
 * literal ScrollTrigger `pin: true`, specifically so it stays eligible as
 * the outgoing side below. CLIENTS (`client-field.tsx`, between WORK and
 * CAPABILITY) is pin-free too, but has no pair here — nothing currently
 * calls for one at that boundary. Only the OUTGOING section is ever
 * transformed here (the incoming section is just the ScrollTrigger's
 * reference point, never itself touched) — so a pair is safe whenever the
 * OUTGOING side is pin-free, regardless of what the incoming side hosts.
 *
 * Two of the four pairs (marked `sheet: true` in PAIRS) also get a
 * curved-corner reveal on the INCOMING side: `clip-path: inset(...
 * round ...)` scrubbed from a rounded rect down to square, on the same
 * scrollTrigger window as the recede above, so the two motions read as
 * one gesture. Only applied where the boundary is also a ground change
 * (PRODUCTS -> IDENTITY, RECORD -> CLOSE) — the other two pairs keep a
 * plain recede since their ground doesn't change either side. Unlike the
 * plain recede, this DOES touch the incoming section — so the "outgoing
 * side pin-free" rule above isn't sufficient for a `sheet: true` pair; the
 * INCOMING side matters too. `clip-path` on an element clips its entire
 * painted subtree, including `position: fixed` descendants, so a
 * `sheet: true` incoming section is only safe if it either pins ITSELF
 * (IDENTITY does — `identity.tsx`) or doesn't pin at all (CLOSE doesn't).
 * It must never pin via a descendant: CAPABILITY's `ServicesStage`
 * (`services-convergence.tsx`) pins `stage`, a child of the `<section>`,
 * not the section itself — so CAPABILITY must never get `sheet: true` as
 * an incoming section, or clipping the outer section would clip its own
 * pinned stage mid-pin.
 */
const PAIRS: readonly [outgoing: string, incoming: string, sheet?: boolean][] = [
  ["What MaCo does", "Bridge in motion"],
  ["Selected client work", "Who we work with"],
  ["Products", "MaCo, in one name and many scripts", true],
  ["Clients and company", "Start a project", true],
];

export function GroundHandoff() {
  useScrollScene((rt) => {
    for (const [outLabel, inLabel, sheet] of PAIRS) {
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

      rt.gsap.fromTo(
        outgoing,
        { yPercent: 0, scale: 1, opacity: 1 },
        {
          yPercent: -4,
          scale: 0.965,
          opacity: 0.55,
          ease: "none",
          transformOrigin: "50% 0%",
          scrollTrigger,
        },
      );

      // Curved sheet: the incoming section's top corners start rounded
      // and flatten to square as it settles into place — a one-way
      // "sheet lifting into place" cue layered on the recede above, only
      // where the boundary is ALSO a ground change (see PAIRS above).
      // clip-path defaults to `none` in the JSX (no inline style), so with
      // no JS / reduced motion the section just renders with its normal
      // square top edge — the settled end-state. Safe here specifically
      // because `incoming` either pins ITSELF (IDENTITY) or doesn't pin
      // at all (CLOSE) — never a descendant — per the doc comment above;
      // this is not a blanket exemption from the pin hazard.
      if (sheet) {
        rt.gsap.fromTo(
          incoming,
          { clipPath: "inset(0px round 48px 48px 0px 0px)" },
          { clipPath: "inset(0px round 0px 0px 0px 0px)", ease: "none", scrollTrigger },
        );
      }
    }
  }, []);

  return null;
}

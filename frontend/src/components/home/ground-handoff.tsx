import { useScrollScene } from "@/hooks/use-scroll-scene";

/**
 * Cross-section continuity: as the page moves from one section to the
 * next, the OUTGOING section recedes (scale down, dim, drift up) during
 * the natural crossing window instead of just scrolling off — the
 * incoming section then reads as physically overtaking it, rather than
 * merely following it. Mounted once in routes/index.tsx.
 *
 * Rebuilt 2026-08-28 for the Cuberto-parity twelve-slot structure (plan
 * "Cuberto-parity homepage rebuild") — the previous PAIRS keyed off
 * sections (ServicesConvergence, ProductShowcase, WorkReveal, MethodLine,
 * ClientField) that no longer exist. Same hazard as before, restated for
 * the new component set: a `transform` on an ancestor of a
 * `position: fixed` element repositions that fixed element relative to
 * the TRANSFORMED ancestor instead of the viewport, so a section that
 * HOSTS a pin must never be the OUTGOING side. Only two of the twelve
 * sections pin at all now: EvidenceExpand (`aria-label="Bridge in
 * motion"`, pins its own `<section>`) and Identity (`aria-label="MaCo, in
 * one name and many scripts"`, same — pins its own `<section>` directly,
 * confirmed in identity.tsx). Both are therefore excluded as OUTGOING —
 * which is why there is no "Bridge in motion" -> "What MaCo does" pair
 * and no "MaCo, in one name and many scripts" -> "Clients and company"
 * pair below, even though both are real adjacent boundaries. Every other
 * section on the page is pin-free, so every other boundary is eligible.
 *
 * Only the OUTGOING section is ever transformed here (the incoming
 * section is just the ScrollTrigger's reference point, never itself
 * touched) — so a plain-recede pair is safe whenever the OUTGOING side is
 * pin-free, regardless of what the incoming side hosts.
 *
 * `sheet: true` pairs additionally get a curved-corner reveal on the
 * INCOMING side (`clip-path: inset(... round ...)` scrubbed from a
 * rounded rect to square, same scrollTrigger window as the recede) —
 * reserved for boundaries that are ALSO a ground change, so the two
 * motions read as one "sheet lifting into place" gesture rather than a
 * decoration on every boundary. Unlike the plain recede, this DOES touch
 * the incoming section: `clip-path` clips an element's entire painted
 * subtree, including `position: fixed` descendants, so a `sheet: true`
 * incoming section is only safe if it either pins ITSELF or doesn't pin
 * at all — never via a descendant.
 *
 * The page's actual ground sequence is
 * paper,deep,paper,paper,paper,deep,paper,paper,deep,deep,deep — six
 * flips: 1->2, 2->3, 5->6, 6->7, 7->8(none, both paper — not a flip,
 * disregard), 8->9. Two of the six sit at an excluded (pinned-outgoing)
 * boundary — 2->3 (EvidenceExpand outgoing) and 8->9 (Identity
 * outgoing) — so they get no pair at all, sheet or otherwise. The three
 * that remain (1->2, 5->6, 6->7) all have a pin-free outgoing side and an
 * incoming side that either pins itself (EvidenceExpand, at 1->2) or
 * doesn't pin at all (FeaturedWork at 5->6, ProductSummary at 6->7), so
 * all three are safe as `sheet: true`.
 */
const PAIRS: readonly [outgoing: string, incoming: string, sheet?: boolean][] = [
  ["Introduction", "Bridge in motion", true],
  ["What MaCo does", "Capabilities"],
  ["Capabilities", "Who we work with"],
  ["Who we work with", "Selected client work", true],
  ["Selected client work", "Products", true],
  ["Products", "MaCo, in one name and many scripts"],
  ["Clients and company", "How MaCo works"],
  ["How MaCo works", "Start a project"],
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

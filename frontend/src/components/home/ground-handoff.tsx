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
 * (the portfolio grid) is pin-free, which is what makes it safe as the
 * OUTGOING side of the "Selected client work" -> "Capabilities" pair below
 * even though CAPABILITY itself now hosts one. Only the OUTGOING section
 * is ever transformed here (the incoming section is just the
 * ScrollTrigger's reference point, never itself touched) — so a pair is
 * safe whenever the OUTGOING side is pin-free, regardless of what the
 * incoming side hosts. PRODUCTS' own cards are `position: sticky`, not
 * `fixed` — ancestor transforms don't reposition sticky elements the way
 * they do fixed ones, so PRODUCTS is safe as an outgoing section too.
 */
const PAIRS: readonly [outgoing: string, incoming: string][] = [
  ["What MaCo does", "Bridge in motion"],
  ["Selected client work", "Capabilities"],
  ["Products", "MaCo, in one name and many scripts"],
  ["Clients and company", "Start a project"],
];

export function GroundHandoff() {
  useScrollScene((rt) => {
    for (const [outLabel, inLabel] of PAIRS) {
      const outgoing = document.querySelector<HTMLElement>(`[aria-label="${outLabel}"]`);
      const incoming = document.querySelector<HTMLElement>(`[aria-label="${inLabel}"]`);
      if (!outgoing || !incoming) continue;

      rt.gsap.fromTo(
        outgoing,
        { yPercent: 0, scale: 1, opacity: 1 },
        {
          yPercent: -4,
          scale: 0.965,
          opacity: 0.55,
          ease: "none",
          transformOrigin: "50% 0%",
          scrollTrigger: {
            trigger: incoming,
            start: "top bottom",
            end: "top 25%",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        },
      );
    }
  }, []);

  return null;
}

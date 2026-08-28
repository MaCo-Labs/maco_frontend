import { useScrollScene } from "@/hooks/use-scroll-scene";

/**
 * Cross-section continuity: as the page moves from one section to the
 * next, the OUTGOING section recedes (scale down, dim, drift up) during
 * the natural crossing window instead of just scrolling off — the
 * incoming section then reads as physically overtaking it, rather than
 * merely following it. Mounted once in routes/index.tsx.
 *
 * Rebuilt 2026-08-28 for the Cuberto-parity twelve-slot structure, then
 * retuned the same day for the dark-first three-act ground sequence
 * (`CONTEXT.md` §10: `deep deep | paper×6 | deep deep deep`). Same pin
 * hazard as before: a `transform` on an ancestor of a `position: fixed`
 * element repositions that fixed element relative to the TRANSFORMED
 * ancestor instead of the viewport, so a section that HOSTS a pin must
 * never be the OUTGOING side of a recede. Only two of the eleven
 * sections pin at all: EvidenceExpand (`aria-label="Bridge in motion"`)
 * and Identity (`aria-label="MaCo, in one name and many scripts"`), both
 * pinning their own `<section>` directly.
 *
 * Only the OUTGOING section is ever transformed by a recede (the
 * incoming section is just the ScrollTrigger's reference point) — so a
 * plain recede is safe whenever the OUTGOING side is pin-free, regardless
 * of what the incoming side hosts.
 *
 * The curved-corner sheet reveal (`clip-path: inset(... round ...)`
 * scrubbed from a rounded rect to square) touches the INCOMING side
 * instead, and is reserved for boundaries that are ALSO a ground
 * change — every other boundary just recedes, so the sheet gesture keeps
 * meaning "the ground just changed" rather than decorating every
 * crossing. `clip-path` clips an element's entire painted subtree,
 * including `position: fixed` descendants, so a sheet is only safe on an
 * incoming section that either pins ITSELF or doesn't pin at all — never
 * via a descendant.
 *
 * The dark-first sequence puts BOTH of the page's two ground flips
 * exactly on the two pinned-outgoing boundaries (EvidenceExpand -> What
 * MaCo does, Identity -> About MaCo) — the only boundaries a recede can't
 * touch. Each `mode` covers one shape:
 *   - default (no `mode`): plain recede only. Every boundary that isn't a
 *     ground change — which, after the inversion, is every OTHER boundary
 *     on the page.
 *   - `"sheet"`: recede + sheet, for a ground-change boundary whose
 *     outgoing side is pin-free (none currently — both ground flips now
 *     sit on a pinned-outgoing boundary, so this mode is unused today but
 *     kept for the next ground change that doesn't).
 *   - `"sheet-only"`: sheet on the incoming side, NO recede (the outgoing
 *     side pins, so it's excluded from transforms entirely) — both of
 *     today's ground flips use this.
 */
const PAIRS: readonly [outgoing: string, incoming: string, mode?: "sheet" | "sheet-only"][] = [
  ["Introduction", "Bridge in motion"],
  ["Bridge in motion", "What MaCo does", "sheet-only"],
  ["What MaCo does", "Capabilities"],
  ["Capabilities", "Who we work with"],
  ["Who we work with", "Selected client work"],
  ["Selected client work", "Products"],
  ["Products", "MaCo, in one name and many scripts"],
  ["MaCo, in one name and many scripts", "About MaCo", "sheet-only"],
  ["About MaCo", "How MaCo works"],
  ["How MaCo works", "Start a project"],
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

      // "sheet-only" boundaries sit on a PINNED outgoing section — the
      // recede below is exactly the transform-on-a-pin-ancestor hazard
      // this file's doc comment describes, so it's skipped entirely here.
      if (mode !== "sheet-only") {
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
      }

      // Curved sheet: the incoming section's top corners start rounded
      // and flatten to square as it settles into place. clip-path
      // defaults to `none` in the JSX (no inline style), so with no JS /
      // reduced motion the section just renders with its normal square
      // top edge — the settled end-state.
      if (mode === "sheet" || mode === "sheet-only") {
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

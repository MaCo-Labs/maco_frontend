import { useScrollScene } from "@/hooks/use-scroll-scene";

const RECEDE_WEIGHTS = {
  emphasis: { opacity: 0.74 },
  interior: { opacity: 0.88 },
} as const;

export type HandoffPair = readonly [
  outgoing: string,
  incoming: string,
  mode?: "sheet" | "sheet-only" | "emphasis",
];

/**
 * Shared mechanics behind `home/ground-handoff.tsx`'s `GroundHandoff`
 * (the homepage's own 10-pair cross-section fade/rounded-overlap-sheet
 * list), generalized so any route can wire its own outgoing→incoming
 * pairs without dragging that list along. Inner routes currently need at
 * most one pair each (their paper body's last section → their new deep
 * `PageOutro`), always `mode: "sheet"` since none of their sections pin
 * (the sheet-vs-sheet-only distinction below only matters for a pinned
 * outgoing side — see `ground-handoff.tsx`'s own doc comment for why).
 */
export function useSectionHandoff(pairs: readonly HandoffPair[]) {
  useScrollScene(
    (rt) => {
      for (const [outLabel, inLabel, mode] of pairs) {
        const outgoing = document.querySelector<HTMLElement>(`[aria-label="${outLabel}"]`);
        const incoming = document.querySelector<HTMLElement>(`[aria-label="${inLabel}"]`);
        if (!outgoing || !incoming) continue;

        const scrollTrigger = {
          trigger: incoming,
          start: "top bottom",
          end: "top 25%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        };
        const sheetScrollTrigger = { ...scrollTrigger, end: "top 55%" };

        if (mode !== "sheet-only") {
          const weight =
            RECEDE_WEIGHTS[mode === "sheet" || mode === "emphasis" ? "emphasis" : "interior"];
          rt.gsap.fromTo(outgoing, { opacity: 1 }, { ...weight, ease: "none", scrollTrigger });
        }

        if (mode === "sheet" || mode === "sheet-only") {
          rt.gsap.fromTo(
            incoming,
            { borderRadius: "0px 0px 0px 0px" },
            { borderRadius: "48px 48px 0px 0px", ease: "none", scrollTrigger: sheetScrollTrigger },
          );
        }
      }
    },
    [pairs],
  );
}

/**
 * Shared "what [data-ground] section is at this viewport y?" resolver —
 * used by chrome.tsx's header/pill-nav/trigger-overlay sync (sampled at
 * y=48, near the top), EdgeNav's dot coloring (sampled at viewport
 * center, since its dots sit there), and the custom cursor (sampled at
 * the cursor's own y when nothing is directly hovered). One function so
 * all three can never independently drift on what "the ground here" means
 * — before this, the cursor derived it from `closest("[data-ground]")`
 * only while hovering, and EdgeNav had no derivation of its own.
 */
export type Ground = "paper" | "deep";

/** `<section data-ground>`/`<footer data-ground>` only — NOT the bare
 *  `[data-ground]` attribute selector. The cursor (`components/motion/
 *  cursor.tsx`) and the preloader (`components/preloader.tsx`) both also
 *  carry `data-ground`, reusing the same CSS remap mechanism for their own
 *  unrelated reasons (the cursor paints itself from the ground it's
 *  currently over; the preloader is always `deep`). Neither is a real
 *  page section, but both match a bare `[data-ground]` query — confirmed
 *  live as a real bug: the cursor is `position: fixed` and moves with the
 *  pointer, so whenever it happened to sit near y=48 (the header's own
 *  sample point), `groundAt` picked up the CURSOR's current ground
 *  instead of whatever section was actually behind the header, with no
 *  relationship to the real page content underneath. */
export const SECTION_SELECTOR = "section[data-ground], footer[data-ground]";

/**
 * `fallback` (default `"paper"`) is what's returned when NO section covers
 * `y` — which is not just "off the end of the page." `GroundHandoff`
 * (home/ground-handoff.tsx) scales a full-bleed section down a couple
 * percent at its OWN edges as the next section arrives (`transformOrigin:
 * "50% 0%"` shrinks its bottom edge upward), which can open a real,
 * momentary gap at `y` between two adjacent `deep` sections — confirmed as
 * a known, previously-only-partially-mitigated case in chrome.tsx's own
 * ticker comment. Hard-defaulting that gap to `"paper"` flashes every
 * consumer (header, pill-nav, trigger-overlay, edge-nav, the body
 * backdrop) to the WRONG tone for a few frames on every such boundary —
 * most visible exactly where it matters least to change, a deep-to-deep
 * crossing with no real ground change at all. Callers that track a
 * position continuously (the per-frame ticker) should pass their own last
 * resolved value as `fallback` so a transient gap holds its prior tone
 * instead of flashing; one-shot callers (a click handler sampling once)
 * can leave it at the default.
 */
export function groundAt(
  grounds: readonly HTMLElement[],
  y: number,
  fallback: Ground = "paper",
): Ground {
  const current = grounds.find((el) => {
    const rect = el.getBoundingClientRect();
    return rect.top <= y && rect.bottom >= y;
  });
  const ground = current?.dataset["ground"];
  if (ground === "deep") return "deep";
  if (ground === "paper") return "paper";
  return fallback;
}

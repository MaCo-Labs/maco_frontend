/**
 * Shared motion primitives for the homepage reset.
 *
 * Consolidates what used to be duplicated (clamp01/smootherstep lived
 * independently in hero.tsx and multilingual-identity.tsx — both retired)
 * and encodes the house motion style from the Apple Fluid Interfaces
 * principles: critically-damped by default, momentum only when a
 * gesture actually carried velocity, transform/opacity only.
 */

export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Quintic smoothstep — the easing used for every scroll-progress mapping. */
export const smootherstep = (t: number): number => {
  const x = clamp01(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

/** Progressive resistance at a boundary — soft stop, not a hard wall. */
export const rubberband = (overshoot: number, dimension: number, constant = 0.55): number =>
  (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));

/** Slight bounce — reserve for momentum-driven interactions only (a flick, a drag release). */
export const SPRING_MOMENTUM = { type: "spring", bounce: 0.2, duration: 0.4 } as const;

/**
 * House easing curves — numerically identical to `--ease-emphasis` /
 * `--ease-standard` in styles.css (that pair is CSS's copy for
 * transition/animation properties; these are the same curves as JS arrays
 * for GSAP/Motion, which can't read a custom property into a tween config).
 * Previously duplicated as inline literals in chrome.tsx (x4) and
 * preloader.tsx — centralized here per the "one source, not scattered
 * magic numbers" rule.
 */
export const EASE_EMPHASIS = [0.16, 1, 0.3, 1] as const;
export const EASE_EXIT = [0.4, 0, 0.2, 1] as const;

/**
 * Duration bands, tuned by feel not treated as exact (motion-and-navigation
 * pass, §9): micro interactions, general UI state changes, and full section
 * transitions each read differently at a glance even before the easing is
 * considered.
 */
export const DUR = {
  micro: 0.2,
  ui: 0.4,
  section: 0.9,
} as const;

/**
 * Motion preference resolution — the single source of truth read by BOTH
 * `useReducedMotion()` and `getScrollRuntime()`, so they can never disagree
 * (previously two independent `matchMedia` calls).
 *
 * `prefers-reduced-motion: reduce` is an OS-level, per-machine setting (e.g.
 * Windows Settings > Accessibility > Visual effects > Animation effects) —
 * it is NOT a statement about this one site, but browsers apply it globally.
 * A developer or reviewer on such a machine has no way to see the site's
 * actual motion without an explicit override, so `?motion=full|reduced` in
 * the URL sets a persisted override that wins over the OS setting. Real
 * reduced-motion users are never affected: the override is opt-in only.
 */
const MOTION_STORAGE_KEY = "maco-motion";
export const MOTION_CHANGE_EVENT = "maco:motion-change";

type StoredMotionPreference = "full" | "reduced";

function readStoredMotionPreference(): StoredMotionPreference | null {
  const v = window.localStorage.getItem(MOTION_STORAGE_KEY);
  return v === "full" || v === "reduced" ? v : null;
}

/** Reads `?motion=` once and persists it — so the override survives the
 *  next navigation instead of only applying to the URL that set it. */
function applyUrlMotionOverride(): StoredMotionPreference | null {
  const raw = new URLSearchParams(window.location.search).get("motion");
  if (raw !== "full" && raw !== "reduced") return null;
  window.localStorage.setItem(MOTION_STORAGE_KEY, raw);
  return raw;
}

/** Resolves to "reduced" or "full". Priority: `?motion=` (persisted) >
 *  a stored override from a previous visit > the OS `prefers-reduced-motion`
 *  setting. Client-only — callers must guard SSR themselves. */
export function resolveMotionPreference(): StoredMotionPreference {
  const fromUrl = applyUrlMotionOverride();
  const stored = fromUrl ?? readStoredMotionPreference();
  if (stored) return stored;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full";
}

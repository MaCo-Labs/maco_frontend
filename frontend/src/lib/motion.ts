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

export const clamp = (v: number, min: number, max: number): number =>
  v < min ? min : v > max ? max : v;

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Quintic smoothstep — the easing used for every scroll-progress mapping. */
export const smootherstep = (t: number): number => {
  const x = clamp01(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

/**
 * Apple's momentum-projection function (Designing Fluid Interfaces, WWDC18):
 * projects where a flick will come to rest, so a snap target can be chosen
 * from the projected point rather than the raw release point.
 */
export const project = (initialVelocity: number, decelerationRate = 0.998): number =>
  ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate);

/** Progressive resistance at a boundary — soft stop, not a hard wall. */
export const rubberband = (overshoot: number, dimension: number, constant = 0.55): number =>
  (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));

/** Critically damped — the default for anything not carrying gesture velocity. */
export const SPRING_DEFAULT = { type: "spring", bounce: 0, duration: 0.4 } as const;

/** Slight bounce — reserve for momentum-driven interactions only (a flick, a drag release). */
export const SPRING_MOMENTUM = { type: "spring", bounce: 0.2, duration: 0.4 } as const;

/** IDENTITY's script reel — a longer, heavier settle than default UI motion,
 *  since it's travelling a real distance (a full slot) rather than resolving
 *  a small state change. */
export const SPRING_REEL = { type: "spring", bounce: 0, duration: 0.7 } as const;

/** Matches --ease-standard / --ease-emphasis in styles.css, for use in motion's `ease` prop. */
export const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;
export const EASE_EMPHASIS = [0.16, 1, 0.3, 1] as const;

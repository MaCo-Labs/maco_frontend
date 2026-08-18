import { useEffect, useState, type RefObject } from "react";

/** Settle after section enters before cycling begins. */
const SETTLE_MS = 1000;

/**
 * Curated center sequence — strings verified against SCRIPTS in multilingual-identity.
 * MaCo bookends; Latin is always the default / reset state.
 */
export const CENTER_SEQUENCE = [
  { text: "MaCo", lang: "English", holdMs: 1800, latin: true },
  { text: "മാകോ", lang: "Malayalam", holdMs: 1700 },
  { text: "மாகோ", lang: "Tamil", holdMs: 1700 },
  { text: "माको", lang: "Hindi", holdMs: 1700 },
  { text: "ماكو", lang: "Arabic", holdMs: 1700 },
  { text: "マコ", lang: "Japanese", holdMs: 1700 },
  { text: "마코", lang: "Korean", holdMs: 1700 },
  { text: "玛科", lang: "Chinese", holdMs: 1700 },
  { text: "Мако", lang: "Russian", holdMs: 1700 },
  { text: "MaCo", lang: "English", holdMs: 3000, latin: true },
] as const;

type CyclePhase = "idle" | "settling" | "cycling";

/**
 * Viewport-gated center language cycle.
 * - Starts only after section is ~25% visible + settle delay
 * - Pauses and resets to MaCo when section leaves
 * - Single timer per effect, cleaned up on unmount / leave
 */
export function useCenterLanguageCycle(
  sectionRef: RefObject<HTMLElement | null>,
  reducedMotion: boolean,
) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<CyclePhase>("idle");
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.25);
        setInView(visible);
      },
      { threshold: [0, 0.15, 0.25, 0.4] },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [sectionRef]);

  useEffect(() => {
    if (inView) return;
    setIndex(0);
    setPhase("idle");
  }, [inView]);

  useEffect(() => {
    if (!inView || reducedMotion) return;

    setIndex(0);
    setPhase("settling");

    const settleTimer = window.setTimeout(() => {
      setPhase("cycling");
      setIndex(0);
    }, SETTLE_MS);

    return () => window.clearTimeout(settleTimer);
  }, [inView, reducedMotion]);

  useEffect(() => {
    if (phase !== "cycling" || !inView || reducedMotion) return;

    const current = CENTER_SEQUENCE[index];
    if (!current) return;

    const cycleTimer = window.setTimeout(() => {
      setIndex((i) => (i + 1) % CENTER_SEQUENCE.length);
    }, current.holdMs);

    return () => window.clearTimeout(cycleTimer);
  }, [phase, index, inView, reducedMotion]);

  const current = CENTER_SEQUENCE[index] ?? CENTER_SEQUENCE[0];

  return {
    centerText: current.text,
    centerLang: current.lang,
    centerLatin: current.latin ?? false,
    cycleActive: phase === "cycling" && !reducedMotion,
    cyclePhase: phase,
  };
}

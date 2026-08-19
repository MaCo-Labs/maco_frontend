import { useEffect, useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScriptFontsWhenVisible } from "@/hooks/use-script-fonts";
import { SPRING_REEL } from "@/lib/motion";

/**
 * IDENTITY — "One name. Many scripts." A reel, not a cross-fade: the
 * active script sits centred and prominent, its neighbours visible
 * either side, fading and shrinking toward the edges as the track
 * advances — closer to how the user actually described it than the
 * single-word cross-fade this replaces.
 *
 * Zero DOM measurement. Every item occupies an identical --slot, so a
 * transform of `x: "100%"` always means exactly one slot — this also
 * makes the layout immune to the lazy-loaded Noto fonts swapping in
 * after first paint (a measured width would be wrong until they land,
 * then jump).
 *
 * Position is per-item, from the SIGNED CIRCULAR distance to the
 * active index — not a single translated track. With 13 scripts a
 * translated track would visibly rewind 12 slots on the 12->0 wrap;
 * circular distance puts that seam at |d|=6, where opacity is already
 * 0 and the jump is unobservable.
 */
const SCRIPTS: readonly { text: string; lang: string; code: string; dir?: "rtl" }[] = [
  { text: "MaCo", lang: "English", code: "en" },
  { text: "മാകോ", lang: "Malayalam", code: "ml" },
  { text: "மாகோ", lang: "Tamil", code: "ta" },
  { text: "మాకో", lang: "Telugu", code: "te" },
  { text: "ಮಾಕೋ", lang: "Kannada", code: "kn" },
  { text: "माको", lang: "Hindi", code: "hi" },
  { text: "માકો", lang: "Gujarati", code: "gu" },
  { text: "ਮਾਕੋ", lang: "Punjabi", code: "pa" },
  { text: "মাকো", lang: "Bengali", code: "bn" },
  { text: "ମାକୋ", lang: "Odia", code: "or" },
  { text: "ماكو", lang: "Arabic", code: "ar", dir: "rtl" },
  { text: "ماکو", lang: "Persian", code: "fa", dir: "rtl" },
  { text: "מאקו", lang: "Hebrew", code: "he", dir: "rtl" },
];

const N = SCRIPTS.length;
const HOLD_MS = 2200;
const VISIBLE = 2; // |d| <= VISIBLE is painted; further out is invisible anyway

const OPACITY: number[] = [1, 0.3, 0.12];
const SCALE: number[] = [1, 0.62, 0.46];
const BLUR: number[] = [0, 1.5, 3];

/** Signed shortest distance around a ring of N items. Range [-6, +6] for N=13. */
function circularDistance(i: number, active: number): number {
  let d = i - active;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
}

export function Identity() {
  const reduced = useReducedMotion();
  const scriptRef = useScriptFontsWhenVisible<HTMLDivElement>();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % N), HOLD_MS);
    return () => window.clearInterval(id);
  }, [reduced, paused]);

  // Reduced motion freezes on English — still a real composition (the
  // sr-only list below still carries all 13 scripts), not a broken mid-cycle
  // frame.
  const active = reduced ? 0 : index;

  return (
    <section data-ground="paper" className="rule-t" aria-label="MaCo, in one name and many scripts">
      <div className="shell flex flex-col items-center gap-6 py-24 text-center md:py-32">
        <p className="label">One name. Many scripts.</p>

        <div
          ref={scriptRef}
          aria-hidden="true"
          className="relative w-full overflow-hidden"
          style={
            {
              "--slot": "clamp(11rem, 26vw, 20rem)",
              height: "clamp(7.5rem, 15vw, 10.5rem)",
              fontFamily: "var(--font-script-fallback)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)",
            } as CSSProperties
          }
        >
          {SCRIPTS.map((s, i) => {
            const d = circularDistance(i, active);
            const k = Math.min(Math.abs(d), VISIBLE);
            const far = Math.abs(d) > VISIBLE;
            return (
              <motion.span
                key={s.code}
                lang={s.code}
                dir={s.dir}
                className="absolute left-1/2 top-1/2 block text-center"
                style={{
                  width: "var(--slot)",
                  marginLeft: "calc(var(--slot) / -2)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(2.2rem, 6vw, 5rem)",
                  // NOT display-hero's line-height (1.02) — that clips
                  // Malayalam/Devanagari/Gujarati/Gurmukhi vowel marks and
                  // Bengali/Odia ascenders.
                  lineHeight: 1.25,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  color: "var(--text)",
                }}
                animate={{
                  x: `${d * 100}%`,
                  y: "-50%",
                  opacity: far ? 0 : (OPACITY[k] ?? 0),
                  scale: far ? 0.4 : (SCALE[k] ?? 0.4),
                  filter: far ? "none" : `blur(${BLUR[k] ?? 0}px)`,
                }}
                transition={reduced || far ? { duration: 0 } : SPRING_REEL}
              >
                {s.text}
              </motion.span>
            );
          })}
        </div>

        {!reduced && (
          // WCAG 2.2.2 — indefinite auto-advancing motion needs a way to
          // stop it, reachable by keyboard.
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="label link-draw"
            style={{ color: "var(--muted)" }}
          >
            {paused ? "Resume" : "Pause"} the script reel
          </button>
        )}

        <p className="lead max-w-md">MaCo works with clients across India and the Gulf.</p>

        {/* The one accessible representation — the reel above is aria-hidden.
            Per-item lang so a screen reader switches voice/pronunciation
            per script instead of reading all 13 as one English-tagged run. */}
        <div className="sr-only">
          <p>MaCo, written in {N} scripts:</p>
          <ul>
            {SCRIPTS.map((s) => (
              <li key={s.code}>
                <span lang={s.code} dir={s.dir}>
                  {s.text}
                </span>
                {` — ${s.lang}`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

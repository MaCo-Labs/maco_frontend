import { useRef, type CSSProperties } from "react";
import { nameScripts } from "@/content/maco";
import { useScriptFontsWhenVisible } from "@/hooks/use-script-fonts";
import { useScrollScene } from "@/hooks/use-scroll-scene";
import { usePointerField } from "@/hooks/use-pointer-field";

/**
 * IDENTITY — "One name. Many scripts." Scroll IS the dial: each script's
 * position is `--i - --t`, where `--i` is the script's own fixed index
 * (set once, inline) and `--t` is the track's current dial position,
 * written by one pinned ScrollTrigger and inherited down to every span —
 * pure CSS `calc()`, zero React re-render per frame, zero DOM measurement.
 *
 * This replaces a `setInterval`-driven reel (motion/react springs, a
 * WCAG 2.2.2 pause control for the auto-advance, and 13 items' worth of
 * animated `filter: blur()`) with a genuinely scroll-linked one:
 *  - Scroll-driven motion the user starts by scrolling isn't "automatic"
 *    in the WCAG 2.2.2 sense, so the pause control is gone — same as
 *    every other pinned section on the page (EVIDENCE, WORK, METHOD),
 *    none of which have one either.
 *  - `filter: blur()` is gone — it's an animated-blur, which the site's
 *    motion rules disallow (transform/opacity only); depth here comes
 *    from `scale` + `opacity` alone.
 *  - The signed circular-distance dance (13 items wrapping 12 -> 0) that
 *    the old timer-driven reel needed is gone with it: a SCRUBBED dial
 *    never wraps, `--d` is plain `i - t`, so there's no seam to manage.
 *  - Ownership becomes correct: `motion` no longer touches this section
 *    at all — it was the one place on the page where discrete-UI-only
 *    `motion` was driving something scroll-adjacent, which the site's own
 *    ownership rule (Lenis: position, GSAP: scroll-linked, motion:
 *    discrete UI) argues against.
 *
 * Reduced motion needs no special branch: `--t` (styles.css) is a
 * registered custom property with `initial-value: 0`, so with no
 * ScrollTrigger ever created, every span's `calc()` resolves exactly as
 * if `--t` were 0 — English centred, neighbours dimmed either side. That
 * IS the composed at-rest state, not a frozen frame of an animation.
 *
 * The script list itself lives in content/maco.ts (`nameScripts`) — the
 * footer's compact strip (chrome.tsx) reads the same array, so the two
 * can't drift apart the way they had before.
 */
const SCRIPTS = nameScripts;
const N = SCRIPTS.length;

export function Identity() {
  // Pointer field on the SECTION (not the track) so --px/--py inherit down
  // to identity-script's calc() in styles.css without competing with --t,
  // which the pin below still writes on trackRef alone. Bails under a
  // coarse pointer and rests at 0.5/0.5, same as everywhere else this
  // hook is used — a touch scroll gets the dial exactly as before.
  const sectionRef = usePointerField<HTMLElement>();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const scriptFontsRef = useScriptFontsWhenVisible<HTMLDivElement>();

  useScrollScene((rt) => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // gsap.matchMedia over useMediaQuery: created/reverted by GSAP itself
    // and measured together with every other trigger on the page, which
    // is what avoids the SSR-false-then-true-in-an-effect mount-order
    // race useMediaQuery has (the documented cause of a past bug where
    // METHOD's pin fired before WORK's spacer existed).
    const mm = rt.gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const trigger = rt.ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=170%",
        pin: true,
        anticipatePin: 1,
        scrub: 0.25,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          track.style.setProperty("--t", String(self.progress * (N - 1)));
        },
      });
      return () => trigger.kill();
    });
    mm.add("(max-width: 1023px)", () => {
      // Shorter pin on a shorter viewport — the desktop distance felt
      // over-long at 844px tall (values below tuned by scrubbing live,
      // not derived).
      const trigger = rt.ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=130%",
        pin: true,
        anticipatePin: 1,
        scrub: 0.25,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          track.style.setProperty("--t", String(self.progress * (N - 1)));
        },
      });
      return () => trigger.kill();
    });
  }, []);

  return (
    <section
      ref={sectionRef as never}
      data-ground="paper"
      className="relative z-[41] flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
      aria-label="MaCo, in one name and many scripts"
    >
      <div aria-hidden="true" className="ambient-field" />
      <div className="shell cb-section flex flex-col items-center gap-6 text-center">
        <p className="label">One name. Many scripts.</p>

        <div
          ref={(el) => {
            trackRef.current = el;
            scriptFontsRef.current = el;
          }}
          className="relative w-full overflow-hidden"
          style={
            {
              "--slot": "clamp(13rem, 34vw, 30rem)",
              height: "clamp(9rem, 20vw, 15rem)",
              fontFamily: "var(--font-script-fallback)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)",
            } as CSSProperties
          }
        >
          {SCRIPTS.map((s, i) => (
            <span
              key={s.code}
              lang={s.code}
              dir={s.dir}
              aria-hidden="true"
              className="identity-script absolute left-1/2 top-1/2 block text-center"
              style={
                {
                  "--i": i,
                  width: "var(--slot)",
                  marginLeft: "calc(var(--slot) / -2)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(2.6rem, 9vw, 8rem)",
                  // NOT display-hero's line-height (1.02) — that clips
                  // Malayalam/Devanagari/Gujarati/Gurmukhi vowel marks and
                  // Bengali/Odia ascenders.
                  lineHeight: 1.25,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  color: "var(--text)",
                } as CSSProperties
              }
            >
              {s.text}
            </span>
          ))}
        </div>

        <p className="lead max-w-md">MaCo works with clients across India and the Middle East.</p>

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

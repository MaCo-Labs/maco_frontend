import { useEffect, useRef } from "react";
import { site } from "@/content/maco";
import { Mark } from "@/components/mark";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { BlindsField } from "./blinds-field";
import { getScrollRuntime } from "@/lib/scroll-runtime";
import { usePointerField } from "@/hooks/use-pointer-field";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useTheme } from "@/components/theme";

const GLOW_COLOR: Record<"obsidian" | "cobalt", string> = {
  cobalt: "rgba(59, 130, 246, 0.5)",
  obsidian: "rgba(56, 189, 248, 0.35)",
};

/**
 * OPEN — MaCo's brand, alone. Full-viewport, centred: the real mark
 * (`public/maco-mark-hero.png`, downsampled from `public/white-logo.png`
 * — see `scripts/shrink-hero-mark.cjs`, 637KB -> 61.6KB, alpha channel
 * only, nothing else is ever read) plus the animated "MaCo" wordmark
 * (`<SplitReveal>`), over a cursor-reactive WebGL gradient-blinds field
 * (`<BlindsField>`, `three`-based — see that file's doc comment for why
 * it isn't React Bits' `ogl`-based GradientBlinds verbatim).
 *
 * Layering, bottom to top: `<BlindsField>` (z-0) -> a fixed vignette for
 * text legibility (z-[1]) -> the three original content rows (z-10,
 * `pointer-events-none` so pointer input reaches the field underneath;
 * the mark's `<Magnetic>` wrapper opts back into `pointer-events-auto`
 * for its own hover).
 *
 * `usePointerField` now lives on the `<section>` itself (previously just
 * the centre row) so one field covers the whole viewport: `<BlindsField>`
 * reads it for the shader's mouse uniform, the ambient-glow halo below
 * reads it via the same inherited `--px`/`--py`, and the mark's existing
 * parallax transform is unchanged (still reads `var(--px)`, just now
 * driven by the full section instead of the narrower centre band).
 *
 * Replaces the previous hero, which put the Bridge product screen in the
 * foreground and the brand in a small top-left label — the brief asked
 * for the brand itself, centred, to be the opening statement. The Bridge
 * recording and the descriptive claim move to `working-surface.tsx`
 * directly below, which also absorbs the previous CLAIM section.
 *
 * Both `<Mark>` and `<SplitReveal>` read `currentColor`/`var(--text)`, so
 * this renders correctly in both themes with no separate light/dark
 * asset — near-black on Obsidian's deep ground, MaCo blue on Cobalt's.
 */
export function OpenLogo() {
  const sectionRef = usePointerField<HTMLElement>();
  const cueRef = useRef<HTMLDivElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const markWrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { theme } = useTheme();

  useEffect(() => {
    const section = sectionRef.current;
    const cue = cueRef.current;
    if (!section) return;
    let cancelled = false;
    let trigger: { kill: () => void } | null = null;

    getScrollRuntime().then((rt) => {
      if (cancelled || !rt) return;
      trigger = rt.ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          // Fades out fast on the first bit of scroll — the cue's job is
          // done the moment the visitor has actually started scrolling.
          if (cue) cue.style.opacity = String(Math.max(0, 1 - self.progress * 4));
        },
      });
      rt.scheduleRefresh();

      // Cinematic load: the shell row rises in, the mark scales up just
      // behind it — <SplitReveal>'s own char-stagger runs independently
      // on its own mount effect and settles in the same window.
      if (!reduced) {
        const tl = rt.gsap.timeline({ delay: 0.05 });
        if (topRowRef.current) {
          tl.from(topRowRef.current, { y: -30, opacity: 0, duration: 0.6, ease: "expo.out" }, 0);
        }
        if (markWrapRef.current) {
          tl.from(
            markWrapRef.current,
            { scale: 0.8, opacity: 0, duration: 0.7, ease: "expo.out" },
            0.05,
          );
        }
      }
    });

    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, [reduced, sectionRef]);

  return (
    <section
      ref={sectionRef as never}
      data-ground="deep"
      // z-[41]: harmless while position:static (default); once ScrollTrigger
      // pins this section it becomes position:fixed, and without an explicit
      // z-index above the header's z-40 it renders BEHIND the sticky,
      // backdrop-blurred header.
      className="relative z-[41] flex min-h-[100svh] flex-col justify-between overflow-hidden"
      aria-label="Introduction"
    >
      <div className="absolute inset-0 z-0">
        <BlindsField />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      <div
        ref={topRowRef}
        className="shell pointer-events-none relative z-10 flex items-center justify-between pt-8 md:pt-10"
      >
        <span className="label" style={{ color: "var(--text)" }}>
          {site.name}
        </span>
        <span className="label">{site.location}</span>
      </div>

      <div className="pointer-events-none relative z-10 flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center md:gap-7">
        {/* Ambient glow halo — tracks the same --px/--py the mark's own
            parallax reads (inherited from the section-wide pointer field),
            so it visually intensifies as the cursor nears the mark rather
            than sitting as a static blob. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full"
          style={{
            left: "calc(var(--px, 0.5) * 100%)",
            top: "calc(var(--py, 0.5) * 100%)",
            width: "26rem",
            height: "26rem",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${GLOW_COLOR[theme]} 0%, transparent 70%)`,
            mixBlendMode: "screen",
            filter: "blur(10px)",
          }}
        />
        <Magnetic className="pointer-events-auto">
          <div ref={markWrapRef}>
            <Mark
              src="/maco-mark-hero.png"
              style={{
                color: "var(--text)",
                width: "clamp(6.2rem, 17vw, 11.5rem)",
                height: "clamp(3.5rem, 9.6vw, 6.5rem)",
                filter: `drop-shadow(0 0 35px ${GLOW_COLOR[theme]})`,
                transform:
                  "translate3d(calc((var(--px, 0.5) - 0.5) * -16px), calc((var(--py, 0.5) - 0.5) * -16px), 0)",
                transition: "transform 0.5s var(--ease-standard)",
              }}
            />
          </div>
        </Magnetic>
        <SplitReveal
          as="h1"
          text="MaCo"
          className="font-display font-normal leading-none"
          style={{
            color: "var(--text)",
            fontSize: "clamp(4rem, 16vw, 11rem)",
            letterSpacing: "-0.03em",
          }}
        />
      </div>

      <div className="shell pointer-events-none relative z-10 flex items-center justify-between pb-10 md:pb-14">
        <span className="label" style={{ color: "var(--muted)" }}>
          {site.category}
        </span>
        <div ref={cueRef} aria-hidden="true" className="flex flex-col items-center gap-2">
          <span className="label" style={{ color: "var(--muted)" }}>
            Scroll
          </span>
          <span
            className="h-10 w-px"
            style={{ background: "linear-gradient(to bottom, var(--muted), transparent)" }}
          />
        </div>
      </div>
    </section>
  );
}

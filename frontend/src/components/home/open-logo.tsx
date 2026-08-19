import { useEffect, useRef } from "react";
import { site } from "@/content/maco";
import { Mark } from "@/components/mark";
import { SplitReveal } from "@/components/motion/split-reveal";
import { getScrollRuntime } from "@/lib/scroll-runtime";

/**
 * OPEN — MaCo's brand, alone. Full-viewport, centred: the real mark
 * (`public/maco-mark-hero.png`, downsampled from `public/white-logo.png`
 * — see `scripts/shrink-hero-mark.cjs`, 637KB -> 61.6KB, alpha channel
 * only, nothing else is ever read) plus the animated "MaCo" wordmark
 * (`<SplitReveal>`).
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
  const sectionRef = useRef<HTMLElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

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
    });

    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, []);

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
      <div className="shell relative z-10 flex items-center justify-between pt-8 md:pt-10">
        <span className="label" style={{ color: "var(--text)" }}>
          {site.name}
        </span>
        <span className="label">{site.location}</span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center md:gap-7">
        <Mark
          src="/maco-mark-hero.png"
          style={{
            color: "var(--text)",
            width: "clamp(6.2rem, 17vw, 11.5rem)",
            height: "clamp(3.5rem, 9.6vw, 6.5rem)",
          }}
        />
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

      <div className="shell relative z-10 flex items-center justify-between pb-10 md:pb-14">
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

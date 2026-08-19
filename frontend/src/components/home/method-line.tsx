import { useEffect, useRef } from "react";
import { process } from "@/content/maco";
import { MotionSection } from "@/components/motion-section";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { getScrollRuntime } from "@/lib/scroll-runtime";

const BAND = 0.22; // fraction of the pin's scroll distance each step takes to reveal

/**
 * METHOD — the real A→B→C→D process, plus the one differentiator the
 * brief calls out explicitly: MaCo doesn't disappear after launch.
 *
 * A pinned vertical step-through — the section pins for ~150vh while a
 * progress spine draws A→B→C→D and each step rises into place as the
 * scrub crosses its own band — deliberately a DIFFERENT mechanic from
 * WORK's horizontal pinned rail, so the page doesn't repeat the same
 * trick twice in a row.
 *
 * Progress is written straight to CSS custom properties in
 * `ScrollTrigger.onUpdate`, never through React state — see the same note
 * in `work-sequence.tsx`. This also removes METHOD from the set of things
 * that could plausibly race WORK's mount: both now report readiness via
 * `scheduleRefresh()` and get measured together, once, regardless of which
 * one's effect ran first.
 */
export function MethodLine() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const spine = spineRef.current;
    if (!section) return;
    let cancelled = false;
    let trigger: { kill: () => void } | null = null;

    const spacing = process.length > 1 ? (1 - BAND) / (process.length - 1) : 0;

    getScrollRuntime().then((rt) => {
      if (cancelled || !rt) return;
      trigger = rt.ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 0.3,
        onUpdate: (self) => {
          const p = self.progress;
          if (spine) spine.style.width = `${p * 100}%`;
          stepRefs.current.forEach((el, i) => {
            if (!el) return;
            const threshold = i * spacing;
            const reveal = Math.min(1, Math.max(0, (p - threshold) / BAND));
            el.style.opacity = String(reveal);
            el.style.transform = `translate3d(0, ${(1 - reveal) * 1.5}rem, 0)`;
          });
        },
      });
      rt.scheduleRefresh();
    });

    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, [reduced]);

  if (reduced) {
    return (
      <section data-ground="paper" className="rule-t" aria-label="How MaCo works">
        <div className="shell py-24 md:py-32">
          <MotionSection>
            <p className="label">Method</p>
            <h2 className="display-lg mt-3 max-w-xl" style={{ color: "var(--text)" }}>
              Launch is not the finish line.
            </h2>
          </MotionSection>

          <ol className="mt-16 grid gap-0 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <MotionSection
                key={step.step}
                as="li"
                delay={i * 90}
                className="border-b border-line py-8 pr-6 sm:border-r lg:min-h-[14rem]"
              >
                <span className="font-display text-4xl" style={{ color: "var(--muted)" }}>
                  {step.step}
                </span>
                <p className="display-md mt-4" style={{ color: "var(--text)" }}>
                  {step.title}
                </p>
                <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
                  {step.body}
                </p>
              </MotionSection>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      data-ground="paper"
      // z-[41]: see the matching comment in open-logo.tsx — keeps the pinned
      // step-through above the sticky header instead of behind it.
      className="rule-t relative z-[41] flex h-screen flex-col justify-center overflow-hidden"
      aria-label="How MaCo works"
    >
      <div className="shell w-full py-16">
        <p className="label">Method</p>
        <h2 className="display-lg mt-3 max-w-xl" style={{ color: "var(--text)" }}>
          Launch is not the finish line.
        </h2>

        <div className="relative mt-16 border-t border-line">
          <div
            ref={spineRef}
            aria-hidden="true"
            className="absolute -top-px left-0 h-px"
            style={{ width: "0%", background: "var(--text)" }}
          />
          <ol className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <li
                key={step.step}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="border-b border-line py-8 pr-6 sm:border-r lg:min-h-[14rem]"
                // No opacity:0 seed here — renders fully visible at rest.
                // ScrollTrigger's onUpdate corrects this to the real
                // scroll-derived value the moment scheduleRefresh() fires
                // (refresh forces an update pass). Without this, a blocked
                // dynamic import (offline, CSP, an extension) left all
                // four steps permanently invisible — the JSX default must
                // be the correct fallback, not a value only JS ever fixes.
              >
                <span className="font-display text-4xl" style={{ color: "var(--muted)" }}>
                  {step.step}
                </span>
                <p className="display-md mt-4" style={{ color: "var(--text)" }}>
                  {step.title}
                </p>
                <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

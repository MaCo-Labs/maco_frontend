import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { site } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { RuleDraw } from "@/components/motion/rule-draw";
import { Magnetic } from "@/components/motion/magnetic";
import { useScrollScene } from "@/hooks/use-scroll-scene";

/**
 * OUTRO — `section.cb-outro`, the last section before the footer.
 * Cuberto's measured grid is two columns (`652.562px` + implicit second);
 * here the closing statement runs left and the contact route runs right,
 * on `md` and up — the same split, collapsed to one column below it.
 *
 * Carries over the light-pass sweep and the centre-drawn rule from the
 * `close-intake.tsx` section this replaces — both were built for exactly
 * this position on the page (the one place a rule draws from the middle
 * rather than the left, a closing gesture rather than a ruling) and nothing
 * about the structural rebuild changes what that gesture is for.
 *
 * The full intake form is a dedicated phase (HOMEPAGE_REDESIGN_PLAN.md
 * Phase I) — this links to the real `/contact` route rather than
 * duplicating a second form here, same as the section it replaces.
 */
export function Outro() {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollScene((rt) => {
    const el = sectionRef.current;
    if (!el) return;
    el.classList.add("is-lit");
    rt.gsap.fromTo(
      el,
      { "--sweep": -0.15 },
      {
        "--sweep": 1.15,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.25 },
      },
    );
  }, []);

  return (
    <section
      ref={sectionRef as never}
      data-ground="deep"
      className="light-pass"
      aria-label="Start a project"
    >
      <div className="shell cb-section">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <div className="relative">
              <RuleDraw origin="center" className="absolute -top-px left-0 h-px w-full" />
              <ScrubReveal as="p" className="label pt-8">
                Contact
              </ScrubReveal>
            </div>
            <LineReveal
              as="h2"
              mode="scrub"
              start="top 95%"
              end="top 30%"
              className="display-hero mt-4 max-w-xl"
              style={{ color: "var(--text)" }}
            >
              Good software earns its place.
            </LineReveal>
          </div>

          <div className="md:pt-16">
            <ScrubReveal as="p" hold className="lead max-w-lg">
              Tell us what has to work. We reply from {site.contact_email}.
            </ScrubReveal>
            <ScrubReveal className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <Link to="/contact" className="btn-solid">
                  Start a project <span aria-hidden="true">→</span>
                </Link>
              </Magnetic>
              <Magnetic>
                <a href={`mailto:${site.contact_email}`} className="btn-line">
                  {site.contact_email}
                </a>
              </Magnetic>
            </ScrubReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

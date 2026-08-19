import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { site } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { RuleDraw } from "@/components/motion/rule-draw";
import { Magnetic } from "@/components/motion/magnetic";
import { useScrollScene } from "@/hooks/use-scroll-scene";

/**
 * CLOSE — the final statement and the way in. The page closes the way a
 * file does: a rule draws outward from centre (the one place on the page
 * a rule draws from the middle rather than the left — a closing gesture,
 * not a ruling), the statement rises out of a full line-height mask, and
 * the light makes one last pass across the section as it leaves.
 *
 * The light-pass mechanism here matches RakingSurface (same transit-based
 * --sweep, same overshoot range) applied directly to the `<section>`
 * rather than through the component — RakingSurface always renders a
 * `<div>`, and this element needs to BE the `<section>` itself (for
 * data-ground + aria-label), not wrapped by one.
 *
 * The full intake form (and the fix for contact.tsx's silently-fake
 * submission handler) is a dedicated phase — see
 * HOMEPAGE_REDESIGN_PLAN.md Phase I. This links to the real /contact
 * route rather than duplicating a second, hastily-wired form here.
 */
export function CloseIntake() {
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
      className="light-pass rule-t"
      aria-label="Start a project"
    >
      <div className="shell py-24 md:py-36">
        <div className="relative">
          <RuleDraw origin="center" className="absolute -top-px left-0 h-px w-full" />
          <ScrubReveal as="p" className="label pt-8">
            Contact
          </ScrubReveal>
        </div>
        <LineReveal
          as="h2"
          mode="scrub"
          className="display-hero mt-4 max-w-3xl"
          style={{ color: "var(--text)" }}
        >
          Good software earns its place.
        </LineReveal>
        <ScrubReveal as="p" hold className="lead mt-6 max-w-lg">
          Tell us what has to work. We reply from {site.contact_email}.
        </ScrubReveal>
        <ScrubReveal className="mt-10 flex flex-wrap gap-3">
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
    </section>
  );
}

import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { site } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { RuleDraw } from "@/components/motion/rule-draw";
import { Magnetic } from "@/components/motion/magnetic";
import { useScrollScene } from "@/hooks/use-scroll-scene";

/**
 * Shared deep-ground close for the non-homepage routes. Every inner page
 * previously stayed on `paper` end to end and then hit the deep footer
 * with no boundary marking the change — the homepage's own three-act
 * ground shape (deep/paper/deep, `CONTEXT.md` §10) had no equivalent
 * here. This gives each page ONE ground flip, mirroring `home/outro.tsx`'s
 * mechanism exactly (same light-pass sweep tween, same centre-drawn rule)
 * rather than inventing a second closing device.
 *
 * Callers must also pair `aria-label` with `useSectionHandoff` (see
 * `home/ground-handoff.tsx`) so the fade/rounded-overlap sheet actually
 * runs between the page's last paper section and this one.
 */
export function PageOutro({
  ariaLabel,
  eyebrow = "Contact",
  heading,
  body,
  cta,
}: {
  ariaLabel: string;
  eyebrow?: string;
  heading: string;
  body: string;
  /** Omit for a page that's already a conversion point (e.g. /contact
   *  itself) — a second "Start a project" button there would be
   *  redundant with the form directly above it. */
  cta?: { label: string; to: string } | undefined;
}) {
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
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
      },
    );
  }, []);

  return (
    <section
      ref={sectionRef as never}
      data-ground="deep"
      className="light-pass ground-sheet"
      aria-label={ariaLabel}
    >
      <div className="shell cb-section">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <div className="relative">
              <RuleDraw origin="center" className="absolute -top-px left-0 h-px w-full" />
              <ScrubReveal as="p" className="label pt-8">
                {eyebrow}
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
              {heading}
            </LineReveal>
          </div>

          <div className="md:pt-16">
            <ScrubReveal as="p" hold className="lead max-w-lg">
              {body}
            </ScrubReveal>
            <ScrubReveal className="mt-8 flex flex-wrap gap-3">
              {cta && (
                <Magnetic>
                  <Link to={cta.to} className="btn-solid">
                    {cta.label} <span aria-hidden="true">→</span>
                  </Link>
                </Magnetic>
              )}
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

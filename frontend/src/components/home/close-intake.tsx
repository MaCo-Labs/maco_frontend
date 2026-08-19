import { Link } from "@tanstack/react-router";
import { site } from "@/content/maco";
import { MotionSection } from "@/components/motion-section";
import { LineReveal } from "@/components/motion/line-reveal";
import { Magnetic } from "@/components/motion/magnetic";

/**
 * CLOSE — the final statement and the way in. The full intake form
 * (and the fix for contact.tsx's silently-fake submission handler)
 * is a dedicated phase — see HOMEPAGE_REDESIGN_PLAN.md Phase I. This
 * links to the real /contact route rather than duplicating a second,
 * hastily-wired form on the homepage.
 */
export function CloseIntake() {
  return (
    <section data-ground="deep" className="rule-t" aria-label="Start a project">
      <div className="shell py-24 md:py-36">
        <MotionSection>
          <p className="label">Contact</p>
          <LineReveal
            as="h2"
            className="display-hero mt-4 max-w-3xl"
            style={{ color: "var(--text)" }}
          >
            Good software earns its place.
          </LineReveal>
          <p className="lead mt-6 max-w-lg">
            Tell us what has to work. We reply from {site.contact_email}.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
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
          </div>
        </MotionSection>
      </div>
    </section>
  );
}

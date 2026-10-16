import { LineReveal } from "@/components/motion/line-reveal";
import { ServiceExplorer } from "@/components/services/service-explorer";

/** The two service lines, made concrete through real delivered work. */
export function FeatureAccordion() {
  return (
    <section data-ground="paper" aria-label="Capabilities">
      <div className="shell cb-section">
        <div className="service-chapter-heading">
          <p className="label">What we do</p>
          <LineReveal as="h2" className="display-lg mt-4 max-w-3xl">
            From first impression to daily operation.
          </LineReveal>
        </div>
        <ServiceExplorer />
      </div>
    </section>
  );
}

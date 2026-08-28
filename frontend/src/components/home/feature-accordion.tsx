import { Link } from "@tanstack/react-router";
import { services } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Accordion, type AccordionItem } from "@/components/home/accordion";

/**
 * Every capability across both service lines, flattened into one list —
 * Cuberto's `cb-feature` is a single run of expandable rows, not a set of
 * grouped sub-lists, and the grouping is recoverable from each row's own
 * "part of …" link. `slug` prefixes the id so two services could name a
 * capability the same thing without colliding.
 */
const ITEMS: AccordionItem[] = services
  .flatMap((service) =>
    service.capabilities.map((c, i) => ({
      id: `${service.slug}-${i}`,
      title: c.title,
      body: (
        <>
          <p className="lead max-w-2xl">{c.description}</p>
          <Link to="/services/$slug" params={{ slug: service.slug }} className="btn-line mt-6">
            Part of {service.title} <span aria-hidden="true">→</span>
          </Link>
        </>
      ),
    })),
  )
  .map((item, i) => ({ ...item, index: String(i + 1).padStart(2, "0") }));

/**
 * CAPABILITY — `section#features.cb-feature`. Cuberto's most distinctive
 * homepage device: the whole capability offer as one column of numbered,
 * expandable rows, first row open, one open at a time.
 *
 * Replaces `services-convergence.tsx` (two cards flying in from opposite
 * edges and locking into a pinned stack). That was a good device but it
 * is not the shape Cuberto uses here, and this section is the reason the
 * structural pass was asked for: an accordion states the full range of
 * what is on offer in one screen, which the two-card convergence never
 * could — it could only ever show two titles.
 *
 * Losing that pin also shortens the page by roughly one pinned viewport,
 * which is why the rows are numbered: the index is what tells you the
 * list is finite when there is no longer a pin holding you in place.
 *
 * `panel="inverted"` (2026-08-29) opens each row into a `.section-inverted`
 * dark card instead of a plain indented column — real contrast against
 * this section's own `paper` ground (`Accordion`'s only other call site,
 * `Faq`, stays default: it's already `deep`, so a second dark layer there
 * would have nothing to contrast against).
 */
export function FeatureAccordion() {
  return (
    <section data-ground="paper" aria-label="Capabilities">
      <div className="shell cb-section">
        <ScrubReveal hold>
          <p className="label">Capability</p>
        </ScrubReveal>
        <LineReveal
          as="h2"
          mode="scrub"
          className="display-lg mt-4 max-w-2xl"
          style={{ color: "var(--text)" }}
        >
          What we build, and what we keep running.
        </LineReveal>

        <div className="mt-12 md:mt-16">
          <Accordion items={ITEMS} defaultOpen={ITEMS[0]?.id} panel="inverted" />
        </div>
      </div>
    </section>
  );
}

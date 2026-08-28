import { process } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Accordion, type AccordionItem } from "@/components/home/accordion";

const ITEMS: AccordionItem[] = process.map((p) => ({
  id: p.step,
  index: p.step,
  title: p.title,
  body: <p className="lead max-w-2xl">{p.body}</p>,
}));

/**
 * METHOD — `section#faq.cb-faq.-inverse`. Cuberto closes the body of the
 * page with a second accordion on inverted ground: the same disclosure
 * row as `cb-feature` (slot 4), re-used rather than re-invented, which is
 * what makes the two read as one system instead of two ideas.
 *
 * Replaces `method-line.tsx` (a pinned progress spine with a drawing
 * rule). The four steps are the same four steps — `content/maco.ts`'s
 * `process` — but stated as questions the reader can open rather than as
 * a timeline they have to scroll through at the page's pace.
 *
 * Nothing starts open here, unlike slot 4: by this point in the page the
 * reader is deciding whether to make contact, and four collapsed rows
 * keep `Outro` above the fold behind them.
 */
export function Faq() {
  return (
    <section data-ground="deep" aria-label="How MaCo works">
      <div className="shell cb-section">
        <ScrubReveal hold>
          <p className="label">Method</p>
        </ScrubReveal>
        <LineReveal
          as="h2"
          mode="scrub"
          className="display-lg mt-4 max-w-2xl"
          style={{ color: "var(--text)" }}
        >
          Launch is not the finish line.
        </LineReveal>

        <div className="mt-12 md:mt-16">
          <Accordion items={ITEMS} />
        </div>
      </div>
    </section>
  );
}

import { useId, useState, type ReactNode } from "react";

export interface AccordionItem {
  /** Stable key + the value tracked as "which one is open". */
  id: string;
  /** Small leading index — Cuberto numbers its feature rows. Optional. */
  index?: string;
  title: string;
  body: ReactNode;
}

/**
 * The accordion behind both `cb-feature` (#features) and `cb-faq` (#faq)
 * — the two places Cuberto's homepage uses the same disclosure row, so
 * this is one component with two call sites rather than two components
 * with one shape.
 *
 * The open/close transition is Cuberto's own, taken verbatim from the
 * transition declaration skillui extracted off their stylesheet
 * (`grid-template-rows .3s ease-out, opacity .4s ease-out` — see the
 * `cb-panel` utility in styles.css). A `0fr -> 1fr` grid row is what lets
 * it animate to content height without measuring anything in JS.
 *
 * Single-open by design (`open === item.id`), matching Cuberto: with
 * every row expandable at once the section's height jumps around under
 * ScrollTrigger and every pin below it needs a refresh. One row at a time
 * keeps the page's total height nearly stable.
 *
 * Accessibility is a real `<button aria-expanded>` per row controlling a
 * real region — not a `<div onClick>`. With no JS every panel is closed
 * but its content is still in the DOM and reachable by a screen reader
 * through the button, and every row's full copy also lives on the page it
 * links to.
 */
export function Accordion({
  items,
  defaultOpen,
}: {
  items: readonly AccordionItem[];
  /** Which row starts open. Cuberto opens its first feature row. */
  defaultOpen?: string | undefined;
}) {
  const uid = useId();
  const [open, setOpen] = useState<string | undefined>(defaultOpen);

  return (
    <div>
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div
            key={item.id}
            data-open={isOpen}
            className="border-t border-line last:border-b"
            style={{ borderColor: "var(--line)" }}
          >
            <h3>
              <button
                type="button"
                id={`${uid}-${item.id}-btn`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-${item.id}-panel`}
                onClick={() => setOpen(isOpen ? undefined : item.id)}
                className="group flex w-full items-center gap-5 py-6 text-left md:py-8"
                style={{ color: "var(--text)" }}
              >
                {item.index && (
                  <span className="label" style={{ minWidth: "2ch" }}>
                    {item.index}
                  </span>
                )}
                <span className="display-md flex-1">{item.title}</span>
                <span aria-hidden="true" className="cb-plus" />
              </button>
            </h3>

            <div
              id={`${uid}-${item.id}-panel`}
              role="region"
              aria-labelledby={`${uid}-${item.id}-btn`}
              className="cb-panel"
              data-open={isOpen}
            >
              <div>
                <div className="pb-8 md:pl-[calc(2ch+1.25rem)] md:pb-10">{item.body}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

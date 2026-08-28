import { useId, useState, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

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
 * The open/close transition is Cuberto's own device — a `0fr -> 1fr`
 * grid row lets it animate to content height without measuring anything
 * in JS (`cb-panel` in styles.css, retimed to `--ease-emphasis` in the
 * 2026-08-29 dark-first pass). A `.cb-panel-content` fade + slide-up
 * layers on top of that height reveal, added the same pass.
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
 * links to. `panel="inverted"` (FEATURE only — FAQ stays default, it's
 * already on `deep` ground and a dark card there has no contrast) adds a
 * hover-to-open on `(hover: hover) and (pointer: fine)` on top of the
 * click that stays the real, touch-safe control everywhere.
 */
export function Accordion({
  items,
  defaultOpen,
  panel = "default",
}: {
  items: readonly AccordionItem[];
  /** Which row starts open. Cuberto opens its first feature row. */
  defaultOpen?: string | undefined;
  /** "inverted" wraps the open panel in `.section-inverted` — a dark
   *  contrast card, only worth it on a `paper`-ground caller. Default
   *  behaviour (a plain indented text column) is unchanged. */
  panel?: "default" | "inverted";
}) {
  const uid = useId();
  const [open, setOpen] = useState<string | undefined>(defaultOpen);
  // Same query Magnetic already gates its own hover behaviour on
  // (magnetic.tsx) — a real mouse, not a synthetic mouseenter a touch
  // browser fires after tap, which click already handles everywhere.
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const hoverToOpen = panel === "inverted" && canHover;

  return (
    <div>
      {items.map((item) => {
        const isOpen = open === item.id;
        const openThis = () => setOpen(item.id);
        return (
          <div
            key={item.id}
            data-open={isOpen}
            className="border-t border-line last:border-b"
            style={{ borderColor: "var(--line)" }}
            onMouseEnter={hoverToOpen ? openThis : undefined}
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
                {panel === "inverted" ? (
                  <div className="cb-panel-content mb-8">
                    {/* .section-inverted on THIS element, not a sibling —
                        it remaps --text/--muted/etc. via CSS custom
                        properties, which only cascade to descendants.
                        item.body relies on that remap for its own text
                        colour and for `.section-inverted .btn-line`'s
                        dark-panel button styling to even match. */}
                    <div
                      className="light-pass is-lit section-inverted relative overflow-hidden p-8 md:p-12"
                      style={{ borderRadius: "var(--radius-card)" }}
                    >
                      {/* One restrained accent, not a gallery of them —
                          AGENTS.md names "excessive gradients/glows" as a
                          failure mode. --focus (not --accent) so Cobalt's
                          half of the split actually reads as blue: inside
                          .section-inverted, --accent resolves to
                          --accent-inverted, which is near-white for BOTH
                          themes (same reasoning as the hero's display-glow
                          retune, styles.css). Painted first / not
                          positioned above the content, so DOM order alone
                          keeps it behind item.body without a z-index. */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(ellipse at 85% 0%, color-mix(in oklab, var(--focus) 18%, transparent), transparent 60%)",
                        }}
                      />
                      <div className="relative max-w-2xl">{item.body}</div>
                    </div>
                  </div>
                ) : (
                  <div className="cb-panel-content pb-8 md:pl-[calc(2ch+1.25rem)] md:pb-10">
                    {item.body}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

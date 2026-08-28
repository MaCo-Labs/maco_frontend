import { Link } from "@tanstack/react-router";
import { site } from "@/content/maco";
import { Mark } from "@/components/mark";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { RakingSurface } from "@/components/motion/raking-surface";

/**
 * TOPHEAD — `section.cb-tophead`, the first section of Cuberto's
 * homepage. Their measured box is `padding: 180px 0 108px` with a single
 * child: a brand row, one very large left-aligned statement, a short
 * subtext, and the entry action. Not a full-viewport centred logo lockup
 * — the page starts reading immediately and the fold cuts mid-statement,
 * which is what makes the scroll feel like it has somewhere to go.
 *
 * That shape replaces the previous OPEN section (a full-height centred
 * mark + ghost wordmark). Adopted 2026-08-28 at the owner's explicit
 * direction to clone Cuberto's structure; the words are MaCo's
 * (`site.tagline` / `site.statement`), the mark is MaCo's, the light is
 * MaCo's `<RakingSurface>`, and the type runs the active theme's own
 * display face. Nothing of Cuberto's palette, type or copy is here.
 *
 * `<SplitReveal>` still carries the wordmark entrance so the brand is the
 * first thing that moves; the statement below is a plain `<h1>` rather
 * than a scrub reveal because it sits above the fold, where there is no
 * scroll distance for a scrubbed reveal to run across — instead it gets
 * a one-shot `hero-reveal` scale-in on load (styles.css), a static
 * `display-glow` gradient fill (the `.maco-shine` clip-text device,
 * without the sweep), and a `hero-backlight`/`hero-grain` pair behind
 * it. Eyebrow above the brand row is `site.category` — real copy, not
 * invented. All four are `styles.css` utilities so Obsidian/Cobalt each
 * resolve their own restrained/stronger intensity off existing tokens.
 */
export function TopHead() {
  return (
    <section data-ground="paper" aria-label="Introduction" className="relative overflow-hidden">
      <div aria-hidden="true" className="hero-backlight" />
      <div aria-hidden="true" className="hero-grain" />
      <RakingSurface className="light-pass is-lit">
        <div className="shell cb-tophead relative">
          <p className="label">{site.category}</p>

          <div className="mt-6 flex items-center gap-4">
            <Mark size={44} />
            <SplitReveal
              text={site.name}
              as="p"
              className="display-md"
              style={{ color: "var(--text)" }}
            />
          </div>

          <h1 className="display-hero display-glow hero-reveal mt-12 max-w-[16ch] md:mt-16">
            {site.tagline}
          </h1>

          <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
            <p className="lead max-w-xl">{site.statement}</p>

            <Magnetic>
              <Link to="/contact" className="btn-solid shrink-0">
                Start a project <span aria-hidden="true">→</span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </RakingSurface>
    </section>
  );
}

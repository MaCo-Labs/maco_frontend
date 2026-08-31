import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { site, heroLines, getProduct } from "@/content/maco";
import { Mark } from "@/components/mark";
import { SplitReveal } from "@/components/motion/split-reveal";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { MaskedHeading } from "@/components/motion/masked-heading";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const CYCLE_MS = 4800;

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
 * (`site.tagline` / `site.statement`), the mark is MaCo's, and the type
 * runs the active theme's own display face. Nothing of Cuberto's
 * palette, type or copy is here.
 *
 * No `<RakingSurface>` here (2026-08-29, masked-video-hero pass) — it
 * wrapped the whole section before, but its `light-pass` sweep
 * `mix-blend-mode: overlay`-s with whatever's beneath it, and once the
 * `<h1>` below started rendering a graded video instead of solid text,
 * that blend re-tinted the video off-palette on Cobalt (tried three
 * fixes on the heading side — z-index, isolation, regrading — none of
 * them stopped it; see `masked-heading.tsx`'s own comment). Simplest
 * correct fix, and the owner's explicit call: no light-pass on this
 * section at all, not just on the heading — confirmed live that the
 * eyebrow/brand-row/statement read cleanly without it.
 *
 * `<SplitReveal>` still carries the wordmark entrance so the brand is the
 * first thing that moves. Eyebrow above it is `site.category` — real
 * copy, not invented.
 *
 * `data-ground="deep"` since the 2026-08-28 dark-first pass — the page
 * now opens on the material rather than the page, closing the loop with
 * `Record`/`Faq`/`Outro`/`Footer` at the bottom, also `deep` (`CONTEXT.md`
 * §10).
 *
 * The `<h1>` itself has two renders, deliberately never blended:
 *
 * - **Server / first paint / reduced motion**: a plain heading carrying
 *   `display-hero display-glow hero-reveal` — the static `display-glow`
 *   gradient fill, `hero-backlight`/`hero-grain` behind it, a one-shot
 *   scale-in. This is the ONLY thing SSR ever renders for the headline;
 *   see below for why.
 * - **Client, motion allowed, after mount**: `<MaskedHeading>` — the
 *   Bridge screen capture playing inside the letterforms, cycling through
 *   `heroLines` (`content/maco.ts`) every ~5s.
 *
 * The swap is gated on a `mounted` flag rather than just `useReducedMotion()`
 * (which is itself SSR-safe but defaults to `false`, i.e. "motion allowed",
 * on the server) because `MaskedHeading`'s SVG clip-path coordinates are
 * only correct once its own layout-measuring effect has run client-side —
 * server-rendering it would clip to word positions of (0,0), a visible
 * misaligned flash before hydration catches up. `mounted` keeps the first
 * client render identical to the server's, so React never has to
 * reconcile a mismatch, and only swaps in the masked version on the very
 * next paint.
 */
export function TopHead() {
  const bridge = getProduct("bridge");
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (reduced || heroLines.length < 2) return;
    const id = window.setInterval(() => {
      setLineIndex((i) => (i + 1) % heroLines.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduced]);

  const showMasked = mounted && !reduced && bridge?.media?.video;

  return (
    <section data-ground="deep" aria-label="Introduction" className="relative overflow-hidden">
      <div aria-hidden="true" className="hero-backlight" />
      <div aria-hidden="true" className="hero-grain" />
      <div className="shell cb-tophead relative">
        {/* The corner register mark + dashed leader that lived here
            (studied from Sharplink's hero) are removed per the owner's
            own annotated screenshots (motion/nav pass §10) — decorative,
            purposeless floating boxes in both themes, not part of the
            intended hero composition. */}

        <ScrubReveal as="p" hold className="cb-tophead-eyebrow label">
          {site.category}
        </ScrubReveal>

        <div className="cb-tophead-brand mt-6 flex items-center gap-4">
          <Mark size={44} />
          <SplitReveal
            text={site.name}
            as="p"
            className="display-md"
            style={{ color: "var(--text)" }}
          />
        </div>

        {showMasked && bridge?.media?.video ? (
          <MaskedHeading
            text={heroLines[lineIndex] ?? site.tagline}
            className="cb-tophead-headline display-hero mt-12 max-w-[16ch] md:mt-16"
            videoWebm={bridge.media.video.webm}
            videoMp4={bridge.media.video.mp4}
            poster={bridge.media.poster}
          />
        ) : (
          <h1 className="cb-tophead-headline display-hero display-glow hero-reveal mt-12 max-w-[16ch] md:mt-16">
            {site.tagline}
          </h1>
        )}

        <div className="cb-tophead-cta mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <ScrubReveal as="p" hold className="cb-tophead-lead lead max-w-xl">
            {site.statement}
          </ScrubReveal>

          <Magnetic>
            <Link to="/contact" className="btn-solid shrink-0">
              Start a project <span aria-hidden="true">→</span>
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { site, getProduct } from "@/content/maco";
import { Mark } from "@/components/mark";
import { ScrubReveal } from "@/components/motion/scrub-reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { MaskedHeading } from "@/components/motion/masked-heading";
import { autoplayAllowed } from "@/components/media/product-video";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { usePointerField } from "@/hooks/use-pointer-field";

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
 * Brand row is the mark alone (2026-09-01) — the header's own `<Wordmark>`
 * already spells "MaCo" out in text ~120px above this row (chrome.tsx),
 * so a second spelled-out instance directly under it doubled up in the
 * same viewport for no reason; `site.name` stays in the accessible name
 * (`sr-only`) rather than disappearing. Eyebrow above it is
 * `site.category` — real copy, not invented.
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
 *   Bridge screen capture playing inside `site.tagline`'s letterforms, a
 *   single wipe, no cycling (a prior pass cycled through several lines
 *   every ~5s; cut to the one strongest statement per the "fewer, heavier
 *   moments" direction of the premium-motion pass).
 *
 * The swap is gated on `mounted && entered` rather than just
 * `useReducedMotion()` (which is itself SSR-safe but defaults to `false`,
 * i.e. "motion allowed", on the server), for two independent reasons:
 * `MaskedHeading`'s SVG clip-path coordinates are only correct once its
 * own layout-measuring effect has run client-side — server-rendering it
 * would clip to word positions of (0,0), a visible misaligned flash
 * before hydration catches up (`mounted` keeps the first client render
 * identical to the server's) — and the wipe itself should land AFTER the
 * preloader gate, not finish behind the overlay before the visitor ever
 * sees it (`entered`, set by a `maco:entered` event `preloader.tsx`
 * dispatches from both its skip branch and its Enter click, so a visitor
 * who never sees the preloader at all reads as entered immediately).
 */
export function TopHead() {
  const bridge = getProduct("bridge");
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [mediaOk, setMediaOk] = useState(false);
  const [entered, setEntered] = useState(
    () => typeof document !== "undefined" && document.documentElement.dataset["preload"] === "skip",
  );
  const pointerRef = usePointerField<HTMLElement>();

  useEffect(() => {
    setMounted(true);
    // Unlike ProductVideo below the fold, this video is always in the
    // initial viewport, so an IntersectionObserver buys nothing — the
    // actual waste was fetching 764KB unconditionally on touch/narrow/
    // saveData devices with no way to defer it. Same policy ProductVideo
    // already applies, so a phone or a throttled connection gets the
    // static display-glow heading instead, not a silent full-size fetch.
    setMediaOk(autoplayAllowed(reduced));
  }, [reduced]);

  useEffect(() => {
    if (entered) return;
    const onEntered = () => setEntered(true);
    window.addEventListener("maco:entered", onEntered);
    return () => window.removeEventListener("maco:entered", onEntered);
  }, [entered]);

  const showMasked = mounted && entered && !reduced && mediaOk && bridge?.media?.video;

  return (
    <section
      ref={pointerRef as never}
      data-ground="deep"
      aria-label="Introduction"
      className="relative overflow-hidden"
    >
      <div aria-hidden="true" className="hero-backlight" />
      <div aria-hidden="true" className="hero-grain" />

      {/* Layout-3 desktop hint pointing at the fixed edge-nav dot rail
          (edge-nav.tsx) — its per-dot labels only reveal on hover/focus,
          so a first-time visitor sees two bare dot columns with nothing
          marking them as navigation. Lives only in the hero (absolute
          within this section, not fixed) so it scrolls away once the
          real nav is the only thing left to notice. Purely decorative —
          the actual nav landmark is edge-nav.tsx's own `<nav>`. */}
      <div aria-hidden="true" className="hero-nav-hint hero-nav-hint-left">
        <span className="hero-nav-hint-label label">Menu</span>
        <span className="hero-nav-hint-chevron" />
      </div>
      <div aria-hidden="true" className="hero-nav-hint hero-nav-hint-right">
        <span className="hero-nav-hint-label label">Menu</span>
        <span className="hero-nav-hint-chevron" />
      </div>
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
          <Mark size={72} />
          <span className="sr-only">{site.name}</span>
        </div>

        {showMasked && bridge?.media?.video ? (
          <MaskedHeading
            text={site.tagline}
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

# MaCo Website — AI Handoff

## Status

Overall: **STABLE.** The homepage was fully rebuilt on Cuberto's structural
foundation 2026-08-28 (11 sections, new order — see `CONTEXT.md` §10 and
the seventh-pass entry below), refined the same day (eighth pass: EVIDENCE
crop fix, dead-code sweep, hero treatment, client consolidation, adaptive
navbar), pushed further 2026-08-29 (ninth pass: dark-first ground
sequence, a Capabilities dark-panel accordion, a masked video-in-text hero,
a restrained custom cursor), again the same day (tenth pass: reel
geometry fix, Lenis retune, IDENTITY script curation, a first-paint
preloader, a full-width footer wordmark, and a three-mode layout
switcher), again 2026-08-30 (eleventh pass: the `/about` SSR bug fixed
for real, the cursor generalized into a semantic per-state/theme/ground-
aware system with a footer torch effect, layout modes 2 and 3 rebuilt to
match their actual references, and a 15-unit premium/interactivity audit —
see below), a 2026-08-31 motion/nav pass (Layout 3's chrome replaced with
`EdgeNav`'s dots, mode 2's panel translucency + arrow, preloader Enter
gate, cursor labels, motion tokens centralized), and again 2026-09-01 (a
chrome/motion/reveal pass: Layout 2 re-geometried to iventions.com's
actual silhouette, EdgeNav narrowed to mode 3 only, mode 3's header
stripped to dots-only, FEATURE's accordion replaced with a scroll-driven
reveal, GroundHandoff's recede weighted by structural role, the preloader
retimed/enlarged, cursor ground-tracking made continuous — plus two real
pre-existing bugs found and fixed during that pass's own verification, see
below), a 2026-09-02 pass (owner review against 3 screen recordings: FEATURE
reveal pacing, Layout 2 desktop wipe/header chip/panel-opacity, mobile
Layout 2 collision fixes, Layout 3 mobile CTA overlap — six items), a
2026-09-02 later pass (a separate six-item defect list: Layout 2's panel
tone made dynamic instead of hardcoded, the logo mark cropped to its real
content, Layout 3 mobile wordmark/control-cluster/TOPHEAD-padding/
ThemeSwitch hygiene), and a 2026-09-03 pass (FEATURE reverted from the
2026-09-01 scroll-driven reveal back to `Accordion`'s hover-to-open mode —
the scroll version lagged real scroll gestures; `groundAt()` gained a
`fallback` parameter so continuous ground-trackers stop flashing to paper
at gaps between deep sections), and a 2026-09-03 later "homepage premium
pass" (4 UI bugs fixed — preloader collision, Layout 2 mobile brand chip
and panel-CTA overlap, footer wordmark clipping; the two "About" sections
merged into one, homepage now **10 sections**, was 11; GroundHandoff
rebuilt as opacity-only fades on same-ground boundaries plus a real
rounded overlap — not the old barely-visible flatten — at the 2
ground-flip boundaries; see its own entry below for full detail,
including an honest note that this pass was verified structurally but
never actually seen in a browser — both `agent-browser` and `playwright`
MCP were unavailable all session). **Everything through this pass is now
committed** (three commits on top of `503ce20`: a docs checkpoint, a code
checkpoint, and this pass) — `git log --oneline` is authoritative. A full
dead-code/dependency cleanup pass ran 2026-08-21 (see
`CONTEXT.md` §11). Build/lint are clean. The `/about` SSR issue is
resolved. Nothing in the codebase ships behind a preview flag as of this
writing — `?v2=` was removed entirely once the eleventh pass's items
flipped to default. **On top of all of the above, a 2026-09-04 "real-media"
pass, a same-day later "premium motion & interaction" pass, a
2026-09-04/05 "ambient motion" pass (5-stage plan) plus a small layout-3
navigation-discoverability fix, a 2026-09-05 "Services + About
elevation" pass, and a 2026-09-05 later "contact/client/fix" pass (own
entries below, newest first) are all
done but uncommitted** as of this writing — `git status` shows the full
file list; treat `CONTEXT.md` (updated through all of them) as the current
source of truth for what the homepage, `/services/$slug`, and `/about`
look like, not just the last commit.

## 2026-09-05 session, later — contact/client/fix pass (uncommitted)

Owner supplied real contact details, a new client with a print-only
deliverable, an upscaled logo for an existing client, and four bug reports
from screenshots (red arrows/circles marking the problem areas). Two
sub-passes, done back to back:

**Sub-pass A — contact info, Ozone client, Soorath logo swap.**

- `content/maco.ts`: `site.contact_email` corrected `hello@maco.dev` →
  `info@maco.codes` (the placeholder was never real); added `site.phones`
  (Qatar +974 3126 6690, Dubai +971 54 321 0907, India +91 73067 94846).
  Both render on `/contact` (a new "Call" block) and the footer
  (`chrome.tsx`), as `tel:`/`mailto:` links.
- Added a 5th client/project: **Ozone Fitout & Contracting W.L.L.** — the
  owner described a 16-page corporate brochure MaCo designed for them
  (Interior Fit-Out / Contracting & Construction / MEP Services /
  Engineering Consultancy & Design) and explicitly asked for the shortest
  "premium agency style" description on the site, with the longer version
  folded into the case-study's challenge/solution/results blocks — framed
  as brand/communication design, not "we made a PDF," to sit naturally
  under Digital Solutions → Branding and Design (added to that service's
  `evidence` array). Ozone has no live site, which the content model had
  never needed to represent before — see below.
- **`Project.external_url` and `Client.website` made optional.** Both were
  required fields on the assumption every engagement was a live website.
  Every render site was audited and guarded rather than left to silently
  break: `work.index.tsx`'s hover-stage "Visit site" button and its
  gallery-less brand-plate fallback, `work.$slug.tsx`'s "Visit {title}"
  button and its stats row (`["Delivered", "Print / brand piece"]` in
  place of `["Live", "Public"]` when absent), `clients.tsx`'s roster link.
  This is the honest fix, not a placeholder URL — content-integrity rule,
  `CONTEXT.md` §16.
- Soorath Autos's logo swapped for the owner's upscaled source
  (`public/media/brand/soorath.webp`, converted via `sharp` same pattern
  as `scripts/convert-work-shots.mjs`) and its `brand` dimensions bumped
  500×500 → 640×640 in both its `Project` and `Client` entries.
- Verified via `tsc --noEmit` (clean apart from the pre-existing unrelated
  `MaCoGlobe.tsx` GeoJson-accessor error), `eslint` on every touched file,
  `npm run build`, and a live dev-server check (`curl --compressed` +
  `grep -a`, gzip/non-ASCII made plain `curl`/`grep` misreport the response
  as binary) confirming Ozone on `/work` and `/clients`, and the new
  email/phones rendering correctly on `/contact`.

**Sub-pass B — four screenshot-reported fixes**, each an owner screenshot
with a red arrow/circle/X marking the problem:

- **Soorath's logo showed a solid black square instead of sitting cleanly
  on its plate.** Root cause: `sharp .metadata()` on the freshly-converted
  `soorath.webp` showed `channels: 3, hasAlpha: false` — the owner's
  "upscaled" source PNG had already had its transparency flattened to
  solid black before it reached this repo, so the conversion script had
  nothing to preserve. Fixed by chroma-keying the black out in a small
  one-off script (not a checked-in tool — same one-off-`node -e` pattern
  the original conversion used): read raw RGBA, and for every pixel set
  `alpha = max(r, g, b)`, then unpremultiply each channel by that alpha
  (`channel × 255 / alpha`) — the standard "black-screen" removal used for
  clean vector marks on a pure-black field. Produces correct anti-aliased
  edges with no black fringe, unlike a hard luminance threshold. Verified
  by compositing the result over a light background before shipping it.
  Ozone's own logo was checked too — its solid teal background is the
  actual brand-tile design (a rounded icon + wordmark lockup, not a flat
  logo mark), not a conversion artifact, so it was left untouched.
- **`/about`'s intro carried a `SystemField` grid (the M-logo-derived 6×8
  cell mark, `components/system-field.tsx`) that read as unexplained
  decoration next to the hero text.** Removed from `about.tsx` only (its
  other three call sites — `top-head.tsx`, `preloader.tsx`,
  `/products/$slug` — are untouched); the intro section collapsed from a
  two-column `lg:grid-cols-12` split to a single full-width column since
  nothing needs the freed column anymore.
- **Cobalt's `.ambient-field` (the at-rest breathing radial-gradient layer
  on OVERVIEW/FEATURE/FAQ/IDENTITY, `styles.css`) rendered a noticeably
  stronger blue haze than Obsidian's near-invisible version** — the owner
  described it as "a blue smoke like thing" and believed it had already
  been fully removed (it had, effectively, from Obsidian, which is why it
  read as gone there). Root cause: a `[data-theme="cobalt"] .ambient-field`
  override bumped the same two radial gradients' `color-mix` opacity from
  16%/12% to 28%/22%. Deleted the override entirely — Cobalt now falls
  back to the same base values Obsidian uses, so the two themes read
  identically at rest. (`.hero-backlight`'s own, separate Cobalt-stronger
  override on TOPHEAD was left alone — it wasn't one of the sections the
  owner's screenshots pointed at, and it's a deliberate hero-only light
  source rather than the ambient "smoke.")
- **Every "the Gulf" in visible copy renamed to "the Middle East"** —
  `about.tsx` (Contact section), `identity.tsx` (the "One name. Many
  scripts." lead line), `overview.tsx` (the About paragraph absorbed from
  the deleted Record section, 2026-09-03). Code comments in `content/maco.ts`
  explaining historical script-curation reasoning were left as-is (they
  describe a past decision, not live copy).

Verified: `tsc --noEmit` (same single pre-existing `MaCoGlobe.tsx` error,
nothing new), `eslint` clean (prettier auto-fixed one wrap in `about.tsx`),
and a live Playwright check at 1440×900 in both themes — `/about`'s intro
reflows correctly with `SystemField` gone, `/clients` shows Soorath's logo
clean on its plate, and Cobalt's IDENTITY/FEATURE sections show the same
restrained ambient glow Obsidian does. `.playwright-mcp/` scratch output
removed after.

## 2026-09-05 session — Services + About elevation pass (uncommitted)

Owner-directed, citing skiper-ui.com/reactbits.dev as technique references
(same "technique source, not identity" framing as §2 rule 1 — no library
added, no copied files). Confirmed via 4 clarifying questions before
building: no new npm dependencies; the 8 team members would be supplied as
real names only (not invented roles/bios); all 5 globe markers are real
operational hubs, not decoration; portraits stay strictly monochrome (no
grayscale→color hover); one combined pass covering both pages.

**Services (`routes/services.$slug.tsx`):**
- Capability rows: on hover, the title/description slide 4px right and the
  description darkens gray→`--text`. Applied to the child `h2`/`p`
  elements, not the `.stagger-item` wrapper itself — that element's own
  `transform` is GSAP-scrubbed (driven by `Stagger`'s `--sr` custom
  property), so a hover transform on the same node would fight it.
- Evidence grid deduplicated into one `EvidenceCard` component (was two
  near-identical inline `<Link>` blocks for projects vs. products) so
  `usePointerField()` — illegal inside a `.map()` callback — runs once per
  real component instance, giving each card independent `--px`/`--py`.
  New `evidence-spotlight` CSS utility (`styles.css`) renders a mouse-
  tracked radial border ring via the `padding` + `mask-composite: exclude`
  trick, tinted from `--focus` (not `--accent`, same reasoning as the hero
  backlight — `--accent` remaps to near-white on `deep` ground). The whole
  grid already reveals via `<Stagger>`.

**About (`routes/about.tsx`):**
- New **Origin** section: one-paragraph founding narrative
  (`content/maco.ts`'s new `origin` export) revealed word-by-word via
  `LineReveal`'s existing `mode="words"` — second use of that mode (first:
  Overview's opening statement, 2026-08-29), not a new component.
- New **Team** section: a 4-col hairline grid (8 real names, matches the
  Method/Evidence hairline-grid visual language already on this page).
  Portraits stay monochrome per the owner's call — hover/focus-within
  express via `contrast-125 brightness-105` on the image box plus a
  `max-height`/opacity slide-up on the bio text, never a saturation
  change. No portrait images exist yet, so every card falls back to a
  typographic initials monogram (`initials(name)`).
- **`MaCoGlobe`/`GlobeSection` retargeted to 5 real hubs** — Kochi,
  Bangalore, Chennai, Qatar, Dubai — added as `primary: true, label`
  entries in `NODES` (reusing two already-close-enough coordinate slots
  from the old ambient set rather than appending disconnected ones),
  rendered larger/brighter/labelled (`labelsData` etc., all verified
  present in `react-globe.gl`'s own `.d.ts`) versus the remaining
  unlabelled ambient decoration points. `GlobeSection`'s copy dropped the
  old "not a claim about offices or reach" disclaimer — the owner
  confirmed these 5 are genuine hubs, so the copy now states them
  factually ("Kochi, Bangalore, Chennai, Qatar and Dubai — where MaCo
  works").

**The one real content-ethics call this pass:** the owner supplied only 8
names, not roles or bios. Rather than invent plausible-sounding job
titles/bios for real individuals (a direct violation of §2 rule 2 and the
codebase's own `Media.note` no-silent-placeholder convention), each
`TeamMember`'s `role`/`bio` renders as an explicit, visible "Role —
pending" / "Bio — pending." — **owed back from the owner**: real
role/bio text, and portrait image files (`TeamMember.portrait?: Media` is
wired and ready — no path convention needed to be invented, it follows the
same `/media/<area>/<slug>.<ext>` + intrinsic width/height pattern already
used everywhere else).

Zero new dependencies — `motion`, `react-globe.gl`/`three`,
`usePointerField`, `Stagger`, `LineReveal` all pre-existed. Verified:
`npx tsc --noEmit` (only the pre-existing `MaCoGlobe.tsx` error), `npm run
lint` and `npm run build` clean, SSR HTML grepped for the new markup on
both pages, and a live Playwright MCP pass against the dev server —
`/about` and `/services/business-software` both 0 console errors (one
pre-existing `THREE.Color` alpha warning on `/about`, traced to
`tokens.atmosphere` in `MaCoGlobe.tsx`'s cobalt branch, confirmed present
before this pass too) — plus an accessibility-tree snapshot confirming
`/about`'s section order (Introduction → Origin → Method → Principles →
Team → Contact MaCo) and every Team card's content. **Next step: get real
role/bio copy + portraits from the owner, then commit.**

## 2026-09-04/05 session — ambient motion pass (Stages 1-5) + layout 3 nav hint (uncommitted)

Owner-directed, executed via plan mode (`yeah-on-the-paper-warm-frost.md`,
the owner's local plan store, not tracked in-repo — same pattern as the
prior pass's `maco-website-velvet-book.md`). The brief that opened the plan
assumed the homepage read as static because it lacked WebGL ambience, and
proposed pulling in Aceternity/Magic UI/21st.dev shader blocks, Cobe, and
`@react-three/drei`. Exploration found that assumption mostly wrong and the
fix worse than the disease: this codebase runs one shared rAF loop (Lenis
drives `gsap.ticker`, `scroll-runtime.ts`), and every one of those libraries
ships its own private rAF plus framer-motion springs — exactly the failure
mode `MorphSlider` already had before the prior pass's IntersectionObserver
pause/resume. Their hardcoded-hex palettes also can't survive this site's
`obsidian`/`cobalt` × `paper`/`deep` token remap. `ogl` was already
installed and eagerly bundled (for `MorphSlider`), so the actual plan
stayed dependency-free and staged, measuring after each stage:

1. **Retuned scrub** (the real headline fix) — `ScrubReveal`, `Stagger`,
   `RuleDraw`, `LineReveal`, `GroundHandoff`, and `Outro` all ran
   `scrub: 0.22-0.3`, near-instant catch-up that reads as motion snapping
   to rest the moment the wheel stops. Raised all six to `0.6` so reveals
   carry a beat past the scroll gesture instead. Deliberately left alone:
   IDENTITY's and PREVIEW's pinned-scene scrubs (`0.25`/`0.3` — loosening
   these would desync pin geometry and IDENTITY's dial from the actual
   scroll position) and the header's own scrub (a laggy header reads as
   broken, not smooth).
2. **`ambient-field` CSS utility** (`styles.css`) — two layered radial
   gradients built from `color-mix(in oklab, var(--focus) N%, transparent)`
   (`--focus`, not `--accent`, for the same reason the hero backlight
   already uses it: `--accent` remaps to near-white on deep ground in both
   themes), animating `transform`/`scale` only, 40-60s infinite alternate,
   `border-radius: inherit` (required — Overview/Faq carry `.ground-sheet`'s
   rounded top corners with no `overflow: hidden`, so a square child would
   visibly cancel the ground-flip overlap), reduced-motion killed. Mounted
   in Overview, Faq, FeatureAccordion, and Identity — the four text-only
   "flat rooms" that had zero at-rest motion (media sections already had
   `hero-mask-drift`/`cb-reel-drift`/MorphSlider's own drift).
3. **`MorphSlider` folded onto the shared ticker.** The prior pass's
   IntersectionObserver pause/resume stopped the engine's private
   `requestAnimationFrame` loop from running forever off-screen, but it was
   still a second rAF loop competing with Lenis whenever it *was* running —
   the one runtime on the page not on `gsap.ticker`. Now ticks via
   `gsap.ticker.add()`, same instance Lenis drives, with the IO pause/resume
   removing/re-adding the same callback instead of stopping/starting `raf`.
4. **`--vel` scroll-velocity custom property**, registered `inherits: false`
   (an inheriting property invalidates every node in the document per frame
   — thousands of elements here) and written by the *existing* header
   ground-tracking ticker closure (already running every frame, already
   torn down correctly) via `gsap.quickSetter`, targeting only
   `.ambient-field` elements. `rt.lenis.velocity` is px/frame, not px/s —
   divided by `gsap.ticker.deltaRatio()` so it isn't twice as strong at
   120Hz as 60Hz, then normalized against viewport height and clamped.
   `.ambient-field`'s opacity now reads `0.7 + var(--vel, 0) * 0.3` — a
   subtle scroll-reactive brightening, expressing only while scrolling
   (the one case that wasn't actually the original complaint, hence last).
5. **`<AmbientCanvas>`** (`components/motion/ambient-canvas.tsx`, new) —
   the ogl `Renderer`/`Triangle`/`Program`/`Mesh` primitives `MorphSlider`
   already established as this codebase's WebGL pattern, one fragment
   shader doing FBM (fractal Brownian motion) noise instead of a static
   gradient, so the field keeps evolving at rest, not just on scroll or
   pointer. Live `uColorA`/`uColorB` uniforms resample `--focus`/
   `--sweep-light` off a `MutationObserver` on `data-theme`/
   `data-ground-now` (a canvas-2D `fillStyle`/`getImageData` trick resolves
   this codebase's `oklch()`/`color-mix()` token strings into concrete sRGB
   bytes, since a hex-only parser can't read them), never polled per frame.
   `uPointer` is lerped toward the real pointer position for a gentle warp
   — desktop-only in effect, since the pointer hook rests at 0.5/0.5 on
   touch. Ticks on `gsap.ticker` (never its own rAF), IntersectionObserver
   lazy-mounts/pauses it (MorphSlider's own latch pattern), DPR capped
   `Math.min(devicePixelRatio, 1.5)` desktop / `1.0` mobile, and the whole
   component skips mounting under reduced motion — `.ambient-field` alone
   is the complete effect there. Layered on top of `.ambient-field` in
   Overview, Faq, and Identity only (narrower than Stage 2's four sections
   — FeatureAccordion keeps the CSS-only field, per the final brief).
   Verified pixel-level in-browser: correct neutral-gray field on Obsidian,
   correctly blue-shifted field on Cobalt after a live theme toggle, zero
   `<canvas>` elements anywhere under `?motion=reduced`.

**A separate, owner-flagged UX issue, same session:** layout 3's edge-nav
dot rail (`nav/edge-nav.tsx`) is undiscoverable at rest on desktop — each
dot's label is hover/focus/active-only by design, so a first-time visitor
sees two bare columns of dots with nothing marking them as navigation
(flagged with a screenshot, red-circled). Added a small "Menu" hint + a
7×7px chevron pointing at each column (`.hero-nav-hint`, `top-head.tsx`),
scoped three ways: `html[data-layout="3"]` only, `≥64rem` only (below that,
`EdgeBar`'s labels are already always-visible), and confined to TOPHEAD's
own `position: relative` section as `position: absolute` (not `fixed`) so
it scrolls away with the hero once the real dot rail is the only nav left
on screen — no scroll-tracking JS needed. Colors read `--muted`/`.label` so
both themes fall out for free; a `hero-nav-hint-breathe` opacity keyframe
draws the eye, killed under reduced motion (the override selector had to
match the animating rule's specificity, `html[data-layout="3"]
.hero-nav-hint`, not a bare `.hero-nav-hint` — a lower-specificity override
silently lost the cascade, caught live via `getComputedStyle`). Vertical
position is `top: calc(50vh - Nrem); transform: translateY(-100%)` —
`50vh`, not `50%`: a percentage centers on the hero SECTION's own
(taller-than-viewport) height, landing well below the dot rail's actual
viewport-fixed position; `50vh` reaches the same point the rail's own
`top: 50%` fixed positioning does, since the hero's top edge coincides with
the viewport's at scroll position 0 (the only time the hint is visible).
Confirmed via `getBoundingClientRect()` against the real `.edge-nav-col`
that the hint sits directly above it with no horizontal offset (both share
the same `1.75rem` inset).

**Follow-up in the same session, after a live screenshot review:** hid the
native OS scrollbar site-wide (`scrollbar-width: none` / `-ms-overflow-
style: none` / `html::-webkit-scrollbar { display: none }`) — Lenis already
owns scroll feel and every scroll-position readout on the page (EdgeNav's
dots, the header's ground scrub, every `ScrollTrigger`), so the browser's
own scrollbar chrome was pure visual noise on top of a page that already
communicates scroll state its own way; scrolling itself (`overflow`/wheel/
touch) is untouched. Also widened the hero-nav-hint's gap above the dot
rail (`50vh - 3.25rem` → `50vh - 4rem`, ~7px → ~19px measured) since the
first pass's spacing read as cramped in a live screenshot.

Verified: `npx tsc --noEmit` (only the pre-existing `MaCoGlobe.tsx` error),
`npm run lint` (0 errors, same 3 pre-existing warnings). Live-verified in
Playwright MCP against the dev server: theme-color response on a live
theme toggle, IntersectionObserver mount/pause gating (zero canvases before
scroll, zero under reduced motion), pixel alignment of the nav hint against
the real dot rail at 1440×900, `display: none` on the hint at layout 1 and
at 390px width in layout 3, the reduced-motion override actually applying
(`getComputedStyle` showing `animationName: "none"`), and scrollbar-
reserved width dropping to `0`. Uncommitted — layered on the still-
uncommitted "premium motion & interaction" pass below; `git status` has the
full file list.

## 2026-09-04 session, later — premium motion & interaction pass (uncommitted)

Owner-directed (a written brief, executed via plan mode), building on the
"real-media" pass immediately below. Goal: move the homepage from "well-built
agency site" toward "premium software company that feels inevitable" —
fewer, heavier moments and physical pointer response, on the existing stack
only (no new libraries, no new sections, no invented content). Full plan
detail, including the reasoning behind each numbered decision, lived at
`C:\Users\LENOVO\.claude\plans\maco-website-velvet-book.md` during execution.

**Two premises in the original brief were corrected before building, not
after:** (1) "reuse RakingSurface in the hero" would have re-opened a bug
closed 2026-08-29 — `RakingSurface`'s `light-pass` sweep re-tinted the masked
Bridge video off-palette on Cobalt via `mix-blend-mode: overlay`; the hero's
new pointer light is a plain `--px`/`--py`-driven radial on the existing
`.hero-backlight` div instead, no blend mode. (2) "FEATURE rows should open
onto a real UI/media proof" was skipped outright — `content/maco.ts` has no
link from any capability to any project or screenshot, and inventing one
(e.g. pairing "CRM" with a client's screenshot) would be an unsourced claim.

**One thing the brief didn't anticipate, found during exploration:**
`MorphSlider`'s WebGL engine ran an unconditional `requestAnimationFrame`
loop forever, idle or offscreen — four WORK cards meant four permanent GL
contexts and four render loops running outside Lenis's ticker. Fixed as
part of this pass (see below), not a separate ask.

1. **Cleanup.** Deleted `depth-carousel.tsx` (zero live imports — the
   commented-out swap-back import in `summary.tsx` went with it) and
   `raking-surface.tsx` (zero live imports, and its own reason for existing
   was gone per the premise correction above); 5 orphan raw assets in
   `src/assets/` (`AL-AFZAH-GROUP-WLL.png`, `DD-1..4.jpg` — confirmed no
   build script names them, unlike the assets `convert-work-shots.mjs`/
   `convert-product-video.mjs` actually consume). Pruned `styles.css`:
   all `.depth-carousel*` rules, `maco-shine`/its keyframes (verified zero
   `.tsx` references — the "Shiny Text" doc comment describing it was
   already stale before this pass, its real call site gone since
   2026-09-01), `.index-row-active`/`.row-index`/`.row-meta`, the
   `[aria-label="Introduction"] .light-pass::after` suppressor (the hero
   has no `.light-pass` left to suppress), `--backdrop-blur`, and 9 unread
   `@theme inline` aliases (`--color-bg`/`-accent`/`-accent-ink`/`-focus`/
   `-surface-2`, `--ease-overshoot`, `--duration-fast/-standard/-slow` —
   grepped each individually for both `var()` reads and generated Tailwind
   utility class usage before removing, since a `@theme` key can be "live"
   as a utility with zero `var()` references). Un-exported
   `describeError`/`resetScrollRuntime` (used only internally); deleted
   `setMotionOverride` outright (zero callers anywhere, not just external).
   Removed `content/maco.ts`'s `heroLines` (dead once TOPHEAD stopped
   cycling, item 2) and `Status` type (zero occurrences); un-exported
   `NameScript`. Left `scripts/build-media.mjs`'s `brandJobs` alone —
   despite pointing at 6 raw source files that don't exist in this
   checkout, it's the documented regeneration recipe for the brand logos
   already live in `public/media/brand/`, same category as the two
   `convert-*.mjs` scripts, not dead code.
2. **TOPHEAD.** Cut the 4-line cycling tagline (`heroLines`, `CYCLE_MS`,
   the `setInterval`) down to one statement (`site.tagline`) with a single
   `MaskedHeading` wipe. Hero backlight now tracks the pointer:
   `usePointerField` on the `<section>` writes `--px`/`--py` (already the
   pattern `identity.tsx` uses), `.hero-backlight`'s radial centre reads
   `calc(var(--px, .3) * 100%) calc(var(--py, .4) * 100%)` — CSS-only, no
   RAF, rests at the original 30%/40% position on touch/no-JS since the
   hook never runs there. **Preloader hand-off, a real sequencing bug
   fixed:** the masked wipe used to fire on its own mount, finishing behind
   the preloader overlay before a visitor ever pressed Enter — the hero's
   one real reveal moment was wasted off-screen every time. `preloader.tsx`
   now dispatches a `maco:entered` `CustomEvent` from both `markDone()`
   call sites (the reduced-motion/already-shown skip branch, and the real
   Enter click); TopHead's `showMasked` gate is now `mounted && entered &&
   ...`, with `entered`'s initial state read synchronously from
   `document.documentElement.dataset.preload === "skip"` so a visitor who
   never sees the preloader isn't stuck waiting for an event that already
   fired before they mounted.
3. **GroundHandoff + reveal primitives.** Same-ground fade weights
   lightened (`interior` 0.7→0.88, `emphasis` 0.55→0.74 opacity) — still
   heavier at the structural beats, but neither dips far enough to read as
   a gap. Boundary scrub 0.4→0.28. The two ground-flip sheets (Overview,
   Faq) now finish their radius tween at `top 55%` instead of `top 25%` —
   settled and rounded while the two sections still visibly overlap,
   rather than only rounding out just as the incoming section nears the
   top. `ScrubReveal`/`Stagger` scrub 0.35→0.22, `LineReveal`'s `scrub`
   mode 0.4→0.25, `RuleDraw` 0.3→0.22 — tighter tracking is what reads as
   weighted rather than floaty. Lenis itself untouched (`lerp: 0.09` was
   already owner-tuned live 2026-08-29 after `0.07` measured as drag).
4. **WORK/PRODUCTS cards.** `SummaryCard`'s `<Link>` now wraps in the
   existing `<Magnetic>` (14px rubber-banded lean, no-ops on touch/reduced
   motion); the card's own hover-lift duration dropped 500ms→300ms so the
   two compose instead of fighting. The "All work"/"All products" `btn-line`
   CTAs gained the same `<Magnetic>` wrap other site CTAs already had.
   `MorphSlider` defaults retimed (`duration` 1.1→0.85, `ease`
   `power2.inOut`→`power3.out`, `autoplayDelay` 4→5.5 — four cards
   autoplaying every 4s read as busy). **The real fix:** the WebGL engine
   now lazy-mounts via an `IntersectionObserver` (`rootMargin: "300px 0px"`,
   matching `product-video.tsx`'s own threshold) instead of constructing on
   first render — zero GL contexts exist until a card is actually near the
   viewport. Added `pause()`/`resume()` to the engine (stop/restart the
   `requestAnimationFrame` loop without tearing down GL state) wired to the
   same observer, so a card that's been constructed once just idles instead
   of re-fetching/re-decoding every time it crosses the margin. DPR cap
   2→1.75. Confirmed live: zero canvases exist before scrolling near WORK;
   a real trusted Enter keypress on the focused slider stage (which sits
   inside the card's own `<Link>`) does not navigate; a slide-arrow click
   doesn't either.
5. **FEATURE accordion.** No media-proof change (premise correction above).
   The one real defect: the inverted panel's `light-pass is-lit` never had
   anything driving its `--sweep`, so the signature raking light sat frozen
   at the registered `@property`'s 0 rest value — opening a row never lit
   it. Fixed in CSS alone: `.cb-panel[data-open="true"] .light-pass {
   --sweep: 1; }` inside a `prefers-reduced-motion: no-preference` block,
   with the `transition: --sweep .9s` declared on the unconditional base
   selector so closing eases the light back out too, not just opening it
   in. Confirmed live: `transition-property: --sweep` / `--sweep: 1` when
   open under normal motion; `transition-property: all` (i.e. the rule
   doesn't match at all) under reduced motion.
6. **IDENTITY, scaled up** — the chosen signature set-piece (the only
   section about MaCo rather than a client, and the cheapest to add weight
   to: the dial is already pure CSS `calc(--i - --t)`, zero re-renders).
   Pin runway lengthened (`+=110%`→`+=170%` desktop, `+=90%`→`+=130%`
   mobile, `scrub` unchanged at 0.25 — the longer runway does the slowing).
   Type scaled up (`--slot` and track height both ~40% larger, font-size
   `clamp(2.2rem,6vw,5rem)`→`clamp(2.6rem,9vw,8rem)`); depth falloff
   increased (scale `ad*0.28`→`ad*0.34`, opacity `ad*0.44`→`ad*0.5`,
   pointer nudge cap `±0.15`→`±0.25`). No new WebGL — the existing CSS dial
   does this better than a canvas would. Confirmed live at 1440px (font-size
   and track height both measured hitting their intended `clamp()` ceiling)
   and at 390px (no horizontal overflow, Arabic driven to `--t: 8` directly
   to check RTL shaping at the new scale — unclipped, correctly centred).
7. **Cursor/micro-interactions.** Mostly a verify-only pass — `resolveState`
   already auto-resolves buttons/`role=button`/`.btn-solid`/`.btn-line`/
   plain links correctly, and the three explicit `data-cursor` declarers
   (Evidence, summary cards, footer torch) were already correct. The one
   real gap (the two Summary CTAs missing `Magnetic`) is item 4 above.

**Verified this pass:** `npx eslint .` (0 errors, same 3 pre-existing
warnings), `npx tsc --noEmit` (only the pre-existing `MaCoGlobe.tsx` error),
`npm run build` (client + SSR) — all re-run clean after every numbered item,
not just at the end. **A real browser pass was performed** (Playwright MCP,
production `npm run preview` build) covering both themes at 1440px/390px
plus a full `prefers-reduced-motion: reduce` pass — see `PROJECT_STATUS.md`'s
matching entry for the itemized list of what was directly confirmed (event
sequencing, pointer-light wiring, lazy-mount canvas count, card-link-hijack
guards under a real trusted keypress, the `--sweep` transition present/absent
under each motion setting, the `.ground-sheet` CSS rest state, RTL shaping at
the new IDENTITY scale). **Not independently re-verified live:**
`MorphSlider`'s `pause()`/`resume()` under repeated scroll-away/back — code-
reviewed correct (mirrors `product-video.tsx`'s own IntersectionObserver
pattern) but not measured via DevTools Performance for live WebGL-context
count during continuous scrolling. **Next step: commit**, once the owner has
reviewed live.

## 2026-09-04 session — real-media pass (uncommitted)

Owner-directed, ad-hoc (not a `ROADMAP.md` item): the WORK/PRODUCTS cards
had been carrying either the brand-mark-on-plate placeholder or, for
Bridge only, real video — this pass got real imagery/video onto every
remaining card, plus a small-logo-branding request across the homepage
and `/clients`. Full technical detail lives in `CONTEXT.md` §4's
2026-09-04 adopt/reject log entry and §10's updated section notes — this
is the narrative summary:

1. **WORK cards now crossfade real client-site screenshots.** Captured
   raw screenshots of all 4 live sites, converted to web-sized `.webp`
   via a new `scripts/convert-work-shots.mjs` (`sharp`), and wired them
   into `content/maco.ts` as each `Project`'s `media.poster` + new
   `gallery: string[]`. Built a WebGL shader-morph carousel component,
   `MorphSlider` (React Bits port, `ogl` — a new, second WebGL runtime
   alongside `three`), to crossfade through a gallery inside `CardMedia`.
   A GSAP-only alternate, `DepthCarousel`, was built first and is kept on
   disk unused in case `MorphSlider` doesn't hold up — `summary.tsx` has
   a commented-out import marking the swap-back point.
2. **Driver's Diary got a real on-device screen recording.** Raw Android
   capture cropped/scaled/muxed via a new `scripts/convert-product-video.mjs`
   (`ffmpeg-static`) into a webm+mp4 pair, wired in as the product's new
   `screen` field, rendered inside a new `PhoneMockup` component (fixed
   device chassis, always-on muted loop, no chassis under reduced motion —
   poster stands in). Replaces the old brand-illustration placeholder
   that PRODUCTS' second card had been showing since before this pass.
3. **Small brand-logo chips**, a direct UI/UX request (two screenshots,
   two follow-up asks): added to `SummaryCard` (homepage WORK + PRODUCTS,
   40×40px, shared component so one change covered both grids) and to
   `/clients`' roster rows (56×56px). Reused `LogoReel`'s existing chip
   visual language (`--radius-chip`/`--surface-2`/border) rather than
   inventing a new one. Driver's Diary had no `brand` field before this —
   added one, reusing its existing logo asset.
4. **Two small pre-existing issues fixed along the way, not requested
   directly:** CAPABILITY's first accordion row was forcing itself open
   on load (now starts closed like FAQ); `LogoReel`'s track mask was
   clipping each card's hover-lift at the mask edge (`overflow-hidden` →
   `overflow-x-hidden` + padding), and gained a hover sibling-dim to
   match the rest of the site's hover language.
5. **Font loading rewritten** — a performance fix found while working
   in the same area, not requested: `__root.tsx` used to load all six
   typefaces (both themes' full font sets) eagerly for every visitor.
   Split by theme: Obsidian stays eager (it's the default), Cobalt now
   loads on demand via a new `lib/fonts.ts` (`ensureCobaltFonts()`),
   called from `theme.tsx` on an in-session switch and duplicated
   (hardcoded, since an inline script can't `import`) in `__root.tsx`'s
   pre-paint bootstrap for a returning Cobalt visitor.
6. **`SplitReveal` deleted** — dead code since 2026-09-01 (zero call
   sites), noticed and removed while touching `top-head.tsx` for item 5's
   `autoplayAllowed()` reuse (TOPHEAD's masked-video gate now actually
   checks pointer/viewport/save-data instead of firing unconditionally).

**Verification:** `npx eslint .` (0 errors, 3 pre-existing warnings
unrelated to this pass), `npx tsc --noEmit` (only the one pre-existing
`MaCoGlobe.tsx` error), and `npm run build` (client+SSR both succeed) all
re-run and clean after this pass. **No real-browser check performed** —
same standing constraint as recent passes (no browser automation used
without explicit permission this session); the owner should confirm card
sizing/aspect, the WebGL carousel's performance/feel, and logo-chip
placement on the live dev server before this is called done. **Next
step: commit**, once the owner has eyeballed it live.

## 2026-08-27 session — re-audit + 2 confirmed bugs fixed

A prior "STABLE, no open bugs" claim was false — verified live in a real
browser (Playwright, prod build via `bun run preview`), not just by reading
code. Two bugs found and fixed this session, both personally verified live,
both themes, 1440px and 390px:

1. **OPEN/header text collision** (originally filed as "OPEN renders
   blank/white on initial paint" — that literal symptom did NOT reproduce
   under heavy instrumentation: CDP CPU 6x throttle + network throttle +
   cache disabled + storage cleared, dev and prod builds, sampled DOM every
   50-150ms through load. What DID reproduce, live, on every single page
   load, both themes: `chrome.tsx`'s `<header>` is `fixed` (out of flow,
   real height 80px/96px at mobile/desktop), so nothing pushed
   `open-logo.tsx`'s own top-row content (site name + location) down —
   it rendered at `pt-8`/`md:pt-10` (32px/40px), landing in the same band
   as the header's own logo/nav/CTA and visually overlapping it. Fixed by
   changing that row to `pt-24`/`md:pt-28` (96px/112px, ~15px clearance
   under the header's real measured height). Likely regressed by commit
   `9f3d6b4` (header changed from sticky to fixed to overlay the hero).

2. **PRODUCTS compositing bug** — confirmed and root-caused: during the
   desktop (lg+) PRODUCTS scroll-stage crossfade between Bridge and
   Driver's Diary, the two opacity curves in `styles.css`
   (`product-expand-media`/`product-reel-media`) were asymmetric
   (`1 - reel*1.6` vs `reel`), leaving both media layers significantly
   opaque simultaneously across ~28% of the section's scroll range.
   Made visually worse because Driver's Diary has no real product
   screenshot yet — its poster (`content/maco.ts`) is a HeadGreen
   brand-mark-on-map illustration, not app UI, so the long overlap read as
   one company's logo blended into another's real screenshot rather than a
   clean handoff. Fixed by tightening both curves to a symmetric
   hold-then-cross around the existing reel=0.5 handoff point, narrowing
   the double-visible band to ~2.5% of the section's scroll range (still a
   crossfade, not an instant cut — a true zero-overlap cut was considered
   and rejected as a visible pop; flagged for the user to reconsider if
   they want literally zero overlap instead). Mobile's separate
   `ProductStack` path (stacked cards, no crossfade) was unaffected and
   confirmed clean throughout.

Also found this session: `ThemeProvider` (`theme.tsx`) defaulted React state
to `"obsidian"` always, corrected from `localStorage` only in a post-mount
effect, so a returning Cobalt visitor got one render of Obsidian-tinted
`PrismField`/glow colors before it corrected. **Fixed and verified live** in
the motion-audit pass below — moved the correction to an SSR-safe
`useLayoutEffect`.

Verified this session: `bun run build`, `bun run lint` (0 errors), and full
Playwright screenshot passes (obsidian@1440, cobalt@1440, obsidian@390,
all 11 sections + both bug locations before/after) against the **production
build** (`bun run preview`), not just dev server. Screenshots retained in
`audit/` (gitignored, local only). Console: 0 errors/warnings across every
pass checked.

## 2026-08-27, later pass — motion audit fixes

A `design-motion-principles` audit (Jakub primary/Jhey secondary/Emil
selective — the marketing-page weighting) ran against all 11 homepage
sections plus the shared motion vocabulary. Full report:
`motion-audits/maco-website-v2-2026-08-27.html`. Verdict: not a slop
codebase — craft edges, not a missing vocabulary. Six findings implemented
and verified live this pass; full detail in `PHASE-2-MOTION-PLAN.md`
(items 2a/2b/2c):

1. **Mobile nav sheet had no exit animation** (`chrome.tsx`) — scrim and
   panel now use `motion/react`'s `AnimatePresence`, mirroring the existing
   `work-reveal.tsx` carve-out for discrete UI state. Verified live at
   390px under both normal and `prefers-reduced-motion: reduce`.
2. **"Visit site ↗" invisible on keyboard focus** (`work-reveal.tsx`) —
   added `group-focus-within:opacity-100` alongside the existing
   `group-hover:opacity-100`. Verified: opacity flips 0→1 on focus.
3. **RECORD's About paragraph over-animated** (`record.tsx`) — downgraded
   from `LineReveal mode="scrub"` to `ScrubReveal hold`, the site's own
   default for body copy, matching the section's own "quiet beat" intent.
4. **ClientField's ambient float looped indefinitely** (`client-field.tsx`)
   — gated the `repeat: -1` tween to the section's own `ScrollTrigger`
   visibility (WCAG 2.2.2 pause affordance).
5. **`transition-all` on hover-lift cards** (`client-field.tsx`,
   `record.tsx`) — scoped to `transition-[transform,border-color]`.
6. **ThemeSwitch hover-rotate trimmed** (`chrome.tsx`) — 500ms → 300ms.

Verified: `bun run build`/`bun run lint` clean (one pre-existing
`react-refresh` warning in `theme.tsx`, unrelated), live Playwright pass
(390px mobile nav cycle under normal and reduced motion, 1440px
keyboard-focus check, full-page scroll-through) — 0 console errors
introduced.

Item 2d from `PHASE-2-MOTION-PLAN.md` (optional cursor-state hook system,
sticky-vs-pin evaluation for future sections) remains open, pending its own
go/no-go per rule #8 below.

## 2026-08-27, third pass — `removeChild` route-transition crash, root-caused and fixed

The `removeChild` bug flagged in the motion-audit pass above is fixed.
Root cause: `useScrollScene` (`hooks/use-scroll-scene.ts`) ran its GSAP
setup — and, critically, its `ctx.revert()` cleanup — inside a plain
`useEffect`. Four sections use `ScrollTrigger`'s `pin: true`
(`evidence-expand.tsx`, `identity.tsx` ×2, `services-convergence.tsx`,
plus `method-line.tsx`'s own bespoke pin effect), which reparents the
pinned element into a generated `.pin-spacer` div — invisible to React's
fiber tree. On route change, React's mutation phase runs first and calls
`parent.removeChild(section)` expecting `section` to still be `parent`'s
direct child; since it's actually nested inside the spacer, this threw
`NotFoundError: Failed to execute 'removeChild' on 'Node': the node to be
removed is not a child of this node`. Passive (`useEffect`) cleanups don't
run until after that mutation phase, so `ctx.revert()` — which un-nests
the spacer — always fired too late to prevent it.

Fixed by switching `useScrollScene` to an SSR-safe `useLayoutEffect`
(`useIsomorphicLayoutEffect`, same pattern as `theme.tsx`), so
`ctx.revert()` runs synchronously in React's layout phase, before any
mutation. Also migrated `method-line.tsx`'s standalone
`getScrollRuntime().then(...) / trigger.kill()` pin effect onto the shared
`useScrollScene` hook — it was the one pinned section not already using
the shared substrate, so it would have kept the same bug independently.

Verified live via Playwright, dev server: reproduced the original crash
first (full stack trace, `commitDeletionEffectsOnFiber`), confirmed the
fix eliminates it across repeated forward/back navigation cycles between
`/` and `/work/$slug` (0 console errors), and confirmed METHOD's pin still
correctly toggles `position: relative` → `fixed` → `relative` through its
scroll range via real wheel-driven scroll (not `window.scrollTo()`, which
this project's own prior testing already found gives false readings
against Lenis). `bun run build` / `bun run lint` clean.

For detailed session-by-session history of how the homepage was built (the
WebGL hero attempts, the mount-order-race bugs, the pin/transform bugs, the
GSAP+Lenis adoption story), read `git log --oneline` and the individual
commit messages/diffs — that history is preserved there and is more reliable
than a hand-maintained changelog, which drifted badly out of sync with the
code across several passes (that drift is exactly what the 2026-08-21
cleanup fixed). This file now tracks **current** state only.

## 2026-08-27, fourth pass — OPEN hero: Prism WebGL replaced with type-driven treatment

Executed `docs/REFACTOR_PLAN.md` §12's original hero ask (previously marked
superseded) after building it on a throwaway dev route first, not
committing blind. `npx skillui@1.3.4` (real npm package,
`amaancoderx/npxskillui`, MIT) ran against all four reference sites,
producing measured easing/timing data absent from the earlier
DOM-inspection-only `docs/references/*/NOTES.md` — see each file's new
"Measured values" section. Notable: 3 of 4 independent agency sites
converge on the identical `cubic-bezier(0.165, 0.84, 0.44, 1)` easing curve;
Cuberto's primary settle ease already matches MaCo's existing
`--ease-emphasis` token verbatim.

Three OPEN directions were then built on a temporary `dev.hero-preview.tsx`
route (never linked, deleted after the decision) and screenshotted at
1440px/390px, both themes:

- **A — keep Prism, add a scrub-revealed tagline.** Worked, but the tagline
  sat on the shader's brightest band and was hard to read.
- **B — oversized ghost wordmark + `<RakingSurface>`, no WebGL.** Strongest
  result in both themes and on mobile, literally what §12 asked for. Chosen.
- **C — Bridge dashboard footage as an ambient `object-cover` plate.**
  Rejected outright: the raw capture rendered full app chrome (sidebar,
  calendar, task cards) behind the wordmark — exactly the generic-AI-SaaS
  read rule #8 below warns against. Confirms why this wasn't done already;
  would need heavy treatment (blur/crop/desaturate) to be usable, not a
  quick win.

`open-logo.tsx` now uses direction B: the real wordmark and mark sit over
an `aria-hidden` oversized duplicate of the same word at ~5% opacity,
lit by `<RakingSurface>` (MaCo's existing signature light-pass device,
reused rather than inventing a new one). No tagline/statement text was
added — that copy already lives one section down in `working-surface.tsx`
(`site.statement`); repeating it in OPEN would have been the same copy
twice, one scroll apart. `prism-field.tsx` is deleted — it was OPEN's only
consumer, verified via `grep -rn PrismField frontend/src`.

Verified: `tsc --noEmit` (only the pre-existing `MaCoGlobe.tsx` error,
unrelated), `bun run lint` clean, `bun run build` clean, live Playwright
screenshots of the throwaway preview route in both themes at 1440/390
before the swap was applied to the real component.

## 2026-08-27, fifth pass — section-divider lines removed; WORK video-card scaffolding wired

**Divider lines.** Removed the `rule-t` utility (`border-top: 1px solid
var(--line)`, `styles.css:409`) from all 9 homepage sections that had it on
their `<section>` root — `working-surface.tsx`, `work-reveal.tsx`,
`client-field.tsx`, `services-convergence.tsx`, `product-showcase.tsx`,
`identity.tsx`, `method-line.tsx` (both its reduced-motion and pinned
render branches), `record.tsx`, and `close-intake.tsx` (`"light-pass
rule-t"` → `"light-pass"`). OPEN and EVIDENCE never had one. Vertical
padding was left untouched — `py-24 md:py-32` was already consistent
across every non-pinned section, so removing the line alone produces the
seamless scroll. Deliberately did NOT touch `border-t`/`border-b` inside
`method-line.tsx`'s step grid (the animated progress-spine track, and each
step's hover-interactive border segment) or `work-reveal.tsx`'s
`divide-y`/`border-t` list separators — those are functional component
chrome, not section dividers, and stay. Verified: `tsc`/`lint`/`build`
clean, full 154-shot live matrix — 0 console errors on any of the 9
touched sections. (Six cells logged a pre-existing "Clients and company"/
"Start a project" `settleScroll` capture flake in the QA harness itself,
unrelated — confirmed by viewing an unaffected cell's screenshot, which
renders correctly.)

**WORK video cards.** `Project.media?: Media` added to `content/maco.ts`,
mirroring `Product`'s existing shape. `work-reveal.tsx`'s `ProjectPlate`
now renders `ProductVideo` when a project has `media`, falling back to the
brand-mark plate otherwise — same fallback chain `Product` already uses.
No project has `media` set yet, so all 4 client plates render byte-for-byte
unchanged; this is schema + render-path scaffolding only, gated on real
footage per `docs/MEDIA-GAP.md`. Verified: `tsc`/`lint`/`build` clean, live
screenshot of WORK confirms unchanged output.

## 2026-08-27, sixth pass — GroundHandoff pacing + CLOSE reveal differentiation

Closed out the rest of the Cuberto plan's Stage 2 queue:

- **GroundHandoff**: added a fifth pair, `["Who we work with",
  "Capabilities"]` (CLIENTS -> CAPABILITY), plain recede, no `sheet`. After
  this session's `rule-t` divider removal, that boundary was the one spot
  in the WORK/CLIENTS/CAPABILITY/PRODUCTS run of four same-ground sections
  with neither a line nor a ground-color change nor a handoff cue — the
  flattest transition on the page. CLIENTS is pin-free (already established
  in `ground-handoff.tsx`'s own doc comment) and CAPABILITY only needs to
  be safe as an *incoming* target here, which it is.
- **CLOSE's line-mask reveal**: given custom `start="top 95%" end="top
  30%"` (was inheriting `LineReveal`'s default 85%/55%, identical to
  SURFACE and PRODUCTS — the same scrub reveal used verbatim a third time,
  `PHASE-2-MOTION-PLAN.md` Opportunity #3). Wider range, same mechanism —
  no new component, just a slower/later unfurl on the page's biggest
  heading so the third occurrence reads as the close, not a repeat.
- **PRODUCTS crossfade** (`AI_HANDOFF.md`'s flagged ~2.5% overlap band):
  re-checked `product-expand-media`/`product-reel-media` in `styles.css` —
  still the symmetric 0.475-0.525 hold-then-cross documented in the third
  pass above. Kept as-is; the zero-overlap alternative was already tried
  and rejected as a visible pop, so this is the better of the two, not an
  open question.
- **Easing retime**: re-confirmed against `docs/references/*/NOTES.md`'s
  measured values — no change made. MaCo's `--ease-standard`/
  `--ease-emphasis` already match Cuberto's measured curves verbatim, and
  the one genuinely new curve found (`cubic-bezier(0.19, 1, 0.22, 1)`) has
  no concrete section that needs it — adding an unused token would be
  dead CSS.
- **Cursor system** (item 2f, `AI_HANDOFF.md` rule #8 / `PHASE-2-MOTION-
  PLAN.md` item 2d-7): intentionally not touched. Two prior WebGL/cursor
  attempts were built and reverted for reading as a generic template; the
  rule requires its own explicit go/no-go before building, which hasn't
  happened.

Verified: `tsc`/`lint`/`build` clean, full 154-shot live matrix — 0 new
console errors (same pre-existing "Clients and company" `settleScroll`
harness flake as prior passes, confirmed unrelated).

## 2026-08-28, seventh pass — Cuberto-parity full structural rebuild

The owner directly overrode the standing "reference sites are technique-only,
never a target layout" rule (`AGENTS.md` §2/§33, `docs/REFACTOR_PLAN.md`
§10b/§12, `ROADMAP.md`'s "explicitly out of scope" list, every
`docs/references/*/NOTES.md`'s opening line): *"do exactly like the cuberto
wesbite... change our everything... but with the 2 themes of ours."* Asked
to disambiguate structural clone vs. deeper technique fidelity, they chose
**full structural clone**, then personally reinforced the one thing NOT up
for override, unprompted: *"but keep our 2 themes obsidian and cobalt."*

What shipped — plan "Cuberto-parity homepage rebuild," full detail in
`CONTEXT.md` §10:

- Adopted Cuberto's actual homepage section inventory, order, and
  spacing/grid rhythm (measured from `docs/references/cuberto/skillui/`):
  `TopHead` → `EvidenceExpand` (kept) → `Overview` → `FeatureAccordion` →
  `LogoReel` → `Summary`/`FeaturedWork` → `Summary`/`ProductSummary` →
  `Identity` (kept, ground flipped) → `Record` (kept, ground flipped) →
  `Faq` → `Outro`.
- Retired outright (imported only by `routes/index.tsx`, verified before
  deleting): `open-logo.tsx`, `working-surface.tsx`, `client-field.tsx`,
  `services-convergence.tsx`, `product-showcase.tsx`, `method-line.tsx`,
  `work-reveal.tsx`, `close-intake.tsx`. Their CSS-only utilities
  (`converge-card`/`-detail`, `client-tile`, `product-expand-media`/
  `-reel-media`, the now-orphaned `--c`/`--d`/`--reach`/`--scatter`/
  `--expand`/`--reel` `@property` registrations, and the pre-existing dead
  `grid-column-drift`) were pruned from `styles.css` with them.
- New shared `<Accordion>` (`components/home/accordion.tsx`) backs both
  FEATURE and FAQ — real `<button aria-expanded>` + `role="region"`,
  single-open, the `grid-template-rows 0fr->1fr` open/close transition
  taken verbatim off Cuberto's own extracted stylesheet.
- Cuberto's measured rhythm landed as literal tokens in `styles.css`
  (`cb-section`/`cb-tophead`/`cb-cards`/`cb-panel`/`cb-plus`/`cb-reel` +
  `--radius-chip/card/plate/pill`), not eyeballed approximations.
- The eleven `aria-label`s are unchanged — same labels, new order, new
  component per label — so `scripts/shoot.mjs`'s `SECTIONS` list needed
  reordering only, not renaming.
- **The floor held**: MaCo's Obsidian/Cobalt tokens, MaCo's six typefaces,
  `content/maco.ts`'s real copy throughout. `grep -ri
  "fc0019|f1f3fa|494949|Suisse|Manrope" frontend/src` returns nothing
  (one comment explicitly naming `#fc0019` as *what not to use* is the only
  hit, by design).

**`scripts/shoot.mjs`'s `settleScroll` was hardened during this pass**, not
just re-run: the previous architecture's four pinned sections gave the
harness's synthetic wheel-scroll natural places to arrest momentum; this
architecture's mostly-pin-free, much shorter sections don't, so Lenis's own
scroll-smoothing was measured coasting past a short section entirely
(confirmed live: a section settling with only 26px of its 459px height
still inside the viewport) during what used to be a flat 500ms "settle"
wait. Root-caused and fixed with a bounded retry (re-aim, don't just nudge
once) and a tightened in-range band (`top > -200`, was `top > -height`,
which had accepted "one pixel still visible" as settled). Confirmed via
direct DOM inspection (not just screenshots) that every section reporting a
settle failure renders correctly with real content and real geometry —
these are 100% harness artifacts, never a rendering bug. ~24 failures out
of 154 before the fix, 10 after; the remaining 10 are the same mechanism at
a lower rate (a short section — LOGOREEL/RECORD/FAQ — directly following a
tall one — FEATURE/PRODUCTS — occasionally still outruns the retry budget).
Don't re-chase this further without a concrete new failure mode; it's
understood and bounded.

Verified: `tsc --noEmit`, `bun run lint` (0 errors — the CSS-comment
`*/`-inside-a-glob-path bug this pass introduced and then caught, see
`styles.css`'s Cuberto-parity block header, is a cautionary example for
writing doc comments that mention `docs/references/*/NOTES.md`-style
paths), `bun run build` (client + server, 0 warnings), full 154-shot live
matrix (144/154 clean, 10 known-flake as above), spot-checked screenshots
in both themes confirming the accordion, reel, card grids, and all three
ground flips render correctly.

## 2026-08-28, eighth pass — §13 refinement pass (crop fix, hero, clients, adaptive navbar)

The seventh-pass Cuberto-parity rebuild landed entirely uncommitted; this
pass committed it as a baseline (`d6e567f`) and then executed
`docs/REFACTOR_PLAN.md` §13's five refinement items (1, 5, 2, 3, 4 in that
order — 6 stays deferred, see `ROADMAP.md`). Each item verified live in a
real browser against a production build (`bun run preview`), not just
`tsc`/`eslint`/`build`, before being committed.

1. **EVIDENCE frame crop, root-caused and fixed** — the clip-path aperture
   in `evidence-expand.tsx` was correctly 16:9-locked, but the media box
   underneath it (`mediaRef`, full `inset-0`) was the whole viewport;
   `objectFit="cover"` into a non-16:9 box cropped the video's long axis at
   almost every aspect ratio, and an extra `scale(1.1->1)` cropped further
   at progress 0. Now a real sized box (`width`/`height` written in
   `onUpdate`, `mediaRef` and the scale gone); `wMax` dropped 1280->1024
   (the Bridge recording's actual source resolution) so it never upscales
   past what's sharp. `summary.tsx`'s portrait card had the same defect,
   switched to `objectFit="contain"`.
2. **Dead-code sweep** — the "dead prefooter" was `Footer` duplicating
   `Outro`'s closing CTA (no literal prefooter component ever existed);
   stripped. Removed unused `@property --lay`/`--p`, the `.maco-aurora`/
   `.maco-thread` block (`ThemeAtmosphere` is gone), `--radius-plate`.
   Fixed stale comments naming deleted components (Prism WebGL, OPEN,
   method-line) and a backwards z-index comment on EVIDENCE.
3. **Hero treatment** — `TopHead` gets a `site.category` eyebrow, a static
   `display-glow` gradient-fill on the `<h1>` (`.maco-shine`'s
   background-clip:text device, vertical not diagonal — a diagonal band
   crossed a 3-line headline at a different horizontal offset per line,
   read as a legibility bug, not a glow), a `hero-backlight` radial glow, a
   CSS-only `hero-grain` film-grain texture, and a one-shot `hero-reveal`
   scale-in. Live preview surfaced a real interaction: the section's
   pre-existing `light-pass` sweep (shipped before this pass) washed out
   words in both the new glow headline and the plain lead paragraph via its
   `overlay` blend, worst on Cobalt's near-white paper ground — dampened
   with a scoped `[aria-label="Introduction"] .light-pass::after` opacity
   rule, same pattern `styles.css` already uses for `[data-media]` content.
4. **Clients consolidated to one section** — `LogoReel` survives, carrying
   each client's `industry` under the mark (the one thing `Record`'s old
   logo wall showed that the reel didn't); `Record`'s client wall is gone,
   About-only now. `Record`'s `aria-label` moved "Clients and company" ->
   "About MaCo", updated in the three other places that string is a
   selector: `ground-handoff.tsx`'s `PAIRS`, `shoot.mjs`'s `SECTIONS`,
   `CONTEXT.md` §10.
5. **Adaptive navbar** — `Header`/`MobilePillNav` are both `fixed`, mounted
   in `__root.tsx` outside every section, so they never resolved anything
   but paper's tokens. Now carry `data-over`, kept in sync with whichever
   `[data-ground]` section is behind them
   (`.chrome-adaptive[data-over]` in `styles.css`). Took three attempts to
   get the JS right, each one caught live: a ScrollTrigger per section read
   stale past a section that ALSO hosts its own pinning ScrollTrigger
   (EvidenceExpand, Identity); a single whole-document ScrollTrigger
   (`start 0, end "max"`) fixed that but went stale past Identity
   specifically at 390px; `rt.gsap.ticker` (re-derive from live
   `getBoundingClientRect()` every frame, no ScrollTrigger trigger/pin
   geometry at all) is what actually holds up — verified 44/44 (11
   sections x 2 themes x 2 widths).

Verified this pass: `bun run build`/`bun run lint` clean after every item
(only the pre-existing `MaCoGlobe.tsx` tsc error, unchanged); live
production-build checks per item as described above; `/work`, `/about`,
`/contact` confirmed to default the header to paper with no new console
errors (the one React #419 error on `/about` is `MaCoGlobe`-related and
pre-existing — confirmed present on the pre-eighth-pass build too).

## 2026-08-29, ninth pass — dark-first ground, Capabilities dark panel, masked hero, cursor

A new, separate owner request (not §13) in five parts. Each item verified
live in a real browser against a production build before being kept; two
items each needed a second and third live-verified fix after the first
attempt turned out wrong.

1. **The white gap between Outro and Footer.** Root cause: `Footer`'s
   `mt-32` sat *outside* both Outro's and Footer's own dark backgrounds —
   margin between two elements always exposes whatever's behind them,
   which was `body`'s un-grounded default (paper). Moved the same
   separation inside `Footer` as padding instead. Also added a standing
   backdrop safety net: the header's existing ground-tracking ticker now
   also writes `data-ground-now` on `<html>`, and `body`'s own
   `background-color` follows it — covers `GroundHandoff`'s recede (a
   scaled-down section exposes slivers of `body` at its edges) and any
   future spacing mistake of the same shape.
2. **Dark-first three-act ground sequence.** Flipped from
   `paper,deep,paper×3,deep,paper×2,deep×3` to
   `deep,deep,paper×6,deep×3` — the page now opens and closes on the
   material, paper only in the Overview→Identity middle. Only two
   `data-ground` values actually moved (TopHead, `FeaturedWork`); every
   other section was already on its target ground. `ground-handoff.tsx`
   got a `"sheet-only"` pair mode for a ground flip whose outgoing side
   pins (both of the sequence's two remaining flips land there). The
   hero utilities from the previous day's pass were retuned to read off
   `--focus` instead of `--accent` — on `deep` ground `--accent` resolves
   to `--accent-inverted`, which is near-white for BOTH themes, so
   Cobalt's "stronger, chromatic" half of the split had nothing left to
   be chromatic about.
3. **Capabilities accordion, dark contrast panel.** `Accordion` gets an
   opt-in `panel="inverted"` mode (FEATURE only — FAQ stays default,
   already on `deep` ground). The open panel wraps its content in
   `.section-inverted` directly (a sibling overlay doesn't work — the
   token remap is CSS custom properties, which only cascade to
   descendants) plus `light-pass` and one restrained `--focus`-derived
   radial accent. Hover-to-open added, gated to
   `(hover: hover) and (pointer: fine)` — click stays the real,
   touch-safe control everywhere.
4. **Masked video-in-text hero, cycling taglines.** New
   `components/motion/masked-heading.tsx` — reimplemented on this
   project's stack (GSAP through `useScrollScene`, real tokens), not
   copied, per `AGENTS.md`'s React Bits rule. SSR/first-paint/reduced
   motion always render the plain `display-glow` `<h1>`; the masked
   version only mounts client-side after layout-measuring can run
   correctly. Two real problems surfaced and were fixed at the source:
   Bridge's own dashboard footage contains a literal amber status badge
   (a direct palette violation no contrast/saturation tuning could
   safely avoid — fixed with `grayscale(1)` on the video, permanently),
   and even after that, `TopHead`'s `light-pass` sweep still re-tinted
   the now-grayscale letters amber-adjacent via its own
   `mix-blend-mode: overlay` (confirmed live by A/B toggling the beam;
   neither z-index nor isolation on the heading stopped it, since the
   blend composites against `RakingSurface`'s own already-isolated
   stacking context). Owner's call: drop `RakingSurface` from `TopHead`
   entirely rather than keep fighting the interaction.
5. **Restrained custom cursor + one text device.** New
   `components/motion/cursor.tsx` (mounted in `__root.tsx`): one ring,
   `gsap.quickSetter` + a ticker-driven lerp for position,
   `mix-blend-mode: difference` for ground/theme-agnostic contrast,
   fine-pointer-only, fully absent under reduced motion, event-delegated
   hover detection (survives client-side route changes without stale
   listeners — verified live). `LineReveal` gained a third
   `mode="words"` (GSAP SplitText on words, blur-in + short rise),
   applied once to Overview's opening statement. React Bits adopt/reject
   log for this pass is in `CONTEXT.md`, not scattered across docs.

**Found, confirmed pre-existing, not fixed this pass:** a chromatic-fringe
artifact on Overview's "About MaCo" CTA link, but only in Playwright's
viewport/clip screenshots — an isolated element screenshot of the same
link is clean, computed styles are provably correct, and the same artifact
reproduces on the pre-session baseline commit (`3577091`, checked via a
throwaway `git worktree`) with none of this pass's changes present. Left
open as a separate investigation; may be a Playwright/headless-Chromium
rendering quirk rather than something a real visitor would ever see.

Verified this pass: `bun run build`/`bun run lint`/`bunx tsc --noEmit`
clean after every item (only the pre-existing `MaCoGlobe.tsx` error,
unchanged); live checks against a production build (`bun run preview`),
both themes, 1440/390, per item as described above.

## 2026-08-29, tenth pass — reel geometry, scroll tuning, footer identity, preloader, layout modes

Six owner-requested items, three of which (footer name treatment,
preloader, layout modes) discharge the reference-study pass
`ROADMAP.md`/§13 item 6 deferred (Iventions, Minh Pham, By-Kin). Two
items were briefed from a premise exploration corrected before planning:
item 1 ("HeadGreen duplicated in Clients") turned out to be a marquee
geometry bug, not a data duplicate — `clients` in `content/maco.ts` has
exactly four entries; item 3 ("footer's small multilingual line") turned
out to already have a bigger home in `Identity`'s pinned 13-script dial,
with the footer running its own unsynced 7-item copy. One item (footer
wordmark) was rebuilt mid-pass after the owner pointed at
iventions.com's actual scale — the first attempt applied the right
technique to the wrong-sized element. Every item live-verified in a real
browser against a production build (`bun run preview`) before being
committed; one commit per item (footer wordmark: two commits, the
rescale supersedes the first).

1. **Clients logo reel — capped the band, not the data.** The two-copy
   `-50%` marquee loop only reads as seamless while the visible window
   is narrower than one copy (4 cards x 312px = 1248px); the mask
   container had no `max-width`, so above ~1248px wide the window spans
   the seam and HeadGreen appears at both ends. `.cb-reel-mask` now caps
   at `76rem`. `logo-reel.tsx`'s own doc comment carries the invariant
   forward so the next card-width change doesn't silently re-break it.
2. **Lenis scroll feel tuned.** `lerp: 0.07` measured out to a ~0.71s
   settle per wheel notch (Lenis normalises lerp for frame rate:
   `damp = 1 - exp(-lambda*dt)`), and `wheelMultiplier: 0.9` compounded
   it by shaving 10% off every notch's travel — read as lag, not
   smoothness. `lerp: 0.09` (~0.55s settle) keeps the heavier-than-stock
   character without the drag; multiplier back to `1`.
3. **IDENTITY's script list curated to MaCo's actual footprint,
   footer synced to the same array.** 13 scripts trimmed to 10 (dropped
   Gujarati/Punjabi/Bengali/Odia/Persian, added Japanese/Korean — both
   already in `--font-script-fallback`, no new font request). Moved to
   `content/maco.ts` as `nameScripts`, the single source both `Identity`
   and the footer strip now read — they can no longer disagree the way
   the footer's old hand-written Cyrillic-including 7-item copy did.
4. **First-paint preloader** — a percentage ring around MaCo's mark,
   `data-ground="deep"` (the page opens dark), progress on `--focus`
   rather than `--accent` (near-white on deep ground in both themes,
   the same lesson the ninth pass's `display-glow` retune already
   established). Renders in the SSR HTML; the pre-paint script now also
   stamps `data-preload="skip"` before hydration (reduced motion, or
   already shown this session) so CSS alone hides it with no flash
   either way. One real bug caught live: the proxy tween's base illusion
   reached `v:100` on its own 1.6s schedule regardless of real asset
   readiness, so on a slow connection (reproduced by intentionally
   delaying the poster response) the ring froze at a false "100%" for a
   visible extra second-plus before the real snap. Fixed by capping the
   illusion at 92 so a real gap always remains for the ready-signal
   snap to close.
5. **Footer wordmark — cursor-following gradient trace, at the right
   scale.** First attempt put the trace on the existing 44px header-sized
   lockup; live preview showed the effect was barely visible even after
   tuning the gradient radius down from 9rem to 2.6rem, since the whole
   element was smaller than a sensible spotlight. Owner pointed at
   iventions.com's actual footer treatment — a wordmark filling most of
   the section's width. Rebuilt: the small lockup reverted to plain, a
   new `clamp(4.5rem, 15vw, 12rem)` full-width "MaCo" added near the
   footer's bottom, radius now `22vw` (proportional to the element, not
   a fixed value tuned for one size). MaCo is short enough to fill the
   width without literally cropping off-screen the way Iventions' longer
   name does — technique borrowed, literal composition not copied, per
   the standing reference-site rule.
6. **Layout-mode switcher — three modes, by-kin.com's own LAYOUT
   toggle.** Mode 1 unchanged. Mode 2 (Iventions): hamburger + diagonal
   `clip-path` polygon wipe (Motion's own complex-value interpolation,
   not GSAP) reveals a full-screen link list in `var(--accent)`. Mode 3
   (Minh Pham / by-kin.com): centred TOPHEAD copy, nav collapsed to a
   corner — scoped to `[aria-label="Introduction"]` only, hero-treatment
   stays homepage-only while the chrome swap is site-wide. Extracted
   `MobilePillNav`'s focus-trap/scroll-lock/route-close logic into
   `hooks/use-overlay-menu.ts` so the new full-screen menu didn't need a
   second copy. Two bugs caught live before this was called done: the
   overlay panel, first nested inside `<header>`, inherited the header's
   own `.chrome-adaptive[data-over]` ground-remap and rendered each
   theme's accent *inverted* (near-white panel instead of near-black/
   blue) — fixed by rendering the panel as a `<header>` sibling, never a
   descendant; and a single hamburger button couldn't relocate between
   mode 2's (grouped with Wordmark) and mode 3's (grouped with
   ThemeSwitch) positions via CSS `order` alone, since the two live in
   different flex containers — fixed with two trigger instances sharing
   one `useLayoutNavState()` object, `triggerRef` written imperatively
   on click so Escape still returns focus correctly. Modes 2/3 also hide
   the old mobile-only `MobilePillNav`, which would otherwise sit
   alongside the new top hamburger as a second way to open navigation.

**Found, confirmed pre-existing, not fixed this pass:** a
"window is not defined" SSR error on `/about`, causing that route to
fall back to client-only rendering — confirmed present on the baseline
commit before any of this pass's changes too (checked via `git stash`
against a clean checkout), so not introduced here. Most likely
`MaCoGlobe.tsx`/`react-globe.gl` (the same file already has a known,
separate `tsc` type error — see "Next exact actions" below). Worth its
own investigation; out of scope for this pass.

Verified this pass: `bun run build`/`bun run lint`/`bunx tsc --noEmit`
clean after every item (only the pre-existing `MaCoGlobe.tsx` error,
unchanged); live checks against a production build (`bun run preview`)
across both themes and 1440/1024/768/390 widths per item, plus the
layout switcher clicked through end-to-end (persistence across reload,
keyboard activation, no mobile overflow) and five other routes
smoke-tested for regressions from the header/footer changes, which
mount globally.

## 2026-08-30, eleventh pass — /about SSR fix, cursor system, layout modes 2/3, premium audit

Six items, owner-requested against a written plan (this pass carried forward
non-negotiables from the tenth pass: MaCo's own fonts/colors only, reference
sites as technique sources only per AGENTS.md §14/§19). Each item verified
live in a real browser against a production build (`bun run preview`), not
just `tsc`/`eslint`/`build`, before being committed. Two premise corrections
made before building: the owner's brief assumed layout mode 2's diagonal
wipe was missing entirely — it already worked, confirmed live before adding
anything to it; and assumed the `/about` SSR bug was in `MaCoGlobe.tsx`
itself — it's a module-scope `window.THREE` read three layers down the
`react-globe.gl` → `globe.gl` → `three-globe` import chain, which
`React.lazy` cannot prevent from running during streaming SSR (React error
#419).

1. **`/about` SSR fix** (ROADMAP item 8, closed this pass). Root cause: not
   `MaCoGlobe.tsx` — `three-globe`'s own modules read `window.THREE` at
   module scope, reached through a fully static import chain. `React.lazy`
   still runs its factory's dynamic `import()` server-side to resolve a
   Suspense boundary, so the `window` read throws regardless of the lazy
   wrapper. Fixed with a `mounted` gate on `globe-section.tsx`'s `<Suspense>`
   (same pattern `top-head.tsx`'s masked-heading swap already established),
   so the dynamic import never runs on the server at all. Confirmed via the
   server HTML (shell fallback present, zero "window is not defined", zero
   #419 markers) and live hydration in both themes.
2. **`?v2=` preview flag.** Added to `__root.tsx`'s existing pre-paint
   script, same non-persisting-URL-override shape as `?layout=`/`?motion=`.
   Everything below that changes shipped interaction ships behind it —
   **as of this entry, none of items 3-5 below have been flipped to
   default.** No flag reproduces today's site exactly; see each item's own
   flag name to preview it.
3. **Cursor system — semantic per-state hooks, theme/ground-aware paint,
   footer torch** (`?v2=cursor,torch`). Replaced the old binary
   `is-active` class with a resolved `data-state` (link/action/media/torch),
   the semantic-class-hook shape `docs/references/minhpham/NOTES.md`
   recommended generalizing WORK's cursor-follow into (ROADMAP item 6).
   Ground-awareness reuses the existing `[data-ground]` token remap — the
   cursor copies whatever ground the hovered element sits under onto
   itself, so `var(--text)` resolves correctly at the cursor's own
   position. Footer now carries `data-ground="deep"` (previously relied
   only on the legacy `.section-inverted` class, which the adaptive header
   sampler couldn't see — a second bug fixed for free). Torch:
   `data-cursor="torch"` on the footer wordmark turns the cursor into the
   light source over that zone — a radial gradient from `--sweep-light`
   in a `screen` blend, OS pointer hidden only inside the zone. Wordmark
   centers and grows, weight split per theme since Michroma has no weight
   axis (800 on Obsidian's variable-weight Unbounded, 400 + tighter
   tracking on Cobalt). Two real bugs caught live: button-styled links
   (`.btn-solid`/`.btn-line`, which TanStack Router renders as `<a>`) were
   resolving to the tiny "link" dot instead of "action" — fixed by
   checking those classes, not just tag name; and the ring used to
   collapse/re-grow moving between a button's child spans — fixed by
   checking `relatedTarget` before clearing state. **This is the rule #8
   go/no-go entry point** for the custom cursor shipped ninth pass — this
   pass generalizes it, doesn't replace the caution.
4. **Layout mode 2 — leading beam + staggered links** (`?v2=nav2`). The
   diagonal clip-path wipe already worked (confirmed live before touching
   anything). Added a skewed `--sweep-light` gradient band leading the
   reveal and Motion-variant staggered link entrance. Real bug caught
   live: a raw CSS `transform: "skewX(-18deg)"` string in the `style` prop
   was silently dropped — Motion owns the `transform` property once it's
   animating `x` and doesn't compose with a hand-written transform string
   in the same object. Fixed via Motion's own `skewX` style value.
5. **Layout mode 3 — rebuilt as split edge rails** (`?v2=nav3`). Mode 3 was
   built as the same hamburger-overlay pattern as mode 2 — the opposite of
   its actual reference. Rebuilt so nav splits to both screen edges with
   the hero centred between, via two new stable classNames
   (`header-brand-group`/`header-control-cluster`) rather than
   `:first-child`/`:last-child`. Desktop (`lg+`) only; below `lg` this
   flagged mode falls back to mode 1's own chrome (wordmark + the existing
   bottom pill nav) rather than the hamburger, since rails don't fit a
   390px phone. Two real bugs caught live: restoring the header's own CTA
   at the control cluster's bottom edge duplicated the hero's own CTA
   (TopHead's nav rail already lists Contact as a link too) — cut the
   duplicate; and rail-to-hero clearance needed different padding at 1024
   vs 1440 (measured via `getBoundingClientRect`, not guessed — 9rem read
   as visibly tight at 1024, bumped to 10.5rem there, 13rem at 1440).
6. **Premium/interactivity audit** (items 6 + 7b, proposal only — nothing
   from this item is implemented). Fifteen units checked directly against
   source: the homepage's 11 sections plus `/about`, `/work/$slug`,
   `/products/$slug`, `/contact`. Written up in `docs/PREMIUM-AUDIT.md`
   plus a published, filterable artifact. Headline findings: all four
   non-homepage routes are on the deprecated `MotionSection` instead of
   the homepage's actual motion vocabulary (`ScrubReveal`/`Stagger`) and
   carry no `data-ground`/`aria-label`, so the adaptive chrome can't see
   them; `/products/$slug` has a hardcoded `scrollProgress={0.45}`
   freezing what should be a scroll-reactive field (a correctness bug, not
   a taste one); `/work/$slug` has no imagery anywhere despite every
   project already having real media in `content/maco.ts`. Four homepage
   sections (IDENTITY, RECORD, OUTRO, and — narrowly — PREVIEW) are marked
   "leave alone" deliberately, and one idea (an OVERVIEW figure count-up
   tween) was considered and rejected as a generic-SaaS trope.

**Found, confirmed pre-existing, not fixed this pass:** layout mode 2's
trigger button can't be clicked to close once the panel is open — the
full-screen panel's `z-[46]` sits above the header's `position:fixed`
`z-[42]` stacking context, which no descendant z-index can escape.
Confirmed pre-existing via `git stash` against a clean baseline (same
z-index values on both sides of the stash). Escape and link-navigation both
close it correctly — not broken, only incomplete. Logged in
`docs/PREMIUM-AUDIT.md`'s cross-cutting findings rather than fixed here: the
real fix means moving where the trigger renders, bigger than this pass's
nav-chrome scope.

**Still open, deliberately:** items 3-5 above ship behind `?v2=` flags only
— `cursor,torch`, `nav2`, `nav3`. None have been flipped to default yet.
Next session (or this one, later): review live, then flip approved items to
default and delete the flag scaffolding for those, per the plan's own
sequencing.

Verified this pass: `bun run build`/`bun run lint`/`bunx tsc --noEmit`
clean after every item (only the pre-existing `MaCoGlobe.tsx` `react-globe.gl`
ref-type error, unchanged, confirmed identical on the clean baseline via
`git stash`); live checks against a production build across both themes at
1440/1024/390 per item; the no-flag path re-verified after each `?v2=`
addition to confirm zero behavior change (0 console diffs); reduced-motion
and coarse-pointer branches confirmed to render no cursor element at all,
not just a hidden one.

## 2026-09-01, chrome/motion/reveal pass — 8 owner-brief items + 2 pre-existing bugs found live

Eight numbered items from an owner brief dated 2026-08-31, executed
2026-09-01 against a written plan. Three of the brief's own premises
turned out stale against the actual code (recorded in the plan before
building, not discovered mid-work): EdgeNav running in Layout 2 was a
documented decision from the motion/nav pass, not a bug; `?v2=` no longer
exists anywhere in the repo; and `GroundHandoff` already covered every
section-to-section boundary (10 pairs, not the 8 `CONTEXT.md` claimed —
that drift is now corrected). Each item verified live against a
production build (`bun run preview`), both themes, all three layout
modes, via a Playwright script driven directly rather than through the
`agent-browser` MCP tool, which hung on launch for 30 minutes this
session and was abandoned — worth checking whether that tool is healthy
before relying on it again.

1. **Layout 1** — verified unregressed after every other item.
2. **Layout 2 rebuilt to iventions.com's actual silhouette.** The
   diagonal wipe already existed (motion/nav pass) but covered nearly the
   full bottom edge, closer to a full-bleed rectangle than the
   reference's hard diagonal leaving a real uncovered triangle —
   re-geometried (`LAYOUT_NAV_CLOSED`/`OPEN` in `chrome.tsx`, still
   4-point for `clip-path` interpolation parity). The header row
   (CLOSE / wordmark / CTA) now stays visible above the wipe throughout,
   not just the trigger — added `.layout-nav-overlay-brand`/`-cta` to the
   existing `[data-nav-trigger-overlay]` (already the correctly-stacked
   root-level sibling at `z-[47]`, above the panel's `z-[46]`), CSS-gated
   to mode 2 only. Panel links gained a hover-dim treatment (hovering any
   link drops every other to 0.45 opacity, bolds the hovered one) — this
   required moving each link's active/inactive opacity from an inline
   `style` to a `data-active` attribute first, since an inline style
   always outranks any CSS rule regardless of selector specificity.
3. **Layout 3 stripped to dots-only.** Removed the wordmark
   (`.header-brand-group`) and the MENU trigger from mode 3's header — both
   were leftover from EdgeNav's earlier "wayfinding only, not a way to
   reach a page" design; the dots are real `<Link>`s covering all six
   routes now, so the second nav path was redundant. Fixed the dot
   z-order (`z-40` → `z-[43]`) — PREVIEW and IDENTITY are both
   `relative z-[41]` with opaque grounds and were painting over the dots,
   a bug nobody had reasoned about since EdgeNav postdates both those
   `z-[41]` comments. Fixed dot color sampling to read the section at
   viewport CENTER, not the header's `y=48` — the dots are vertically
   centered, so the old shared sample point was reading whatever section
   happened to be at the TOP of the viewport, not behind the dots.
4. **Reload vs. client-navigation color bug — root-caused for real, not
   patched.** The reported symptom ("correct after reload, wrong after
   client-nav") turned out to be two independent, unrelated bugs, both
   pre-existing (not introduced by this pass), both in `Header`
   (`chrome.tsx`), which mounts once in `__root.tsx` and never remounts
   across routes:
   - **The ground-color ticker.** `applyGround`'s `[data-ground]` element
     list was captured ONCE per effect run and cached — fine as long as
     the effect only ran once, but adding a `pathname` dependency (the
     first fix attempted) exposed a worse problem: `pathname` updates as
     soon as TanStack Router commits navigation, which can land BEFORE the
     target route's own code-split chunk has rendered its sections into
     the DOM, so even a dep-triggered re-run captured the OUTGOING route's
     stale section list. Real fix: stop caching `grounds` at all — query
     it fresh inside `applyGround` itself, called every frame via
     `rt.gsap.ticker`. This extends the same "never more than one frame
     stale, self-corrects with no further input" property the ticker
     already gave scroll position to the element list too, and needs no
     `pathname` dependency at all once nothing is cached across frames.
     The same fix applied to `cursor.tsx`'s own ground-tracking, which had
     an identical cached-snapshot bug.
   - **A second bug this surfaced**: the cursor element itself carries
     `data-ground` (for its own CSS remap) and is `position: fixed`, so a
     bare `document.querySelectorAll("[data-ground]")` — used by BOTH the
     header's ticker and the cursor's own tracking — could match the
     cursor's current on-screen position as a candidate "section." Caught
     live: the cursor happening to sit near the header's `y=48` sample
     point fed the header's ground-sync the cursor's OWN current ground,
     unrelated to whatever section was actually behind the header. Fixed
     by scoping every such query to `section[data-ground], footer
     [data-ground]` (`lib/ground.ts`'s new `SECTION_SELECTOR`) instead of
     the bare attribute selector.
   - **The `--header-solid` transparency scrub** (a separate GSAP
     ScrollTrigger, unrelated to the ticker above) got stuck permanently
     at 0 after a client-nav to `/` — confirmed via a hard-reload control
     that the SAME scroll mechanics correctly scrub 0→1, ruling out Lenis/
     ScrollTrigger wiring as the cause. Root cause, found by dumping
     `ScrollTrigger.getAll()`'s live geometry: `[aria-label="Introduction"]`
     collides with EVERY other route's own intro section (`/about`,
     `/clients`, `/contact`, `/products`, `/products/$slug`, `/services`,
     `/services/$slug`, `/work` all have one, all `data-ground="paper"`).
     Frame-by-frame DOM probing confirmed the outgoing route's own
     "Introduction" section is still present at frame 0 of a client-nav,
     replaced by TOPHEAD around frame 13 — a real, brief window where the
     wrong element matches. The query's first (synchronous) check grabbed
     the OUTGOING route's section, which was then detached moments later,
     leaving GSAP measuring a disconnected node forever (a permanently
     near-zero scroll range, `start ≈ end`). Fixed by also matching
     `[data-ground="deep"]` — TOPHEAD is the only "Introduction" section
     that's deep-grounded, which disambiguates it using data the two
     sections already disagree on. Kept the bounded-retry scaffolding
     (`requestAnimationFrame`, ~90 frames / 1.5s, then gives up) from the
     first attempt at this fix — still correct and needed for routes
     whose lazy chunk hasn't rendered yet, just not sufficient alone.
5. **Preloader.** Retimed: main tween now `0→92` over `2.6s` linear (was
   `1.6s power1.inOut`) — a constant rate is what makes the counter
   visibly pass through nearly every integer instead of skipping, and the
   close is gated on `Promise.all([realReadiness, 2.6s-minimum])` so a
   fast connection still gets the full deliberate beat rather than
   snapping the moment assets resolve. The `92` ceiling and its reasoning
   (never let the ring show a false 100% before real assets are ready)
   are unchanged. Enlarged: ring `128px→200px` (`RADIUS` 54→86), mark
   `32px→64px`. TOPHEAD's brand row changed to mark-only (`size={72}`,
   `site.name` moved to `sr-only`) per the owner's own call when asked —
   there is exactly one `site.name` text render on the whole homepage,
   and it sat ~120px under the header's own spelled-out wordmark;
   dropping the `SplitReveal` word there was the entire fix, not a
   broader "reduce repetition" sweep, since no other repetition existed.
   `maco-mark-hero.png` deleted — zero code references, dead since the
   2026-08-28 Cuberto-parity rebuild replaced the old OPEN hero that used
   it; only a stale doc comment in `mark.tsx` still mentioned it.
6. **GroundHandoff — two recede weights instead of one.** Per the
   owner's own choice between three options when asked (differentiate
   the existing recede vs. just close the one real gap vs. rebuild the
   whole language): added an `"emphasis"` weight for the 5 boundaries
   into/out of a set-piece or act break, kept the existing values as the
   new `"interior"` default for the other 4 (the flat card-grid run:
   Capabilities → Clients → Selected work → Products), and closed the one
   boundary that had no handoff at all (Outro → the footer, which needed
   its own `aria-label="Site footer"` since it isn't a `<section>`). The
   2 `sheet-only` ground-flip pairs are unchanged. `CONTEXT.md`'s
   "8 pairs / 3 sheet" description was already wrong before this pass
   (the code had 10 pairs, 2 sheet-only) — corrected while the file was
   open.
7. **FEATURE — scroll-driven sequential reveal, full motion only.** New
   `components/home/feature-scroll.tsx`, a fork of `Accordion`'s
   `panel="inverted"` treatment (not a mode added to it — the two share
   no state model: `Accordion` is single-open/click-toggle by design for
   FAQ's sake, `FeatureScroll` needs every row up to the scroll position
   open at once with no click at all). One `ScrollTrigger`, scrubbed,
   writing `data-open` on plain refs in `onUpdate` per
   `evidence-expand.tsx`'s own discipline — `active = floor(progress * N)`
   opens every row at or before it, so rows pile up scrolling down and
   symmetrically re-collapse scrolling back up (a reversible scrub, not a
   literal "never recollapses," which the plan reasoned through and the
   owner didn't push back on when it was presented as the approach).
   `FeatureAccordion` branches on `useReducedMotion()`: full motion gets
   `FeatureScroll`, reduced motion keeps the exact existing click
   `<Accordion>` call unchanged. Logged in `CONTEXT.md` §4's adopt/reject
   log per `AGENTS.md` §29.
8. **Cursor — continuous ground-tracking.** `onOut` used to delete the
   cursor's `data-ground` attribute entirely, so the ring painted
   `:root`'s own (paper) `--text` the instant nothing was hovered — wrong
   over a deep section with no hoverable directly under the pointer.
   Fixed by tracking `hoveredGround` separately (set by `onOver`/`onOut`,
   precedence over everything else since it's more precise) and falling
   back every tick to `groundAt(grounds, py)` — the cursor's own
   lerped y-position — via the same shared resolver EdgeNav's dots now
   use, so the two can never independently disagree. Did NOT switch
   `action`/`media` states to `--accent`-derived color — the plan called
   this a live A/B taste call requiring visual comparison in both themes,
   and the current `--text`-based treatment is the already-shipped,
   already-verified one; left as a next-session decision rather than
   guessed at blind.

**Not implemented, deliberately:** none — all 8 items shipped. Two
findings from live verification were fixed as part of this pass (item 4's
writeup above) rather than deferred, since they were direct, confirmed
regressions in the exact area being touched, not a new investigation
opened mid-pass.

**A third regression, caught by the owner from a screenshot after this
pass's own live-verification checklist had already passed:** item 4b's
overlay backdrop (`[data-nav-trigger-overlay]`, mode 2) is a full-width
opaque strip at `z-[47]`, which visually covered the real header's
`.header-control-cluster` underneath at `z-[42]` — LayoutSwitch and
ThemeSwitch weren't gone, just invisible behind it (and, since the
overlay wrapper is `pointer-events-none` with only specific children
opting back in, may still have been technically clickable through the
paint, just with no visible affordance). Caught because the automated
checklist asserted the elements item 2/4b specifically introduced
(CLOSE/wordmark/CTA visibility, hover dim, z-index ordering) but never
cross-checked that PRE-EXISTING, unrelated chrome the pass didn't
directly touch had survived being visually painted over by something
that WAS touched — a real gap in that verification, not just bad luck.
Fixed by giving mode 2 one working copy of `LayoutSwitch`/`ThemeSwitch`
inside the overlay row itself (`.layout-nav-overlay-controls`, right of
the wordmark, left of the CTA) and hiding the header's own now-covered
copy (`.header-controls-primary`, a new wrapper around both) specifically
in that mode — modes 1 and 3, which have no such backdrop, keep the
single original copy. Re-verified live via the same screenshot-diff
method that caught it.

Verified this pass: `bun run build`/`bun run lint`/`bunx tsc --noEmit`
clean after every item (only the pre-existing `MaCoGlobe.tsx` error,
unchanged); live Playwright checks against a production build across both
themes, all three layout modes, and reduced motion, described per-item
above; zero console/page errors across every check.

## 2026-09-02, layout 2/3 follow-up — owner review against 3 screen recordings

Owner reviewed the 2026-09-01 pass live and sent 3 screen recordings (own
capture, not skillui) of cuberto.com's capability section and
iventions.com's desktop + mobile menu. Six fixes, all live-verified against
a production build:

1. **FEATURE reveal paced too fast.** `feature-scroll.tsx`'s ScrollTrigger
   used `end: "bottom 60%"`, tying reveal speed to the section's own
   (growing) height — a feedback loop that let several rows snap open per
   scroll notch. Changed to a fixed `end: "+=${n*520}px"` runway, same
   technique `evidence-expand.tsx`/`identity.tsx` already use, decoupling
   pace from height. Verified: ~350-400px of scroll per row now, was
   several rows per 150px.
2. **Layout 2 desktop wipe re-geometried** closer to iventions' own
   silhouette (steeper, less coverage) per the recordings.
3. **Layout 2's persistent header row lost its shared backdrop bar.** The
   real `<header>` is now `display:none` in this mode (nothing rendered
   inside it any more anyway); MENU/wordmark each get their own small
   glass chip instead, closed-state only (`:not([data-nav-open])` — open,
   the panel itself already provides contrast, and the chip was visually
   colliding with the wipe's own corner there).
4. **Panel recolored white** (`data-ground="paper"`, was each theme's own
   `--accent`) and the light beam removed — both per the recordings.
   92%→97% opacity: measured live, 92% of a mathematically-correct
   near-white read as grey against a blurred near-black Obsidian backdrop.
5. **Mobile layout 2 was broken outright** — MENU/wordmark/LayoutSwitch/
   ThemeSwitch/CTA collided into one overlapping cluster on a 390px
   screen. Fixed: CTA drops off this row on mobile (panel's own in-list
   CTA still reaches it), LayoutSwitch/ThemeSwitch move to a fixed
   bottom-left cluster (mode 3's existing pattern), and — per the
   recordings — trigger/wordmark swap sides below `md` (trigger right,
   wordmark left, opposite of desktop). Two real bugs surfaced fixing
   this: the mobile wedge's uncovered triangle geometrically collided with
   the now-left-aligned nav links (not an opacity bleed-through problem,
   as first assumed — the affected links had literally no panel behind
   them); and Tailwind v4's `-translate-x-1/2` compiles to the separate
   CSS `translate` property, not `transform` — resetting only `transform`
   left the wordmark rendered exactly 50%-of-its-own-width off-screen.
6. **Layout 3 mobile: TOPHEAD's own CTA overlapped the fixed bottom-left
   cluster** on first paint — the centred hero stack is tall enough on its
   own (no forced `min-height`) to overflow an 844px viewport before any
   padding is added. `padding-bottom` alone didn't fix it (only adds
   space after the CTA, doesn't move it) — needed `padding-top` reduced
   too, pulling the whole stack up. Both `@utility cb-tophead`'s Tailwind
   defaults needed `!important` to override from outside its layer — a
   real, reproducible pattern this pass hit twice (also on
   `.layout-nav-overlay-brand`'s `translate`), not a one-off; this
   project's unlayered custom CSS is not winning over Tailwind's own
   layered utilities the way the cascade-layers spec says it should,
   worth its own investigation if it recurs a third time.

Verified: `bun run build`/`bun run lint`/`bunx tsc --noEmit` clean (only
the pre-existing `MaCoGlobe.tsx` error); live checks against a production
build, both themes, desktop (1920) and mobile (390) viewports, computed-
geometry checks (not just visual) for every collision bug above.

## 2026-09-02, later — six-item defect pass: dynamic panel tone, logo crop, layout 3 mobile hygiene

A separate owner-flagged defect list from continued live use of the
2026-09-02 build above, six items, each verified live against a production
build:

1. **Layout 2 panel tone made dynamic.** Was effectively hardcoded (tuned
   against one section in an earlier pass); `useLayoutNavState()` now
   samples whichever `[data-ground]` section sits at viewport centre the
   moment the panel opens and sets `panelGround` to its *inverse* — sampled
   once on open, not tracked live, since the panel locks scroll while open
   (`useOverlayMenu`) so the section behind it can't change mid-open. The
   sampled tone is also written as `data-nav-ground` on `<html>` so the
   trigger row/overlay controls (`chrome.tsx`, `styles.css`) flip to match
   the panel instead of assuming one fixed tone.
2. **Logo mark cropped to its real content.** `logo-mark.png` was a
   2481x2481 canvas with the glyph occupying only ~26% of its width and
   ~15% of its height (measured via a per-pixel alpha scan) —
   `mask-size: contain` fit the whole padded canvas into the box, so at any
   sane `size` the visible glyph rendered a few px tall. Re-exported the
   same art cropped to its measured alpha bbox (670x375, no content
   change). `Mark` (`components/mark.tsx`) now treats `size` as WIDTH, with
   height derived from a fixed `ASPECT = 375/670` constant, so the box
   tightly wraps the visible glyph instead of a square padded with empty
   space. `Wordmark`'s default `size` bumped 36->42 to compensate for the
   tighter box reading smaller than before at the same number.
3. **Layout 3 mobile: wordmark text hidden, mark kept.** New
   `maco-wordmark-text` class on `Wordmark`'s text span — a full "MaCo"
   chip centered plus the fixed layout/theme control cluster in a corner
   don't both fit a 390px top row without overlapping; text hides below
   `64rem` in this mode only, mark stays as an icon-only chip.
4. **Layout 3 control cluster relocated top-left on mobile.** Was
   bottom-left (mode 3's original, desktop-only position, since the dot
   columns occupy the side edges there); below `64rem` `.header-control-
   cluster` switches to `position: fixed; left: 1.25rem; top: 1.25rem`
   instead, clear of `EdgeNav`'s new mobile bottom bar (see next pass).
5. **Layout 3 mobile TOPHEAD padding retuned.** The centred hero stack has
   no forced `min-height` and is tall enough on its own to overflow a
   390x844 viewport before any padding is added — needed both
   `padding-top` reduced (pulls the stack up) and `padding-bottom`
   increased (clears the relocated cluster), not `padding-bottom` alone,
   which only adds space after the CTA without moving it.
6. **ThemeSwitch label hidden on mobile layout 3** (`.theme-switch-text`,
   `chrome.tsx`) — closed the last few px of overlap between the shrunk
   control cluster and the brand chip that rules 3-5 didn't fully close on
   their own (confirmed via `elementFromPoint` before this rule existed).

Verified: `bun run build`/`bun run lint`/`bunx tsc --noEmit` clean; live
checks both themes, 1440/390, layout mode 3 specifically re-checked at
390x844 for the mobile-only rules above.

## 2026-09-03 — FEATURE reverted to hover accordion; ground-tone fallback fix

Two items, both from continued live use surfacing real problems with
2026-09-01/09-02 work:

1. **FEATURE reverted from the scroll-driven `FeatureScroll` back to
   `Accordion`'s `hoverToOpen` mode.** The 2026-09-01 reveal
   (`feature-scroll.tsx`, since deleted) tied row-opening to a scrubbed
   `ScrollTrigger`, which lags real scroll position by design (`scrub`)
   — a normal-speed scroll or trackpad flick could blow past several rows'
   open windows before they visually registered. Every row was technically
   reachable by stopping at the right pixel, but that's not how anyone
   actually scrolls. `Accordion`'s `panel="inverted"` mode already had a
   built-in `hoverToOpen` (real mouse + fine pointer only via
   `(hover: hover) and (pointer: fine)`, click always works, touch never
   depends on hover) from the 2026-08-29 Capabilities dark-panel work —
   reusing it removes an entire fragile class of scroll-pacing bugs rather
   than re-tuning them, and hover intent is a more direct signal for "open
   this row" than a scroll position ever was. `FeatureAccordion` no longer
   branches on `useReducedMotion()` for this — `Accordion` with
   `hoverToOpen` already degrades correctly under reduced motion (click
   still works, nothing auto-animates on scroll) with no separate
   component needed.
2. **`groundAt()` gained a `fallback` parameter** (`lib/ground.ts`), default
   `"paper"` to preserve one-shot callers' existing behavior. Previously
   hard-defaulted to `"paper"` whenever no `[data-ground]` section covered
   the sampled y — which is not just "off the end of the page":
   `GroundHandoff`'s recede scales an outgoing section down a couple
   percent from its own bottom edge as the next section arrives, which can
   open a real, momentary gap at the sample point between two *adjacent
   `deep` sections*. Hard-defaulting that gap to paper flashed every
   continuous consumer (the header/EdgeNav ticker in `chrome.tsx`, the
   cursor in `cursor.tsx`) to the wrong tone for a few frames — most
   visible at the About MaCo -> How MaCo works boundary (RECORD -> FAQ,
   both `deep`), reported as a rendering glitch at that seam. Fixed by
   having both continuous trackers pass their own last-resolved tone as
   `fallback`, so a transient gap holds its prior tone instead of flashing;
   the preloader and any future one-shot caller are unaffected.

Verified: `bun run build`/`bun run lint`/`bunx tsc --noEmit` clean; live
check of the RECORD->FAQ boundary in both themes, scrolled through
repeatedly, confirms no tone flash; FEATURE's hover-open confirmed with a
real mouse (rows open on hover, close on hover-out, first row open by
default) and confirmed click-only still works with mouse hover disabled
(coarse-pointer emulation).

## 2026-09-03, later — homepage premium pass: 4 bugs, About merge, transitions rebuilt

Owner brief, 7 numbered items plus an open-ended "check for any issues,
make it premium, make it perfect" homepage audit. First: committed the
entire 2026-09-01-through-earlier-09-03 backlog (previously ~1,700
uncommitted lines, see the old "What's uncommitted" section this replaces)
as two checkpoint commits — one docs-only, one code (bundling everything
since `503ce20` without a per-pass split; re-deriving exact hunk
boundaries across three interleaving chrome.tsx/styles.css passes wasn't
worth the cost for a checkpoint). Then this pass's own work as a third
commit. `git log --oneline` from here: the homepage-premium-pass commit,
then the code checkpoint, then the docs checkpoint, then `503ce20`.

**Four bugs, each root-caused against the actual rendered geometry, not
guessed:**

1. **Preloader numeral/Enter-button collision.** The percentage numeral
   (`preloader.tsx`) was `position: absolute` with `-bottom-12` (−48px),
   so it contributed zero height to the flex column and rendered OUTSIDE
   the 200px ring's own box — directly into the space the (conditionally
   mounted) Enter button occupied 40px below the ring (`gap-10`). Both hit
   their "final" state on the same tick (`showEnter()` sets `ready` and
   writes "100" together), so the opaque `.btn-solid` pill painted over
   the last ~8px of the numeral. Fixed two ways at once: numeral moved to
   `bottom-8`, inside the ring's own box (can't collide with anything
   below it now); the Enter button's wrapper is now always mounted (a
   `min-h-[3.25rem]` reserved slot, opacity/y animate in via Motion,
   `disabled={!ready}` instead of not-yet-existing) so nothing shifts and
   there's no tick where both occupy the same geometry.
2. **Layout 2, mobile, closed: brand chip.** Was being *repositioned*
   into the header row on mobile (`position:static; order:-1`) rather
   than hidden — now `display:none` via
   `html[data-layout="2"]:not([data-nav-open="true"]) .layout-nav-overlay-brand`,
   reusing the same open/closed gating pattern this file already used for
   the chip's background. MENU plus the panel's own in-list "Home" link
   already cover navigation without it.
3. **Layout 2, mobile, panel open: CTA overlap.** The fixed bottom-left
   utility cluster (`LayoutSwitch`+`ThemeSwitch`, `.layout-nav-overlay-
   controls`) sits at `z-[47]`, above the open panel's `z-[46]` — it
   painted directly over the in-panel "Start a project" CTA, which
   bottom-anchors into the same 20–55px band, both left-aligned at the
   same gutter. Fixed by hiding the cluster while the panel is open
   (`html[data-layout="2"][data-nav-open="true"] .layout-nav-overlay-
   controls { display: none }`) — the panel is a scroll-locked modal with
   no equivalent controls of its own anyway (same reasoning the CTA row
   above it already used to drop itself at this width); the cluster
   reappears the instant the panel closes.
4. **Footer wordmark clipping.** `.footer-giant-mark`'s `line-height:
   0.82` was tighter than either display font's real ascender/cap-height
   metrics — the overflow got clipped by the parent `.shell.overflow-
   hidden` wrapper AND, separately, excluded from `background-clip:
   text`'s painted area (same tight line-box), so raising overflow alone
   wouldn't have fixed it. Raised to `1.15` — "MaCo" has no descenders,
   so this is ascender/cap-height clearance only, comfortable in both
   themes' fonts (Unbounded 800 / Michroma 400).

**The two "About" sections merged into one, homepage 11→10 sections.**
Overview ("What MaCo does," early, paper ground) already had a headline,
counted stats, and an `/about` CTA; Record ("About MaCo," late, deep
ground) added only `site.statement` restated — which ALSO already ran
verbatim as `TopHead`'s hero subtext, so it was on the page three times
over — plus one location line. `record.tsx` deleted; its location line
(`{site.category}, based in {site.location}. Working with clients across
India and the Gulf.`) moved verbatim into Overview as a new paragraph
after its CTA — no copy invented or reworded. Ripple: `routes/index.tsx`
(import + render slot removed, renumbered), `ground-handoff.tsx` (the
Identity→"About MaCo" ground-flip pair now targets Identity→"How MaCo
works" directly — same flip, one section earlier), `scripts/shoot.mjs`
(`SECTIONS` entry removed, renumbered `09-faq`/`10-outro`). Grepped for
`"About MaCo"` as an aria-label after deleting — only remaining hits are
the (unrelated, intentional) CTA link text on Overview and the `/about`
route's own page title.

**GroundHandoff rebuilt — the actual point of this pass, per the owner's
own framing ("very fluid... premium... brilliant," "no dividing line or
dividing empty spaces... seamless," and specifically: bring back the
rounded-corner effect like cuberto.com's, which existed before and had
gone missing).** Root cause of "gone missing": the old sheet mechanism
animated a `clip-path` corner radius FROM 48px round TO 0 (square) as the
incoming section arrived — i.e. AWAY from rounded, so the rounded state
was barely ever on screen; it was also never able to carry a box-shadow,
since `clip-path` clips its own shadow too (the shadow paints outside the
border box, which a clip region excludes). Two changes:

- **Same-ground boundaries (8 of 10 pairs) are now a pure opacity
  fade — no transform at all.** The old recede (`yPercent -2/-4, scale
  0.985/0.965, transformOrigin "50% 0%"`) shrank the outgoing section
  from its own bottom edge upward, which could expose a real, if brief,
  dip at the seam — this is the direct fix for the reported "empty gap"
  scrolling Overview→Feature (both `paper`, so it was never a color
  mismatch; the shrink itself was the cue drawing the eye to a moment
  neither section's content had fully settled). Dropping the transform
  removes the mechanism, not just the symptom, and directly answers the
  "no dividing... empty spaces, seamless" ask.
- **The two ground-flip boundaries (Preview→Overview, Identity→Faq) are a
  real, permanent rounded overlap now.** New `.ground-sheet` utility
  (`styles.css`) on the incoming section (`overview.tsx`, `faq.tsx`):
  `margin-top: -3rem` (permanent physical overlap), `border-radius: 3rem
  3rem 0 0` (permanent rest-state rounding — the CSS default, not
  something JS has to create), `box-shadow: 0 -20px 48px -12px oklch(0 0
  0 / 0.35)` (a ground-invariant dark shadow — deliberately not
  `--text`/`--accent`-derived, since those flip to near-white on deep
  ground and would read as a glow, not a shadow). `ground-handoff.tsx`
  now only grows the radius FROM 0 INTO that 48px rest value via a real
  `border-radius` GSAP tween (not `clip-path`) as the section scrolls
  in — reduced-motion/no-JS visitors see the settled rounded composition
  directly at all times, no separate branch needed, since
  `useScrollScene` already no-ops whenever `getScrollRuntime()` returns
  null. 48px reuses the old clip-path's own rounding amount — the
  already-considered-correct number for this exact spot, not reinvented.

**Verification — and an honest limitation.** `bun run build`/`bun run
lint`/`bunx tsc --noEmit` all clean (only the pre-existing `MaCoGlobe.tsx`
error). **No real-browser check was possible this session**: the
`agent-browser` MCP tool hung on `agent_browser_open` (1800s, no
response — same failure class as the 2026-09-01 pass's note about it
hanging on launch), and the `playwright` MCP server failed to connect all
session (`CONNECT_TIMEOUT`, confirmed via `ToolSearch`, not assumed).
Verified instead against the actual production build: ran `bun run
preview`, fetched the SSR HTML with `curl` and confirmed the 10 sections
render in the correct order with the right `aria-label`s, `ground-sheet`
is on exactly Overview and Faq (`grep -o 'class="[^"]*ground-sheet[^"]*"'`
→ 2 matches), the absorbed About paragraph renders `content/maco.ts`'s
exact `site.category`/`site.location` text (React's `<!-- -->` hydration
comments between adjacent text-expression siblings initially broke a
naive grep — found and worked around, not a bug), and the preloader's new
`bottom-8`/`min-h-[3.25rem]` markup is present; fetched the compiled CSS
and JS bundles and confirmed `.ground-sheet`'s exact declared values, the
`.footer-giant-mark` `line-height:1.15`, both new Layout-2-mobile rules,
and GroundHandoff's `borderRadius:` FROM `` `0px 0px 0px 0px` `` TO ``
`48px 48px 0px 0px` `` tween all compiled with the intended literal
values. **This confirms the code is wired correctly, not how it actually
looks or animates on screen.** A real visual pass — does the rounded
overlap read as premium, does the fade feel seamless, do the 4 bug fixes
actually look right — is the single most important thing left; see
`ROADMAP.md` item 0.

**Open, not acted on:** `frontend/public/white.png`/`white-2.png` remain
untracked, zero references anywhere in `frontend/src` (confirmed via
grep) — likely stray exports from the 2026-09-02 logo-crop work. Left
alone rather than guessed at; delete once confirmed unneeded, or ask.
`components/motion/split-reveal.tsx` still has zero call sites (noted
2026-09-03 earlier pass, unchanged this pass) — same "confirm before
deleting" discipline applies.

## Read this first

1. `CONTEXT.md` — authoritative current-state reference (stack, content, homepage architecture)
2. `PROJECT_STATUS.md` — done / partial / not-started matrix
3. `ROADMAP.md` — what's left, in order
4. `frontend/src/content/maco.ts` — the only source of copy facts

## What the homepage is now

10 sections (was 11 until 2026-09-03 — see that pass's entry above),
`routes/index.tsx` → `components/home/*`. Full table with ground/
aria-label/pin behavior in `CONTEXT.md` §10 — don't duplicate it here, it
will drift again.

## Typography

Two themes, fully separate font sets (not a recolor) — see `CONTEXT.md` §9.
Obsidian: Unbounded/Jost/Agdasima. Cobalt: Michroma/Tenor Sans/Krona One.

## Logo

`Mark` component (`components/mark.tsx`), CSS `mask-image` + `currentColor` —
one canonical asset (`logo-mark.png`), correct on every ground/theme/size.
Cropped to its real alpha content 2026-09-02 (`ASPECT` constant, `size` now
means width). `maco-mark-hero.png` is gone — deleted 2026-09-01, zero
references since TopHead replaced the old OPEN hero that used it.

## The signature device — light-pass

`@utility light-pass` in `styles.css`, driven by a `--sweep` custom property
(0–1). One raking-light gradient reused at every scale instead of per-section
decoration. See `CONTEXT.md` §10.

## Contact form (`routes/contact.tsx`)

Real `POST /api/v1/contact/`, requires `VITE_API_BASE_URL` set or it errors
loudly (by design — no silent-discard fallback).

## Mobile nav (`components/chrome.tsx`, `MobilePillNav`)

Real focus trap (Tab/Shift+Tab wrap), Escape, backdrop click-to-dismiss.

## Do NOT change without a real reason

1. Don't reintroduce grid overlays, marquees, pulsing dots, or `NN —`
   numbered eyebrows — removed deliberately in the homepage reset.
2. Don't invent claims, metrics, or names not traceable to `content/maco.ts`.
   The pre-reset homepage shipped false claims once; never again.
3. Don't add a second contact form on the homepage — `Outro` (the
   Cuberto-parity rebuild's OUTRO section, formerly `CloseIntake`)
   deliberately links to `/contact` instead of duplicating it.
4. Don't resurrect the deleted `components/ui/` shadcn scaffold in bulk —
   it was 47 files of dead code removed 2026-08-21. Install a primitive
   fresh if a real feature needs one.
5. Keep `system-field.tsx` — retired from the homepage but still imported by
   `/products/$slug`.
6. Two themes must stay genuinely different type systems, not a shared font
   with recolored surfaces.
7. Don't add a second scroll-smoothing layer on top of Lenis — no
   `useSpring`/`useTransform` on `scrollYProgress` anywhere. Lenis owns
   scroll, GSAP `ScrollTrigger` owns pins/scrubs, `motion` owns discrete UI
   state only.
8. Don't reintroduce WebGL, a custom cursor, or text-scramble without
   live-browser verification before calling it done — three separate WebGL
   hero attempts have now been built and rejected/reverted after actually
   being seen scrolling: two same-session for reading as a generic agency
   template, and `prism-field.tsx` itself replaced 2026-08-27 (fourth pass
   above) once a type-driven, no-WebGL treatment tested stronger in a
   live A/B/C preview. That treatment was itself superseded 2026-08-28
   (seventh pass) by `TopHead` (Cuberto's actual `cb-tophead` shape — brand
   row, large statement, subtext, CTA), also with no WebGL. The current
   hero has never had a WebGL layer since the fourth pass.
9. Don't compute a pin's `end` distance and its transform from two different
   measurements — a real 4× bug in an earlier WORK implementation came from
   exactly that. Derive both from the same measurement function.
10. Don't claim a pass "tested" or "verified" beyond `tsc`/`eslint`/`build`
    unless it was actually driven in a real browser.

## Next exact actions

See `ROADMAP.md` — kept in sync with this file, not duplicated here.

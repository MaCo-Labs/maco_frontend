# Premium / interactivity audit — 2026-08-30

Item 6 + item 7b of the eleventh pass (`AI_HANDOFF.md`'s pass log; see that
file's forthcoming entry for the pass as a whole). **Proposal only — nothing
here is implemented.** Every finding below was checked against the actual
component source (file + line), not guessed, and judged against `AGENTS.md`
§2 (identity-first, "must NOT feel like" list) and §33 (final quality bar),
plus `design-motion-principles`' anti-AI-slop checklist where a motion change
is proposed. A reactbits.dev category is named only where a specific
technique genuinely fits a specific section — most sections don't need one,
and the proposals below mostly reuse primitives MaCo already has
(`ScrubReveal`, `Stagger`, `Magnetic`, the new per-state cursor from this
same pass) rather than reaching for a new one.

Several sections are recommended for **no change** — restraint is itself a
finding, not a gap, and an audit that proposes something for every section
is the "more effects = better design" failure mode AGENTS.md §2 names
directly.

---

## Cross-cutting findings (not section-specific)

1. **The four non-homepage routes (`/about`, `/work/$slug`, `/products/$slug`,
   `/contact`) are on an older motion layer than the homepage.** They use
   `LineReveal` (only in `mode="once"`), `Magnetic`, and the deprecated
   `MotionSection` (`components/motion-section.tsx`) — and nothing else.
   Every scrubbed/reversible primitive built for the homepage (`ScrubReveal`,
   `Stagger`, `RuleDraw`, `RakingSurface`, `SplitReveal`, `MaskedHeading`,
   `SurfaceMedia`, `ProductVideo`, the shared `Accordion`) is used **only**
   inside `components/home/`. `scrub-reveal.tsx:21` calls itself "the
   default replacement for `MotionSection`" — yet `MotionSection` survives
   only on the routes that never got the upgrade. This is the single root
   cause behind most of item 7b below; each route's proposals mostly just
   apply the vocabulary the homepage already has.
2. **None of the four routes carry `data-ground` or a section `aria-label`.**
   The adaptive chrome (`chrome.tsx`'s `applyGround`) and `GroundHandoff`
   both select by exact `[data-ground]`/`aria-label` match — on these routes
   there's nothing to select, so the header/pill-nav simply keep whichever
   ground state they inherited from the last route visited. Worth fixing
   alongside whichever route gets touched first, not as a separate pass.
3. **Layout mode 2's trigger button can't be clicked to close once the panel
   is open** — the full-screen panel's `z-[46]` sits above the header's
   `position:fixed` `z-[42]` stacking context, which no descendant z-index
   can escape. Found live while verifying this pass's item 4 (beam/stagger),
   confirmed pre-existing via `git stash` against a clean baseline. Escape
   and link-navigation both close it correctly, so it's not broken, only
   incomplete — the aria-label says "Close navigation menu" for a button
   that visually can't be. Real fix requires moving where the trigger
   renders (matching the panel's own "must render as a header sibling"
   architecture), which is bigger than a chrome-nav tweak — worth its own
   short pass.
4. **Documentation hygiene, unrelated to the app itself:** `docs/REFACTOR_PLAN.md`
   ends at §12, but §13 is cited by `AI_HANDOFF.md:341/404/487`,
   `ROADMAP.md:26`, and `PROJECT_STATUS.md:11` — five dangling references
   whose only surviving record is the eighth-pass `AI_HANDOFF.md` entry.
   Fold that entry's content back into `REFACTOR_PLAN.md` as the real §13,
   or drop the citations, next time either file is touched.

---

## Homepage — 11 sections

### 1. TOPHEAD — `top-head.tsx`

**Current:** `SplitReveal` on the brand row, `MaskedHeading` (video-in-text,
cycling `heroLines`) on the `<h1>`, `Magnetic` on the CTA, `hero-backlight`/
`hero-grain` behind everything. The richest single moment on the page.

**Gap:** the eyebrow (`site.category`, `.cb-tophead-eyebrow`) and the lead
paragraph (`site.statement`, `.cb-tophead-lead`) are the only two text blocks
in the section with **no reveal at all** — plain render, while every other
text block on the page (including this same section's own wordmark and
headline) uses `ScrubReveal`/`LineReveal`/`SplitReveal`.

**Proposal:** wrap both in `ScrubReveal` — the exact primitive `Overview`
and every section below it already uses for a label/lead pair. Zero new
code, one-line changes, restores consistency at the page's own opening
moment.

**Cost/risk:** trivial, no reactbits category needed (already-adopted MaCo
primitive).

---

### 2. PREVIEW — `evidence-expand.tsx` (pinned)

**Current:** the page's one cinematic set-piece — pin+scrub-driven frame
growth locked to the video's real 16:9, a pointer-following vignette, a
two-act caption swap. Already the strongest section on the page; this is
the one place where "add more" is the wrong instinct.

**Proposal (narrow):** the pinned frame has no `data-cursor` opt-in, so
while it's pinned and filling most of the viewport, the cursor (this same
pass's new semantic-state system) still reads as a plain "action" ring
rather than acknowledging it's sitting over playing media. Add
`data-cursor="media"` to the frame div — one attribute, the "media" state
already exists in `cursor.tsx`, currently unused anywhere on the site.

**Cost/risk:** trivial, and it's the correct kind of small — a section this
polished doesn't need a new effect, just to be wired into the vocabulary
the rest of the pass just built. **Do not** add anything else here; this
section already sets the ceiling other sections are being compared against.

---

### 3. OVERVIEW — `overview.tsx`

**Current:** `ScrubReveal` label, `LineReveal mode="words"` heading (the
one deliberate blur-word-stagger on the page, reserved for exactly this
settle-after-the-hero moment per the component's own comment), `Stagger`
on four counted figures, plain `btn-line` link.

**Considered and rejected:** a count-up number tween on the four figures
(0 → 2, 0 → 4, …) as they stagger in. This is a stock "premium SaaS
metrics" trope — exactly the register AGENTS.md §2 names as a failure mode
("generic SaaS"), and the numbers here are small (2, 4, 4, 2) where a
count-up reads as filler motion rather than a real reveal. **Reject.**

**Proposal (real, small):** the `/about` link at the bottom of this section
is the only primary link-with-arrow on the homepage that isn't wrapped in
`Magnetic` — `top-head.tsx`, `outro.tsx`, and both `Summary` call sites all
wrap theirs. One-line fix for consistency, not a new interaction.

**Cost/risk:** trivial.

---

### 4. FEATURE — `feature-accordion.tsx`

**Current:** Cuberto's numbered-row accordion, `panel="inverted"` opening
each row into a real dark contrast card with one restrained `--focus`
radial accent, hover-to-open on fine pointers. Already distinctive and
already restrained (the shared `Accordion` component's own comment is
explicit about "one restrained accent, not a gallery of them").

**Proposal (narrow):** the row numbers (`01`–`07`) and the `<span
aria-hidden="true" className="cb-plus" />` toggle glyph are the only two
static elements in an otherwise-animated row. A very subtle `RakingSurface`
pass on the OPEN row's number badge only (not the whole row, not the closed
rows) would tie this section into the site's own signature light device
without adding a new visual language — `RakingSurface` already exists,
already used elsewhere, and restraint (one row, one badge) keeps it from
becoming a second competing effect against the panel's own accent glow.

**Cost/risk:** small; genuinely optional — the section reads as complete
without it. If it's tried live and competes visually with the panel's own
`--focus` glow, cut it.

---

### 5. LOGOREEL — `logo-reel.tsx`

**Current:** CSS-only two-copy `-50%` drift (no JS, no ScrollTrigger, stops
under reduced motion), per-card hover lift + border-color change.

**Gap, confirmed by reading `styles.css`'s `.cb-reel`/`cb-reel-drift`
rules directly:** there is no hover-pause. The reel keeps drifting under a
pointer that's trying to read or click a specific logo — a well-established
convenience for any auto-scrolling row of clickable items, not a novelty.

**Proposal:** `.cb-reel:hover, .cb-reel:focus-within { animation-play-state:
paused; }` — one CSS rule, no JS, no new dependency, doesn't touch the
reduced-motion branch (already `animation: none` there, which a
`play-state` rule can't un-stop).

**Cost/risk:** trivial. No reactbits category — this is a standard marquee
convenience, not a technique worth crediting to a reference site.

---

### 6. WORK (`Selected client work`) & 7. PRODUCTS — `summary.tsx`

**Current:** one shared `Summary`/`SummaryCard` component behind both
sections — `Stagger`-revealed card grid, real footage via `ProductVideo`
where it exists, an honest brand-plate or title-text fallback where it
doesn't (never a fake screenshot, per the component's own comment),
`hover:-translate-y-1.5` on the whole card.

**Proposal (applies to both, one implementation cost since it's one
component):** add `data-cursor="media"` to each `SummaryCard`'s `<Link>`,
same reasoning as item 2 (PREVIEW) — these cards are the site's next-most
media-forward moment after the hero, and currently get the generic "action"
cursor state like a plain text link would.

**Cost/risk:** trivial, one component touched, benefits both sections at
once.

---

### 8. IDENTITY — `identity.tsx` (pinned)

**Current:** the most technically distinctive section on the page — a
pinned scroll-driven script dial computed entirely in CSS `calc()`, zero
React re-render per frame, a pointer-position nudge already layered on top
of the scroll-driven position (`identity-script`'s own comment confirms
`--px`/`--py` are consumed, not dead code — checked directly in
`styles.css`, not assumed).

**Proposal:** none. This section is a genuine premium/technical showpiece
already; the risk here is dilution, not absence. Leave it alone.

---

### 9. RECORD — `record.tsx`

**Current:** one `ScrubReveal` paragraph, deliberately the page's "one
quiet beat" per the component's own comment — every other section
performing at once would be as tiring as none of them performing.

**Proposal:** none, and this is itself the finding worth recording: an
audit that adds motion here would be arguing against the section's own
explicit design intent, and against AGENTS.md §2's "nothing purely
decorative" / "one strong effect beats five" rule. Restraint is correct.

---

### 10. FAQ (`How MaCo works`) — `faq.tsx`

**Current:** the same shared `Accordion` as FEATURE, default (non-inverted)
panel since the section is already on `deep` ground — a dark card here
would have nothing to contrast against, per the component's own comment.

**Proposal:** whatever is decided for FEATURE's accordion-row treatment
(item 4 above) is the only thing worth considering here too, since it's the
same component. No section-specific proposal beyond that.

---

### 11. OUTRO (`Start a project`) — `outro.tsx`

**Current:** the closing gesture — `light-pass` sweep, a center-drawn
`RuleDraw` (the one place on the page a rule draws from the middle instead
of the left, per the component's own comment), both CTAs already wrapped
in `Magnetic`.

**Proposal:** none. Already the second-most considered section on the page
after TOPHEAD/PREVIEW; adding anything risks competing with the light-pass
sweep that's specifically tuned for this position.

---

## Cross-page consistency — item 7b

All four routes below inherit cross-cutting findings #1 and #2 above
(`MotionSection` instead of the homepage vocabulary; no `data-ground`/
`aria-label`). Proposals here are additional, route-specific findings.

### `/about` — `routes/about.tsx`

- **Content-architecture issue, not a motion one:** the five "Principles"
  list items (`about.tsx:83-89`) are hardcoded strings written directly in
  the route, the only page-level copy on the site that isn't sourced from
  `content/maco.ts`. Worth moving there regardless of any motion decision —
  it's the kind of drift AGENTS.md §3's source-of-truth order exists to
  prevent.
- **Motion:** the Method section's four steps use `MotionSection` with a
  flat per-item delay (`about.tsx:62-63`). Swapping to `Stagger` (already
  used for OVERVIEW's near-identical four-item figure grid) would match
  the homepage's own device for "four small items entering together" rather
  than reading as a different, older mechanism.
- **Left alone:** the hero's `SystemField` visual and the now-fixed
  `GlobeSection` are both already appropriately restrained for a page whose
  job is mostly to state facts, not perform.

### `/work/$slug` — `routes/work.$slug.tsx`

- **Textbook `Stagger` target, found directly in the source:** the 4-cell
  meta `<dl>` (Client/Sector/Type/Live, `work.$slug.tsx:57-59`) is
  structurally identical to OVERVIEW's figure grid on the homepage, which
  already uses `Stagger` — this one renders as one static block instead.
- **Real gap:** the page has **no imagery anywhere**, despite every project
  already having real media or a brand mark in `content/maco.ts` (the same
  data `SummaryCard`'s `CardMedia` already renders on the homepage). A case
  study with zero visual of the actual work is a genuine absence, not a
  motion polish item — reusing `CardMedia`'s media/brand/title-fallback
  logic here (or `SurfaceMedia` directly) would close it without inventing
  new content.

### `/products/$slug` — `routes/products.$slug.tsx`

- **Correctness issue, not a taste one:** `scrollProgress={0.45}` at
  `products.$slug.tsx:46` is a hardcoded constant driving `MaCoSystemField`
  — the field is frozen at a fixed 45% pose rather than actually responding
  to scroll the way the same primitive does everywhere else it's used. Wire
  it to a real `useScrollScene` progress read (the pattern every pinned
  homepage section already establishes) rather than leaving it static.
- **Motion:** Problem/Solution and Capabilities sections use `MotionSection`
  with flat delays (`products.$slug.tsx:98, 111`) — same swap-to-existing-
  vocabulary proposal as `/about` and `/work/$slug`.

### `/contact` — `routes/contact.tsx`

The plainest of the four — two motion touches in 277 lines (`LineReveal`
on the header, `Magnetic` on submit).

- **Proposal:** wrap each form field group (Name/Email/Company/Phone/
  Service/Budget, `contact.tsx:139-210`) in `Stagger` for a one-time
  entrance as the form scrolls into view — the same primitive, no new
  dependency, and the form is the one place on the site where a visitor is
  about to commit real effort, so a small amount of "this was considered"
  polish is warranted rather than a bare unstyled-feeling field grid.
- **Left alone:** the honeypot field and the throttled submit logic are
  correctness-critical, not a place to add motion.

---

## Summary — what's actually worth doing

Ranked by cost-to-value, all of it small:

1. Logo reel hover-pause (§5) — one CSS rule, closes a real usability gap.
2. TOPHEAD eyebrow/lead reveal + OVERVIEW's `/about` link Magnetic wrap
   (§1, §3) — one-line consistency fixes.
3. `/products/$slug`'s frozen `scrollProgress` (item 7b) — a correctness
   fix wearing a "premium polish" label; worth doing regardless of the rest
   of this audit.
4. `data-cursor="media"` on PREVIEW's frame and both Summary cards (§2, §6/7)
   — wires this pass's new cursor system into the two places it's most
   relevant, near-zero cost once the cursor itself ships.
5. `/work/$slug` imagery + its `<dl>` → `Stagger` (item 7b) — the largest
   real gap found, still small in implementation cost since it reuses
   existing components.
6. The four non-home routes' `MotionSection` → homepage-vocabulary swap,
   plus `data-ground`/`aria-label` (cross-cutting #1, #2) — the biggest
   scope item here, but mechanical: swap an existing deprecated primitive
   for its documented replacement, route by route.

**Explicitly not recommended:** anything on IDENTITY, RECORD, or OUTRO
(sections 8-11's own writeups above); the OVERVIEW count-up rejected in §3;
any reactbits.dev technique not already named above — nothing else in the
catalogue was found to fit a specific MaCo section this pass.

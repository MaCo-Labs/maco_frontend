# MaCo Site Refactor — Master Prompt & Workflow

How to use this file: Section 6 is the literal prompt to paste as your first
message to Claude Code. Sections 1–5 are the reasoning behind it — read them
once, then keep this file in the repo (e.g. `docs/REFACTOR_PLAN.md`) as a
reference for future sessions.

---

## 1. Confirmed bugs, found before any redesign discussion

From the screen recording you shared (Obsidian theme, `2026-08-21`):

1. **OPEN section renders blank/white on initial paint** — the hero holds an
   empty white block for a visible stretch before anything appears. Likely a
   hydration/lazy-load race on `PrismField` or `SplitReveal`, or an at-rest
   `opacity: 0` state whose GSAP `ScrollTrigger`/mount trigger never fires
   above the fold on cold load.
2. **A compositing/z-index bug in the PRODUCTS area** — the HeadGreen
   leaf/map-pin graphic renders on top of and blended into the Bridge product
   screenshot instead of appearing in its own section. Likely two
   `SurfaceMedia` tiers or two sections stacked instead of sequenced, or a
   `mix-blend-mode` inherited where it shouldn't be.

Both are real, current, reproducible bugs — not stylistic complaints.

**The bigger issue they expose:** `PROJECT_STATUS.md` and `AI_HANDOFF.md` are
both dated `2026-08-21` and say `STABLE` / `DONE`, but a same-day recording
shows broken rendering. This is the exact doc-drift failure `AGENTS.md`
already warns about and the cleanup pass was supposed to fix. Conclusion:
don't trust "DONE" in the docs — re-verify everything live in a real browser
before planning new work, per `AGENTS.md` §28.

---

## 2. The real gap is assets, not motion

`HOMEPAGE_REDESIGN_PLAN.md` §1 (your own prior audit) already found this:
zero photography, zero product screenshots beyond one PNG logo, no client
logos as real files, no footage except a since-added Bridge clip. The
architecture already has a three-tier media fallback (`SurfaceMedia`: video →
image → designed fallback) built and waiting for tier-1/tier-2 assets that
mostly don't exist yet.

**Recommendation: prioritize real capture over synthetic video.** Your own
`AGENTS.md` §10 bans fabricated content and §2/§33 say the site must not feel
AI-generated. An AI-video-generated hero (Higgsfield, Runway, Kling, etc.)
risks producing exactly the generic-AI-SaaS look you're fighting — polished,
but generic and slightly synthetic. You have two real, working products
(Bridge, Driver's Diary). Screen-recorded footage of the actual product,
treated with the `light-pass` / `RakingSurface` device you already built,
will look distinctive precisely because it's real and nobody else has it.

Where AI-generated video is genuinely useful: **abstract, non-representational
atmosphere only** — e.g., a subtle material backdrop behind the OPEN
wordmark, a texture, a gradient field. Never as a stand-in for product UI,
client work, or people — that would violate your own no-fabrication rule.

---

## 3. Tech stack verdict: keep it, don't rebuild

Your current stack — React 19 + TanStack Start, Tailwind v4, GSAP
`ScrollTrigger` + Lenis for scroll, `motion` v13 for discrete UI state, raw
`three` for WebGL — is already close to what current top-tier
award-site studios build with. This is not a "wrong stack" problem. Do not
add Framer Motion (you already have `motion`), do not add a second WebGL
runtime, do not resurrect the deleted shadcn scaffold, do not migrate
frameworks. `AGENTS.md` §19/§25 already says this — it's correct, keep
following it.

**What to actually add:**

- **Playwright** (dev dependency) — for the live-browser QA gate `AGENTS.md`
  §27/§28 already mandates but evidently isn't being run consistently.
  `bun add -D @playwright/test && npx playwright install chromium`.
- A small screenshot script that walks all 11 sections × 2 themes × the 7 QA
  widths already listed in `AGENTS.md` §22, so "tested" always means an
  actual image, not a claim.
- Nothing else. The `ffmpeg` media pipeline (`scripts/build-media.mjs`)
  already exists — point it at new real footage instead of building a new
  one.

---

## 4. Design source of truth: Figma MCP + Claude Design, not vibes

**Option A (recommended — you already have the Figma connector linked):**
Design each of the 11 sections, both themes, at key breakpoints in Figma.
Use the **Figma Dev Mode MCP Server** from inside Claude Code so it reads
real component structure, spacing, and tokens straight from the Figma file
instead of guessing from a text description. This is the standard
design-to-code handoff pattern and is far more precise than prompting from
words alone.

**Option B (lighter, no full Figma file):** Use the **Claude Design** app
(Anthropic's design/prototyping app) to iterate on visual direction and
produce a reference mockup image per section/theme. Export the image, drop
it in a `design/` folder in the repo, and hand it to Claude Code with "match
this reference" alongside the master prompt below.

**Where Higgsfield-style tools fit:** they are a separate, third step —
asset generation, not code generation. They don't "connect to" Claude Code.
You generate a clip in Higgsfield/Runway/Kling, download it, run it through
your existing `build-media.mjs` pipeline, and reference the resulting
`.webp`/`.mp4` from `content/maco.ts`, exactly like the current Bridge
footage.

Design → Figma/Claude Design. Motion assets → Higgsfield/real screen capture
→ `build-media.mjs`. Code → Claude Code. Three separate tools, three separate
jobs, one pipeline.

---

## 5. Model guidance inside Claude Code

- **Planning, cross-file architecture, debugging the two real bugs above:**
  switch to **Opus 4.8**. Use Plan Mode (Shift+Tab twice in the terminal, or
  select it in the VS Code extension) so it proposes a plan before touching
  files.
- **Bulk implementation once a plan is approved** (building out the 11
  section components, one phase at a time): **Sonnet 5**. Default, fast,
  strong at code, and cheaper against a Pro plan's usage budget than Opus.
- **Trivial mechanical passes** (lint fixes, renames, one-line token edits):
  **Haiku 4.5**, to save Sonnet 5/Opus 4.8 budget for the harder passes.
- Switch models via the model picker in the VS Code Claude Code panel, or
  `/model` in its terminal.
- Practical sequencing on a Pro plan: spend Opus 4.8 on the PLAN step only,
  then batch every IMPLEMENT phase on Sonnet 5 so the expensive model isn't
  burned on repetitive component work.

---

## 6. The master prompt — paste this as your first message in Claude Code

```
Read AGENTS.md, CONTEXT.md, PROJECT_STATUS.md, AI_HANDOFF.md, and ROADMAP.md
in that order, per AGENTS.md's own reading order. Then do NOT trust their
"STABLE"/"DONE" status claims — a same-day screen recording shows the live
site rendering broken. Treat every status claim in those docs as unverified
until you personally reproduce it in a real browser.

PHASE 0 — RE-AUDIT (do this before any redesign discussion):
1. Run the dev server. Drive the homepage yourself in a real browser
   (Playwright — install it if not present: bun add -D @playwright/test &&
   npx playwright install chromium) across both themes and, at minimum,
   1440px and 390px widths.
2. Screenshot all 11 homepage sections in both themes.
3. Specifically reproduce and diagnose these two known bugs:
   a. The OPEN section renders blank/white for a visible stretch on initial
      paint in Obsidian theme before the hero content appears.
   b. A compositing/z-index bug where a HeadGreen leaf/map-pin graphic
      overlaps and blends into the Bridge product screenshot in the
      PRODUCTS area, instead of the two being properly sequenced.
4. For every section currently showing a tier-3 "designed fallback" instead
   of real tier-1/tier-2 media (per SurfaceMedia, CONTEXT.md §10), list it
   explicitly — I need to know exactly which sections are waiting on real
   photography/screenshots/video before I go capture them.
5. Report findings before writing any code. Do not skip this because the
   docs say the homepage is "DONE" — that claim is exactly what's in
   question.

PHASE 1 — FIX THE TWO CONFIRMED BUGS:
Fix the OPEN blank-paint bug and the PRODUCTS compositing bug. Nothing else.
Verify each fix by actually reloading the page in a real browser and
re-screenshotting — not by reading the code and assuming it's fixed.

PHASE 2 — PLAN (do not implement yet):
Once the two bugs are fixed and the re-audit is complete, propose a plan for
closing the asset gap and any remaining visual/motion issues you found.
Constraints, non-negotiable:
- Do not add new animation/motion libraries — GSAP, Lenis, motion v13, and
  raw three already cover this. Reuse the existing motion vocabulary
  (ScrubReveal, RuleDraw, Stagger, RakingSurface, Magnetic, LineReveal,
  SplitReveal) rather than inventing new components where an existing one
  already does the job.
- Do not migrate frameworks, routing, or styling architecture.
- Do not invent copy, stats, client names, or claims not present in
  content/maco.ts.
- Keep the two-theme separate-font-family architecture (Obsidian vs Cobalt)
  genuinely distinct — never a shared font with recolored surfaces.
- Every cinematic/motion moment needs a designed static fallback for
  prefers-reduced-motion, not just a disabled animation.
- If a section is blocked on a real asset that doesn't exist yet (real
  screen capture of Bridge/Driver's Diary, real client logos, etc.), say so
  explicitly in the plan instead of shipping a placeholder silently.

Wait for my explicit approval of the plan before implementing anything in
Phase 2's scope.

PHASE 3 — IMPLEMENT, one phase at a time, per the approved plan. After each
phase: run bun run build && bun run lint, then actually drive the change in
a real browser (Playwright) before calling it done. Update AI_HANDOFF.md and
PROJECT_STATUS.md only with claims you personally verified this session —
mark anything you could not verify live as "unverified," not "done."
```

---

## 7. Command sequence to start

```bash
cd path/to/maco-website-v2
git status                     # confirm clean tree, per AGENTS.md §26
git checkout -b refactor-audit-2026-08
code .                         # open in VS Code
```

Open the Claude Code panel, switch model to Opus 4.8 for Phase 0–2, paste
the Section 6 prompt as the first message. Once Phase 2's plan is approved,
switch to Sonnet 5 for Phase 3's implementation loop.

---

## 8. On the three YouTube links

Couldn't watch them directly this session — no video-transcript tool
available, and the YouTube fetch was rate-limited when tried. Based on the
"higglesfield" mention, these are almost certainly demos of the pattern in
§4: an AI camera-controlled video generator (Higgsfield) producing cinematic
background/hero footage, wired into a hand-coded GSAP-driven site by an
agentic coding tool. That's a real, documented pattern, not a rumor — but
it's an asset-generation step, not a Claude Code plugin or connector.

If you want a frame-by-frame breakdown of a specific technique from those
videos (a particular text reveal, a particular scroll transition), describe
what happens at a given timestamp and I'll map it to your existing motion
vocabulary (ScrubReveal / LineReveal / RuleDraw / RakingSurface) rather than
suggesting a new dependency.

---

## 9. Design-system tooling — verdicts on the five links

Cloned and inspected all five. Four are real, current, and independently
verifiable; one couldn't be located.

1. **`nextlevelbuilder/ui-ux-pro-max-skill`** — real, active. An AI reasoning
   engine (192 industry rules, 79 UI styles, color/type/pattern generator)
   that scaffolds a design system for a *new* project type ("SaaS", "spa",
   etc.). **Verdict: use selectively, not wholesale.** MaCo already has a
   specific, considered identity (Obsidian/Cobalt, the two font sets, the
   `light-pass` device) — running this tool's generic reasoning engine over
   the whole project risks generating a *different* generic identity on top
   of the one you already built. Worth using for its accessibility
   checklist and anti-pattern list only, not for re-deriving colors/type.
   Install: `/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill`
   then `/plugin install ui-ux-pro-max@ui-ux-pro-max-skill` inside Claude
   Code.

2. **`VoltAgent/awesome-claude-design`** — real. Not a tool, a curated
   library of `DESIGN.md` files for **Claude Design**
   (`claude.ai/design`) — Anthropic's persistent design-system workspace.
   This is the actual answer to your original "how does Claude Design
   connect to Claude Code" question: it doesn't connect programmatically —
   you hand it a `DESIGN.md`, it scaffolds `colors_and_type.css`, component
   previews, a working `index.html` UI kit, and a `SKILL.md`, and *you*
   carry that output into Claude Code as a reference. I wrote MaCo's own
   `DESIGN.md` in that exact 9-section format — see the second file
   delivered alongside this one. Upload it at claude.ai/design.

3. **`bergside/design-md-chrome`** — real, a Chrome extension. Point it at
   any live site and it extracts a `DESIGN.md`/`SKILL.md` from that site's
   actual computed styles (type, color, spacing, motion). Useful if you
   want to reverse-engineer a specific reference site you admire into a
   comparison document — **use as inspiration input only**, never upload a
   competitor's extracted file as-is; MaCo's own `AGENTS.md` §1 already
   requires the site not be a clone of any reference.

4. **`kylezantos/design-motion-principles`** — real, and the best fit of
   the five. Has an **audit mode** built specifically to catch "AI-slop"
   motion (pulsing indicators, hover-scale-everything, stagger-spam,
   uniform fade-ins) — exactly the pattern your own `HOMEPAGE_REDESIGN_PLAN.md`
   already fought once. Run this against the codebase after Phase 1 fixes
   land, as a second opinion before trusting your own "done" claim.
   Install: `npx skills add kylezantos/design-motion-principles`, or
   manually: `git clone https://github.com/kylezantos/design-motion-principles.git`
   then copy `skills/design-motion-principles` into `.claude/skills/`.

5. **`LeonxInx/taste-skill`** — couldn't find this repository under that
   name or common case variants. Either the URL has a typo, it's private,
   or it's been renamed/removed. Double-check the link if you want it
   evaluated too.

6. **`emilkowalski/skills`** — real, verified, 29.9k stars, MIT license, by
   Emil Kowalski (ex-Vercel/Linear design engineer). Best fit for MaCo:
   `apple-design` (17 motion/material principles, reinforces the spring/
   damping rules already in `MACO_DESIGN.md`), `review-animations` and
   `improve-animations` (audit existing motion, produce a fix plan),
   `find-animation-opportunities` (also flags what *not* to animate).
   Install only the specific skills that fit, not the whole repo:
   ```
   npx skills add emilkowalski/skills --skill apple-design --agent claude-code
   npx skills add emilkowalski/skills --skill review-animations --agent claude-code
   npx skills add emilkowalski/skills --skill improve-animations --agent claude-code
   ```

## 10b. Four reference sites, mapped to MaCo sections (verified by fetch, not guessed)

**Non-negotiable rule for all four below and any future reference site:**
these are technique sources only. Never copy a reference site's actual
layout, color, or type as the target look — MaCo's own Obsidian/Cobalt
identity is the target, always. (This needed saying explicitly after a
request to copy Cuberto's site directly — that instruction was not
followed, for exactly the reasons `AGENTS.md` §1/§2/§33 already state.)

- **Cuberto** (`cuberto.com`) — WORK cards are muted autoplay video loops, not
  screenshots. Two-tier showreel: short clip for the hero, full clip behind
  "watch more." → Reuse for MaCo's WORK grid (Ananta/Al Afzah/Soorath/
  HeadGreen) and EVIDENCE's Bridge clip. Skip their invented-for-them stat
  block (15+ years, 300+ projects) — MaCo has no equivalent real numbers.
- **Iventions** (`iventions.com`) — numbered service showcase (`01–04`, big
  image + one line + link) and a dual-panel closing CTA (quote path vs
  general contact). → Reuse the numbered pattern for SERVICES (`01/02`,
  matches MaCo's actual 2 services). Reuse dual-CTA for CLOSE.
- **Uncommon Design Group** (`uncommondesign.group`) — the hero itself is
  real project video (Vimeo, mute/unmute, "Play reel"), not an abstract
  scene. Nav labels near-identical to MaCo's already. → Reopen
  `HOMEPAGE_REDESIGN_PLAN.md`'s abstract "dimensional material slab" hero
  concept against this: MaCo now has real Bridge footage, so a real-footage
  hero is worth testing against the synthetic one the plan assumed was
  necessary when no footage existed.
- **Minh Pham** (`minhpham.design`) — "What I do" capability grid (one
  plain sentence per capability) and a CLIENTS section that's just a name +
  one real sentence, no logos required. → Reuse the grid shape for
  CAPABILITY. Reuse name+sentence for CLIENTS. Do not reuse his
  joke-toggle copy or testimonial carousel — wrong tone for MaCo, and MaCo
  has no real testimonials to place there.

**Suggested order:** write/refine `MACO_DESIGN.md` (delivered) → run
`design-md-chrome` on 1-2 sites you admire purely for comparison, not
copying → Phase 0-1 bug fixes from §6 → run `design-motion-principles` in
audit mode → Phase 2 plan → Phase 3 implement.

---

## 10. Two more tools, verified this session

**GetLayers (`getlayers.ai`, by Textura Agency)** — real. A copy-paste prompt
library: Templates (full pages), 3D Scenes (standalone Three.js), Sections
(single blocks), Backgrounds (video loops). Every prompt outputs one
self-contained HTML file; paste it into an AI, get a working page. Their own
docs confirm every prompt is written and tested against **Claude Opus 4.8**
specifically — weaker models keep the structure but lose motion timing and
depth, which matches the model guidance in §5.

**Use it narrowly.** GetLayers layers are shared by every subscriber who
copies them — shipping one untouched on MaCo's homepage is the exact
"generic template" outcome `AGENTS.md` §2/§33 bans, just from a different
generator than the AI ones already rejected. Treat it the way `AGENTS.md`
§14 already treats React Bits: a technique source, not a source of shipped
identity.
- Good use: browsing the **3D Scenes** category for a raw Three.js technique
  (particle field, shader) to study and reimplement, heavily restyled to
  MaCo's tokens, inside the existing `PrismField`/raw-`three` setup.
- Bad use: pasting a Template or Section prompt and shipping the result as a
  MaCo page or section.

**`skillui` CLI** — shown mid-session in a "Claude for Designers" demo,
reverse-engineering `clay.com` into a Claude Skill package (`CLAUDE.md` +
`references/{ANIMATIONS,LAYOUT,COMPONENTS}.md` + a `screens/scroll/`
folder of scroll-position screenshots) with three source modes:
```
skillui --dir /path/to/project      # scan a local project
skillui --repo https://github.com/user/repo   # clone + scan a git repo
skillui --url https://example.com   # crawl a live site
```
This is real — it appeared running in the demo, not a claim from marketing
copy — but I could not independently verify the exact npm package name or
publisher this session, so don't blind-`npm install -g` it. Check
`npm search skillui` yourself, or the original video's description/bio for
the exact package, before running it. Same caution as `design-md-chrome`
applies to its output: reverse-engineer references for technique study, not
to clone a competitor's page as MaCo's own.

## 11. Phase 2 kickoff prompt — send only after Phase 1's two bugs are verified fixed

```
Before anything else: never copy a reference site's actual layout, color,
or type as a target to hit. Every reference site named below is a
technique source only — MaCo's own Obsidian/Cobalt identity from
CONTEXT.md/DESIGN.md is non-negotiable and stays the target look.

1. Install these skills (specific ones only, not full repos):
   npx skills add kylezantos/design-motion-principles --agent claude-code
   npx skills add emilkowalski/skills --skill apple-design --agent claude-code
   npx skills add emilkowalski/skills --skill review-animations --agent claude-code
   npx skills add emilkowalski/skills --skill improve-animations --agent claude-code
   Then run design-motion-principles and review-animations in audit mode
   against the current homepage. Report findings — don't fix anything yet.

2. **Done (2026-08-27).** `skillui` was never independently verified as a
   real installable package (see §10's caution), so this was done by hand:
   fetched all four sites live (Playwright `browser_navigate` +
   `browser_evaluate`, DOM/computed-style inspection, no screenshots) and
   wrote mechanism-only notes to `docs/references/<site-name>/NOTES.md`:
   `docs/references/cuberto/NOTES.md`, `docs/references/iventions/NOTES.md`,
   `docs/references/uncommondesign/NOTES.md`,
   `docs/references/minhpham/NOTES.md`. Each file records stack, structural
   patterns, motion mechanisms, an explicit "maps to MaCo" section citing
   real homepage sections from `CONTEXT.md` §10, and an "explicitly not
   taking" section — no palette, typeface, or copy from any of the four
   sites was recorded, per the non-negotiable rule above.

3. Using the two audits above plus the original Phase 0 findings, produce
   the Phase 2 plan (per the constraints already given: no new animation
   libraries, no invented copy/stats, Obsidian/Cobalt fonts stay separate,
   reduced-motion fallback for every cinematic moment, flag every
   asset-blocked section explicitly instead of shipping a placeholder).

Wait for my explicit approval before implementing anything.
```

## 12. Cuberto-foundation prompt — structure/motion mechanism, MaCo identity from the first build

**Status: reconciled 2026-08-27, then superseded 2026-08-28 by an actual
full structural clone.** This prompt was drafted before `homepage-reset`
(commits `5bcf9fb`..`9f3d6b4`) shipped a technique-level rebuild, which the
2026-08-27 reconciliation table below judged close enough to not redo. The
owner disagreed the next day and asked directly for what this prompt
originally asked for — Cuberto's actual section inventory, order, and
spacing/grid system, not just its techniques — and confirmed "full
structural clone" explicitly when asked to disambiguate. That rebuild is
now shipped; see "What actually happened (2026-08-28)" below the original
table, which supersedes every row in it. Kept below verbatim as a
historical record of what was asked; the 2026-08-27 table is kept for
history too, not as current status.

```
Rebuild the homepage using cuberto.com as the structural and motion
foundation — its section rhythm, hero energy, scroll pacing, and overall
kinetic feel are the reference. Use the notes already captured in
docs/references/cuberto/ from the earlier reverse-engineering pass.

Apply MaCo's own identity from this same build, not as a later pass:
- Typography: Obsidian = Unbounded/Jost/Agdasima, Cobalt = Michroma/Tenor
  Sans/Krona One — per CONTEXT.md §9 and DESIGN.md §3. Never Cuberto's
  actual typefaces at any point, even as a placeholder.
- Color: MaCo's own Obsidian/Cobalt tokens from styles.css. Never
  Cuberto's palette, even temporarily.
- Content: only real MaCo copy, projects, products, services, and clients
  from content/maco.ts. Never Cuberto's text, case studies, or client
  names, even as placeholder/lorem content.
- Ground sequence: OPEN starts on `deep` (dark), trending toward `paper`
  (light) by CLOSE — opposite of Cuberto's own light-to-dark order, using
  the existing deep/paper system already in the codebase.

Structural/motion elements to take from Cuberto specifically:
1. WORK section: muted autoplay video-loop cards (already approved).
2. Hero: bold, kinetic, type-driven energy in place of the current Prism
   concept. Propose 2-3 directions as previews before building all
   sections around one — I haven't picked a direction yet.
3. Client logo strip, numbered service showcase pattern, overall pacing
   and confidence of section transitions.

Do not add new animation/motion libraries — GSAP, Lenis, motion v13, and
raw three already cover everything Cuberto's site does technically. Do not
invent stats, testimonials, or claims not in content/maco.ts.

Output for this pass: the 2-3 hero direction previews (screenshots or a
local preview), plus a written plan for the full restructure. Do not build
past the previews until I pick a direction and approve the plan.
```

**What actually happened (reconciled 2026-08-27):**

| §12 asked for | Status |
|---|---|
| Rebuild the homepage on Cuberto's structural foundation | **Superseded.** `homepage-reset` already shipped the real rebuild — `ROADMAP.md`'s "Explicitly out of scope" list now names the current 11-section architecture as the intended shape, not a placeholder. Do not rebuild again on this premise. |
| Hero: type-driven energy "in place of the current Prism concept" | **Now done, executed as written.** Reopened 2026-08-27 by the Stage 1 hero-preview pass (this plan's own follow-up): three directions (Prism+type, type-driven-no-WebGL, Bridge-video-plate) were built on a throwaway dev route and screenshotted in both themes/mobile against measured Cuberto/Iventions/Uncommon Design/Minh Pham easing data. Type-driven-no-WebGL won — `prism-field.tsx` (`9121662`) is deleted, `open-logo.tsx` now uses an oversized ghost wordmark + `<RakingSurface>` instead. Video-plate was rejected: raw Bridge dashboard footage under `object-cover` read as generic-AI-SaaS chrome, exactly what `AI_HANDOFF.md` #8 warns against. |
| Ground sequence: deep→paper, opposite of Cuberto's light-to-dark | **Superseded** by `df915d5`'s 5-chapter regroup. Verified via `grep -n data-ground frontend/src/components/home/*.tsx` (2026-08-27): actual order is deep (OPEN) → deep (SURFACE) → paper (WORK/CLIENTS/CAPABILITY) → deep insets (PRODUCTS media) → deep (IDENTITY) → paper (METHOD/RECORD) → deep (CLOSE) — not a clean deep-to-paper trend. |
| WORK section: muted autoplay video-loop cards | **Scaffolding done 2026-08-27, footage still asset-blocked.** `Project.media` and `ProjectPlate`'s `ProductVideo` render path are wired (mirrors `Product`'s existing shape) — see `docs/MEDIA-GAP.md`. Only Bridge has real capture; the 4 client projects (Ananta, Al Afzah, Soorath, HeadGreen) are still `.webp` brand-mark stills and render unchanged until a project gets a real `media` value. Tracked in `docs/references/cuberto/NOTES.md`'s "Maps to MaCo" section. |
| Client logo strip, numbered service pattern, section pacing | **Done** as of 2026-08-27, then **superseded 2026-08-28** — `WorkReveal`/`ClientField`/`ServicesConvergence` were retired the next day for `logo-reel.tsx`/`feature-accordion.tsx`/`summary.tsx` (see below). |

**What actually happened (2026-08-28) — supersedes every row above.**

The 2026-08-27 table's central judgment — "the real rebuild already shipped
at the technique level, don't redo it structurally" — is what the owner
overrode directly: *"do exactly like the cuberto wesbite... change our
everything."* Asked to disambiguate, they chose a full structural clone over
deeper technique fidelity in the existing 11-section shape. Plan:
"Cuberto-parity homepage rebuild." Full detail in `CONTEXT.md` §10 (now the
authoritative section-by-section reference) and the dated entry in
`AI_HANDOFF.md`. Summary:

- Cuberto's actual section inventory and order were adopted — `TopHead`,
  `Overview`, `FeatureAccordion`, `LogoReel`, `Summary` (×2, one component
  two call sites), `Faq`, `Outro` replace `OpenLogo`, `WorkingSurface`,
  `WorkReveal`, `ClientField`, `ServicesConvergence`, `ProductShowcase`,
  `MethodLine`, `CloseIntake` — all eight retired outright, no longer in the
  tree.
- Cuberto's measured spacing/grid rhythm was adopted as literal tokens
  (`cb-section`/`cb-tophead`/`cb-cards` utilities, `--radius-chip/card/
  plate/pill`, `styles.css`), not approximated.
- The floor from the original §12 prompt (identity/color/content rules
  above) held exactly as written and was reconfirmed by the owner
  unprompted, in their own words, mid-request: *"but keep our 2 themes
  obsidian and cobalt."* No Cuberto hex value, typeface, or copy is
  anywhere in `frontend/src` — verified by grep as part of this pass's own
  checklist.
- Ground sequence changed again, now matching Cuberto's own alternation
  (`L L L L L · D · L L · D D`) rather than the deep→paper trend this
  prompt originally asked for — see `CONTEXT.md` §10's ground-sequence line.
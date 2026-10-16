# MaCo design refinement, 2026-10-15

## Working source and scope

Working repository: E:\\Downloads\\maco-website-v2. The existing homepage-reset branch was fast-forwarded from 08d49bf to origin/main c988e2f using git pull --ff-only origin main. The pre-existing CONTEXT.md edit about Bridge video encode size was retained. No history was rewritten. No commits were pushed and no hosting configuration was changed.

The older source export at E:\\Downloads\\maco-website\\maco was used only as a preparation area after the owner corrected the working directory. The rejected abstract character image is not used in the website.

## Audit and design decisions

- Keep the actual MaCo mark, existing routes, client work, two service lines, Obsidian/Cobalt themes and their different type families.
- Replace the oversized text-only opening with a concise statement and a real Bridge dashboard. Its board switch demonstrates actual product UI.
- Remove the separate long pinned Bridge reel from the homepage. Real Bridge media now appears in an interactive product chapter, with optional film playback.
- Keep the multilingual identity moment. Shorten its desktop pin and use natural, unpinned scrolling on mobile.
- Replace About's timed profile carousel with person-controlled interaction. Use eight human character portraits derived from the actual supplied team photographs; preserve all current names, roles and biographies.
- Give Bridge the lead product treatment. Describe Driver's Diary as built for HeadGreen, rather than calling both products MaCo-owned.
- Use real screens and product evidence in place of invented statistics or mock dashboards.

Design dials: variance 9, motion 8 for signature interactions, density 3. Existing brand architecture takes precedence over generic palette or typography recommendations.

## Reference research

Reviewed the owner-supplied reference catalogues and component libraries:
- https://www.awwwards.com/
- https://www.cssdesignawards.com/
- https://dribbble.com/tags/award-winning-website
- https://reactbits.dev/ and its tilted-card technique
- https://ui.aceternity.com/ and its animated-tooltip technique
- https://skiper-ui.com/
- https://uiverse.io/
- https://ui.spectrumhq.in/
- https://ui.shadcn.com/
- https://github.com/emilkowalski/skills/tree/main/skills/apple-design

Also inspected https://clay.global/ visually and https://linear.app/ for product presentation. Applied clear editorial hierarchy, product proof, direct feedback and physical pointer movement. Rejected library stacking, decorative particle backgrounds, copied templates, new fake products, fabricated testimonials and long scroll gates. No animation library was added.

Instagram pages could not be retrieved through web research. The owner's supplied public links are retained as direct links in the footer:
- https://www.instagram.com/maco.codes/
- https://www.instagram.com/bridge.maco/

## Verified product content and media

Bridge: projects, task ownership/priorities/checklists, project conversations, calendar, role-aware access, progress/workload views, AMC contracts/planned visits/service tasks/renewal history. Source: current D:\\TaskFlow frontend implementation and the scoped product research. No enabled-AI, dispatch, GPS, invoicing, savings or automatic-renewal claims were added.

Real Bridge screenshots:
D:\\TaskFlow\\brag-output\\composition\\assets\\screens\\desktop-home.png
D:\\TaskFlow\\brag-output\\composition\\assets\\screens\\desktop-board.png
D:\\TaskFlow\\brag-output\\composition\\assets\\screens\\mobile-home.png

The source README.md and ASSET_LEDGER.md document fictional fixtures, real frontend captures, no customer backend access and blocked external requests. Optimized outputs are public/media/bridge/tour-{home,board,mobile}.webp. The tour visibly identifies the demo workspace.

Film source:
D:\\TaskFlow\\promo-production\\bridge-teaser-20261004-v2\\brag.mp4 and brag.jpg.
20-second illustrative film, original music and CC0 UI sounds documented by CREDITS.md. It is fetched only when the visitor opens the film. The landscape video with CC BY music was not imported.

Driver's Diary: verified against D:\\HG source for ride capture/vehicle selection, offline synchronization, charging expenses and reporting. Existing real on-device recording stays in use. HeadGreen ownership stays explicit.

## Human avatar assets

Built-in ImageGen generated two transparent 2x2 human character sheets from the eight existing founder photographs. They are stylized interpretations, with original photographs available through the Portraits control.

Outputs:
- frontend/public/media/team/characters-a.webp
- frontend/public/media/team/characters-b.webp

Source generated images:
- exec-0a17a464-7763-42a7-bf54-c9cc1d46f1eb.png
- exec-a43fecdd-4e69-4430-9c53-310bf23037b8.png

Generation brief: preserve the source order, recognizable hair, facial hair, skin tone, glasses/caps/headphones and clothing; make friendly premium 3D human upper-bust characters in an animated-film/Memoji style, with consistent lighting, no text, no logos and transparent backgrounds. Sheet A contains the first four team members. Sheet B contains the remaining four and uses sheet A as a style reference. Artwork was optimized to WebP without modifying the original photographs.

Interaction: independent pointer springs, selected-person lift, click/tap/keyboard profiles, Characters/Portraits switch. No idle timer changes a profile while it is being read. Mobile biographies appear under the selected person. Reduced motion removes the physical movement.

## Reliability fixes

- Intro auto-dismisses after readiness, with a 1.6-second upper bound and immediate Enter/Escape paths.
- Dismissal synchronously prevents a pending runtime import from reacquiring the scroll lock.
- Intro timers and locks clean up, and focus returns to main content.
- Scroll scenes respond to live motion-preference changes; runtime construction rechecks the preference after lazy imports.
- A null runtime result can be retried when full motion returns.
- Storage-denied environments retain a working theme and system motion preference.
- Collapsed accordion panels are inert and hidden from the accessibility tree. Disclosure state is click/tap controlled and refreshes scroll measurements after layout settles.
- Overlay focus targets buttons, fields and video controls; cleanup restores trigger focus.
- Video lightboxes render in a portal to avoid transformed-ancestor clipping.
- Gallery/video controls are outside work-card navigation links.
- Native scroll position is visible again.
- Primary navigation uses readable body text and a shorter header.

## Validation

- Production build: `bun run build` passed after the final source change.
- TypeScript: `node node_modules/typescript/bin/tsc --noEmit` passed.
- Lint: `bun run lint` passed with 0 errors and 3 existing react-refresh warnings (layout-mode.tsx, product-video.tsx, theme.tsx).
- `git diff --check` passed.
- Production browser: all 16 routes at 375px in Cobalt had one H1, no horizontal overflow and no broken loaded images.
- Home/About/Products also passed layout checks at 768px and 1024px; the desktop hero and team were inspected at 1440px. Both theme treatments were visually inspected.
- Verified team selection, mobile inline biography, original-portrait switch, Bridge tab click/ArrowRight, film open/Escape/scroll unlock/focus return, and mobile navigation/Experience.
- Full-motion homepage scroll and client navigation away from a pinned scene passed, with no production console errors. Reduced-motion homepage had no pin spacers or scroll lock; About profiles remained usable. Restored full motion after testing.
- Existing lazy globe bundle-size advisory remains. Formal Lighthouse, automated contrast and physical-device testing were not run.

Exact final check results are also recorded in PROJECT_STATUS.md and AI_HANDOFF.md. Existing lint warnings concern mixed component/helper exports in layout-mode.tsx, product-video.tsx and theme.tsx. The existing lazy globe bundle still produces a bundle-size advisory.

No deployment was performed. Source changes remain reviewable and uncommitted.

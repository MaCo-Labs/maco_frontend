# MaCo design refinement — 2026-10-16

## Current result

Working repository: E:\Downloads\maco-website-v2, branch homepage-reset, base c988e2f (main pulled with --ff-only). Changes are local, uncommitted and unpushed. No deployment or hosting decision. The prior CONTEXT.md media-size edit is preserved.

The owner asked for stronger execution of the design research, then clarified that the hero must represent the software company as a whole, rather than primarily Bridge. This pass supersedes the earlier Bridge-led opening described in DESIGN_REFINEMENT_2026-10-15.md. All existing company routes, real projects, product ownership, branding and two themes remain.

## Audit → plan → implementation

Observed weaknesses: the opening over-weighted one product; repetitive equal project cards and multiple automatic WebGL galleries diluted the work; services were a long generic accordion; small service copy and some reveal timing impeded reading; reduced motion could leave adaptive navigation using stale colours.

Plan: reuse the existing React/Motion/GSAP architecture; build one company-wide interactive opening; connect the two actual service lines to delivered work; use an editorial project collection; adapt the requested device frames; verify actual layouts and complete interaction cycles. No new runtime package was necessary.

Implemented:

- **Company-wide hero:** “Built around your business.” A pointer-responsive desk of real browser and phone screens, with explicit Websites / Business software / Mobile platforms tabs. Default view is Ananta Nethralaya. Bridge is one selectable example; Driver’s Diary remains labelled as built for HeadGreen. Arrow keys/Home/End work; there is no automatic carousel timer. CTAs and the two actual service-line links stay clear.
- **Service explorer:** Business Software and Digital Solutions, with keyboard selection, actual content-model capabilities, and related real screens. Shared by Home and Services. Motion responds immediately, with no wait for an outgoing transition. Capability descriptions remain visible in the selected service rather than requiring seven separate disclosures.
- **Editorial work collection:** unequal 7/5 and 5/7 compositions, a separate full-width brand/print item for Ozone, real website screenshots and a second view on hover/focus. Whole project links are usable; no controls are nested in links. Shared by Home and Work. The homepage no longer runs five WebGL project galleries simultaneously; detailed galleries remain on project pages.
- **Readable content:** shorter one-shot reveals, live reduced-motion cleanup for SplitText, accurate “client projects” counting (Ozone is a brochure), and a trust headline that does not call every engagement production software.
- **Adaptive chrome:** native IntersectionObserver tracking for reduced motion, runtime tracking reattached after preference/route changes, mobile dock sampled at its actual bottom position.

## Device frames and truthful media

Adapted the official MIT-licensed Magic UI Safari and iPhone source, without installing a component framework:

- https://magicui.design/docs/components/safari
- https://magicui.design/docs/components/iphone
- https://raw.githubusercontent.com/magicuidesign/magicui/main/apps/www/registry/magicui/safari.tsx
- https://raw.githubusercontent.com/magicuidesign/magicui/main/apps/www/registry/magicui/iphone.tsx

License retained at docs/licenses/magicui.txt. Local frame files document provenance. SVG masks and clip paths use React useId values to prevent collisions between multiple devices. Media is rendered as real DOM, avoiding SVG foreignObject video problems. The iPhone content has space below the decorative island so the supplied screen’s header is not obscured. These frames are presentation mockups, not claims of native iOS applications.

Bridge uses the verified TaskFlow demo captures from the previous pass. Full Bridge screenshots use contain fitting rather than being cropped; demo-workspace labels remain. Its three tour views use Safari for desktop and iPhone for mobile.

Driver’s Diary now uses public/media/products/drivers-diary/interface.webp, extracted at 4 seconds from the repository’s existing screen.mp4 recording. This is a real filters/export interface, replacing the opening logo as the poster. The source video and original poster are unchanged. No UI was fabricated. Its walkthrough has Play/Pause controls, observes visibility and pauses offscreen or when the page is hidden. Autoplay remains subject to reduced-motion/device/network policy; explicit user playback is available.

## Design research applied

The earlier research ledger contains the Awwwards, CSS Design Awards and component-library review. This pass rechecked https://clay.global/ and https://linear.app/ for editorial proof, product presentation and clear content hierarchy, then reviewed the owner’s Magic UI references and official source.

Adopted: distinctive hierarchy, asymmetry, real project evidence, interruptible pointer springs, clear selected states, tasteful device presentation and readable static fallbacks.

Rejected: copied agency templates, fake metrics/awards/testimonials, decorative particle fields, a library stack, timed reading interruptions and long pinned reveal gates. Existing Obsidian and Cobalt typography/palettes remain distinct. Human character portraits from the prior pass remain in About, with the original-photo switch and person-controlled biographies.

## Validation and limits

- Production build passed after the final source change.
- TypeScript --noEmit passed after the final source change.
- Lint passed with 0 errors and 3 existing react-refresh warnings: layout-mode.tsx, product-video.tsx and theme.tsx.
- All 16 routes were checked at 1440px and 375px in both themes (64 route/layout checks): one H1, no horizontal overflow, no broken loaded images, no nested links/buttons/inputs. The final hero/device changes were then rechecked separately.
- The new hero was inspected at 1440px and checked at 1280, 1024, 768, 430, 390 and 375px. Both themes were checked. The primary CTA remained within the initial viewport at the measured breakpoints.
- Final product index and both product details were rechecked on mobile. Service selection was tested on desktop and mobile, including ArrowLeft. Hero selection was tested with click and ArrowRight; no duplicate SVG IDs were found.
- Bridge mobile capture loaded successfully inside the iPhone frame. Film open/Escape restored the trigger focus and released body overflow. Driver’s Diary playback and pause were verified.
- Reduced-motion Home had zero pin spacers and no body scroll lock. After scrolling onto paper, header ground correctly read paper. Full motion was restored after testing.
- Alternative mobile layout 2 navigation opened/closed with scrolling released; layout 3’s Site navigation reached Services. Both had no horizontal overflow.
- Production console-error checks returned no errors.

Existing lazy-globe bundle-size advisory remains. Formal Lighthouse, automated contrast scoring and physical-device testing were not performed. Browser checks are evidence for the inspected states, not a claim of award certification or universal perfection.

No release action remains within this local implementation scope. Review the diff before any later commit, push or deployment, and preserve Lovable’s published history.

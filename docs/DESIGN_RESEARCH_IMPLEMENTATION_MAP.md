# MaCo design research: implementation and remaining opportunities

Updated 2026-10-16. Working checkout: E:\Downloads\maco-website-v2. This ledger distinguishes shipped source changes from optional future work. Library references informed technique choices; they are not a list of installed packages or a claim of awards.

## Implemented in this refinement

| Area | Result | Research fit |
| --- | --- | --- |
| Home introduction | Company-wide headline and layered real browser/phone screens. Websites, business software and mobile categories rotate every 6.5 seconds; each return advances that category's example. No slideshow buttons or counter, per owner request. Hover, keyboard focus, hidden document, offscreen state and reduced motion suspend rotation. | Apple-style spatial continuity and physical springs; React Bits tilt concept, implemented with existing Motion. |
| Website examples | Ananta, Al Afzah, Soorath and HeadGreen main pages. HeadGreen uses capture 2; capture 1 was a loading screen. Caption, destination and browser address match each example. | Portfolio evidence rather than a generic decorative dashboard. |
| Mobile examples | Driver's Diary and Bridge mobile use actual captured interfaces. | Requested Magic UI iPhone source adapted with safe screen positioning. |
| Services / Home | Two-line service explorer with selected capabilities, relevant real evidence and direct service links. | Progressive disclosure and clear selection instead of a long equal-card catalogue. |
| Work / Home | Asymmetric editorial collection of actual projects; five simultaneous WebGL galleries removed from the homepage. | Award-gallery references informed rhythm, hierarchy and image scale. |
| Work details | Chaptered Challenge / Solution / Outcome story, desktop sticky chapter navigation and active chapter feedback. Mobile keeps all chapters in a normal reading flow. Existing text and galleries remain. | Aceternity timeline informed a restrained reading spine; no package or scroll gate added. |
| Products / Bridge | Real workspace/board/mobile tour, optional real film, stronger Bridge emphasis. Safari screen follows the native 3:2 image ratio and fills the frame without side gutters, cropping or stretching. | Official Magic UI Safari and iPhone references adapted under MIT. |
| About | Eight human character portraits derived from actual team photos, spring tilt, selected profile, original-photo toggle and inline mobile biography. | Bespoke identity and physical feedback. These are interactive illustrations, not rigged facial animations. |
| Contact | With no contact API configured, the form says Continue in WhatsApp and explains that the visitor must review/send the draft there. It no longer reports a backend error after opening WhatsApp. | Explicit handoff and truthful feedback. No external enquiry was submitted during QA. |
| Shared experience | Bounded intro, scroll/overlay cleanup, reduced-motion fallbacks, keyboard selection, readable adaptive navigation and mobile flow fixes. | Motion is subordinate to reading and navigation. |

## Source references and decisions

- [Magic UI Safari](https://magicui.design/docs/components/safari) and [iPhone](https://magicui.design/docs/components/iphone): source adapted; license retained in docs/licenses/magicui.txt. No runtime library added.
- [React Bits tilted card](https://reactbits.dev/components/tilted-card): conceptual reference for pointer depth; reimplemented with installed Motion. No OGL runtime added.
- [Aceternity timeline](https://ui.aceternity.com/components/timeline): conceptual reference for case-study chapters. Existing content stays readable without motion or JavaScript-driven scroll gates.
- [shadcn carousel](https://ui.shadcn.com/docs/components/carousel): reviewed explicit carousel interaction. Owner subsequently requested removal of slideshow controls; category tabs, hover/focus suspension and reduced-motion behavior remain.
- [Awwwards](https://www.awwwards.com/), [CSS Design Awards](https://www.cssdesignawards.com/) and [Dribbble](https://dribbble.com/tags/award-winning-website): visual research for editorial hierarchy, composition and project-led identity, not evidence that MaCo has won awards.
- [Skiper](https://skiper-ui.com/), [Uiverse](https://uiverse.io/) and [Spectrum](https://ui.spectrumhq.in/): catalogue exploration; no component adopted. Their visual language did not justify additional packages or competing effects.

## Optional next opportunities, not implemented claims

| Page | Best-fit next change | Acceptance / constraint |
| --- | --- | --- |
| Products | A deeper task-to-project-to-service walkthrough if the owner supplies additional verified product states. | Use real captures and documented capabilities only; keep visitor control and mobile readability. |
| Clients | A selected-client view connecting each client to its existing delivered work. | Keyboard and tap parity; no invented testimonials, results or logos. Current roster and project links remain usable. |
| About | Bespoke blink/greeting animation built from properly rigged artwork or sprite assets. | Current illustrations cannot honestly be described as rigged human animations. Avoid uncanny facial distortion and keep a still fallback. |
| Contact | Verify production delivery after the owner chooses and configures the backend/deployment environment. | Test with owner-approved test contact details. Current QA intentionally does not send an external message. |
| All pages | Formal Lighthouse, automated contrast and physical-device audits. | Current browser/build checks are not a substitute for these audits. |

Rejected: demo-component collage, decorative particle fields, duplicate WebGL runtimes, fake code terminals, fabricated metrics/awards, automatic before/after comparisons without source assets, and the previously declined global Signal Rail. The current work strengthens real MaCo evidence rather than adding effects for their own sake.

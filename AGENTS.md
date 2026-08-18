AGENTS.md — MaCo Website AI Development Guide

Persistent operating instructions for OpenCode, Cursor, Claude Code, Antigravity, Gemini, DeepSeek, GLM, Nemotron, and other coding agents working on the MaCo website.

Core workflow: AUDIT → PLAN → VALIDATE PLAN → IMPLEMENT → TEST → QA → DOCUMENT → HANDOFF.


1. PROJECT IDENTITY

Company

MaCo

MaCo is a software / IT solutions company.

Tagline:

SOLUTIONS. TECHNOLOGY. GROWTH.

The website is MaCo's premium company/portfolio website. Its goals are:

present MaCo professionally;

showcase real completed client projects;

showcase MaCo's own products;

explain services;

communicate technical credibility without fake claims;

create a distinctive brand experience;

generate project/contact enquiries.

The website must feel like a real technology company, not an AI-generated template.

2. DESIGN NORTH STAR

The site must be:

premium

technical

distinctive

confident

humble

editorial

modern

memorable

responsive

accessible

performant

It must NOT feel like:

AI boilerplate

generic SaaS

generic agency template

Lovable demo

Framer clone

React Bits showcase

animation gallery

excessive glassmorphism

excessive gradients/glows

"more effects = better design"

Fundamental rule

MaCo identity first. Effects second.

Every effect/component must answer:

Does this make MaCo more recognizable, useful, premium, or memorable?

If not, reject it.

3. SOURCE-OF-TRUTH ORDER

When sources conflict:

actual source code and runtime behavior

actual repository content/data

AI_HANDOFF.md

PROJECT_STATUS.md

CONTEXT.md

ROADMAP.md

DOCS.md

README.md

this AGENTS.md

old AI conversation/history

Never trust a documented completion percentage without inspecting the code.

If docs conflict with code:

inspect;

determine the real state;

update docs.

4. REQUIRED FIRST READ

Before making changes, read:

AGENTS.md

AI_HANDOFF.md

PROJECT_STATUS.md

CONTEXT.md

ROADMAP.md

DOCS.md

README.md

Then inspect:

package.json

repository structure

current git status

current routes

styles

content/data

animation system

theme system

backend integration

At minimum inspect the existing Hero, SystemField, multilingual section, navigation, theme components, content model and route structure.

Do not start coding until the existing implementation is understood.

5. PLAN-FIRST PROTOCOL — MANDATORY

For any substantial task:

Step 1 — AUDIT

Determine:

what exists;

what works;

what is broken;

what is partial;

what must be preserved;

what should change;

dependencies;

risks;

performance implications;

responsive implications;

accessibility implications.

Step 2 — PLAN

Create a concrete plan BEFORE editing production code.

For every phase include:

objective

files likely affected

implementation approach

dependencies

risks

validation

completion criteria

Step 3 — CHALLENGE THE PLAN

Ask:

Can existing code be reused?

Is this refactor necessary?

Are we adding unnecessary dependencies?

Are we duplicating animation systems?

Will this hurt SSR/hydration?

Will this hurt mobile?

Will this hurt accessibility?

Will this hurt performance?

Are we using React Bits merely because it is available?

Does this strengthen MaCo identity?

Remove unnecessary work.

Step 4 — IMPLEMENT

Implement one phase at a time.

Step 5 — TEST

Test after meaningful phases.

Step 6 — QA

Perform runtime and visual QA.

Step 7 — DOCUMENT

Update project-state documents.

6. CURRENT TECHNICAL DIRECTION

Frontend

Target/current direction:

React

TypeScript

Vite

Tailwind CSS

Motion

React Bits selectively

The existing repository may use TanStack Start / TanStack Router. Preserve the current architecture unless there is a demonstrated problem.

Do not migrate frameworks merely for preference.

Backend

Django

Django REST Framework

Django Admin

PostgreSQL target

Django Admin is intended to be the internal content-management interface.

Hosting options

Frontend:

AWS Amplify

Vercel

Netlify

Backend:

AWS EC2

Railway

Render

Do not change hosting architecture unless explicitly required.

7. REAL PROJECTS

These are real completed MaCo projects.

Ananta Nethralaya

Website for an eye clinic.

https://www.anantanethralaya.org/

Al Afzah

Website for a Qatar-based construction company.

https://www.al-afzahgroup.com/

Soorath Autos

Website for a used-car dealership / pre-owned car showroom.

https://www.soorathautos.in/

HeadGreen

Website for an EV fleet / corporate EV cab service in Kerala, Kochi.

https://headgreen.in/

Do not invent project metrics, testimonials or claims.

8. REAL PRODUCTS

Driver's Diary

PWA for HeadGreen operational management.

Scope includes:

attendance

rides

payroll

documentation

reports

operational management

Current deployment:

https://prod.d25ny7hdw64pgk.amplifyapp.com/

Bridge

MaCo's own product.

Modern SaaS/PWA/Desktop platform for:

task/project implementation

administration

users

project analysis

task assignment

team collaboration

productivity workflows

Current deployment:

https://prod.ddklo8cltmn7o.amplifyapp.com/

Bridge deserves stronger presentation because it is MaCo's own product.

Do not invent undocumented functionality.

9. SERVICES

Current services:

Web Development

App Development

Technical Support

Software Support

Social Media Managing

Do not invent additional services or fake capabilities.

10. NO FABRICATED CONTENT

Never invent:

clients

testimonials

awards

certifications

revenue

employee counts

customer counts

years of experience

partnerships

performance metrics

case-study results

rankings

"industry leader" claims

Use actual project/product information.

If information is missing:

use neutral copy;

prepare a CMS field;

or flag it.

11. SITE INFORMATION ARCHITECTURE

Primary areas:

Home

Services

Work / Projects

Products

Clients

About

Contact

Desktop navigation should remain concise/editorial.

Primary CTA:

START A PROJECT

12. TWO THEME SYSTEM

There are two official themes.

OBSIDIAN

Feel:

architectural

monochrome

technical

quiet

editorial

precise

Visual direction:

near black

white

neutral gray

subtle borders

restrained grid

subtle atmosphere

Avoid:

purple AI glow

excessive neon

generic glass effects

noisy backgrounds

COBALT

Feel:

kinetic

energetic

technical

confident

modern

expressive

Visual direction:

deep cobalt

white

controlled blue accents

slightly more active atmosphere

Do not implement Cobalt as simply "Obsidian with blue background."

Theme differences may affect:

typography emphasis

SystemField

atmosphere

button behavior

background motion

interaction intensity

section transitions

accents

Both themes must still clearly be MaCo.

13. TYPOGRAPHY

Approved font families:

Bricolage Grotesque

Anybody

Syne

Instrument Sans

Geist

IBM Plex Sans

Do not use all six indiscriminately.

Obsidian

Preferred:

display: Bricolage Grotesque

alternative display: Syne

body: Instrument Sans

technical: IBM Plex Sans

accent: Anybody

utility: Geist

Cobalt

Preferred:

display: Anybody

alternative: Bricolage Grotesque

body: Geist / Instrument Sans

technical: IBM Plex Sans

accent: Syne

Create deliberate hierarchy.

Do not force Latin fonts onto scripts they do not support.

14. HERO — SIGNATURE MACO EXPERIENCE

The Hero is the highest-priority visual area.

The intended concept:

                MACO SYSTEM FIELD
              ┌────────────────────┐
              │                    │
              │   EXACT MACO       │
              │   LOGO GEOMETRY    │
              │                    │
              └────────────────────┘

MA
CO

Software and IT solutions...

CTA

On scroll:

typography transforms
        ↓
SystemField responds
        ↓
grid responds
        ↓
logo geometry becomes active
        ↓
Hero transitions into next section

The experience should feel like:

THE MACO SYSTEM IS ACTIVATING.

It must NOT feel like the Hero is disappearing.

15. HERO DULLNESS BUG — CRITICAL

The previous Hero implementation has a known visual problem:

During the scroll sequence, too much of the Hero becomes dull/dim/faded.

Do NOT solve this by simply increasing global opacity.

Do NOT use:

Hero opacity → 0

as the primary transition.

Animate independent layers:

background

MA

CO

eyebrow

description

CTA

SystemField

grid

active cells

counts

atmosphere

next-section entrance

MA / CO and CTA must remain readable and visually strong.

16. HERO SCROLL TIMELINE

0–20%

stable

MA / CO dominant

SystemField restrained

copy readable

CTA clear

20–45%

typography subtly transforms

SystemField responds

grid becomes more active

45–70%

SystemField becomes a stronger visual anchor

MA / CO remains strong

pointer interaction can increase

70–90%

composition transforms

typography moves/repositions

SystemField transitions

next section begins entering

90–100%

clean transition

no abrupt fade

no muddy intermediate state

Avoid global fade-out.

17. MACO SYSTEM FIELD

SystemField is a core MaCo signature component.

It is NOT disposable.

It should combine:

technical grid

exact MaCo logo geometry

pointer response

scroll response

theme-specific treatment

Hero transition state

The logo must remain recognizable in:

idle state

pointer state

scroll state

theme state

transition state

18. EXACT MACO LOGO GEOMETRY

The actual supplied MaCo logo is the source of truth.

Do NOT settle for a generic M-like grid.

Do NOT invent a new logo.

Do NOT approximate from memory when the real asset/reference is available.

Important visual characteristics:

two raised upper blocks

two main lower/vertical structures

distinctive central negative space

rounded geometry

continuous M-like silhouette

controlled proportions

If a clean SVG/vector asset exists:

reuse it.

If not:

create precise SVG/CSS geometry from the supplied reference.

A grid may be the interaction layer, but its active geometry must reproduce the actual MaCo mark.

19. SYSTEMFIELD POINTER BEHAVIOR

Desktop only.

Allowed:

subtle brightness

subtle scale

slight translation

local line intensity

local emphasis

Avoid:

chaos

random particles

violent displacement

geometry destruction

The user must always perceive MaCo.

20. SYSTEMFIELD SCROLL BEHAVIOR

Scroll may control:

intensity

brightness

scale

grid emphasis

active-cell emphasis

transition state

Prefer:

CSS variables

SVG

transforms

opacity

efficient animation loops

Avoid unnecessary React state updates every frame.

21. REACT BITS

Official library:

https://reactbits.dev/

React Bits is approved for selective use.

It is NOT the MaCo design system.

For every candidate:

inspect current official documentation

check compatibility

check dependencies

check accessibility

check mobile behavior

check performance

check MaCo fit

decide USE or REJECT

Document significant decisions.

Potential current categories include:

Background / Hero

Cursor Grid

Threads

Grid Motion

Grid Scan

Shape Grid

Strands

Soft Aurora

Aurora

Beams

Floating Lines

Dot Field

Lightfall

Ferrofluid

Border Glow

Radar

Line Waves

Typography

Split Text

Scroll Reveal

Scroll Velocity

Variable Proximity

Shiny Text

True Focus

Text Pressure

Text Type

Shuffle Text

Curved Loop

Circular Text

Logo Loop

Cards / Work

Spotlight Card

Tilted Card

Chroma Grid

Scroll Stack

Navigation

Pill Nav

Buttons

Specular Button

Do not use all of them.

One strong effect is better than five competing effects.

22. REACT BITS — LICENSE RULE

Use freely available/open-source components.

If a component is locked/proprietary and the project has no applicable license:

DO NOT bypass licensing.

Use:

free alternative

existing implementation

original MaCo implementation

instead.

23. SPECULAR BUTTON

Evaluate the official React Bits Specular Button:

https://reactbits.dev/components/specular-button

Use it selectively for:

Start a Project

Selected Work

Explore Bridge

Contact

Do not use it on every button.

Prefer a reusable MaCoSpecularButton wrapper if needed.

Requirements:

keyboard accessible

focus visible

touch friendly

reduced-motion support

Obsidian styling

Cobalt styling

24. MULTILINGUAL MACO IDENTITY

This is a required signature brand section.

Concept:

ONE NAME. MANY SCRIPTS.

It is:

not a language selector

not a translation tool

not a language chart

It is a visual expression of MaCo across writing systems.

25. REQUIRED INDIAN LANGUAGES

At minimum:

Malayalam:മാകോ

Tamil:மாகோ

Telugu:మాకో

Kannada:ಮಾಕೋ

Hindi:माको

Bengali:মাকো

Marathi:माको

Odia:ମାକୋ

Recommended additional Indian/South Asian representation:

Gujarati:માકો

Punjabi:ਮਾਕੋ

Assamese:মাকো

Urdu:ماکو

Do not overload the visual design simply to increase the count.

26. OTHER SCRIPTS

Arabic:ماكو

Persian:ماکو

Hebrew:מאקו

Russian/Cyrillic:Мако

Ukrainian:Мако

Greek:Μάκο

Japanese:マコ

Korean:마코

Chinese:玛科

Thai:มาโก

27. INTERNATIONAL LATIN LANGUAGES

For Latin-script languages, keep the brand name:

MaCo

Examples:

English

French

Spanish

Portuguese

Italian

German

Dutch

Swedish

Norwegian

Danish

Polish

Czech

Turkish

Romanian

Do NOT pretend that MaCo has been translated into these languages.

The visual distinction comes from scripts, typography, movement and composition.

28. MULTILINGUAL FONT RULE

Use proper Unicode/script-compatible fallback fonts.

Do not force the six MaCo Latin fonts onto unsupported scripts.

Verify:

Malayalam

Tamil

Telugu

Kannada

Devanagari

Bengali

Marathi

Odia

Gujarati

Gurmukhi

Arabic

Persian

Urdu

Hebrew

Cyrillic

Greek

Japanese

Korean

Chinese

Thai

No missing glyph boxes.

No incorrect fallback.

No broken RTL.

29. MULTILINGUAL ANIMATION

The section should be scroll-driven and memorable.

Target:

GLOBAL IDENTITY / 01

ONE NAME.
MANY SCRIPTS.

             MaCo

മാകോ
माको
மாகோ
మాకో
ماكو
Мако
Μάκο
マコ
마코
玛科
MaCo
...

Scroll:

Phase 1

scripts appear.

Phase 2

groups move at different velocities.

Phase 3

scripts travel through the composition.

Phase 4

layers converge.

Phase 5

central MaCo becomes dominant.

Phase 6

resolve to:

MaCo

ONE NAME. MANY SCRIPTS.

Then transition into Services.

Potential React Bits tools:

Scroll Velocity

Scroll Reveal

Variable Proximity

Split Text

Curved Loop

Circular Text

Shuffle Text

Text Pressure

Text Type

True Focus

Logo Loop

Select only what produces the best result.

30. MULTILINGUAL MOBILE

On mobile:

remove pointer effects

reduce movement complexity

preserve scroll choreography

prevent horizontal overflow

maintain glyph readability

avoid showing too many simultaneous scripts

Mobile is an intentional composition, not a shrunken desktop.

31. MOBILE NAVIGATION

Desktop navigation remains editorial.

Mobile uses a floating pill navigation.

Required:

Home

navigation links

theme switch

CTA

Escape to close

focus management

keyboard support

Evaluate React Bits Pill Nav if it materially improves the current implementation.

Never sacrifice accessibility for appearance.

32. MOTION HIERARCHY

Use three motion levels.

Level 1 — Utility

hover

simple reveals

small transitions

Level 2 — Section

scroll movement

card interaction

section transitions

Level 3 — Signature MaCo

Reserved primarily for:

Hero/SystemField

Multilingual Identity

Do not make every section a visual spectacle.

33. WORK / PROJECT PRESENTATION

Projects:

Ananta Nethralaya

Al Afzah

Soorath Autos

HeadGreen

Potential React Bits:

Spotlight Card

Tilted Card

Chroma Grid

Scroll Stack

Use only if they improve the actual content.

34. PRODUCT PRESENTATION

Products:

Driver's Diary

Bridge

Bridge should receive stronger visual treatment.

Potential:

product UI previews

system visualization

scroll-linked feature progression

interactive cards

Do not invent features.

35. SERVICE PRESENTATION

Services:

Web Development

App Development

Technical Support

Software Support

Social Media Managing

Presentation should be clear, credible and restrained.

36. BACKEND / CMS DIRECTION

Django Admin is the internal CMS/control surface.

Backend should support, as needed:

projects

products

services

clients

images

galleries

screenshots

descriptions

external links

ordering

featured status

contact submissions

site content

Do not over-engineer fields before the frontend/content requirements justify them.

When changing Django:

inspect models

inspect serializers

inspect views

inspect URLs

inspect admin

inspect migrations

Never create destructive migrations blindly.

37. FRONTEND/BACKEND SEPARATION

Frontend:

presentation

theme

animation

responsive behavior

interaction

Backend:

data

content

persistence

admin

APIs

Do not put unnecessary data/business logic inside presentation components.

38. PERFORMANCE

Prefer:

CSS

SVG

transforms

opacity

CSS variables

Use Canvas/WebGL only when justified.

Avoid:

per-frame React state

unnecessary DOM measurements

multiple animation libraries

multiple heavy backgrounds

huge particle fields

offscreen animations running continuously

Lazy-load heavy effects.

Use intersection/visibility strategies where practical.

Maximum principle:

One major atmospheric effect per major viewport.

39. DEPENDENCY DISCIPLINE

Before adding a dependency:

inspect package.json

see if existing tooling already solves it

assess bundle cost

assess compatibility

assess maintenance

Do not add GSAP, Lenis or another animation framework simply because it is popular.

Reuse existing Motion infrastructure when practical.

40. ACCESSIBILITY

Required:

semantic headings

keyboard navigation

visible focus

accessible buttons

accessible links

accessible mobile menu

accessible theme switch

accessible CTA

meaningful labels

reduced-motion support

No interaction may require a mouse.

41. REDUCED MOTION

For:

prefers-reduced-motion: reduce

simplify/disable:

major scroll transforms

pointer effects

animated backgrounds

large typography motion

unnecessary transitions

Keep:

content

navigation

CTA

hierarchy

recognizable SystemField

42. RESPONSIVE QA

Test at minimum:

1440+

1280

1024

768

430

390

375

360

Check:

Hero

SystemField

logo

desktop nav

mobile pill

buttons

multilingual section

work

products

services

footer

No:

horizontal overflow

clipped CTA

broken glyphs

overlapping animation

unreadable text

43. SEO / PRODUCTION QUALITY

Preserve/improve where appropriate:

page titles

meta descriptions

canonical URLs

semantic HTML

alt text

Open Graph metadata

favicon/logo assets

clean URLs

performance

Never invent SEO claims.

44. CODE QUALITY

Prefer:

strict TypeScript

focused components

reusable primitives only when useful

centralized theme tokens

centralized content

clear names

minimal duplication

Avoid:

giant components

unnecessary abstraction

duplicated animation systems

duplicated theme logic

dead code

unused imports

speculative architecture

Do not use any unnecessarily.

Do not suppress errors globally.

45. DO NOT REBUILD THE FOUNDATION

Do not repeatedly restructure the application.

Do not migrate:

routing

frontend architecture

styling

animation architecture

backend architecture

unless there is a demonstrated problem.

The objective is to finish the product.

46. GIT SAFETY

Before modifications:

git status

Do not:

force push

reset user work

discard unrelated changes

rebase published history

amend/squash published history

delete unrelated files

The Lovable-connected git history is especially sensitive.

Keep the branch working.

47. TESTING

Run available checks such as:

npm run build
npm run lint

and relevant type checks/tests.

Never say "tested" unless the test actually ran.

If a command is unavailable, document that.

48. MANUAL VISUAL QA

Inspect:

Home

Services

Work

Products

Clients

About

Contact

Bridge

project details

service details

Inspect:

Obsidian

Cobalt

desktop

tablet

mobile

Do not rely only on build success.

49. HERO QA CHECKLIST

Before marking Hero complete:

Hero remains strong during scroll

MA / CO remains readable

CTA remains readable

SystemField remains visible

actual logo geometry is correct

pointer works

scroll works

no excessive global fade

no muddy state

next section enters naturally

mobile works

reduced motion works

50. MULTILINGUAL QA CHECKLIST

Malayalam

Tamil

Telugu

Kannada

Hindi

Bengali

Marathi

Odia

Gujarati if included

Punjabi if included

Assamese if included

Urdu

Arabic

Persian

Hebrew

Cyrillic

Greek

Japanese

Korean

Chinese

Thai if included

Latin languages preserve MaCo

correct fallback fonts

no missing glyphs

RTL works

no overflow

animation works

mobile works

reduced motion works

51. DOCUMENTATION CHECKPOINTS

After meaningful phases update:

AI_HANDOFF.md

PROJECT_STATUS.md

ROADMAP.md

Update CONTEXT.md when stable architecture/design decisions change.

Document React Bits choices:

USED:
Specular Button

REJECTED:
[component]

REASON:
Poor MaCo fit / too heavy / inaccessible / redundant / etc.

52. TOKEN / CONTEXT LIMIT PROTOCOL

This is mandatory.

The AI may reach:

context limits

token limits

usage limits

credit limits

session limits

If the context is getting low:

DO NOT RUSH.

DO NOT START ANOTHER LARGE FEATURE.

DO NOT LEAVE THE PROJECT IN AN UNDOCUMENTED STATE.

Enter:

HANDOFF MODE

stop starting new work

finish the smallest safe edit if possible

save valid code

run git status

run git diff --stat

update AI_HANDOFF.md

update PROJECT_STATUS.md

update ROADMAP.md

record current phase

record completed work

record unfinished work

record current file

record last successful action

record exact next action

record known errors

record test status

record React Bits decisions

record design decisions

Never trade documentation for one more feature.

53. AI_HANDOFF REQUIRED CONTENT

AI_HANDOFF.md must include:

overall status

current phase

completion estimate

completed work

in-progress work

remaining work

current problem

last successful action

current file

exact next action

Hero state

SystemField state

logo geometry state

multilingual state

React Bits used

React Bits rejected

Obsidian state

Cobalt state

mobile state

responsive state

accessibility state

performance state

tests passed

tests failed

tests not run

known issues

files changed

dependencies changed

important decisions

things not to change

next-AI instructions

Use explicit statuses:

DONE

IN PROGRESS

PARTIAL

NOT STARTED

BLOCKED

NEEDS REVIEW

Never claim completion without evidence.

54. CHECKPOINTS

Recommended checkpoints:

repository audit

plan created

plan validated

Hero diagnosis

exact logo/SystemField

Hero scroll correction

React Bits research

Specular Button

multilingual redesign

multilingual animation

Obsidian

Cobalt

mobile navigation

responsive QA

accessibility

reduced motion

performance

full QA

final polish

final documentation

55. NEXT-AI BOOTSTRAP

When another AI takes over:

FIRST READ:

AGENTS.md

AI_HANDOFF.md

PROJECT_STATUS.md

CONTEXT.md

ROADMAP.md

DOCS.md

README.md

Then inspect:

package.json

git status

actual implementation

relevant routes/components

Do not restart.

Do not redo completed work.

Continue from:

AI_HANDOFF.md → Next Exact Action

If docs disagree with code:

trust code,then update docs.

56. PRESERVE THESE DECISIONS

Unless explicitly requested otherwise, preserve:

MaCo brand identity

Obsidian theme

Cobalt theme

two-theme architecture

SystemField concept

actual MaCo logo geometry

multilingual identity concept

mobile pill navigation

editorial desktop navigation

Bridge emphasis

real project information

existing routes

content architecture

working backend

existing Motion infrastructure

Improve these; do not casually replace them.

57. FINAL QUALITY BAR

The website should feel:

PREMIUMTECHNICALDISTINCTIVECONFIDENTHUMBLEEDITORIALMODERNMEMORABLE

The user should not immediately think:

"AI website"

"Lovable website"

"generic agency template"

"React Bits demo"

"generic SaaS"

Instead:

MaCo has its own technology identity.

The Hero must feel like MaCo.

The SystemField must feel like MaCo.

The multilingual section must feel like MaCo.

Obsidian and Cobalt must feel like two modes of the same brand.

React Bits must enhance the experience without becoming the identity.

58. FINAL OPERATING PRINCIPLE

Optimize for:

quality × identity × usability × performance × maintainability

Prefer:

intentional design over effect quantity

correctness over speed

reuse over rewrites

measured motion over chaos

real content over invented content

documented state over undocumented progress

MaCo identity over library identity

production quality over demo quality

When uncertain:

inspect first, question assumptions, plan, then implement.
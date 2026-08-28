# MaCo Website — Documentation Index

Authoritative docs for humans and AI agents.

| File | Purpose | When to read |
|------|---------|--------------|
| [AI_HANDOFF.md](./AI_HANDOFF.md) | Live handoff for the next coding agent | Always first for AI continuation |
| [CONTEXT.md](./CONTEXT.md) | Full website encyclopedia (brand, content, stack, design) | Understanding *what* MaCo is |
| [PROJECT_STATUS.md](./PROJECT_STATUS.md) | What’s done / partial / blocked | Status checks |
| [ROADMAP.md](./ROADMAP.md) | Phased remaining work | Planning next implementation |
| [README.md](./README.md) | How to install and run | Local setup |
| [backend/README.md](./backend/README.md) + [frontend/src/routes/README.md](./frontend/src/routes/README.md) | Package-specific notes | Working in one stack |
| [docs/references/](./docs/references/) | Mechanism-only notes on external reference sites (Cuberto, Iventions, Uncommon Design Group, Minh Pham) — technique study, never layout/color/type to copy | Before proposing a new motion/interaction pattern |
| [docs/MEDIA-GAP.md](./docs/MEDIA-GAP.md) | Per-section inventory of which homepage slots have real tier-1/2 media vs. the tier-3 designed fallback | Before planning what real photography/screenshots/video to go capture |

**Rule:** Do not invent content. Source of truth for copy = `frontend/src/content/maco.ts` (and Django CMS when live).

# MaCo Website v2

**Frontend-only** for now: React/TanStack Start. The Django REST backend
was moved out to `../maco-backend` (sibling folder, untracked here) —
kept for future use, not part of this repo or its deploy.

**Documentation:** start at [DOCS.md](./DOCS.md) — includes [CONTEXT.md](./CONTEXT.md) (full site encyclopedia), [PROJECT_STATUS.md](./PROJECT_STATUS.md), [ROADMAP.md](./ROADMAP.md), and [AI_HANDOFF.md](./AI_HANDOFF.md) for AI agents.

```
maco-website-v2/
└── frontend/        # React app (TanStack Start + Vite + Tailwind CSS)
    ├── src/
    │   ├── components/
    │   ├── routes/
    │   ├── hooks/
    │   ├── lib/
    │   └── content/
    ├── public/
    ├── package.json
    └── vite.config.ts
```

---

## Frontend Setup

Requires **Node.js 18+**. **`bun` is the canonical package manager** — `bun.lock` is the only lockfile tracked; use `npm`/`pnpm` only if you know what you're doing with the lockfile.

```bash
cd frontend
bun install
bun run dev       # starts dev server at http://localhost:5173
```

Other scripts:

```bash
bun run build     # production build
bun run preview   # preview production build
bun run lint      # run ESLint
bun run format    # run Prettier
bun run media     # regenerate public/media/ from raw source assets
```

---

## Contact form

The contact form (`frontend/src/routes/contact.tsx`) posts to
`VITE_API_BASE_URL`. With no backend wired up, leave that env var unset —
the form detects this and shows "email us directly instead" rather than
failing silently. All content on the site is otherwise static, compiled
into the bundle from `frontend/src/content/maco.ts`.

## Backend (future)

Django REST + Admin CMS, moved to `../maco-backend`. See its own
`README.md` when it's reintroduced.

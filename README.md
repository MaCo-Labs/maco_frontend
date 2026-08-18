# MaCo Website v2

Full-stack project: **React/TanStack Start** frontend + **Django REST** backend.

**Documentation:** start at [DOCS.md](./DOCS.md) — includes [CONTEXT.md](./CONTEXT.md) (full site encyclopedia), [PROJECT_STATUS.md](./PROJECT_STATUS.md), [ROADMAP.md](./ROADMAP.md), and [AI_HANDOFF.md](./AI_HANDOFF.md) for AI agents.

```
maco-website-v2/
├── frontend/        # React app (TanStack Start + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   ├── routes/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── content/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
└── backend/         # Django REST API
    ├── maco/        # Django project settings
    ├── content/     # Content app (models, views, serializers)
    ├── manage.py
    ├── requirements.txt
    └── .env         # created from .env.example
```

---

## Frontend Setup

Requires **Node.js 18+** and **npm** (or **bun**).

```bash
cd frontend
npm install       # or: bun install
npm run dev       # starts dev server at http://localhost:5173
```

Other scripts:

```bash
npm run build     # production build
npm run preview   # preview production build
npm run lint      # run ESLint
npm run format    # run Prettier
```

---

## Backend Setup

Requires **Python 3.11+** and a running **PostgreSQL** instance.

```bash
cd backend

# 1. Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
#    .env is already created from .env.example — edit it:
#    - Set DJANGO_SECRET_KEY to a random secret
#    - Set DATABASE_URL to your Postgres connection string

# 4. Run migrations
python manage.py migrate

# 5. Start development server
python manage.py runserver       # http://localhost:8000
```

### Backend environment variables (`.env`)

| Variable | Default | Description |
|---|---|---|
| `DJANGO_SECRET_KEY` | `change-me` | Django secret key — **change this** |
| `DJANGO_DEBUG` | `True` | Debug mode |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` | Allowed hosts |
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:5432/maco` | Postgres URL |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:8080,http://localhost:5173` | CORS whitelist |
| `DEFAULT_FROM_EMAIL` | `noreply@maco.dev` | Email sender |
| `LEAD_NOTIFICATION_EMAIL` | `hello@maco.dev` | Lead notification target |

---

## Running Both Together

Open two terminals:

```bash
# Terminal 1 — Frontend
cd frontend && npm run dev

# Terminal 2 — Backend
cd backend && venv\Scripts\activate && python manage.py runserver
```

Frontend: http://localhost:5173  
Backend API: http://localhost:8000/api/

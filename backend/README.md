# MaCo — Django + DRF backend

The API that powers the React frontend and the editorial CMS, per
`04_BACKEND_SCHEMA.md`. Stack: Django 5, Django REST Framework, PostgreSQL.

## Layout

```
backend/
  manage.py
  requirements.txt
  .env.example
  maco/            # project (settings, urls, wsgi)
  content/         # models, serializers, viewsets, admin
    management/commands/seed_content.py
```

## Run locally

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # set DATABASE_URL + SECRET_KEY
createdb maco
python manage.py migrate
python manage.py seed_content # loads the locked content catalog
python manage.py createsuperuser
python manage.py runserver 8000
```

Frontend: set `VITE_API_BASE_URL=http://localhost:8000` so the contact form
posts to `POST /api/v1/contact/`.

## API

| Method | Path | Notes |
|---|---|---|
| GET | `/api/v1/settings/` | Site settings singleton |
| GET | `/api/v1/services/` | Published services, ordered |
| GET | `/api/v1/services/<slug>/` | Capabilities + related evidence |
| GET | `/api/v1/projects/` | Client work, `?featured=true` |
| GET | `/api/v1/projects/<slug>/` | Case study + images + technologies |
| GET | `/api/v1/products/` | MaCo products |
| GET | `/api/v1/products/<slug>/` | Features + technologies |
| GET | `/api/v1/clients/` | Only `approved_for_publication=True` |
| POST | `/api/v1/contact/` | Throttled lead capture, honeypot protected |

Reads are `AllowAny` + read-only. Writes happen through Django Admin only,
except contact submissions.

# Portfolio — React + Django + Docker

Modern portfolio with **React + Vite + Tailwind** frontend and **Python/Django + DRF** backend, fully **Dockerized** with Postgres.

Live stack:
- **Frontend** (`/`): React 19, Vite 8, Tailwind 3 — dark `#0E100F` / cream `#FFFCE1` design (Hanken Grotesk), scroll-reveal + hover micro-interactions, live API integration with static fallbacks
- **Backend** (`/backend`): Django 6.1, Django REST Framework, Postgres (Docker) / SQLite (local venv), CORS, Gunicorn
- **Infra**: Docker multi-stage builds, `docker-compose.yml` (db + backend + frontend/nginx)

---

## Project Structure

```
portfolio/
├─ src/                 # React frontend
│  ├─ App.jsx           # Main portfolio UI (fetches from /api/*)
│  ├─ api.js            # API helper (VITE_API_URL)
│  └─ index.css         # Tailwind directives
├─ backend/
│  ├─ config/           # Django project (settings.py, urls.py)
│  ├─ api/              # Django app
│  │  ├─ models.py      # Skill, Project (emoji/cover/stack), Profile (cv), ContactMessage
│  │  ├─ serializers.py
│  │  ├─ views.py       # ViewSets + health/contact
│  │  ├─ urls.py        # /api/skills/, /api/projects/, /api/profile/, /api/contact/, /api/health/
│  │  └─ fixtures.json  # seed reference (actual seeding via entrypoint shell)
│  ├─ requirements.txt  # Django deps (incl. Pillow for image uploads)
│  ├─ Dockerfile        # python:3.11-slim + gunicorn
│  └─ entrypoint.sh     # migrate + seed/sync + collectstatic + gunicorn
├─ Dockerfile           # Frontend: node:20 build → nginx:alpine + /api proxy
├─ nginx.conf           # SPA fallback + /api → backend:8000
├─ docker-compose.yml   # db (postgres) + backend:8000 + frontend:80
├─ vite.config.js       # proxy /api → localhost:8000 in dev
├─ venv/                # Python virtual env (created before pip install)
├─ .env / .env.example  # Env vars
└─ dist/                # Vite build output
```

---

## Quick Start

### 1) Create venv **before installing anything** (as required)

```powershell
# from project root
python -m venv venv
.\venv\Scripts\Activate.ps1   # Windows
# source venv/bin/activate    # macOS/Linux

pip install --upgrade pip
pip install -r backend/requirements.txt
# or: pip install django djangorestframework django-cors-headers psycopg2-binary gunicorn python-dotenv django-filter drf-spectacular Pillow
```

### 2) Run locally (without Docker) — SQLite fallback

```powershell
# backend (terminal 1)
.\venv\Scripts\python.exe backend/manage.py migrate
.\venv\Scripts\python.exe backend/manage.py shell -c "from api.models import Skill; print(Skill.objects.count())"
# seeding already done via shell; or re-seed if empty (see entrypoint.sh)
.\venv\Scripts\python.exe backend/manage.py runserver 8000

# frontend (terminal 2)
npm install
npm run dev   # http://localhost:5173 → proxies /api to localhost:8000
# verify
# curl http://localhost:8000/api/health/  -> {"status":"ok"}
# curl http://localhost:8000/api/skills/
```

Frontend automatically falls back to static data if API offline (see `src/App.jsx` and `src/api.js`).

### Content management (`/admin/`)

- **Skills** — fully admin-managed; the frontend renders whatever `/api/skills/` returns. Skill bars map level → width: Beginner 20%, Intermediate 58%, Advanced 88%.
- **Projects** — the 5 showcase projects (R.A.G, Tweeter_Demo, CakeShop, Online-shop-CBV, Summerizer) are synced from `backend/entrypoint.sh` on every boot (matched by title). Card **text is code-managed** and overwritten on redeploy; **`cover` photos are never touched** — upload them per-project in admin (emoji shows when no cover).
- **CV** — upload a PDF/DOC/DOCX (≤10MB) on the Profile page in admin; the hero **Download CV** button downloads it, otherwise it shows "coming soon".
- **Dates & socials** — project dates sync live from the GitHub API (repo `created_at`/`pushed_at`); the X handle, blog link, bio and location fall back to the GitHub profile (`api.github.com/users/Soroush-Eghdami`).
- Stale-skill fix: if the DB ever shows wrong skills again, delete all Skill rows in admin and restart the backend — the seed repopulates the backend set.

### 3) Docker — full stack (Postgres + Django + Nginx)

> Requires Docker Desktop running. First `docker compose build` may take 2-3 min.

```powershell
docker compose up --build        # builds all, runs migrations + seeding
# or detached
docker compose up --build -d
docker compose logs -f

# Services:
# - frontend → http://localhost      (nginx, serves React + proxies /api)
# - backend  → http://localhost:8000 (Django + DRF)
# - db       → localhost:5432 (postgres)
# - admin    → http://localhost:8000/admin/  (create superuser via env below)

docker compose down              # stop
docker compose down -v           # stop + delete pgdata volume
```

**Env** (`.env:1`):
```
DJANGO_SECRET_KEY=...
POSTGRES_DB=portfolio
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
```

To auto-create Django admin:
```env
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=admin123
```
then `docker compose up --build` — check logs for `Superuser admin created`.

---

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health/` | health check |
| GET | `/api/skills/` | list skills (paginated) — `{name, level, icon}` |
| GET | `/api/projects/` | list featured projects — incl. `{stack, emoji, cover}` |
| GET | `/api/profile/` | singleton profile — incl. `cv` file URL |
| POST | `/api/contact/` | create contact message `{name,email,subject,message}` |

Admin: `/admin/` — manage Skills/Projects/Profile/Messages.

---

## Frontend ↔ Backend Wiring

- `vite.config.js` proxies `/api` → `http://localhost:8000` in dev
- `src/api.js` uses `VITE_API_URL` (empty = relative, works with nginx proxy in Docker)
- `src/App.jsx` fetches skills/projects/profile on mount, shows `API online/offline` badge, POSTs contact form to `/api/contact/`
- Project card gradients come from the DB at runtime, so `tailwind.config.js` **safelist**s all `from-`/`to-` stops the API can serve — picking a new gradient in admin needs no frontend change
- Uploaded files (`cover`, `cv`) resolve against `VITE_API_URL`; Django serves `/media/` in all envs and nginx proxies it in Docker

---

## Verification

```powershell
.\venv\Scripts\python.exe backend/manage.py check   # Django system check → 0 issues
npm run build                                       # Vite build → dist/
docker compose config                               # validates compose
# when daemon up:
docker compose build --no-cache
```

Tested locally:
- `python backend/manage.py migrate` — OK (SQLite fallback when `POSTGRES_HOST=db` outside Docker)
- `curl /api/health/` — `{"status":"ok"}`
- `curl /api/skills/` — 8 backend skills
- `curl /api/projects/` — 5 showcase projects
- `npm run build` — ~229kB JS, ~39kB CSS (incl. gradient safelist)

---

## Production Notes

- Set `DJANGO_DEBUG=False`, generate new `DJANGO_SECRET_KEY`, restrict `DJANGO_ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`
- Remove bind mount `volumes: - ./backend:/app` in `docker-compose.yml` (backend service) for pure image deploys
- `backend_static` and `backend_media` are Docker volumes (covers/CV persist); configure S3/Cloud storage for real prod
- Frontend `VITE_API_URL` build arg: leave empty for relative `/api` (nginx proxy) or set to `https://api.yourdomain.com`

---

Built with ♥ — React + Django + Docker.

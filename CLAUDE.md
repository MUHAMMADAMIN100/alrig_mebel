# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ALRIG (`alrig.tj`) — a catalog site + admin panel for a home-appliances store in Dushanbe, Tajikistan. All user-facing copy is in **Russian**; keep new UI text in Russian. The site is heavily SEO-tuned for the Dushanbe market (see the `<head>` in `index.html`).

Two projects in one repo:
- **Frontend** (repo root): React 18 + TypeScript + Vite (SWC), SCSS modules, react-router-dom v6, react-query v3, zustand. Deployed on Vercel as an SPA (`vercel.json`).
- **Backend** (`backend/`): Django 6 + DRF + SimpleJWT + drf-yasg, env via python-decouple (`backend/.env`, see `.env.example`). SQLite locally, Postgres via `DATABASE_URL` in prod; media on S3 when AWS env vars are set, local `media/` otherwise.

## Commands

```bash
# frontend (repo root)
npm run dev      # vite --host (точка API берётся из .env: VITE_SERVER_URL)
npm run build    # tsc -b && vite build  — type-check is part of the build, so build fails on TS errors
npm run lint     # eslint . (backend/ исключён в eslint.config.js)
node e2e/run-e2e.mjs   # Playwright E2E (нужны запущенные backend + vite dev)

# backend (cd backend; venv в .venv)
./.venv/Scripts/python.exe manage.py migrate
./.venv/Scripts/python.exe manage.py runserver 127.0.0.1:8000
PYTHONUTF8=1 ./.venv/Scripts/python.exe scripts/seed.py          # идемпотентный сид каталога
PYTHONUTF8=1 ./.venv/Scripts/python.exe scripts/api_selftest.py  # самотест API (39 проверок)
```

## Architecture

Feature-Sliced Design, but only three layers are used: **`shared` → `widgets` → `pages`** (no `entities`/`features`). Import direction flows upward only (pages import widgets import shared).

- **`src/pages/*`** — route-level components. Thin: they compose widgets. Each is exported as a named export from `index.tsx`.
- **`src/widgets/*`** — self-contained page sections (header, footer, banner, products, services, constructor, contacts…). Internal structure is typically `ui/`, `model/` (types + data), `const/`, `lib/`.
- **`src/shared/*`** — reusable primitives: `ui/` (Button, Modal, Dropdown, Input, loaders…), `api/`, `lib/` (pure helpers), `model/` (shared types), `const/`, `layout/`, `styles` live separately under `src/styles`.

### Routing

`BrowserRouter` is in `src/main.tsx`; all routes are declared in `src/App.tsx`. Client routes live under a single `<Layout />` (Header/Footer + scroll-to-top). Admin routes are **outside** `Layout`: `/login` and `/admin/*` (wrapped in `ProtectedRoute` + `AdminLayout` from `src/admin/`). A module-level `QueryClient` and `<Toaster />` are set up in `App.tsx`; session restore from localStorage happens in an `App` effect.

### Catalog & API — important

The catalog is **API-driven** (Django backend, strict hierarchy Category → Subcategory → Product):

- `src/shared/api/types.ts` — API types; `catalog.ts` — public fetchers; `admin.ts` — admin CRUD (multipart via `toFormData`); `hooks.ts` — react-query hooks.
- `src/shared/api/axiosInstance.ts` — axios with Bearer-token request interceptor and a 401→refresh→retry response interceptor (tokens in localStorage, see `src/shared/auth/`).
- `src/data/products.ts` is kept only as legacy types/fallback — the UI renders from the API.
- Client pages: `/products` (categories), `/products/:slug` (subcategory), `/category/:slug`, `/product/:slug` (gallery, specs, order modal → `POST /api/orders/`).
- Admin: `/admin` dashboard, products (cascading category→subcategory selects, image gallery, specs editor), categories, subcategories, orders. Login: superuser from `backend/.env` (`DJANGO_SUPERUSER_*`).
- Backend API docs: Swagger at `http://127.0.0.1:8000/api/docs/`. Write access requires `is_staff` JWT; deleting a category/subcategory with children returns 409 (PROTECT).

### State & data libraries

Note both `react-query` (v3) **and** `@tanstack/react-query` (v5) are installed. The app uses the **v3** `react-query` everywhere — match it; don't import from `@tanstack/react-query`. Auth state is a `zustand` store (`src/shared/auth/useAuthStore.ts`). Forms use `react-hook-form`; toasts use `react-hot-toast`; maps use `@pbe/react-yandex-maps`; animation via `framer-motion`/`@react-spring/web`; carousels via `swiper`.

DRF gotcha already handled in `catalog/serializers.py`: absent boolean fields in multipart default to the model default via `FormBooleanField` (stock DRF would silently coerce them to `False`).

## Conventions

- **Components**: one component per folder as `index.tsx` (named exports, no default except `Layout`/`App`). Note pre-existing typo filenames `Title/indext.tsx` and `Subtitle/indext.tsx` — import paths must match these exactly.
- **Styling**: SCSS Modules co-located as `*.module.scss`, imported as `classes`. Global styles in `src/styles/` (`index.scss` aggregates `variables`, `mixins`, `normalize`, `core`). Use the breakpoint/wrapper variables from `_variables.scss` and mixins from `_mixins.scss` for responsive work. Colors are in `_colors.scss` and re-`:export`ed for JS where needed.
- **SVG**: imported as React components via `vite-plugin-svgr` (`*.svg?react`). The `@icons` alias maps to `/public/assets/icons` (configured in both `vite.config.ts` and `tsconfig.app.json`).
- **Static assets**: product images and icons live under `public/assets/`; reference them with absolute paths (e.g. `/assets/products/...`).
- **TypeScript** is strict, with `noUnusedLocals` and `noUnusedParameters` on — unused imports/vars break the build.

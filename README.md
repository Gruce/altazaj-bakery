# الطازج بيكري · Al-Tazaj Bakery — Menu + Dashboard

A premium, animated, bilingual (Arabic-first / English) digital menu for
**Al-Tazaj Bakery** (Basra, Iraq) — now a full **Next.js** app with a **SQLite**
backend and a password-protected **admin dashboard** that controls every aspect
of the menu. Edits in the dashboard go live on the menu instantly.

> **Stack:** Next.js 16 (App Router, React 19) · TypeScript · Tailwind CSS v4 ·
> shadcn/ui · Drizzle ORM + better-sqlite3 · Motion · lucide-react · jose (auth)

## ✨ What's inside

- **Public menu** (`/`) — the original cinematic experience, now DB-backed:
  intro loader, bold hero, sticky scroll-spy category bar, live bilingual search,
  signature carousel, animated cards, item detail sheet, Arabic ⇄ English toggle
  (RTL/LTR + Eastern-Arabic numerals), CDN images with blur-up.
- **Admin dashboard** (`/dashboard`) — manage **items** (CRUD, price, photo via
  URL **or** upload, featured & availability toggles, reorder), **categories**
  (emoji, chapter, order), **chapters/acts**, **branches** (hours, "new" badge),
  **brand & settings** (names, tagline, currency, socials), and every **UI string**
  — all in both languages.
- **Public API** — `GET /api/menu` returns the full menu as JSON (CORS-open).
- **Auth** — single-admin password login with a signed, httpOnly session cookie;
  the whole dashboard and the upload endpoint are guarded by `proxy.ts`.

## 🚀 Getting started

```bash
npm install
cp .env.example .env        # set ADMIN_PASSWORD and AUTH_SECRET
npm run db:push             # create the SQLite tables (./data/altazaj.db)
npm run db:seed             # load db/seed/menu.json (brand, 28 categories, 331 items)
npm run dev                 # http://localhost:3000  ·  dashboard at /dashboard
```

Default dev password is whatever you set as `ADMIN_PASSWORD` in `.env`.

```bash
npm run build && npm start  # production build + serve
npm run db:studio           # browse the database (Drizzle Studio)
npm run typecheck           # TypeScript check
```

## 🗂️ Project layout

| Path | What |
| --- | --- |
| `app/page.tsx` | Public menu (Server Component → DB → providers → UI) |
| `app/dashboard/**` | Admin pages + `_actions/*` (server actions per entity) |
| `app/api/menu` · `app/api/upload` | Public menu feed · authenticated image upload |
| `app/login` | Password login + session actions |
| `components/menu/**` | The menu UI (ported, client components) |
| `components/dashboard/**` | Dashboard tables, forms, dialogs |
| `components/ui/**` | shadcn/ui primitives |
| `db/schema.ts` · `db/index.ts` · `db/seed.ts` | Drizzle schema, client, seeder |
| `db/seed/menu.json` | Seed export (also the offline fallback) |
| `lib/menu-data.ts` | Assembles the menu payload from the DB (JSON fallback) |
| `lib/dashboard-data.ts` | Read helpers for the dashboard |
| `lib/auth.ts` · `lib/session.ts` | Session signing/verify + cookie helpers |
| `proxy.ts` | Auth guard for `/dashboard` and `/api/upload` |

## 🍞 Importing the menu from Excel

The bundled importer still works — it now writes the **seed** file:

```bash
pip3 install openpyxl
python3 scripts/generate-menu.py            # → db/seed/menu.json
npm run db:seed                             # load it into SQLite
```

> `db:seed` is destructive (it clears and re-inserts). Edit through the dashboard
> for day-to-day changes; use the importer for a full re-import.

## 🎨 Brand

Bold red `#ED1C24` · white / off-white · near-black, with the geometric **wheat
mark** (`components/menu/wheat-mark.tsx`). Fonts: **Jost** (Latin) + **Cairo**
(Arabic) via `next/font`. Theme tokens live in `app/globals.css` (`@theme`).

## 🌍 Deploying

Run anywhere Node + a writable disk are available (the SQLite file lives in
`./data` and uploads in `./public/uploads`). Set `ADMIN_PASSWORD` and a strong
`AUTH_SECRET` in the environment, run `npm run db:push` once, then
`npm run build && npm start`.

---

Made with love in Basra · طازج كل يوم

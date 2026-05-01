# Heidi Calls — Self-Serve Onboarding

Next.js 15 · Tailwind · Vercel Postgres

## Local setup

```bash
npm install
cp .env.local.example .env.local
# fill in your Vercel Postgres creds (see below)
npm run dev
```

Open http://localhost:3000

## Vercel Postgres setup (5 minutes)

1. Push to GitHub
2. Import project in vercel.com
3. Dashboard → Storage → Create Database → Postgres
4. Click your DB → Settings → .env.local tab → copy all vars
5. Paste into your local `.env.local`
6. In Vercel: Settings → Environment Variables → add the same vars
7. Deploy
8. Visit `yourdomain.vercel.app/api/setup` once — creates the table
9. Complete an onboarding at `/` — config saves to DB
10. View all configs at `/configs`

## Routes

| Route | What it does |
|---|---|
| `/` | 7-step onboarding wizard |
| `/configs` | Admin — all saved clinic configs |
| `GET /api/setup` | Creates DB table (run once after deploy) |
| `POST /api/config` | Saves / upserts a clinic config |
| `GET /api/config?name=X` | Loads config by clinic name |
| `GET /api/configs` | Lists all configs (JSON) |

## File structure

```
app/
  lib/
    types.ts        # ClinicConfig type + all shared data
    db.ts           # Vercel Postgres queries (upsert, get, list)
  api/
    setup/route.ts  # GET /api/setup — create table
    config/route.ts # POST + GET /api/config
    configs/route.ts# GET /api/configs
  components/
    TopBar.tsx      # Header + save state indicator
    Sidebar.tsx     # Step nav + live config preview
    UI.tsx          # All shared primitives
  steps/
    Step0Basics.tsx → Step6Review.tsx
    StepDone.tsx
  configs/
    page.tsx        # Admin view — all clinic configs
  page.tsx          # Wizard orchestration
```

## Design decisions

**Standardised (hardcoded):**
- Safety triggers (Lifeline, 000) — cannot be disabled
- 6 base routing scenarios with sensible defaults
- DB upsert on clinic name — re-onboarding a clinic updates rather than duplicates

**Configurable:**
- Per-doctor rules, hours, tone, fallback, edge cases

**DB schema:**
- Single `clinic_configs` table — JSONB config column
- Upsert on `clinic_name` (unique) — idempotent, safe to re-run
- `/configs` admin page reads directly from Postgres (server component, no API round-trip)

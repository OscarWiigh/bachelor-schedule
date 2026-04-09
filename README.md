# Bachelor Schedule

Mobile-first Next.js app: a **Friday–Sunday timeline** for a bachelor weekend, with times in **Europe/Prague**. Schedule data lives in **PostgreSQL** (via [Prisma](https://www.prisma.io/)); the timeline and `/edit` share state through a client provider and sync writes with `PUT /api/activities`.

## Develop

1. Copy [`.env.example`](.env.example) to `.env` and set `DATABASE_URL` to a Postgres connection string (a free [Neon](https://neon.tech/) database works well).

2. Install and migrate:

```bash
npm install
npx prisma migrate dev
```

3. (Optional) Seed the database from [`data/activities.ts`](data/activities.ts):

```bash
npm run db:seed
```

4. Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repo to GitHub (or GitLab / Bitbucket) and [import the project](https://vercel.com/new) in Vercel.
2. Add **Postgres**:
   - Easiest: install the [Neon](https://vercel.com/marketplace/neon) (or Vercel Postgres) integration from the Vercel Marketplace so `DATABASE_URL` is set automatically on Production (and Preview if you wire it).
   - Or create a database manually and add **`DATABASE_URL`** under Project → Settings → Environment Variables for **Production** (and **Preview** if you want previews to use a DB).
3. **Build command** (default is fine): `prisma generate && prisma migrate deploy && next build` — already set in [`package.json`](package.json). The first production deploy applies migrations and creates the `activities` table.
4. **Seed production once** (optional): from your machine, with production `DATABASE_URL` in env:

```bash
DATABASE_URL="postgresql://..." npm run db:seed
```

Or run SQL / Prisma Studio against production if you prefer.

5. **`npm run build`** locally needs a valid `DATABASE_URL` in `.env` because `migrate deploy` runs during build (same as Vercel).

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/activities` | Returns all activities sorted by start time (JSON). |
| `PUT` | `/api/activities` | Replaces the full schedule with a JSON array of activities (same shape as [`lib/types.ts`](lib/types.ts)). |

There is no auth on these routes by default; restrict access with [Vercel deployment protection](https://vercel.com/docs/security/deployment-protection), a private repo + preview protection, or your own middleware / secret header if you need it.

## Edit in the browser

Open [`/edit`](http://localhost:3000/edit). **Times are Europe/Prague** in the form; they are stored as UTC in the database. Optional **Link (optional)** must be `https://` (or `http://`) if set; tappable cards on the timeline open that URL in a new tab.

## Customize

- **Weekend range (Prague):** [`lib/config.ts`](lib/config.ts) — `WEEKEND_START_ISO` / `WEEKEND_END_ISO` (UTC).
- **Seed / template data:** [`data/activities.ts`](data/activities.ts) — used by `npm run db:seed`; edit and re-seed or use `/edit` after deploy.
- **AirBnB / header:** [`lib/config.ts`](lib/config.ts) `AIRBNB_MAPS_URL`.
- **Categories:** [`lib/categories.ts`](lib/categories.ts).

## Database schema

Defined in [`prisma/schema.prisma`](prisma/schema.prisma). Table `activities`: `id`, `title`, `start_at`, `end_at`, `category`, `booked_by`, optional `map_url`.

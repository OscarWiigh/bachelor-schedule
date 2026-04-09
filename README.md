# Bachelor Schedule

Mobile-first Next.js app: a **Friday–Sunday timeline** for a bachelor weekend, with times in **Europe/Prague**. Schedule data lives in **[Upstash Redis](https://upstash.com/)** (HTTP/REST, serverless-friendly); the timeline and `/edit` share state through a client provider and sync writes with `PUT /api/activities`.

## Develop

1. Create a free Redis database at [Upstash Console](https://console.upstash.com/) → **Redis** → create database → copy **REST API** `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

2. Copy [`.env.example`](.env.example) to `.env` and paste those two values.

3. Install and seed:

```bash
npm install
npm run redis:seed
```

4. Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push this repo to GitHub and [import the project](https://vercel.com/new) in Vercel.

2. **Connect Redis (pick one):**
   - **Recommended:** Install [Upstash for Vercel](https://vercel.com/marketplace/upstash) from the Marketplace. It can create a database and inject **`UPSTASH_REDIS_REST_URL`** and **`UPSTASH_REDIS_REST_TOKEN`** into your project (check **Production** and **Preview** if you want preview deployments to work).
   - **Manual:** In Upstash, open your database → **REST API** → copy URL + token. In Vercel → your project → **Settings** → **Environment Variables** → add both variables for **Production** (and **Preview** if needed).

3. **Build command:** default `npm run build` is enough (`next build` only — no database step at build time).

4. **Redeploy** after saving env vars.

5. **Seed production once** (optional): from your machine, with the same env vars in `.env`:

```bash
npm run redis:seed
```

Or use `/edit` after deploy to enter activities manually.

## API

| Method | Path | Description |
|--------|-------------|-------------|
| `GET` | `/api/activities` | Returns all activities sorted by start time (JSON). |
| `PUT` | `/api/activities` | Replaces the full schedule with a JSON array of activities (same shape as [`lib/types.ts`](lib/types.ts)). |

There is no auth on these routes by default; restrict access with [Vercel deployment protection](https://vercel.com/docs/security/deployment-protection), a private repo + preview protection, or your own middleware / secret header if you need it.

## Edit in the browser

Open [`/edit`](http://localhost:3000/edit). **Times are Europe/Prague** in the form; they are stored as UTC in Redis. Optional **Link (optional)** must be `https://` (or `http://`) if set; tappable cards on the timeline open that URL in a new tab.

## Customize

- **Weekend range (Prague):** [`lib/config.ts`](lib/config.ts) — `WEEKEND_START_ISO` / `WEEKEND_END_ISO` (UTC).
- **Seed / template data:** [`data/activities.ts`](data/activities.ts) — used by `npm run redis:seed`; edit and re-seed or use `/edit` after deploy.
- **AirBnB / header:** [`lib/config.ts`](lib/config.ts) `AIRBNB_MAPS_URL`.
- **Categories:** [`lib/categories.ts`](lib/categories.ts).

## Storage

The full schedule is one JSON array under the Redis key `bachelor-schedule:activities` (see [`lib/schedule-store.ts`](lib/schedule-store.ts)). No migrations: empty store returns an empty list until you seed or save from `/edit`.

# Bachelor Schedule

Mobile-first Next.js app: a **Friday–Sunday timeline** for a bachelor weekend (Europe/Prague). Data lives in **PostgreSQL** via **Prisma**.

## Easiest deploy (Vercel + one env var)

1. Push this repo to GitHub and [import it in Vercel](https://vercel.com/new).

2. Add **Postgres** and get **one** variable named **`DATABASE_URL`**:
   - **Simplest:** In Vercel go to **Storage** → create **Postgres** (or install [Neon](https://vercel.com/marketplace/neon) from the Marketplace). Vercel usually attaches `DATABASE_URL` to the project for you.
   - **Or:** Create a free DB at [neon.tech](https://neon.tech), copy the connection string, and in Vercel → **Settings** → **Environment Variables** add **`DATABASE_URL`** for **Production** (and **Preview** if you want previews to work).

3. Deploy. The build runs `prisma migrate deploy`, which creates the `activities` table on first deploy.

4. **Optional — load sample events:** on your computer, put the same `DATABASE_URL` in `.env`, then:

```bash
npm install
npx prisma migrate deploy
npm run db:seed
```

(Or skip seed and add everything in `/edit` after deploy.)

## Local dev

```bash
cp .env.example .env
# paste DATABASE_URL
npm install
npx prisma migrate dev
npm run dev
```

## API

| Method | Path | Description |
|--------|-------------|-------------|
| `GET` | `/api/activities` | All activities, sorted by start. |
| `PUT` | `/api/activities` | Replace full schedule (JSON array, see `lib/types.ts`). |

## Customize

- Weekend range: `lib/config.ts`
- Seed data template: `data/activities.ts`
- Categories: `lib/categories.ts`

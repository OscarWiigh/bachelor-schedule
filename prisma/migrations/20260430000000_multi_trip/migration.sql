-- Create trips table
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "good_to_know_md" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- Seed the bachelor trip
INSERT INTO "trips" ("id", "title", "subtitle", "timezone", "start_date", "end_date", "good_to_know_md")
VALUES (
    'bachelor',
    'Bachelor Schedule',
    '',
    'Europe/Prague',
    '2026-04-09 22:00:00',
    '2026-04-12 21:59:59.999',
    '**Oscar** – [+46 70 147 66 88](tel:+46701476688)

**Filip** – [+46 70 748 45 83](tel:+46707484583)

**Main door code:** 9517#'
)
ON CONFLICT ("id") DO NOTHING;

-- Add trip_id to activities with default (only if column doesn't exist yet)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'activities' AND column_name = 'trip_id'
    ) THEN
        ALTER TABLE "activities" ADD COLUMN "trip_id" TEXT;
        UPDATE "activities" SET "trip_id" = 'bachelor' WHERE "trip_id" IS NULL;
        ALTER TABLE "activities" ALTER COLUMN "trip_id" SET NOT NULL;

        ALTER TABLE "activities" ADD CONSTRAINT "activities_trip_id_fkey"
            FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Drop old settings table if it exists
DROP TABLE IF EXISTS "schedule_page_settings";

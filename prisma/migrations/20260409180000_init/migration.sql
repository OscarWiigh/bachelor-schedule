-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "booked_by" TEXT NOT NULL DEFAULT '',
    "map_url" TEXT,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

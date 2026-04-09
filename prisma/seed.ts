import { ACTIVITIES } from "../data/activities";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.activity.deleteMany();
  if (ACTIVITIES.length === 0) return;
  await prisma.activity.createMany({
    data: ACTIVITIES.map((a) => ({
      id: a.id,
      title: a.title,
      startAt: new Date(a.start),
      endAt: new Date(a.end),
      category: a.category,
      bookedBy: a.bookedBy,
      mapUrl: a.mapUrl ?? null,
    })),
  });
  console.log(`Seeded ${ACTIVITIES.length} activities.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    void prisma.$disconnect();
    process.exit(1);
  });

import "dotenv/config";

import { ACTIVITIES } from "@/data/activities";
import { writeActivities } from "@/lib/schedule-store";

async function main() {
  await writeActivities([...ACTIVITIES]);
  console.log(`Seeded ${ACTIVITIES.length} activities to Redis.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

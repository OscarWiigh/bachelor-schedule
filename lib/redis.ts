import { Redis } from "@upstash/redis";

let client: Redis | null = null;

/**
 * Upstash Redis (REST) — works on Vercel serverless without persistent TCP.
 * Env is only required when handling requests, not during `next build`.
 */
export function getRedis(): Redis {
  if (!client) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error(
        "Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN",
      );
    }
    client = new Redis({ url, token });
  }
  return client;
}

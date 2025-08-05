import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function getCachedData<T>(
  key: string,
  fetchData: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached) {
    return cached;
  }

  const data = await fetchData();
  await redis.set(key, data, { ex: ttl });
  return data;
}

export async function invalidateCache(key: string) {
  await redis.del(key);
}

export async function invalidateCachePattern(pattern: string) {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
} 
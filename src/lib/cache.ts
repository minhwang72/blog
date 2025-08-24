import Redis from 'ioredis'
import { getEnv } from './env'

// Redis 클라이언트 인스턴스
let redis: Redis | null = null
let redisConnectionAttempted = false
let redisAvailable = false

// Redis 연결 함수
export function getRedisClient(): Redis | null {
  try {
    if (redisConnectionAttempted && !redisAvailable) {
      return null
    }
    
    if (!redis && !redisConnectionAttempted) {
      redisConnectionAttempted = true
      
      const redisUrl = getEnv('REDIS_URL')
      if (!redisUrl || redisUrl === 'redis://localhost:6379') {
        console.log('🔴 Redis not configured for production, using fallback mode')
        return null
      }
      
      redis = new Redis(redisUrl, {
        enableReadyCheck: false,
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        lazyConnect: true,
      })

      redis.on('error', (err) => {
        if (!redisAvailable) {
          console.log('🔴 Redis unavailable, falling back to direct database queries')
          redisAvailable = false
        }
      })

      redis.on('connect', () => {
        console.log('✅ Redis connected successfully')
        redisAvailable = true
      })

      redis.on('ready', () => {
        redisAvailable = true
      })
    }
    
    return redisAvailable ? redis : null
  } catch (error) {
    console.log('🔴 Redis initialization failed, using direct database queries')
    return null
  }
}

// 캐시 키 생성 헬퍼
export function createCacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `blog:${prefix}:${parts.join(':')}`
}

// 캐시 TTL 상수 (초 단위)
export const CACHE_TTL = {
  POSTS: 60 * 15, // 15분
  POST_DETAIL: 60 * 30, // 30분
  CATEGORIES: 60 * 60, // 1시간
  POPULAR_POSTS: 60 * 10, // 10분
  SEARCH_RESULTS: 60 * 5, // 5분
  STATS: 60 * 30, // 30분
} as const

// 타입 안전한 캐시 함수들
export class CacheManager {
  private client: Redis | null

  constructor() {
    this.client = getRedisClient()
  }

  // 캐시에서 데이터 가져오기
  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null
    
    try {
      const cached = await this.client.get(key)
      if (!cached) return null
      
      return JSON.parse(cached) as T
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  // 캐시에 데이터 저장하기
  async set<T>(key: string, data: T, ttl: number = CACHE_TTL.POSTS): Promise<void> {
    if (!this.client) return
    
    try {
      await this.client.setex(key, ttl, JSON.stringify(data))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  // 캐시 삭제
  async del(key: string): Promise<void> {
    if (!this.client) return
    
    try {
      await this.client.del(key)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }

  // 패턴으로 캐시 삭제
  async delPattern(pattern: string): Promise<void> {
    if (!this.client) return
    
    try {
      const keys = await this.client.keys(pattern)
      if (keys.length > 0) {
        await this.client.del(...keys)
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error)
    }
  }

  // 캐시 만료 시간 설정
  async expire(key: string, ttl: number): Promise<void> {
    if (!this.client) return
    
    try {
      await this.client.expire(key, ttl)
    } catch (error) {
      console.error('Cache expire error:', error)
    }
  }

  // 캐시 존재 여부 확인
  async exists(key: string): Promise<boolean> {
    if (!this.client) return false
    
    try {
      const result = await this.client.exists(key)
      return result === 1
    } catch (error) {
      console.error('Cache exists error:', error)
      return false
    }
  }
}

// 싱글톤 캐시 매니저 인스턴스
export const cache = new CacheManager()

// 캐시 데코레이터 함수
export function withCache<T>(
  cacheKey: string,
  ttl: number = CACHE_TTL.POSTS
) {
  return function <Args extends any[], Return>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: Args) => Promise<Return>>
  ) {
    const method = descriptor.value!
    
    descriptor.value = async function (...args: Args): Promise<Return> {
      const key = createCacheKey(cacheKey, ...args.map(String))
      
      // 캐시에서 시도
      const cached = await cache.get<Return>(key)
      if (cached) {
        return cached
      }
      
      // 캐시 미스 시 실제 함수 실행
      const result = await method.apply(this, args)
      
      // 결과 캐싱
      await cache.set(key, result, ttl)
      
      return result
    }
  }
}

// 캐시 무효화 함수들
export const invalidateCache = {
  // 포스트 관련 캐시 무효화
  async posts() {
    await cache.delPattern(createCacheKey('posts:*'))
    await cache.delPattern(createCacheKey('popular:*'))
    await cache.delPattern(createCacheKey('stats:*'))
  },
  
  // 카테고리 관련 캐시 무효화
  async categories() {
    await cache.delPattern(createCacheKey('categories:*'))
    await cache.delPattern(createCacheKey('posts:*'))
  },
  
  // 검색 관련 캐시 무효화
  async search() {
    await cache.delPattern(createCacheKey('search:*'))
  },
  
  // 전체 캐시 무효화
  async all() {
    await cache.delPattern('blog:*')
  }
}
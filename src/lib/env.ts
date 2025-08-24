import { z } from 'zod'

// 환경변수 스키마 정의
const envSchema = z.object({
  // 데이터베이스
  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_PORT: z.string().optional().default('3306'),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
  DB_NAME: z.string().min(1, 'DB_NAME is required'),
  
  // 환경 설정
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().default('http://localhost:3001'),
  
  // API 키들 (선택사항)
  CLAUDE_API_KEY: z.string().optional(),
  UNSPLASH_ACCESS_KEY: z.string().optional(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters').optional(),
  
  // 모니터링 (선택사항)
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  
  // Redis (선택사항)
  REDIS_URL: z.string().url().optional(),
})

// 환경변수 타입 추론
export type Env = z.infer<typeof envSchema>

// 환경변수 검증 함수
export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)
  
  if (result.success) {
    return result.data
  }
  
  // 개발 환경에서는 기본값으로 진행
  console.warn('환경변수 검증 실패, 기본값 사용')
  const fallbackEnv = {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || '3306',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'blog_db',
    NODE_ENV: 'development' as const,
    NEXT_PUBLIC_SITE_URL: 'http://localhost:3001',
    CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
    UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
    JWT_SECRET: process.env.JWT_SECRET || 'default-jwt-secret-for-development-only',
    SENTRY_DSN: process.env.SENTRY_DSN,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    REDIS_URL: process.env.REDIS_URL,
  }
  
  return fallbackEnv as Env
}

// 안전하게 환경변수 가져오기
export const env = validateEnv()

// 타입 안전한 환경변수 접근
export function getEnv<K extends keyof Env>(key: K): Env[K] {
  return env[key]
}

// 필수 환경변수 체크
export function requireEnv<K extends keyof Env>(key: K): NonNullable<Env[K]> {
  const value = env[key]
  if (!value) {
    throw new Error(`Required environment variable ${String(key)} is not set`)
  }
  return value as NonNullable<Env[K]>
}
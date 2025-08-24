import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { requireEnv } from './env'

const JWT_SECRET = requireEnv('JWT_SECRET') || 'your-super-secret-jwt-key-min-32-chars'
const secret = new TextEncoder().encode(JWT_SECRET)

export interface SessionPayload {
  adminId: number
  username: string
  iat: number
  exp: number
}

// JWT 토큰 생성
export async function createToken(payload: { adminId: number; username: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

// JWT 토큰 검증
export async function verifyToken(token: string): Promise<SessionPayload> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as SessionPayload
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// 세션 쿠키 설정
export async function setSessionCookie(payload: { adminId: number; username: string }) {
  const token = await createToken(payload)
  const cookieStore = cookies()
  
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24시간
    path: '/',
  })
}

// 세션 확인
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies()
  const token = cookieStore.get('session')?.value
  
  if (!token) return null
  
  try {
    return await verifyToken(token)
  } catch {
    return null
  }
}

// 세션 삭제
export function clearSession() {
  const cookieStore = cookies()
  cookieStore.delete('session')
}

// 관리자 인증 미들웨어
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}
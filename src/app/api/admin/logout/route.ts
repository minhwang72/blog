import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminSessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // 쿠키에서 세션 ID 가져오기
    const sessionId = request.cookies.get('adminSession')?.value;

    if (sessionId) {
      // 데이터베이스에서 세션 삭제
      await db.delete(adminSessions).where(eq(adminSessions.id, sessionId));
    }

    // 쿠키 삭제
    const response = NextResponse.json({ success: true });
    response.cookies.set('adminSession', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // 즉시 만료
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: '로그아웃 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
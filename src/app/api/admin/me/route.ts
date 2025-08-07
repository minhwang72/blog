import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { admins, adminSessions } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // 쿠키에서 세션 ID 가져오기
    const sessionId = request.cookies.get('adminSession')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 세션 검증 (유효하고 만료되지 않은 세션)
    const session = await db
      .select({
        id: adminSessions.id,
        adminId: adminSessions.adminId,
        expiresAt: adminSessions.expiresAt,
        username: admins.username,
      })
      .from(adminSessions)
      .innerJoin(admins, eq(adminSessions.adminId, admins.id))
      .where(
        and(
          eq(adminSessions.id, sessionId),
          gt(adminSessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (session.length === 0) {
      return NextResponse.json(
        { message: '세션이 만료되었습니다.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      admin: {
        id: session[0].adminId,
        username: session[0].username,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: '인증 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
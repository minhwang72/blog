import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { admins, adminSessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: '아이디와 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 관리자 계정 확인
    const admin = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username))
      .limit(1);

    if (admin.length === 0) {
      return NextResponse.json(
        { message: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 검증
    const isValidPassword = await bcrypt.compare(password, admin[0].password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 세션 생성 (24시간 유효)
    const sessionId = nanoid();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.insert(adminSessions).values({
      id: sessionId,
      adminId: admin[0].id,
      expiresAt,
    });

    // 쿠키에 세션 설정
    const response = NextResponse.json({
      success: true,
      sessionId,
      admin: {
        id: admin[0].id,
        username: admin[0].username,
      },
    });

    response.cookies.set('adminSession', sessionId, {
      httpOnly: true,
      secure: false, // 개발 환경에서도 작동하도록 false로 설정
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24시간
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: '로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
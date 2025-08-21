import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// GET /api/users/[id] - 특정 사용자 조회
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 관리자 인증 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = authHeader.replace('Bearer ', '');
    
    // 세션 유효성 검사
    const sessionResponse = await fetch(`${new URL(request.url).origin}/api/admin/me`, {
      headers: {
        'Authorization': `Bearer ${sessionId}`
      }
    });

    if (!sessionResponse.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        avatar: users.avatar,
        bio: users.bio,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, parseInt(params.id)))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/users/[id] - 사용자 정보 수정
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 관리자 인증 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = authHeader.replace('Bearer ', '');
    
    // 세션 유효성 검사
    const sessionResponse = await fetch(`${new URL(request.url).origin}/api/admin/me`, {
      headers: {
        'Authorization': `Bearer ${sessionId}`
      }
    });

    if (!sessionResponse.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, password, role, avatar, bio } = await request.json();

    // 사용자 존재 여부 확인
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(params.id)))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 이메일 중복 확인 (이메일이 변경되는 경우)
    if (email && email !== existingUser[0].email) {
      const emailExists = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (emailExists.length > 0) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    // 업데이트할 데이터 준비
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (avatar) updateData.avatar = avatar;
    if (bio) updateData.bio = bio;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // 사용자 정보 업데이트
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(params.id)));

    // 업데이트된 사용자 정보 조회
    const updatedUser = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        avatar: users.avatar,
        bio: users.bio,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, parseInt(params.id)))
      .limit(1);

    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/users/[id] - 사용자 삭제
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 관리자 인증 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionId = authHeader.replace('Bearer ', '');
    
    // 세션 유효성 검사
    const sessionResponse = await fetch(`${new URL(request.url).origin}/api/admin/me`, {
      headers: {
        'Authorization': `Bearer ${sessionId}`
      }
    });

    if (!sessionResponse.ok) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 사용자 존재 여부 확인
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(params.id)))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 사용자 삭제
    await db.delete(users).where(eq(users.id, parseInt(params.id)));

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
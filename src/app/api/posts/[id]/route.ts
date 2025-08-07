import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 관리자 인증 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const sessionId = authHeader.replace('Bearer ', '');
    
    // 세션 유효성 검사
    const sessionResponse = await fetch(`${request.nextUrl.origin}/api/admin/me`, {
      headers: {
        'Authorization': `Bearer ${sessionId}`
      }
    });

    if (!sessionResponse.ok) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { published } = await request.json();
    const postId = parseInt(params.id);

    await db
      .update(posts)
      .set({ published })
      .where(eq(posts.id, postId));

    const updatedPost = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
      with: {
        author: true,
        category: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 관리자 인증 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const sessionId = authHeader.replace('Bearer ', '');
    
    // 세션 유효성 검사
    const sessionResponse = await fetch(`${request.nextUrl.origin}/api/admin/me`, {
      headers: {
        'Authorization': `Bearer ${sessionId}`
      }
    });

    if (!sessionResponse.ok) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const postId = parseInt(params.id);

    await db.delete(posts).where(eq(posts.id, postId));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 
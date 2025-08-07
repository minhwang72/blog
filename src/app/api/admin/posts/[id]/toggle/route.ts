import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface Params {
  id: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const postId = parseInt(params.id);
    const { published } = await request.json();

    await db
      .update(posts)
      .set({
        published,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId));

    return NextResponse.json({ 
      success: true,
      message: published ? '포스트가 발행되었습니다.' : '포스트가 초안으로 변경되었습니다.'
    });
  } catch (error) {
    console.error('Post toggle error:', error);
    return NextResponse.json(
      { message: '발행 상태 변경 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
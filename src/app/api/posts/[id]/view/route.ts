import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    
    // 포스트 존재 확인
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // 조회수 증가
    await db
      .update(posts)
      .set({ 
        viewCount: post.viewCount + 1,
        updatedAt: new Date()
      })
      .where(eq(posts.id, postId));

    return NextResponse.json({ 
      success: true,
      viewCount: post.viewCount + 1 
    });
  } catch (error) {
    console.error('Error processing view:', error);
    return NextResponse.json(
      { error: 'Failed to process view' },
      { status: 500 }
    );
  }
} 
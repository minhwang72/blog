import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq, and, ne, sql, isNotNull } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentPost = await db.query.posts.findFirst({
      where: eq(posts.id, parseInt(params.id)),
    });

    if (!currentPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // 같은 카테고리의 다른 포스트 중 최근 3개를 가져옴
    const relatedPosts = await db
      .select()
      .from(posts)
      .where(
        and(
          isNotNull(posts.categoryId),
          eq(posts.categoryId, currentPost.categoryId || 0),
          ne(posts.id, currentPost.id)
        )
      )
      .orderBy(sql`RAND()`)
      .limit(3);

    return NextResponse.json(relatedPosts);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related posts' },
      { status: 500 }
    );
  }
} 
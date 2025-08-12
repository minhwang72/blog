import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, comments, users, categories } from '@/lib/db/schema';
import { sql, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // 세션 검증은 middleware에서 처리된다고 가정하거나, 여기서 추가로 검증

    // 통계 데이터 수집
    const [
      totalPostsResult,
      totalCommentsResult,
      totalViewsResult,
      recentPosts,
      recentComments
    ] = await Promise.all([
      // 총 포스트 수
      db.select({ count: sql<number>`count(*)` }).from(posts),
      
      // 총 댓글 수
      db.select({ count: sql<number>`count(*)` }).from(comments),
      
      // 총 조회수
      db.select({ totalViews: sql<number>`sum(view_count)` }).from(posts),
      
      // 최근 포스트 5개
      db.select({
        id: posts.id,
        title: posts.title,
        createdAt: posts.createdAt,
        viewCount: posts.viewCount,
      })
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(5),
      
      // 최근 댓글 5개
      db.select({
        id: comments.id,
        content: comments.content,
        name: comments.name,
        createdAt: comments.createdAt,
        postId: comments.postId,
        postTitle: posts.title,
      })
      .from(comments)
      .innerJoin(posts, sql`${comments.postId} = ${posts.id}`)
      .orderBy(desc(comments.createdAt))
      .limit(5)
    ]);

    const stats = {
      totalPosts: totalPostsResult[0]?.count || 0,
      totalComments: totalCommentsResult[0]?.count || 0,
      totalViews: totalViewsResult[0]?.totalViews || 0,
      recentPosts: recentPosts.map(post => ({
        id: post.id,
        title: post.title,
        createdAt: post.createdAt?.toISOString() || '',
        viewCount: post.viewCount || 0,
      })),
      recentComments: recentComments.map(comment => ({
        id: comment.id,
        content: comment.content,
        name: comment.name,
        createdAt: comment.createdAt?.toISOString() || '',
        postId: comment.postId,
        postTitle: comment.postTitle,
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { message: '통계 데이터를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
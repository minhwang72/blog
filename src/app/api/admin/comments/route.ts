import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comments, posts } from '@/lib/db/schema';
import { eq, desc, sql, isNull, isNotNull } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const filter = searchParams.get('filter') || 'all';
    const offset = (page - 1) * limit;

    // 댓글 목록 조회
    let commentsData;
    let totalCountResult;

    if (filter === 'comments') {
      // 댓글만 (parentId가 null인 것)
      commentsData = await db
        .select({
          id: comments.id,
          content: comments.content,
          name: comments.name,
          password: comments.password,
          createdAt: comments.createdAt,
          postId: comments.postId,
          parentId: comments.parentId,
          postTitle: posts.title,
        })
        .from(comments)
        .innerJoin(posts, eq(comments.postId, posts.id))
        .where(isNull(comments.parentId))
        .orderBy(desc(comments.createdAt))
        .limit(limit)
        .offset(offset);

      totalCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(comments)
        .innerJoin(posts, eq(comments.postId, posts.id))
        .where(isNull(comments.parentId));
    } else if (filter === 'replies') {
      // 답글만 (parentId가 null이 아닌 것)
      commentsData = await db
        .select({
          id: comments.id,
          content: comments.content,
          name: comments.name,
          password: comments.password,
          createdAt: comments.createdAt,
          postId: comments.postId,
          parentId: comments.parentId,
          postTitle: posts.title,
        })
        .from(comments)
        .innerJoin(posts, eq(comments.postId, posts.id))
        .where(isNotNull(comments.parentId))
        .orderBy(desc(comments.createdAt))
        .limit(limit)
        .offset(offset);

      totalCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(comments)
        .innerJoin(posts, eq(comments.postId, posts.id))
        .where(isNotNull(comments.parentId));
    } else {
      // 전체
      commentsData = await db
        .select({
          id: comments.id,
          content: comments.content,
          name: comments.name,
          password: comments.password,
          createdAt: comments.createdAt,
          postId: comments.postId,
          parentId: comments.parentId,
          postTitle: posts.title,
        })
        .from(comments)
        .innerJoin(posts, eq(comments.postId, posts.id))
        .orderBy(desc(comments.createdAt))
        .limit(limit)
        .offset(offset);

      totalCountResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(comments)
        .innerJoin(posts, eq(comments.postId, posts.id));
    }

    const totalCount = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      comments: commentsData.map(comment => ({
        id: comment.id,
        content: comment.content,
        name: comment.name,
        email: comment.password, // password 필드를 email로 사용
        createdAt: comment.createdAt?.toISOString(),
        postId: comment.postId,
        postTitle: comment.postTitle,
        parentId: comment.parentId,
        isReply: comment.parentId !== null,
      })),
      totalPages,
      currentPage: page,
      totalCount,
    });
  } catch (error) {
    console.error('Comments fetch error:', error);
    return NextResponse.json(
      { message: '댓글 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
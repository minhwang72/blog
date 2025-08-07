import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comments, posts } from '@/lib/db/schema';
import { eq, desc, sql, isNull, isNotNull } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const filter = searchParams.get('filter') || 'all'; // 'all', 'main', 'replies'
    const offset = (page - 1) * limit;

    // 필터 조건 설정
    let whereCondition;
    switch (filter) {
      case 'main':
        whereCondition = isNull(comments.parentId);
        break;
      case 'replies':
        whereCondition = isNotNull(comments.parentId);
        break;
      default:
        whereCondition = undefined;
    }

    // 댓글 목록 조회 (관리자용)
    const commentsQuery = db
      .select({
        id: comments.id,
        content: comments.content,
        name: comments.name,
        email: comments.email,
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

    if (whereCondition) {
      commentsQuery.where(whereCondition);
    }

    const commentsData = await commentsQuery;

    // 전체 댓글 수 조회
    const totalCountQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(comments)
      .innerJoin(posts, eq(comments.postId, posts.id));

    if (whereCondition) {
      totalCountQuery.where(whereCondition);
    }

    const totalCountResult = await totalCountQuery;
    const totalCount = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      comments: commentsData.map(comment => ({
        id: comment.id,
        content: comment.content,
        name: comment.name,
        email: comment.email,
        createdAt: comment.createdAt?.toISOString(),
        postId: comment.postId,
        postTitle: comment.postTitle,
        parentId: comment.parentId,
        isReply: comment.parentId !== null,
      })),
      totalPages,
      currentPage: page,
      totalCount,
      filter,
    });
  } catch (error) {
    console.error('Comments fetch error:', error);
    return NextResponse.json(
      { message: '댓글 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
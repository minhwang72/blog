import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface Params {
  id: string;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const commentId = parseInt(params.id);

    // 댓글 존재 확인
    const existingComment = await db
      .select({ 
        id: comments.id,
        parentId: comments.parentId 
      })
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (existingComment.length === 0) {
      return NextResponse.json(
        { message: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const comment = existingComment[0];

    // 메인 댓글인 경우, 하위 답글들도 함께 삭제
    if (comment.parentId === null) {
      // 답글들 먼저 삭제
      await db.delete(comments).where(eq(comments.parentId, commentId));
    }

    // 해당 댓글 삭제
    await db.delete(comments).where(eq(comments.id, commentId));

    return NextResponse.json({ 
      success: true,
      message: comment.parentId === null 
        ? '댓글과 관련 답글이 모두 삭제되었습니다.'
        : '답글이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('Comment delete error:', error);
    return NextResponse.json(
      { message: '댓글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const commentId = parseInt(params.id);

    const commentData = await db
      .select({
        id: comments.id,
        content: comments.content,
        name: comments.name,
        createdAt: comments.createdAt,
        postId: comments.postId,
        parentId: comments.parentId,
      })
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (commentData.length === 0) {
      return NextResponse.json(
        { message: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const comment = commentData[0];

    return NextResponse.json({
      id: comment.id,
      content: comment.content,
      name: comment.name,
      createdAt: comment.createdAt?.toISOString(),
      postId: comment.postId,
      parentId: comment.parentId,
      isReply: comment.parentId !== null,
    });
  } catch (error) {
    console.error('Comment fetch error:', error);
    return NextResponse.json(
      { message: '댓글을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comments } from '@/lib/db/schema';
import { eq, desc, isNull } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// 댓글 조회 (포스트별)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    
    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    // 최상위 댓글들과 대댓글들을 모두 가져와서 클라이언트에서 구조화
    const allComments = await db
      .select({
        id: comments.id,
        content: comments.content,
        name: comments.name,
        postId: comments.postId,
        parentId: comments.parentId,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
      })
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    return NextResponse.json(allComments);
  } catch (error) {
    console.error('댓글 조회 오류:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// 댓글 작성
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    const body = await request.json();
    const { content, name, password, parentId } = body;

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    if (!content || !name || !password) {
      return NextResponse.json(
        { error: 'Content, name, and password are required' },
        { status: 400 }
      );
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 12);

    // 댓글 생성
    const newComment = await db.insert(comments).values({
      content: content.trim(),
      name: name.trim(),
      password: hashedPassword,
      postId,
      parentId: parentId || null,
    });

    return NextResponse.json({ 
      success: true, 
      id: newComment.insertId,
      message: 'Comment created successfully'
    });
  } catch (error) {
    console.error('댓글 작성 오류:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

// 댓글 수정
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    const body = await request.json();
    const { commentId, content, password } = body;

    if (isNaN(postId) || !commentId) {
      return NextResponse.json(
        { error: 'Invalid post ID or comment ID' },
        { status: 400 }
      );
    }

    if (!content || !password) {
      return NextResponse.json(
        { error: 'Content and password are required' },
        { status: 400 }
      );
    }

    // 댓글 조회
    const comment = await db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (comment.length === 0) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, comment[0].password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // 댓글 수정
    await db
      .update(comments)
      .set({ 
        content: content.trim(),
        updatedAt: new Date()
      })
      .where(eq(comments.id, commentId));

    return NextResponse.json({ 
      success: true, 
      message: 'Comment updated successfully'
    });
  } catch (error) {
    console.error('댓글 수정 오류:', error);
    return NextResponse.json(
      { error: 'Failed to update comment' },
      { status: 500 }
    );
  }
}

// 댓글 삭제
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    const body = await request.json();
    const { commentId, password } = body;

    if (isNaN(postId) || !commentId) {
      return NextResponse.json(
        { error: 'Invalid post ID or comment ID' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // 댓글 조회
    const comment = await db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (comment.length === 0) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, comment[0].password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // 댓글 삭제 (연쇄 삭제로 대댓글도 함께 삭제됨)
    await db
      .delete(comments)
      .where(eq(comments.id, commentId));

    return NextResponse.json({ 
      success: true, 
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}
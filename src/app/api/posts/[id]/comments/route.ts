import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postComments = await db.query.comments.findMany({
      where: eq(comments.postId, parseInt(params.id)),
      with: {
        author: true,
      },
      orderBy: (comments, { desc }) => [desc(comments.createdAt)],
    });

    // 댓글 계층 구조 구성
    const commentMap = new Map();
    const rootComments: typeof postComments = [];

    postComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    postComments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id);
      if (comment.parentId) {
        const parentComment = commentMap.get(comment.parentId);
        if (parentComment) {
          parentComment.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return NextResponse.json(rootComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { content, parentId } = await request.json();
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const newComment = await db.insert(comments).values({
      content,
      postId: parseInt(params.id),
      authorId: session.user.id,
      parentId: parentId ? parseInt(parentId) : null,
    });

    return NextResponse.json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
} 
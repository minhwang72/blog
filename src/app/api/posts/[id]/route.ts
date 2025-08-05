import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
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
    const session = await getServerSession();

    if (!session?.user) {
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
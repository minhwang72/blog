import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, parseInt(params.id)),
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing view:', error);
    return NextResponse.json(
      { error: 'Failed to process view' },
      { status: 500 }
    );
  }
} 
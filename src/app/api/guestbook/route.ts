import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { guestbook } from '@/lib/db/schema';

export async function GET() {
  try {
    const entries = await db.select().from(guestbook).orderBy(guestbook.createdAt);
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch guestbook entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, authorId } = body;

    const newEntry = await db.insert(guestbook).values({
      content,
      authorId,
    });

    return NextResponse.json(newEntry);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create guestbook entry' },
      { status: 500 }
    );
  }
} 
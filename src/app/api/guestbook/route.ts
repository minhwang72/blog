import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { guestbook } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const entries = await db
      .select()
      .from(guestbook)
      .orderBy(desc(guestbook.createdAt));
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Guestbook GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guestbook entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, name, email } = body;

    if (!content || !name) {
      return NextResponse.json(
        { error: 'Content and name are required' },
        { status: 400 }
      );
    }

    const newEntry = await db.insert(guestbook).values({
      content,
      name,
      email: email || null,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: newEntry.insertId });
  } catch (error) {
    console.error('Guestbook POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create guestbook entry' },
      { status: 500 }
    );
  }
} 
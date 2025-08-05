import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as SessionUser).role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { topic, tone, length } = await req.json();

    if (!topic) {
      return new NextResponse('Topic is required', { status: 400 });
    }

    // Simple response since OpenAI is not being used
    const content = `This is a sample blog post about "${topic}" in a ${tone} tone. The post would be ${length} in length. This feature is currently disabled.`;

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error generating content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const prompt = `Write a blog post about "${topic}" in a ${tone} tone. The post should be ${length} in length. Include an introduction, main points, and a conclusion.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional blog writer. Write engaging and informative content.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length === 'short' ? 500 : length === 'medium' ? 1000 : 2000,
    });

    const content = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error generating content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 
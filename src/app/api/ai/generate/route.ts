import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 관리자 인증 확인
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const sessionId = authHeader.replace('Bearer ', '');
    
    // 세션 유효성 검사
    const sessionResponse = await fetch(`${req.nextUrl.origin}/api/admin/me`, {
      headers: {
        'Authorization': `Bearer ${sessionId}`
      }
    });

    if (!sessionResponse.ok) {
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
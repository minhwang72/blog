import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // API 요청에 대해서만 타임아웃 설정
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

    try {
      return NextResponse.next({
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}; 
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 관리자 페이지 접근 시 인증 확인
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminSession = request.cookies.get('adminSession');
    
    // 세션이 없으면 로그인 페이지로 리다이렉트
    if (!adminSession || !adminSession.value) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 로그인 페이지에서는 리다이렉션 로직 제거 (클라이언트에서 처리)
  // 무한 리다이렉션 방지를 위해 미들웨어에서는 단순히 통과시킴

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
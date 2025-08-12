import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 관리자 페이지 접근 시에만 인증 확인
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    console.log('🔍 미들웨어 - 관리자 페이지 접근:', pathname);
    console.log('🔍 미들웨어 - 요청 URL:', request.url);
    
    const adminSession = request.cookies.get('adminSession');
    console.log('🔍 미들웨어 - adminSession 쿠키:', adminSession);
    console.log('🔍 미들웨어 - 모든 쿠키:', request.cookies.getAll());
    
    // 세션이 없으면 로그인 페이지로 리다이렉트
    if (!adminSession || !adminSession.value) {
      console.log('❌ 미들웨어 - 세션 없음, 로그인 페이지로 리다이렉트');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    console.log('✅ 미들웨어 - 세션 확인됨, 접근 허용');
  }

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
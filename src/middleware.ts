import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 미들웨어 일시적으로 비활성화 (테스트용)
  console.log('🔍 미들웨어 - 요청 경로:', pathname);
  
  // 관리자 페이지 접근 시에만 인증 확인 (일시적으로 주석 처리)
  /*
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    console.log('🔍 미들웨어 - 관리자 페이지 접근:', pathname);
    console.log('🔍 미들웨어 - 요청 URL:', request.url);
    console.log('🔍 미들웨어 - 요청 헤더:', Object.fromEntries(request.headers.entries()));
    
    // 쿠키 읽기 시도 1: get 메서드
    const adminSession = request.cookies.get('adminSession');
    console.log('🔍 미들웨어 - adminSession 쿠키 (get):', adminSession);
    
    // 쿠키 읽기 시도 2: getAll 메서드
    const allCookies = request.cookies.getAll();
    console.log('🔍 미들웨어 - 모든 쿠키 (getAll):', allCookies);
    
    // 쿠키 읽기 시도 3: toString 메서드
    const cookieString = request.cookies.toString();
    console.log('🔍 미들웨어 - 쿠키 문자열:', cookieString);
    
    // 세션이 없으면 로그인 페이지로 리다이렉트
    if (!adminSession || !adminSession.value) {
      console.log('❌ 미들웨어 - 세션 없음, 로그인 페이지로 리다이렉트');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    console.log('✅ 미들웨어 - 세션 확인됨, 접근 허용');
  }
  */

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
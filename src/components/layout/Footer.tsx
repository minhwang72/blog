'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  // 홈 페이지가 아니면 푸터를 렌더링하지 않음
  if (pathname !== '/') {
    return null;
  }
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="w-full flex h-auto items-center px-6 py-8">
        <div className="w-full">
          {/* 메인 푸터 콘텐츠 */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 mb-8">
            {/* 왼쪽: 로고 및 소개 */}
            <div className="text-center lg:text-left lg:max-w-md">
              <div className="logo text-2xl font-bold mb-3">min.log</div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                개발, 일상, 그리고 배움의 기록을 공유하는 공간입니다.
              </p>
            </div>
            
            {/* 오른쪽: 카테고리 링크 */}
            <div className="text-center lg:text-right">
              <div className="flex flex-wrap justify-center lg:justify-end gap-4 text-sm">
                <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  홈
                </Link>
                <Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  블로그
                </Link>
                <Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  소개
                </Link>

              </div>
            </div>
          </div>
          
          {/* 구분선 */}
          <div className="w-full h-px bg-slate-200 dark:bg-slate-700 mb-6"></div>
          
          {/* 하단: 저작권 정보 */}
          <div className="text-center lg:text-left">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              © 2025 Hwang Min. All rights reserved.
            </p>
          </div>
          
          {/* 관리자 버튼 - 간소하게 하단에 */}
          <div className="text-center mt-2">
            <a
              href="/admin/login"
              className="inline-flex items-center px-2 py-1 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors opacity-70 hover:opacity-100"
            >
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              관리자
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 
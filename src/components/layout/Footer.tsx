'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  // 관리자 페이지에서는 푸터를 렌더링하지 않음
  if (pathname.startsWith('/admin')) {
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
            
            {/* 오른쪽: 설정 아이콘 */}
            <div className="text-center lg:text-right">
              <a
                href="/admin/login"
                className="inline-flex items-center p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors opacity-70 hover:opacity-100"
                title="관리자 설정"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </a>
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
          

        </div>
      </div>
    </footer>
  );
} 
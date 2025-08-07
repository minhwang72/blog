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
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* 메인 콘텐츠 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* 로고 및 소개 */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold bg-gradient-to-r from-sky-400 via-slate-500 to-gray-600 bg-clip-text text-transparent">
                  min.log
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center sm:text-left max-w-xs">
                개발자의 기술과 배움을 기록하는 공간
              </p>
            </div>
            
            {/* 저작권 정보 */}
            <div className="text-center sm:text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                © 2025 min.log. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 
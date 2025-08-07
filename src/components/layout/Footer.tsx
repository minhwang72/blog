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
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* 메인 콘텐츠 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* 로고 및 소개 */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  min.log
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left max-w-xs">
                황민의 개인 블로그
              </p>
            </div>
            
            {/* 저작권 정보 */}
            <div className="text-center sm:text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                © 2025 Hwang Min. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 
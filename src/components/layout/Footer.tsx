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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          {/* 메인 콘텐츠 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* 로고 및 소개 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  min.log
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                개발자의 기술과 배움을 기록하는 공간입니다. 
                새로운 기술을 탐구하고, 경험을 공유하며, 함께 성장하는 지식의 공간입니다.
              </p>
            </div>
            
            {/* 빠른 링크 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                빠른 링크
              </h3>
              <div className="space-y-2">
                <Link href="/" className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  홈
                </Link>
                <Link href="/blog" className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  블로그
                </Link>
                <Link href="/categories" className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  카테고리
                </Link>
                <Link href="/search" className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  검색
                </Link>
              </div>
            </div>
            
            {/* 기술 스택 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                기술 스택
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Next.js, React, TypeScript
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Tailwind CSS, MySQL
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Prisma ORM, AWS
                </p>
              </div>
            </div>
          </div>
          
          {/* 하단 정보 */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  © 2025 min.log. All rights reserved.
                </p>
              </div>
              <div className="flex items-center space-x-6 text-xs text-slate-500 dark:text-slate-400">
                <a 
                  href="https://github.com/minhwang72" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  GitHub
                </a>
                <a 
                  href="https://linkedin.com/in/minhwang72" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  LinkedIn
                </a>
                <a 
                  href="/admin" 
                  rel="noopener noreferrer"
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  settings
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 
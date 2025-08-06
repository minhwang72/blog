import Link from 'next/link';
import { Github, Mail, Settings } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="w-full px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-6">
          {/* 로고 및 소개 */}
          <div className="text-center">
            <div className="logo text-2xl font-bold mb-2">min.log</div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
              개발, 일상, 그리고 배움에 대한 기록을 공유하는 공간입니다.
            </p>
          </div>
          
          {/* 카테고리 링크 */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              홈
            </Link>
            <Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              블로그
            </Link>
            <Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              소개
            </Link>
            <Link href="/admin" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
              관리자
            </Link>
          </div>
          
          {/* 구분선 */}
          <div className="w-full max-w-md h-px bg-slate-200 dark:bg-slate-700"></div>
          
          {/* 저작권 정보 */}
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              © 2025 hwang min. All rights reserved.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
              Built with Next.js 14 & TypeScript
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 
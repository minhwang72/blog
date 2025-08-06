import Link from 'next/link';
import { Github, Mail, Settings } from 'lucide-react';

export default function Footer() {
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
                <Link href="/admin" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  관리자
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
        </div>
      </div>
    </footer>
  );
} 
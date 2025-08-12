'use client';

import Link from "next/link";
import { Menu, X, Settings } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navigation = [
  { name: "홈", href: "/" },
  { name: "블로그", href: "/blog" },
  { name: "카테고리", href: "/categories" },
  { name: "검색", href: "/search" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm">
      <div className="w-full flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* 로고 */}
        <Link href="/" className="logo text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          min.log
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex items-center gap-6 ml-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 relative group py-2"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          <ThemeToggle />
          <Link
            href="/admin/login"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors opacity-70 hover:opacity-100 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="관리자 설정"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </nav>

        {/* 모바일 메뉴 버튼 */}
        <div className="md:hidden ml-auto flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 - 드롭다운 박스 */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-lg">
          <nav className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-base font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* 관리자 설정 버튼 - 모바일에서만 표시 */}
            <div className="pt-2 mt-4 border-t border-slate-200 dark:border-slate-700">
              <Link
                href="/admin/login"
                className="flex items-center gap-3 text-base font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                관리자 설정
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
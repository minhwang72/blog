'use client';

import Link from "next/link";
import { Menu, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Category {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}

const navigation = [
  { name: "홈", href: "/" },
  { name: "블로그", href: "/blog" },
  { name: "소개", href: "/about" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
      <div className="w-full flex h-16 items-center px-6">
        {/* 로고 */}
        <Link href="/" className="logo text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          min.log
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex items-center gap-8 ml-auto">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 relative group py-2"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          
          {/* 카테고리 드롭다운 */}
          <div className="relative">
            <button
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 relative group py-2"
            >
              카테고리
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
            
            {/* 카테고리 드롭다운 메뉴 */}
            {isCategoryOpen && (
              <div
                onMouseEnter={() => setIsCategoryOpen(true)}
                onMouseLeave={() => setIsCategoryOpen(false)}
                className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50"
              >
                <Link
                  href="/blog"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>전체 보기</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                      {categories.reduce((sum, cat) => sum + cat.postCount, 0)}
                    </span>
                  </div>
                </Link>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                        {category.postCount}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* 토글 & 모바일 메뉴 버튼 */}
        <div className="flex items-center gap-4 ml-4 md:ml-6">
          <ThemeToggle />
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="메뉴 열기"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-4">
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* 모바일 카테고리 */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-2 uppercase tracking-wider">
                카테고리
              </div>
              <Link
                href="/blog"
                className="block py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <span>전체 보기</span>
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                    {categories.reduce((sum, cat) => sum + cat.postCount, 0)}
                  </span>
                </div>
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="block py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    <span>{category.name}</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                      {category.postCount}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

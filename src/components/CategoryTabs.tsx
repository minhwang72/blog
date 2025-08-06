'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}

function CategoryTabsContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

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
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categorySlug: string) => {
    if (categorySlug === 'all') {
      router.push('/');
    } else {
      router.push(`/?category=${categorySlug}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          카테고리
        </h3>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        카테고리
      </h3>
      
      <div className="space-y-2">
        {/* 전체 보기 탭 */}
        <button
          onClick={() => handleCategoryClick('all')}
          className={`tab w-full text-left flex items-center justify-between ${
            currentCategory === 'all' ? 'active' : ''
          }`}
        >
          <span>전체 보기</span>
          <span className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full">
            {categories.reduce((sum, cat) => sum + cat.postCount, 0)}
          </span>
        </button>

        {/* 카테고리 탭들 */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.slug)}
            className={`tab w-full text-left flex items-center justify-between ${
              currentCategory === category.slug ? 'active' : ''
            }`}
          >
            <span>{category.name}</span>
            <span className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full">
              {category.postCount}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CategoryTabs() {
  return (
    <Suspense fallback={
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          카테고리
        </h3>
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    }>
      <CategoryTabsContent />
    </Suspense>
  );
} 
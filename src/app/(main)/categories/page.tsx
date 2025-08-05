import Link from 'next/link';
import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';

export const metadata = {
  title: '카테고리 - 은밍의 블로그',
  description: '은밍의 블로그 카테고리 목록입니다.',
};

async function getAllCategories() {
  return await db.query.categories.findMany();
}

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="py-8 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            카테고리
          </h1>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
            관심 있는 주제의 글을 모아보세요.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative isolate flex items-center gap-x-6 overflow-hidden rounded-2xl bg-gray-100 px-6 py-12 dark:bg-gray-800"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-100 via-gray-100/10 dark:from-gray-800 dark:via-gray-800/10" />
              <div>
                <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900 dark:text-white">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {category.description}
                </p>
                <div className="mt-4 flex items-center gap-x-2 text-sm font-semibold leading-6 text-blue-600 dark:text-blue-400">
                  <span>더 보기</span>
                  <svg
                    className="h-5 w-5 transition group-hover:translate-x-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 
import { db } from '@/lib/db';
import { categories, posts, users } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import Link from 'next/link';
import { Metadata } from 'next';
import PostList from '@/components/PostList';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'min.log',
  description: '개발, 일상, 그리고 배움에 대한 기록',
};

async function getCategories() {
  try {
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
      return [];
    }

    const allCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
      })
      .from(categories);
    
    return Array.isArray(allCategories) ? allCategories : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Home() {
  const categoryList = await getCategories();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">
          개발, 일상 그리고 배움에 대한 기록
        </h1>
        <p className="text-xl text-gray-600">
          프로그래밍, 일상 생활, 그리고 새로운 것을 배우는 과정을 기록합니다.
        </p>
      </section>

      {/* Categories Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">카테고리</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.isArray(categoryList) && categoryList.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">최근 포스트</h2>
        <PostList />
      </section>
    </div>
  );
} 
import { db } from '@/lib/db';
import { posts, users, categories } from '@/lib/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug);
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, decodedSlug))
    .limit(1);

  if (!category[0]) {
    return {
      title: '카테고리를 찾을 수 없습니다',
      description: '요청하신 카테고리를 찾을 수 없습니다.',
    };
  }

  return {
    title: `${category[0].name} 카테고리`,
    description: `${category[0].name} 카테고리의 모든 포스트를 확인하세요.`,
  };
}

async function getCategory(slug: string) {
  try {
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    return category[0] || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function getCategoryPosts(categoryId: number) {
  try {
    const categoryPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorName: users.name,
        categoryName: categories.name,
        categoryId: posts.categoryId,
        viewCount: posts.viewCount,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(
        and(
          eq(posts.categoryId, categoryId),
          eq(posts.published, true)
        )
      )
      .orderBy(desc(posts.createdAt));

    return Array.isArray(categoryPosts) ? categoryPosts : [];
  } catch (error) {
    console.error('Error fetching category posts:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const decodedSlug = decodeURIComponent(params.slug);
  const category = await getCategory(decodedSlug);
  
  if (!category) {
    notFound();
  }

  const categoryPosts = await getCategoryPosts(category.id);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="space-y-8">
          {/* 헤더 섹션 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                카테고리
              </Link>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                {category.name}
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                {categoryPosts.length}개의 포스트
              </p>
            </div>
          </div>

          {/* 포스트 목록 */}
          <div className="space-y-6">
            {categoryPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📂</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  포스트가 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  이 카테고리에 아직 포스트가 없습니다.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group relative rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 hover:shadow-md bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-800"
                  >
                    <Link href={`/blog/${post.id}`} className="block h-full">
                      <div className="flex flex-col h-full">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 mb-3">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-grow text-sm">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-auto space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <time dateTime={post.createdAt.toString()}>
                              {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </time>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
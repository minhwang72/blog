import { db } from '@/lib/db';
import { posts, users, categories } from '@/lib/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import Link from 'next/link';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '카테고리별 보기',
  description: '카테고리별로 정리된 포스트를 확인하세요.',
};

async function getCategories() {
  try {
    const allCategories = await db.select().from(categories);

    const categoriesWithCount = await Promise.all(
      allCategories.map(async (category) => {
        const postCount = await db
          .select({ count: posts.id })
          .from(posts)
          .where(
            and(
              eq(posts.categoryId, category.id),
              eq(posts.published, true)
            )
          );

        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          postCount: postCount.length,
        };
      })
    );

    return categoriesWithCount.filter(category => category.postCount > 0);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getPosts() {
  try {
    const allPosts = await db
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
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt));

    return Array.isArray(allPosts) ? allPosts : [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const [categories, posts] = await Promise.all([
    getCategories(),
    getPosts()
  ]);

  // 디버깅용 로그
  console.log('Categories data:', categories.map(c => ({ name: c.name, slug: c.slug })));

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="space-y-8">
          {/* 헤더 섹션 */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              카테고리
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              주제별로 분류된 포스트들을 확인하세요.
            </p>
          </div>

          {/* 카테고리별 포스트 그리드 */}
          <div className="space-y-8">
            {categories.map((category) => {
              const categoryPosts = posts
                .filter(post => post.categoryId === category.id)
                .slice(0, 4); // 최신 4개만

              return (
                <div key={category.id} className="space-y-4">
                  {/* 카테고리 헤더 */}
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/categories/${category.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 hover:from-blue-200 hover:to-indigo-200 dark:hover:from-blue-800/40 dark:hover:to-indigo-800/40 border border-blue-200 dark:border-blue-800/50 transition-all duration-200 hover:shadow-md cursor-pointer"
                    >
                      <h3 className="text-lg font-semibold">
                        {category.name}
                      </h3>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full">
                        {category.postCount}
                      </span>
                    </Link>
                  </div>

                  {/* 포스트 그리드 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categoryPosts.map((post) => (
                      <article
                        key={post.id}
                        className="group relative rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 hover:shadow-md bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-800"
                      >
                        <Link href={`/blog/${post.id}`} className="block h-full">
                          <div className="flex flex-col h-full">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 mb-3">
                              {post.title}
                            </h4>
                            {post.excerpt && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
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

                  {/* 더보기 버튼 */}
                  <div className="flex justify-center pt-4">
                    <Link
                      href={`/categories/${category.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      모든 글 보기
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 
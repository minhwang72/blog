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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="space-y-12">
          {/* 헤더 섹션 */}
          <div className="text-center space-y-6">
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-400 via-slate-500 to-gray-600 bg-clip-text text-transparent">
                카테고리
              </h1>
              <div className="absolute -inset-x-6 -inset-y-3 bg-gradient-to-r from-sky-100/50 via-slate-100/50 to-gray-100/50 dark:from-sky-900/20 dark:via-slate-900/20 dark:to-gray-900/20 rounded-3xl blur-3xl -z-10 opacity-30"></div>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              주제별로 정리된 포스트들을 확인하세요.
            </p>
          </div>

          {/* 카테고리별 포스트 그리드 */}
          <div className="space-y-12">
            {categories.map((category) => {
              const categoryPosts = posts.filter(post => post.categoryName === category.name);
              
              return (
                <div key={category.id} className="space-y-6">
                  {/* 카테고리 헤더 */}
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {category.name}
                      </h2>
                      <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                        {categoryPosts.length}개의 포스트
                      </span>
                    </div>
                    <Link 
                      href={`/categories/${category.slug}`}
                      className="text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                    >
                      모두 보기 →
                    </Link>
                  </div>

                  {/* 포스트 그리드 */}
                  {categoryPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-slate-500 dark:text-slate-400">
                        이 카테고리에 포스트가 없습니다.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {categoryPosts.slice(0, 6).map((post) => (
                        <div key={post.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 h-full flex flex-col relative overflow-hidden group">
                          {/* 배경 그라데이션 효과 */}
                          <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-indigo-50/30 to-purple-50/50 dark:from-sky-900/10 dark:via-indigo-900/5 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* 카테고리 태그 */}
                          <div className="mb-4 relative z-10">
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 rounded-full border border-sky-200 dark:border-sky-800">
                              {category.name}
                            </span>
                          </div>

                          {/* 제목 */}
                          <Link href={`/blog/${post.id}`} className="relative z-10">
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-200 line-clamp-2">
                              {post.title}
                            </h3>
                          </Link>

                          {/* 요약 */}
                          {post.excerpt && (
                            <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 flex-grow relative z-10">
                              {post.excerpt}
                            </p>
                          )}

                          {/* 메타 정보 */}
                          <div className="mt-auto space-y-3 relative z-10">
                            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{new Date(post.createdAt).toLocaleDateString('ko-KR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}</span>
                              </div>
                            </div>
                          </div>

                          {/* 우상단 장식 요소 */}
                          <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-sky-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 
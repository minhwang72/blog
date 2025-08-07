import { Suspense } from 'react';
import { db } from '@/lib/db';
import { posts, users, categories } from '@/lib/db/schema';
import { desc, like, or, eq, and } from 'drizzle-orm';
import PostCard from '@/components/blog/PostCard';
import SearchBar from '@/components/ui/SearchBar';
import { Metadata } from 'next';
import Link from 'next/link';

interface SearchPageProps {
  searchParams: { q?: string };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || '';
  
  if (!query) {
    return {
      title: '검색',
      description: '블로그 포스트를 검색하세요.',
    };
  }

  return {
    title: `"${query}" 검색 결과`,
    description: `"${query}"에 대한 검색 결과입니다.`,
    keywords: `${query},검색,블로그,개발,프로그래밍,황민`,
    robots: 'index, follow',
    openGraph: {
      title: `"${query}" 검색 결과`,
      description: `"${query}"에 대한 검색 결과입니다.`,
      url: `https://blog.eungming.com/search?q=${encodeURIComponent(query)}`,
      siteName: 'min.log',
    },
  };
}

async function searchPosts(query: string) {
  try {
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
      return [];
    }

    if (!query.trim()) {
      return [];
    }

    const searchResults = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorId: posts.authorId,
        authorName: users.name,
        categoryName: categories.name,
        categorySlug: categories.slug,
        viewCount: posts.viewCount,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(
        and(
          eq(posts.published, true),
          or(
            like(posts.title, `%${query}%`),
            like(posts.content, `%${query}%`),
            like(posts.excerpt, `%${query}%`)
          )
        )
      )
      .orderBy(desc(posts.createdAt));

    return Array.isArray(searchResults) ? searchResults : [];
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const searchResults = await searchPosts(query);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* 검색 섹션 */}
        <div className="w-full max-w-4xl mx-auto text-center space-y-12">
          {/* 헤더 섹션 */}
          <div className="text-center space-y-6">
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-400 via-slate-500 to-gray-600 bg-clip-text text-transparent">
                검색
              </h1>
              <div className="absolute -inset-x-6 -inset-y-3 bg-gradient-to-r from-sky-100/50 via-slate-100/50 to-gray-100/50 dark:from-sky-900/20 dark:via-slate-900/20 dark:to-gray-900/20 rounded-3xl blur-3xl -z-10 opacity-30"></div>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              원하는 내용을 검색해보세요.
            </p>
          </div>

          {/* 검색바 */}
          <div className="w-full max-w-2xl mx-auto">
            <SearchBar />
          </div>

          {/* 검색 결과 */}
          {query && (
            <div className="space-y-8">
              {searchResults.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    검색 결과가 없습니다
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    다른 키워드로 검색해보세요.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {searchResults.map((post) => (
                    <div key={post.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 h-full flex flex-col relative overflow-hidden group">
                      {/* 배경 그라데이션 효과 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-indigo-50/30 to-purple-50/50 dark:from-sky-900/10 dark:via-indigo-900/5 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* 카테고리 태그 */}
                      {post.categoryName && (
                        <div className="mb-4 relative z-10">
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 rounded-full border border-sky-200 dark:border-sky-800">
                            {post.categoryName}
                          </span>
                        </div>
                      )}

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
          )}
        </div>
      </div>
    </div>
  );
} 
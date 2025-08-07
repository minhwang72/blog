import { Suspense } from 'react';
import { db } from '@/lib/db';
import { posts, users, categories } from '@/lib/db/schema';
import { desc, like, or, eq, and } from 'drizzle-orm';
import PostCard from '@/components/blog/PostCard';
import SearchBar from '@/components/ui/SearchBar';
import { Metadata } from 'next';

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
    <div className="min-h-screen flex flex-col">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* 검색 섹션 */}
        <div className="w-full max-w-4xl mx-auto text-center space-y-8">
          {/* 검색 헤더 */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {query ? `"${query}" 검색 결과` : '블로그 검색'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {query 
                ? `${searchResults.length}개의 포스트를 찾았습니다.`
                : '제목, 내용, 요약에서 검색할 수 있습니다.'
              }
            </p>
          </div>

          {/* 검색바 */}
          <div className="max-w-2xl mx-auto">
            <SearchBar initialQuery={query} />
          </div>

          {/* 검색 결과 */}
          <div className="w-full">
            {query && searchResults.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  검색 결과가 없습니다
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                  다른 키워드로 다시 검색해보세요.
                </p>
                <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-center gap-3">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span>제목에서 검색</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                    <span>내용에서 검색</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                    <span>요약에서 검색</span>
                  </div>
                </div>
              </div>
            ) : query ? (
              <div className="space-y-6">
                {/* 검색 결과 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((post: any) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  검색어를 입력하세요
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  위의 검색바에 찾고 싶은 내용을 입력하세요.
                </p>
                
                {/* 검색 팁 */}
                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg max-w-md mx-auto">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    💡 검색 팁
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>키워드로 정확한 검색</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      <span>제목, 내용, 요약 모두 검색</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span>Enter 키로 검색 실행</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
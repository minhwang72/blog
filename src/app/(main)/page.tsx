import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import PostCard from '@/components/blog/PostCard';
import { BlogPost } from '@/types/blog';
import { blogService } from '@/lib/services/blog.service';

// ISR을 위한 revalidate 설정
export const revalidate = 900 // 15분마다 재생성

interface PageProps {
  searchParams: { category?: string };
}

export default async function Home({ searchParams }: PageProps) {
  const categorySlug = searchParams.category || 'all';
  
  // 캐시된 서비스 사용
  const [postsResponse, categories, popularPosts, stats] = await Promise.all([
    blogService.getPosts(categorySlug, 1, 6),
    blogService.getCategories(),
    blogService.getPopularPosts(4),
    blogService.getStats(),
  ]);

  const recentPosts = postsResponse.posts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section - 시크한 색상으로 변경 */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200/40 via-gray-100/30 to-slate-300/40 dark:from-slate-700/40 dark:via-slate-800/30 dark:to-slate-900/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="relative">
              <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-slate-600 via-gray-500 to-slate-700 bg-clip-text text-transparent leading-none tracking-tight">
                min.log
              </h1>
              <div className="absolute -inset-x-12 -inset-y-6 bg-gradient-to-r from-slate-200/60 via-gray-100/40 to-slate-300/60 dark:from-slate-700/40 dark:via-slate-800/30 dark:to-slate-900/40 rounded-3xl blur-3xl -z-10 opacity-50"></div>
            </div>
            <div className="space-y-6 max-w-4xl mx-auto">
              <p className="text-2xl md:text-3xl text-slate-700 dark:text-slate-200 font-semibold leading-relaxed">
                개발자의 기술과 배움을 기록하는 공간
              </p>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                새로운 기술을 탐구하고, 경험을 공유하며, 함께 성장하는 지식의 공간입니다.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link
                  href="/blog"
                  className="px-8 py-4 bg-gradient-to-r from-slate-600 to-gray-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  블로그 둘러보기
                </Link>
                <Link
                  href="/categories"
                  className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300"
                >
                  카테고리 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 통계 섹션 - 시크한 색상으로 변경 */}
      <section className="py-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-slate-600 dark:text-slate-300 mb-2">
                {stats.totalPosts.toLocaleString()}
              </div>
              <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">총 포스트</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-gray-600 dark:text-gray-300 mb-2">
                {stats.totalViews.toLocaleString()}
              </div>
              <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">총 조회수</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-slate-500 dark:text-slate-400 mb-2">
                {stats.totalCategories}
              </div>
              <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">카테고리</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-gray-500 dark:text-gray-400 mb-2">
                {Math.floor(recentPosts.reduce((sum, post) => sum + (post.content?.length || 0), 0) / 1000)}
              </div>
              <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">총 글자수(K)</div>
            </div>
          </div>
        </div>
      </section>

      {/* 최신 포스트 섹션 - 시크한 색상으로 변경 */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                최신 포스트
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                가장 최근에 작성된 포스트들을 확인하세요
              </p>
            </div>
            <Link
              href="/blog"
              className="px-6 py-3 bg-slate-600 text-white font-semibold rounded-full hover:bg-slate-700 transition-colors"
            >
              전체 보기
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* 인기 포스트 섹션 - 시크한 색상으로 변경 */}
      {popularPosts.length > 0 && (
        <section className="py-16 bg-white/60 dark:bg-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                인기 포스트
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                많은 분들이 읽고 있는 인기 포스트입니다
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {popularPosts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                        🔥 인기
                      </span>
                      {post.categoryName && (
                        <span className="px-3 py-1 text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                          {post.categoryName}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 line-clamp-2">
                      <Link href={`/blog/${post.id}`} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    {post.excerpt && (
                      <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <time dateTime={post.createdAt.toISOString()}>
                        {format(new Date(post.createdAt), 'PPP', { locale: ko })}
                      </time>
                      <div className="flex items-center gap-2">
                        <span>👁️ {post.viewCount?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA 섹션 - 시크한 색상으로 변경 */}
      <section className="py-20 bg-gradient-to-r from-slate-600 via-gray-600 to-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            개발 지식을 공유하고 함께 성장하세요
          </h2>
          <p className="text-xl text-slate-200 mb-8">
            새로운 기술과 경험을 블로그에 기록하고, 다른 개발자들과 소통해보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-full hover:bg-slate-100 transition-colors"
            >
              블로그 둘러보기
            </Link>
            <Link
              href="/search"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-slate-700 transition-colors"
            >
              검색하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
  authorName: string;
  categoryName: string;
  categoryId: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [paginatedPosts, setPaginatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 포스트 데이터 가져오기
        const postsResponse = await fetch('/api/posts');
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 페이지네이션 적용
  useEffect(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    setPaginatedPosts(posts.slice(startIndex, endIndex));
  }, [posts, currentPage, postsPerPage]);

  const handlePostsPerPageChange = (newPerPage: number) => {
    setPostsPerPage(newPerPage);
    setCurrentPage(1); // 페이지 크기 변경 시 첫 페이지로
  };

  const totalPages = Math.ceil(posts.length / postsPerPage);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="space-y-12">
          {/* 헤더 섹션 */}
          <div className="text-center space-y-6">
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-400 via-slate-500 to-gray-600 bg-clip-text text-transparent">
                블로그
              </h1>
              <div className="absolute -inset-x-6 -inset-y-3 bg-gradient-to-r from-sky-100/50 via-slate-100/50 to-gray-100/50 dark:from-sky-900/20 dark:via-slate-900/20 dark:to-gray-900/20 rounded-3xl blur-3xl -z-10 opacity-30"></div>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              개발과 일상에 대한 모든 포스트를 확인하세요.
            </p>
          </div>

          {/* 포스트 목록 - 웹에 맞는 레이아웃 */}
          <div className="space-y-8">
            {paginatedPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">📝</div>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  포스트가 없습니다
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                  첫 번째 포스트를 작성해보세요!
                </p>
                <Link 
                  href="/admin/posts/new" 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-gray-600 hover:from-sky-600 hover:to-gray-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  포스트 작성하기
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`} className="block group">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-6 h-full flex flex-col relative overflow-hidden">
                      {/* 배경 그라데이션 효과 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-slate-50/30 to-gray-50/50 dark:from-sky-900/10 dark:via-slate-900/5 dark:to-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* 카테고리 태그 */}
                      {post.categoryName && (
                        <div className="mb-4 relative z-10">
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 rounded-full border border-sky-200 dark:border-sky-800">
                            {post.categoryName}
                          </span>
                        </div>
                      )}

                      {/* 제목 */}
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-200 line-clamp-2 relative z-10">
                        {post.title}
                      </h3>

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
                      <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-sky-400 to-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {paginatedPosts.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    페이지당 포스트 수:
                  </span>
                  <select
                    value={postsPerPage}
                    onChange={(e) => handlePostsPerPageChange(Number(e.target.value))}
                    className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value={5}>5개</option>
                    <option value={10}>10개</option>
                    <option value={20}>20개</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    이전
                  </button>
                  
                  <span className="text-sm text-slate-600 dark:text-slate-400 px-3">
                    {currentPage} / {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    다음
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
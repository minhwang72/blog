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
    <div className="min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              블로그
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              개발과 일상에 대한 모든 포스트를 확인하세요.
            </p>
          </div>

          {/* 포스트 목록 - 웹에 맞는 레이아웃 */}
          <div className="space-y-6">
            {paginatedPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  포스트가 없습니다.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedPosts.map((post, index) => (
                  <article
                    key={post.id}
                    className="group relative rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-green-300 dark:hover:border-green-700 transition-all duration-200 hover:shadow-md bg-gradient-to-r from-white to-green-50 dark:from-gray-800 dark:to-gray-900 hover:from-green-50 hover:to-emerald-50 dark:hover:from-gray-700 dark:hover:to-gray-800"
                  >
                    <Link href={`/blog/${post.id}`} className="block">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200 mb-2">
                            {post.title}
                          </h2>
                          {post.excerpt && (
                            <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 text-base">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <time dateTime={post.createdAt}>
                              {new Date(post.createdAt).toLocaleString('ko-KR', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'Asia/Seoul'
                              })}
                            </time>
                            {post.categoryName && (
                              <span className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full border border-green-200 dark:border-green-800/50">
                                {post.categoryName}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-6 text-gray-400 group-hover:text-green-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* 페이지당 포스트 수 선택 */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">페이지당 표시:</span>
              <div className="flex space-x-2">
                {[5, 10, 20].map((size) => (
                  <button
                    key={size}
                    onClick={() => handlePostsPerPageChange(size)}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      postsPerPage === size
                        ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white'
                        : 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 hover:from-green-200 hover:to-emerald-200 dark:hover:from-green-800/40 dark:hover:to-emerald-800/40 border border-green-200 dark:border-green-800/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              총 {posts.length}개 포스트 중 {Math.min((currentPage - 1) * postsPerPage + 1, posts.length)}-{Math.min(currentPage * postsPerPage, posts.length)}개 표시
            </div>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-8 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-700 dark:text-teal-300 hover:from-teal-200 hover:to-cyan-200 dark:hover:from-teal-800/40 dark:hover:to-cyan-800/40 disabled:opacity-50 disabled:cursor-not-allowed border border-teal-200 dark:border-teal-800/50 transition-all duration-200"
              >
                이전
              </button>

              {/* 페이지 번호 */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-md border transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-white border-teal-400'
                        : 'bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/50 hover:from-teal-200 hover:to-cyan-200 dark:hover:from-teal-800/40 dark:hover:to-cyan-800/40'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-teal-700 dark:text-teal-300 hover:from-teal-200 hover:to-cyan-200 dark:hover:from-teal-800/40 dark:hover:to-cyan-800/40 disabled:opacity-50 disabled:cursor-not-allowed border border-teal-200 dark:border-teal-800/50 transition-all duration-200"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
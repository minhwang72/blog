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

interface Category {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
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
          setFilteredPosts(postsData);
        }

        // 카테고리 데이터 가져오기
        const categoriesResponse = await fetch('/api/categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 카테고리 필터링 (페이지도 1로 리셋)
  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => post.categoryId === selectedCategory);
      setFilteredPosts(filtered);
    }
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로
  }, [selectedCategory, posts]);

  // 페이지네이션 적용
  useEffect(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    setPaginatedPosts(filteredPosts.slice(startIndex, endIndex));
  }, [filteredPosts, currentPage, postsPerPage]);

  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const handlePostsPerPageChange = (newPerPage: number) => {
    setPostsPerPage(newPerPage);
    setCurrentPage(1); // 페이지 크기 변경 시 첫 페이지로
  };

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

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
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          블로그
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          개발과 일상에 대한 모든 포스트를 확인하세요.
        </p>
      </div>

      {/* 카테고리 필터 버튼들 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">카테고리별 보기</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleCategoryFilter(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategory === null
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            전체 ({posts.length})
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.name} ({category.postCount})
            </button>
          ))}
        </div>
      </div>

      {/* 페이지당 포스트 수 선택 */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">페이지당 표시:</span>
          <div className="flex space-x-2">
            {[10, 20, 50].map((size) => (
              <button
                key={size}
                onClick={() => handlePostsPerPageChange(size)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  postsPerPage === size
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          총 {filteredPosts.length}개 포스트 중 {Math.min((currentPage - 1) * postsPerPage + 1, filteredPosts.length)}-{Math.min(currentPage * postsPerPage, filteredPosts.length)}개 표시
        </div>
      </div>

      {/* 포스트 목록 - 스크롤 가능한 컨테이너 */}
      <div className="min-h-[600px] space-y-6">
        {paginatedPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {filteredPosts.length === 0 
                ? (selectedCategory === null ? '포스트가 없습니다.' : '해당 카테고리에 포스트가 없습니다.')
                : '해당 페이지에 포스트가 없습니다.'
              }
            </p>
          </div>
        ) : (
          paginatedPosts.map((post) => (
            <article
              key={post.id}
              className="group relative rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-md"
            >
              <Link href={`/blog/${post.id}`} className="block">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <time dateTime={post.createdAt}>
                    {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  {post.categoryName && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {post.categoryName}
                    </span>
                  )}
                </div>
              </Link>
            </article>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-8 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-600"
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
                className={`px-3 py-2 rounded-md border ${
                  currentPage === pageNum
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-600"
          >
            다음
          </button>
        </div>
      )}

      {/* 선택된 카테고리 표시 */}
      {selectedCategory !== null && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <span className="font-medium">
              {categories.find(cat => cat.id === selectedCategory)?.name}
            </span> 카테고리의 포스트 {filteredPosts.length}개를 표시하고 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}